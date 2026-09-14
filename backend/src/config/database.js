import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');

fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(dataDir, 't4i.db');

export const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    amount_paise INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    razorpay_order_id TEXT NOT NULL UNIQUE,
    receipt TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'created',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    razorpay_payment_id TEXT NOT NULL UNIQUE,
    razorpay_order_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    amount_paise INTEGER,
    currency TEXT NOT NULL DEFAULT 'INR',
    verification_status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'unknown',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    razorpay_payment_id TEXT NOT NULL UNIQUE,
    razorpay_order_id TEXT NOT NULL,
    amount_paise INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    enrollment_status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
  CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
  CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
  CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
  CREATE INDEX IF NOT EXISTS idx_enrollments_razorpay_payment_id ON enrollments(razorpay_payment_id);
`);

export function insertOrder({ courseId, courseName, amountPaise, currency, razorpayOrderId, receipt, status = 'created' }) {
  const result = db
    .prepare(
      `INSERT INTO orders (course_id, course_name, amount_paise, currency, razorpay_order_id, receipt, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(courseId, courseName, amountPaise, currency, razorpayOrderId, receipt, status);
  return result.lastInsertRowid;
}

export function getOrderByRazorpayId(razorpayOrderId) {
  return db.prepare(`SELECT * FROM orders WHERE razorpay_order_id = ?`).get(razorpayOrderId) ?? null;
}

export function updateOrderStatus(razorpayOrderId, status) {
  db.prepare(`UPDATE orders SET status = ? WHERE razorpay_order_id = ?`).run(status, razorpayOrderId);
}

export function getPaymentByRazorpayPaymentId(razorpayPaymentId) {
  return db.prepare(`SELECT * FROM payments WHERE razorpay_payment_id = ?`).get(razorpayPaymentId) ?? null;
}

export function getPaymentByRazorpayOrderId(razorpayOrderId) {
  return db.prepare(`SELECT * FROM payments WHERE razorpay_order_id = ?`).get(razorpayOrderId) ?? null;
}

export function insertPayment({
  razorpayPaymentId,
  razorpayOrderId,
  courseId,
  amountPaise = null,
  currency = 'INR',
  verificationStatus = 'pending',
  paymentStatus = 'unknown',
}) {
  const result = db
    .prepare(
      `INSERT OR IGNORE INTO payments
        (razorpay_payment_id, razorpay_order_id, course_id, amount_paise, currency, verification_status, payment_status, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
    .run(razorpayPaymentId, razorpayOrderId, courseId, amountPaise, currency, verificationStatus, paymentStatus);
  return result.changes > 0;
}

export function updatePayment({ razorpayPaymentId, verificationStatus, paymentStatus }) {
  db.prepare(
    `UPDATE payments
     SET verification_status = ?, payment_status = ?, updated_at = datetime('now')
     WHERE razorpay_payment_id = ?`
  ).run(verificationStatus, paymentStatus, razorpayPaymentId);
}

export function insertEnrollment({
  courseId,
  courseName,
  razorpayPaymentId,
  razorpayOrderId,
  amountPaise,
  currency = 'INR',
  enrollmentStatus = 'active',
}) {
  const result = db
    .prepare(
      `INSERT OR IGNORE INTO enrollments
        (course_id, course_name, razorpay_payment_id, razorpay_order_id, amount_paise, currency, enrollment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(courseId, courseName, razorpayPaymentId, razorpayOrderId, amountPaise, currency, enrollmentStatus);
  return result.changes > 0;
}

export function getEnrollmentByRazorpayPaymentId(razorpayPaymentId) {
  return db.prepare(`SELECT * FROM enrollments WHERE razorpay_payment_id = ?`).get(razorpayPaymentId) ?? null;
}

export function persistCapturedPayment({ order, paymentId, amountPaise, paymentStatus, source }) {
  const existing = getPaymentByRazorpayPaymentId(paymentId);
  if (existing) {
    updatePayment({
      razorpayPaymentId: paymentId,
      verificationStatus: 'verified',
      paymentStatus,
    });
    return {
      payment: getPaymentByRazorpayPaymentId(paymentId),
      enrollment: getEnrollmentByRazorpayPaymentId(paymentId),
      alreadyExisting: true,
    };
  }

  db.exec('BEGIN IMMEDIATE');
  try {
    insertPayment({
      razorpayPaymentId: paymentId,
      razorpayOrderId: order.razorpay_order_id,
      courseId: order.course_id,
      amountPaise,
      currency: order.currency,
      verificationStatus: 'verified',
      paymentStatus,
    });
    insertEnrollment({
      courseId: order.course_id,
      courseName: order.course_name,
      razorpayPaymentId: paymentId,
      razorpayOrderId: order.razorpay_order_id,
      amountPaise,
      currency: order.currency,
    });
    updateOrderStatus(order.razorpay_order_id, 'paid');
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  return {
    payment: getPaymentByRazorpayPaymentId(paymentId),
    enrollment: getEnrollmentByRazorpayPaymentId(paymentId),
    alreadyExisting: false,
  };
}

export function recordFailedPayment({ order, paymentId, paymentStatus }) {
  db.exec('BEGIN IMMEDIATE');
  try {
    insertPayment({
      razorpayPaymentId: paymentId,
      razorpayOrderId: order.razorpay_order_id,
      courseId: order.course_id,
      paymentStatus,
      verificationStatus: 'verified',
    });
    updateOrderStatus(order.razorpay_order_id, 'failed');
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function closeDatabase() {
  try {
    db.close();
  } catch {
    // already closed
  }
}