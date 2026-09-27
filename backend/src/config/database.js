import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../../data');

fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(dataDir, 't4i.db');

export const db = new DatabaseSync(dbPath);

function enrollmentHasPaymentOnlyUnique() {
  const uniqueIndexes = db.prepare(`PRAGMA index_list('enrollments')`).all().filter((i) => i.unique);
  for (const index of uniqueIndexes) {
    const columns = db.prepare(`PRAGMA index_info('${index.name}')`).all().map((c) => c.name);
    if (columns.length === 1 && columns[0] === 'razorpay_payment_id') {
      return true;
    }
  }
  return false;
}

// Migration: the original table required a single unique razorpay_payment_id,
// which prevents recording one enrollment per course for a multi-course order.
// Rebuild it with a composite unique (razorpay_payment_id, course_id) so every
// purchased course in an order gets its own enrollment row while existing
// single-course records are preserved.
if (enrollmentHasPaymentOnlyUnique()) {
  db.exec('BEGIN IMMEDIATE');
  try {
    db.exec(`ALTER TABLE enrollments RENAME TO enrollments_migration_old`);
    db.exec(`
      CREATE TABLE enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id TEXT NOT NULL,
        course_name TEXT NOT NULL,
        razorpay_payment_id TEXT NOT NULL,
        razorpay_order_id TEXT NOT NULL,
        amount_paise INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'INR',
        enrollment_status TEXT NOT NULL DEFAULT 'active',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE (razorpay_payment_id, course_id)
      )
    `);
    db.exec(`
      INSERT INTO enrollments
        (id, course_id, course_name, razorpay_payment_id, razorpay_order_id, amount_paise, currency, enrollment_status, created_at)
      SELECT
        id, course_id, course_name, razorpay_payment_id, razorpay_order_id, amount_paise, currency, enrollment_status, created_at
      FROM enrollments_migration_old
    `);
    db.exec(`DROP TABLE enrollments_migration_old`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_enrollments_razorpay_payment_id ON enrollments(razorpay_payment_id)`);
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

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

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    razorpay_order_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    course_name TEXT NOT NULL,
    unit_price_paise INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    line_total_paise INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (razorpay_order_id, course_id)
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
    razorpay_payment_id TEXT NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    amount_paise INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    enrollment_status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (razorpay_payment_id, course_id)
  );

  CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_razorpay_order_id ON order_items(razorpay_order_id);
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

export function insertOrderWithItems({
  courseId,
  courseName,
  amountPaise,
  currency,
  razorpayOrderId,
  receipt,
  status = 'created',
  items = [],
}) {
  db.exec('BEGIN IMMEDIATE');
  try {
    insertOrder({ courseId, courseName, amountPaise, currency, razorpayOrderId, receipt, status });
    const insertItem = db.prepare(
      `INSERT OR IGNORE INTO order_items
        (razorpay_order_id, course_id, course_name, unit_price_paise, quantity, line_total_paise)
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    for (const item of items) {
      insertItem.run(
        razorpayOrderId,
        item.courseId,
        item.courseName,
        item.unitPricePaise,
        item.quantity,
        item.lineTotalPaise
      );
    }
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function getOrderItems(razorpayOrderId) {
  return (
    db
      .prepare(
        `SELECT course_id, course_name, unit_price_paise, quantity, line_total_paise
         FROM order_items WHERE razorpay_order_id = ? ORDER BY id`
      )
      .all(razorpayOrderId) ?? []
  );
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

export function getEnrollmentsByRazorpayPaymentId(razorpayPaymentId) {
  return (
    db
      .prepare(
        `SELECT id, course_id, course_name, razorpay_payment_id, razorpay_order_id, amount_paise, currency, enrollment_status, created_at
         FROM enrollments WHERE razorpay_payment_id = ? ORDER BY id`
      )
      .all(razorpayPaymentId) ?? []
  );
}

export function persistCapturedPayment({ order, paymentId, amountPaise, paymentStatus, source, items = [] }) {
  const existing = getPaymentByRazorpayPaymentId(paymentId);
  if (existing) {
    updatePayment({
      razorpayPaymentId: paymentId,
      verificationStatus: 'verified',
      paymentStatus,
    });
    return {
      payment: getPaymentByRazorpayPaymentId(paymentId),
      enrollments: getEnrollmentsByRazorpayPaymentId(paymentId),
      enrollment: getEnrollmentByRazorpayPaymentId(paymentId),
      alreadyExisting: true,
    };
  }

  const effectiveItems = items.length
    ? items
    : [
        {
          courseId: order.course_id,
          courseName: order.course_name,
          lineTotalPaise: amountPaise ?? order.amount_paise,
        },
      ];

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
    for (const item of effectiveItems) {
      insertEnrollment({
        courseId: item.courseId ?? item.course_id,
        courseName: item.courseName ?? item.course_name,
        razorpayPaymentId: paymentId,
        razorpayOrderId: order.razorpay_order_id,
        amountPaise: item.lineTotalPaise ?? item.line_total_paise ?? item.amount_paise,
        currency: order.currency,
      });
    }
    updateOrderStatus(order.razorpay_order_id, 'paid');
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  return {
    payment: getPaymentByRazorpayPaymentId(paymentId),
    enrollments: getEnrollmentsByRazorpayPaymentId(paymentId),
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