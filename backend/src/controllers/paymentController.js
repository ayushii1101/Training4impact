import Razorpay from 'razorpay';
import { randomUUID, createHmac, timingSafeEqual } from 'crypto';
import razorpay from '../config/razorpay.js';
import { getCourseById } from '../config/courses.js';
import {
  insertOrder,
  getOrderByRazorpayId,
  persistCapturedPayment,
  recordFailedPayment,
  updateOrderStatus,
} from '../config/database.js';

const CREATE_ORDER_KEYS = ['courseId'];
const VERIFY_KEYS = ['courseId', 'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'];

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

export const createOrder = async (req, res) => {
  try {
    const body = req.body ?? {};

    if (!isPlainObject(body)) {
      return safeJsonError(res, 400, 'Request body must be a JSON object');
    }

    const extraKeys = Object.keys(body).filter((key) => !CREATE_ORDER_KEYS.includes(key));
    if (extraKeys.length > 0) {
      return safeJsonError(res, 400, `Only "courseId" is accepted. Unexpected field(s): ${extraKeys.join(', ')}`);
    }

    const { courseId } = body;

    if (courseId === undefined || courseId === null) {
      return safeJsonError(res, 400, 'courseId is required');
    }

    if (typeof courseId !== 'string' || courseId.trim() === '') {
      return safeJsonError(res, 400, 'courseId must be a non-empty string');
    }

    const course = getCourseById(courseId);

    if (!course) {
      return safeJsonError(res, 404, 'Course not found');
    }

    if (typeof course.amount !== 'number' || !Number.isInteger(course.amount) || course.amount <= 0) {
      return safeJsonError(res, 500, 'Course price is not configured correctly');
    }

    const amountInPaise = toPaise(course.amount);
    const receipt = `rcp_${randomUUID().replace(/-/g, '')}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
    });

    try {
      insertOrder({
        courseId,
        courseName: course.name,
        amountPaise: amountInPaise,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        receipt,
        status: 'created',
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
      course: {
        id: courseId,
        name: course.name,
        price: course.amount,
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

    const paymentStatus = payment.status;
    const captured = paymentStatus === 'captured';

    if (captured) {
      const { payment: paymentRecord, enrollment, alreadyExisting } = persistCapturedPayment({
        order,
        paymentId: razorpay_payment_id,
        amountPaise: Number(payment.amount) || order.amount_paise,
        paymentStatus,
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
        },
        course: {
          id: course.id,
          name: course.name,
          price: course.amount,
        },
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
      },
      course: {
        id: course.id,
        name: course.name,
        price: course.amount,
      },
      enrollment: null,
    });
  } catch (error) {
    console.error('Payment verification failed:', error?.message ?? error);
    return safeJsonError(res, 500, 'Payment verification failed');
  }
};

export const handleWebhook = async (req, res) => {
  try {
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

    const payloadString = rawBody.toString('utf8');

    const valid = Razorpay.validateWebhookSignature(payloadString, signature, webhookSecret);
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
    if (!eventName) {
      return safeJsonError(res, 400, 'Missing event type');
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
      persistCapturedPayment({
        order,
        paymentId: entity.id,
        amountPaise: Number(entity.amount),
        paymentStatus: entity.status || 'captured',
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