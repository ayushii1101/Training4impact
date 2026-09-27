import { randomUUID, createHmac, timingSafeEqual } from 'crypto';
import razorpay from '../config/razorpay.js';
import { getCourseById } from '../config/courses.js';
import {
  insertOrderWithItems,
  getOrderByRazorpayId,
  getOrderItems,
  getPaymentByRazorpayOrderId,
  persistCapturedPayment,
  recordFailedPayment,
  updateOrderStatus,
} from '../config/database.js';

const CREATE_ORDER_KEYS = ['courses'];
const CART_ITEM_KEYS = ['courseId', 'quantity'];
const VERIFY_KEYS = ['courseId', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'];

const MAX_QUANTITY_PER_ITEM = 100;
// Razorpay Test/Live per-transaction limit is ₹5,00,000; enforce it server-side
// so oversized carts are rejected with a clean 400 before reaching Razorpay.
const MAX_ORDER_PAISE = 50000000;

const toPaise = (rupees) => Math.round(rupees) * 100;

const safeJsonError = (res, status, message) =>
  res.status(status).json({ success: false, message });

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const verifyRazorpaySignature = ({ orderId, paymentId, signature, secret }) => {
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
};

// Webhook signature verification. Razorpay's SDK compares the bare hex digest,
// but webhook deliveries can carry either `sha256=<hex>` or the bare `<hex>`
// form depending on how the dashboard/event is configured. Accept both, using a
// constant-time comparison so the check does not leak timing information.
const verifyWebhookSignature = (payloadString, signature, secret) => {
  const digest = createHmac('sha256', secret).update(payloadString, 'utf8').digest('hex');
  const variants = [`sha256=${digest}`, digest];
  const provided = Buffer.from(String(signature), 'utf8');
  return variants.some((variant) => {
    const expected = Buffer.from(variant, 'utf8');
    return expected.length === provided.length && timingSafeEqual(expected, provided);
  });
};

export const createOrder = async (req, res) => {
  try {
    const body = req.body ?? {};

    if (!isPlainObject(body)) {
      return safeJsonError(res, 400, 'Request body must be a JSON object');
    }

    const extraKeys = Object.keys(body).filter((key) => !CREATE_ORDER_KEYS.includes(key));
    if (extraKeys.length > 0) {
      return safeJsonError(res, 400, `Only "courses" is accepted. Unexpected field(s): ${extraKeys.join(', ')}`);
    }

    const { courses } = body;

    if (!Array.isArray(courses) || courses.length === 0) {
      return safeJsonError(res, 400, 'Cart is empty. Add at least one course.');
    }

    const aggregated = new Map();
    for (const item of courses) {
      if (!isPlainObject(item)) {
        return safeJsonError(res, 400, 'Each cart item must be an object with courseId and quantity');
      }

      const itemExtraKeys = Object.keys(item).filter((key) => !CART_ITEM_KEYS.includes(key));
      if (itemExtraKeys.length > 0) {
        return safeJsonError(
          res,
          400,
          `Only "courseId" and "quantity" are accepted per item. Unexpected field(s): ${itemExtraKeys.join(', ')}`
        );
      }

      const { courseId, quantity } = item;

      if (typeof courseId !== 'string' || courseId.trim() === '') {
        return safeJsonError(res, 400, 'Each cart item must include a valid courseId');
      }

      if (quantity !== undefined && quantity !== null) {
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
          return safeJsonError(
            res,
            400,
            `quantity must be a positive integer between 1 and ${MAX_QUANTITY_PER_ITEM}`
          );
        }
      }

      const qty = quantity === undefined || quantity === null ? 1 : quantity;
      const trimmedCourseId = courseId.trim();
      aggregated.set(trimmedCourseId, (aggregated.get(trimmedCourseId) ?? 0) + qty);
    }

    const lines = [];
    let totalPaise = 0;
    for (const [courseId, quantity] of aggregated) {
      const course = getCourseById(courseId);
      if (!course) {
        return safeJsonError(res, 404, `Course not found: ${courseId}`);
      }
      if (typeof course.amount !== 'number' || !Number.isInteger(course.amount) || course.amount <= 0) {
        return safeJsonError(res, 500, 'Course price is not configured correctly');
      }
      const unitPricePaise = toPaise(course.amount);
      const lineTotalPaise = unitPricePaise * quantity;
      totalPaise += lineTotalPaise;
      lines.push({
        courseId,
        courseName: course.name,
        unitPricePaise,
        quantity,
        lineTotalPaise,
      });
    }

    if (!Number.isSafeInteger(totalPaise) || totalPaise <= 0) {
      return safeJsonError(res, 400, 'Cart total could not be calculated');
    }
    if (totalPaise > MAX_ORDER_PAISE) {
      return safeJsonError(res, 400, 'Order total exceeds the maximum allowed amount');
    }

    const receipt = `rcp_${randomUUID().replace(/-/g, '')}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: 'INR',
      receipt,
    });

    const primary = lines[0];
    try {
      insertOrderWithItems({
        courseId: primary.courseId,
        courseName: primary.courseName,
        amountPaise: totalPaise,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        receipt,
        status: 'created',
        items: lines,
      });
    } catch (error) {
      const isDuplicate = String(error?.message ?? '').includes('UNIQUE');
      if (!isDuplicate) {
        console.error('Failed to persist order record:', error?.message ?? error);
        return safeJsonError(res, 500, 'Failed to process order');
      }
    }

    return res.status(200).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
      cart: {
        items: lines.map((line) => ({
          courseId: line.courseId,
          courseName: line.courseName,
          unitPrice: line.unitPricePaise / 100,
          quantity: line.quantity,
          lineTotal: line.lineTotalPaise / 100,
        })),
        totalAmountPaise: totalPaise,
        totalAmount: totalPaise / 100,
        currency: 'INR',
      },
      course: {
        id: primary.courseId,
        name: primary.courseName,
        price: primary.unitPricePaise / 100,
      },
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error?.message ?? error);
    return safeJsonError(res, 500, 'Failed to create order');
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const body = req.body ?? {};

    if (!isPlainObject(body)) {
      return safeJsonError(res, 400, 'Request body must be a JSON object');
    }

    const extraKeys = Object.keys(body).filter((key) => !VERIFY_KEYS.includes(key));
    if (extraKeys.length > 0) {
      return safeJsonError(
        res,
        400,
        `Only "courseId", "razorpay_order_id", "razorpay_payment_id" and "razorpay_signature" are accepted. Unexpected field(s): ${extraKeys.join(', ')}`
      );
    }

    const { courseId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (typeof courseId !== 'string' || courseId.trim() === '') {
      return safeJsonError(res, 400, 'courseId is required');
    }

    if (typeof razorpay_order_id !== 'string' || razorpay_order_id.trim() === '') {
      return safeJsonError(res, 400, 'razorpay_order_id is required');
    }

    if (typeof razorpay_payment_id !== 'string' || razorpay_payment_id.trim() === '') {
      return safeJsonError(res, 400, 'razorpay_payment_id is required');
    }

    if (typeof razorpay_signature !== 'string' || razorpay_signature.trim() === '') {
      return safeJsonError(res, 400, 'razorpay_signature is required');
    }

    const course = getCourseById(courseId);
    if (!course) {
      return safeJsonError(res, 404, 'Course not found');
    }

    const order = getOrderByRazorpayId(razorpay_order_id);
    if (!order) {
      return safeJsonError(res, 400, 'Order not found or was not created by this server');
    }

    if (order.course_id !== courseId) {
      return safeJsonError(res, 400, 'Order does not match the requested course');
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not configured');
      return safeJsonError(res, 500, 'Payment verification is not configured');
    }

    if (
      !verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        secret,
      })
    ) {
      return safeJsonError(res, 401, 'Signature verification failed');
    }

    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (error) {
      console.error('Failed to fetch Razorpay payment:', error?.message ?? error);
      return safeJsonError(res, 400, 'Payment not found on Razorpay');
    }

    if (!payment || payment.order_id !== razorpay_order_id) {
      return safeJsonError(res, 400, 'Payment does not belong to the referenced order');
    }

    const orderItems = getOrderItems(order.razorpay_order_id);
    const effectiveItems = orderItems.length
      ? orderItems
      : [
          {
            course_id: order.course_id,
            course_name: order.course_name,
            line_total_paise: order.amount_paise,
            quantity: 1,
          },
        ];

    const paymentStatus = payment.status;
    const captured = paymentStatus === 'captured';

    if (captured) {
      const { payment: paymentRecord, enrollment, enrollments, alreadyExisting } = persistCapturedPayment({
        order,
        paymentId: razorpay_payment_id,
        amountPaise: Number(payment.amount) || order.amount_paise,
        paymentStatus,
        items: effectiveItems,
      });

      return res.status(200).json({
        success: true,
        message: alreadyExisting ? 'Payment already verified' : 'Payment verified successfully',
        payment: {
          paymentId: paymentRecord.razorpay_payment_id,
          orderId: paymentRecord.razorpay_order_id,
          status: 'verified',
        },
        order: {
          id: order.razorpay_order_id,
          amount: order.amount_paise,
          currency: order.currency,
          items: effectiveItems.map((item) => ({
            courseId: item.course_id,
            courseName: item.course_name,
            quantity: item.quantity ?? 1,
            lineTotal: item.line_total_paise ?? item.amount_paise,
          })),
        },
        course: {
          id: course.id,
          name: course.name,
          price: course.amount,
        },
        enrollments: (enrollments ?? []).map((enr) => ({
          courseId: enr.course_id,
          courseName: enr.course_name,
          status: enr.enrollment_status,
          amountPaise: enr.amount_paise,
          createdAt: enr.created_at,
        })),
        enrollment: enrollment
          ? { status: enrollment.enrollment_status, createdAt: enrollment.created_at }
          : null,
      });
    }

    if (paymentStatus === 'failed') {
      recordFailedPayment({ order, paymentId: razorpay_payment_id, paymentStatus });
    } else {
      updateOrderStatus(order.razorpay_order_id, paymentStatus);
    }

    return res.status(200).json({
      success: true,
      message: `Payment verified but not captured (status: ${paymentStatus})`,
      payment: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'verified',
        paymentStatus,
      },
      order: {
        id: order.razorpay_order_id,
        amount: order.amount_paise,
        currency: order.currency,
        items: effectiveItems.map((item) => ({
          courseId: item.course_id,
          courseName: item.course_name,
          quantity: item.quantity ?? 1,
          lineTotal: item.line_total_paise ?? item.amount_paise,
        })),
      },
      course: {
        id: course.id,
        name: course.name,
        price: course.amount,
      },
      enrollments: [],
      enrollment: null,
    });
  } catch (error) {
    console.error('Payment verification failed:', error?.message ?? error);
    return safeJsonError(res, 500, 'Payment verification failed');
  }
};

const WEBHOOK_EVENTS = new Set(['payment.captured', 'payment.failed', 'order.paid']);

export const handleWebhook = async (req, res) => {
  try {
    // Express raw body middleware supplies a Buffer; signature verification MUST
    // use the exact raw bytes sent by Razorpay, never re-serialized JSON.
    const rawBody = req.body;
    if (!Buffer.isBuffer(rawBody)) {
      return safeJsonError(res, 400, 'Raw request body required');
    }

    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
      return safeJsonError(res, 500, 'Webhook is not configured');
    }

    if (typeof signature !== 'string' || signature === '') {
      return safeJsonError(res, 401, 'Missing webhook signature');
    }

    // Signature verified against the raw body before the payload is trusted or parsed.
    const payloadString = rawBody.toString('utf8');

    const valid = verifyWebhookSignature(payloadString, signature, webhookSecret);
    if (!valid) {
      return safeJsonError(res, 401, 'Invalid webhook signature');
    }

    let event;
    try {
      event = JSON.parse(payloadString);
    } catch {
      return safeJsonError(res, 400, 'Malformed webhook payload');
    }

    const eventName = event?.event;
    if (typeof eventName !== 'string') {
      return safeJsonError(res, 400, 'Missing event type');
    }

    // Explicit allowlist. Unknown/unsupported events are acknowledged without
    // side effects so Razorpay stops retrying them and the API never errors.
    if (!WEBHOOK_EVENTS.has(eventName)) {
      return res.status(200).json({ received: true, ignored: true });
    }

    if (eventName === 'payment.failed') {
      const entity = event?.payload?.payment?.entity;
      if (!entity?.id || !entity?.order_id) {
        return res.status(200).json({ received: true, ignored: true });
      }
      const order = getOrderByRazorpayId(entity.order_id);
      if (!order) {
        console.warn('Webhook payment.failed for unknown order:', entity.order_id);
        return res.status(200).json({ received: true, ignored: true });
      }
      // Never regress an order that already has a captured payment (retry, or a
      // delayed failed callback arriving after a successful payment was recorded).
      const existingPayment = getPaymentByRazorpayOrderId(entity.order_id);
      const alreadyCaptured =
        existingPayment &&
        existingPayment.verification_status === 'verified' &&
        existingPayment.payment_status === 'captured';
      if (alreadyCaptured) {
        return res.status(200).json({ received: true, ignored: true });
      }
      recordFailedPayment({ order, paymentId: entity.id, paymentStatus: entity.status || 'failed' });
      return res.status(200).json({ received: true });
    }

    if (eventName === 'payment.captured') {
      const entity = event?.payload?.payment?.entity;
      if (!entity?.id || !entity?.order_id) {
        return res.status(200).json({ received: true, ignored: true });
      }
      const order = getOrderByRazorpayId(entity.order_id);
      if (!order) {
        console.warn('Webhook payment.captured for unknown order:', entity.order_id);
        return res.status(200).json({ received: true, ignored: true });
      }
      // A signature-validated payment.captured event is Razorpay's authoritative
      // capture confirmation. Enrollments always use server-side order/order_items
      // amounts from the database, never data from the webhook body or the frontend.
      persistCapturedPayment({
        order,
        paymentId: entity.id,
        amountPaise: Number(entity.amount),
        paymentStatus: entity.status || 'captured',
        items: getOrderItems(entity.order_id),
      });
      return res.status(200).json({ received: true });
    }

    if (eventName === 'order.paid') {
      const entity = event?.payload?.order?.entity;
      if (!entity?.id) {
        return res.status(200).json({ received: true, ignored: true });
      }
      const order = getOrderByRazorpayId(entity.id);
      if (!order) {
        console.warn('Webhook order.paid for unknown order:', entity.id);
        return res.status(200).json({ received: true, ignored: true });
      }
      updateOrderStatus(entity.id, 'paid');
      return res.status(200).json({ received: true });
    }

    return res.status(200).json({ received: true, ignored: true });
  } catch (error) {
    console.error('Webhook processing failed:', error?.message ?? error);
    return safeJsonError(res, 500, 'Webhook processing failed');
  }
};