import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

const STORAGE_KEY = 't4i-payment-success';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const [data, setData] = useState(() => location.state || null);

  useEffect(() => {
    if (location.state) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(location.state));
    }
  }, [location.state]);

  useEffect(() => {
    if (!data) {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) setData(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, [data]);

  if (!data) {
    return (
      <div className="bg-surface-50 flex min-h-[70vh] items-center justify-center px-4">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
          <p className="text-5xl" aria-hidden="true">🔍</p>
          <h1 className="mt-4 text-xl font-bold text-navy-900">Payment Information Not Found</h1>
          <p className="mt-2 text-sm text-slate-600">
            We could not find payment details for this page. If you believe a payment was completed,
            please contact us for assistance.
          </p>
          <a
            href="https://wa.me/919644488892"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="h-4 w-4" />
            Contact on WhatsApp
          </a>
          <div className="mt-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
              Browse Programs
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const courses =
    Array.isArray(data.courses) && data.courses.length > 0
      ? data.courses
      : [{ courseName: data.courseName, amount: data.coursePrice }];
  const multi = courses.length > 1;
  const isVerified =
    data.enrollmentStatus === 'active' ||
    (Array.isArray(data.enrollments) &&
      data.enrollments.length > 0 &&
      data.enrollments.every((enr) => enr.status === 'active'));

  return (
    <div className="bg-surface-50 flex min-h-[70vh] items-center justify-center px-4">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-card sm:p-10">
        <div className="text-center">
          <CheckCircle
            className={`mx-auto h-14 w-14 ${isVerified ? 'text-emerald-500' : 'text-amber-500'}`}
            aria-hidden="true"
          />
          <h1 className="mt-4 text-xl font-bold text-navy-900">
            {isVerified ? 'Payment Successful' : 'Payment Received'}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isVerified
              ? multi
                ? `Your enrollment for ${courses.length} programs has been confirmed.`
                : `Your enrollment for "${courses[0]?.courseName}" has been confirmed.`
              : multi
                ? `Your payment for ${courses.length} programs was received and is being processed.`
                : `Your payment for "${courses[0]?.courseName}" was received and is being processed.`}
          </p>
        </div>

        <div className="mt-6 space-y-3 rounded-xl bg-surface-50 px-5 py-4 text-sm">
          {multi ? (
            <div className="border-b border-slate-100 pb-3">
              <span className="block text-slate-500">Programs</span>
              <ul className="mt-2 space-y-1.5">
                {courses.map((course, index) => (
                  <li key={`${course.courseId ?? 'course'}-${index}`} className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-navy-900">{course.courseName}</span>
                    {course.amount != null && (
                      <span className="shrink-0 text-slate-600">
                        {'\u20B9'}{Number(course.amount).toLocaleString('en-IN')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Program</span>
              <span className="font-semibold text-navy-900">{courses[0]?.courseName}</span>
            </div>
          )}
          {data.orderRef && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Order Reference</span>
              <span className="font-mono text-xs text-navy-800">{data.orderRef}</span>
            </div>
          )}
          {data.paymentId && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Payment Reference</span>
              <span className="font-mono text-xs text-navy-800">{data.paymentId}</span>
            </div>
          )}
          {data.amount != null && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="font-semibold text-navy-900">Amount Paid</span>
              <span className="text-base font-bold text-navy-900">
                {'\u20B9'}{Number(data.amount).toLocaleString('en-IN')}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Enrollment Status</span>
            <span className={`font-semibold ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isVerified ? (multi ? `${courses.length} Programs Confirmed` : 'Confirmed') : 'Processing'}
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-center text-xs text-slate-500">
          <p>
            Access details will be shared within 24–72 hours. Please save your order reference.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="https://wa.me/919644488892"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Contact on WhatsApp
          </a>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            Browse More Programs
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}