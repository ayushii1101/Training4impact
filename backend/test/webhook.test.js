import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Test-only webhook secret. MUST be set before importing app/database modules
// because config reads process.env at import time.
const WEBHOOK_SECRET = 'test-webhook-secret-for-local-tests-only';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 't4i-webhook-test-'));
process.env.DB_PATH = path.join(tmpDir, 'test.db');
process.env.RAZORPAY_WEBHOOK_SECRET = WEBHOOK_SECRET;
process.env.NODE_ENV = 'test';
// Fake placeholders only so the Razorpay SDK can be constructed offline.
// No test below invokes the Razorpay API, so these values are never sent anywhere.
process.env.RAZORPAY_KEY_ID = 'rzp_test_dummy_key';
process.env.RAZORPAY_KEY_SECRET = 'dummy_secret_for_local_tests_only';

const { createApp } = await import('../src/app.js');
const {
  insertOrderWithItems,
  insertOrder,
  getOrderByRazorpayId,
  getPaymentByRazorpayPaymentId,
  getEnrollmentsByRazorpayPaymentId,
  closeDatabase,
} = await import('../src/config/database.js');

const F1 = {
  courseId: 'f1',
  courseName: 'One Year Fellowship in Cardiac Critical Care',
  unitPricePaise: 5900000,
};
const F2 = {
  courseId: 'f2',
  courseName: 'One Year Fellowship in Cardio Diabetes',
  unitPricePaise: 4720000,
};
const MULTI_ORDER_TOTAL = F1.unitPricePaise + F2.unitPricePaise; // 10,620,000

function sign(bodyString) {
  return `sha256=${createHmac('sha256', WEBHOOK_SECRET).update(bodyString, 'utf8').digest('hex')}`;
}

function buildEvent({ event, entity, amount, id, orderId, status }) {
  const body = JSON.stringify({
    entity: 'event',
    event,
    account_id: 'acc_test_1234',
    contains: ['payment', 'order'].filter((k) => (event.startsWith('payment') ? k === 'payment' : k === 'order')),
    payload:
      event.startsWith('payment')
        ? { payment: { entity: { id, entity: 'payment', amount, currency: 'INR', status, order_id: orderId } } }
        : { order: { entity: { id: orderId, entity: 'order', amount } } },
    created_at: Date.now(),
  });
  return { body, id, orderId };
}

function createMultiCourseOrder(razorpayOrderId) {
  insertOrderWithItems({
    courseId: F1.courseId,
    courseName: F1.courseName,
    amountPaise: MULTI_ORDER_TOTAL,
    currency: 'INR',
    razorpayOrderId,
    receipt: `rcp_${randomUUID().replace(/-/g, '')}`,
    status: 'created',
    items: [
      { ...F1, quantity: 1, lineTotalPaise: F1.unitPricePaise },
      { ...F2, quantity: 1, lineTotalPaise: F2.unitPricePaise },
    ],
  });
}

function createSingleCourseOrder(razorpayOrderId) {
  insertOrder({
    courseId: 'f5',
    courseName: 'Certificate Course in ECHO',
    amountPaise: 590000,
    currency: 'INR',
    razorpayOrderId,
    receipt: `rcp_${randomUUID().replace(/-/g, '')}`,
    status: 'created',
  });
}

let server;
let baseUrl;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  closeDatabase();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('GET /api/health returns 200', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
});

test('create-order rejects empty cart before reaching Razorpay', async () => {
  const res = await fetch(`${baseUrl}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ courses: [] }),
  });
  assert.equal(res.status, 400);
});

test('verify rejects missing fields before reaching Razorpay', async () => {
  const res = await fetch(`${baseUrl}/api/payments/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400);
});

test('webhook rejects missing signature', async () => {
  const { body } = buildEvent({ event: 'payment.captured', id: 'pay_x', orderId: 'order_x', amount: 100, status: 'captured' });
  const res = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
  assert.equal(res.status, 401);
});

test('webhook rejects invalid signature', async () => {
  const { body } = buildEvent({ event: 'payment.captured', id: 'pay_x', orderId: 'order_x', amount: 100, status: 'captured' });
  const res = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': 'sha256=deadbeef' },
    body,
  });
  assert.equal(res.status, 401);
});

test('webhook rejects malformed JSON payload safely', async () => {
  const rawBody = 'this is not json';
  const res = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(rawBody) },
    body: rawBody,
  });
  assert.equal(res.status, 400);
});

test('webhook honours only supported events and ignores unknown events', async () => {
  const unknown = JSON.stringify({ entity: 'event', event: 'refund.processed', payload: {}, created_at: Date.now() });
  const res = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(unknown) },
    body: unknown,
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ignored, true);
});

test('webhook ignores events for orders this server never created', async () => {
  const { body } = buildEvent({ event: 'payment.captured', id: 'pay_ghost', orderId: 'order_ghost', amount: 100, status: 'captured' });
  const res = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(body) },
    body,
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ignored, true);
});

test('payment.captured creates one enrollment per purchased course (multi-course)', async () => {
  const razorpayOrderId = `order_multi_${randomUUID().replace(/-/g, '')}`;
  createMultiCourseOrder(razorpayOrderId);

  const paymentId = `pay_multi_${randomUUID().replace(/-/g, '')}`;
  const { body } = buildEvent({
    event: 'payment.captured',
    id: paymentId,
    orderId: razorpayOrderId,
    amount: MULTI_ORDER_TOTAL,
    status: 'captured',
  });

  const res = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(body) },
    body,
  });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).received, true);

  const payment = getPaymentByRazorpayPaymentId(paymentId);
  assert.ok(payment, 'payment row should exist');
  assert.equal(payment.verification_status, 'verified');
  assert.equal(payment.payment_status, 'captured');

  const enrollments = getEnrollmentsByRazorpayPaymentId(paymentId);
  assert.equal(enrollments.length, 2, 'two courses -> two enrollments');
  const courseIds = enrollments.map((e) => e.course_id).sort();
  assert.deepEqual(courseIds, ['f1', 'f2']);

  const order = getOrderByRazorpayId(razorpayOrderId);
  assert.equal(order.status, 'paid');
});

test('duplicate payment.captured webhook is idempotent', async () => {
  const razorpayOrderId = `order_dup_${randomUUID().replace(/-/g, '')}`;
  createMultiCourseOrder(razorpayOrderId);

  const paymentId = `pay_dup_${randomUUID().replace(/-/g, '')}`;
  const { body } = buildEvent({
    event: 'payment.captured',
    id: paymentId,
    orderId: razorpayOrderId,
    amount: MULTI_ORDER_TOTAL,
    status: 'captured',
  });

  const post = () =>
    fetch(`${baseUrl}/api/payments/webhook`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(body) },
      body,
    });

  const first = await post();
  assert.equal(first.status, 200);
  const second = await post();
  assert.equal(second.status, 200);

  const payments = getPaymentByRazorpayPaymentId(paymentId);
  assert.equal(getEnrollmentsByRazorpayPaymentId(paymentId).length, 2, 'no duplicate enrollments');
  assert.ok(payments);
});

test('payment.captured falls back to single enrollment when order has no items', async () => {
  const razorpayOrderId = `order_single_${randomUUID().replace(/-/g, '')}`;
  createSingleCourseOrder(razorpayOrderId);

  const paymentId = `pay_single_${randomUUID().replace(/-/g, '')}`;
  const { body } = buildEvent({
    event: 'payment.captured',
    id: paymentId,
    orderId: razorpayOrderId,
    amount: 590000,
    status: 'captured',
  });

  const res = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(body) },
    body,
  });
  assert.equal(res.status, 200);

  const enrollments = getEnrollmentsByRazorpayPaymentId(paymentId);
  assert.equal(enrollments.length, 1);
  assert.equal(enrollments[0].course_id, 'f5');
});

test('payment.failed records the failure and marks the order failed', async () => {
  const razorpayOrderId = `order_fail_${randomUUID().replace(/-/g, '')}`;
  createSingleCourseOrder(razorpayOrderId);

  const paymentId = `pay_fail_${randomUUID().replace(/-/g, '')}`;
  const { body } = buildEvent({
    event: 'payment.failed',
    id: paymentId,
    orderId: razorpayOrderId,
    amount: 590000,
    status: 'failed',
  });

  const res = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(body) },
    body,
  });
  assert.equal(res.status, 200);

  const payment = getPaymentByRazorpayPaymentId(paymentId);
  assert.equal(payment.payment_status, 'failed');
  const order = getOrderByRazorpayId(razorpayOrderId);
  assert.equal(order.status, 'failed');
});

test('late payment.failed does not regress an already-captured order', async () => {
  const razorpayOrderId = `order_latefail_${randomUUID().replace(/-/g, '')}`;
  createSingleCourseOrder(razorpayOrderId);

  const capturedPaymentId = `pay_latefail_cap_${randomUUID().replace(/-/g, '')}`;
  const captured = buildEvent({
    event: 'payment.captured',
    id: capturedPaymentId,
    orderId: razorpayOrderId,
    amount: 590000,
    status: 'captured',
  });
  const captureRes = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(captured.body) },
    body: captured.body,
  });
  assert.equal(captureRes.status, 200);

  const failed = buildEvent({
    event: 'payment.failed',
    id: `pay_latefail_f_${randomUUID().replace(/-/g, '')}`,
    orderId: razorpayOrderId,
    amount: 590000,
    status: 'failed',
  });
  const failRes = await fetch(`${baseUrl}/api/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-razorpay-signature': sign(failed.body) },
    body: failed.body,
  });
  assert.equal(failRes.status, 200);

  const order = getOrderByRazorpayId(razorpayOrderId);
  assert.equal(order.status, 'paid', 'order must remain paid');
  assert.equal(getEnrollmentsByRazorpayPaymentId(capturedPaymentId).length, 1);
});