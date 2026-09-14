import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft, ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-react';
import { getCourseBySlug, formatINR } from '../data/courses';
import { useCart } from '../context/CartContext';
import { usePageMeta } from '../utils/hooks';
import { createOrder, startRazorpayCheckout, getRazorpayKeyId } from '../utils/payments';

export default function CartPage() {
  const { items, removeItem, subtotal } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const navigate = useNavigate();
  const keyId = getRazorpayKeyId();

  usePageMeta({
    title: 'Enrollment Cart | Training4Impact',
    description:
      'Review your selected fellowship programs and proceed to secure checkout at Training4Impact.',
  });

  const handleCheckout = async () => {
    if (items.length === 0 || checkingOut) return;
    setCheckoutError('');

    if (!keyId) {
      setCheckoutError(
        'Razorpay is not configured yet. Please contact us on WhatsApp +91 96444 88892 to complete your enrollment.'
      );
      return;
    }

    if (items.length > 1) {
      setCheckoutError(
        'Multiple course checkout is not available yet. Please complete one course at a time, or contact us on WhatsApp +91 96444 88892.'
      );
      return;
    }

    const course = getCourseBySlug(items[0].slug);
    if (!course) {
      setCheckoutError('Course information could not be found. Please try again.');
      return;
    }

    setCheckingOut(true);
    try {
      const { order } = await createOrder(course.id);
      const result = await startRazorpayCheckout({
        order,
        courseId: course.id,
        courseName: course.title,
      });

      removeItem(course.slug);

      navigate('/payment-success', {
        state: {
          courseName: course.title,
          courseSlug: course.slug,
          coursePrice: course.fee,
          orderRef: order.id,
          paymentId: result.payment?.paymentId,
          amount: course.fee,
          enrollmentStatus: result.enrollment?.status ?? null,
        },
      });
    } catch (err) {
      const msg = err?.message || 'Payment could not be completed.';
      if (msg !== 'Payment cancelled') {
        setCheckoutError(msg);
      }
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="bg-surface-50 min-h-[60vh] py-12 sm:py-16">
      <div className="container-site mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold sm:text-2xl">
            <ShoppingCart aria-hidden="true" className="mr-2 inline h-6 w-6 text-primary-700" />
            Enrollment Cart
          </h1>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-5xl" aria-hidden="true">🛒</p>
            <h2 className="mt-4 text-lg font-bold text-navy-900">Your cart is empty</h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Browse our fellowship and certificate programs and add one to get started.
            </p>
            <Link
              to="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Browse Programs
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {items.map(({ slug, title, fee }) => {
                const course = getCourseBySlug(slug);
                return (
                  <div
                    key={slug}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:gap-6"
                  >
                    <img
                      src={course?.image}
                      alt={title}
                      className="h-28 w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-28"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="flex flex-1 flex-col">
                      <h2 className="text-base font-bold text-navy-900">{title}</h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {course?.badge} · {course?.duration}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        Qty&nbsp;1
                      </span>
                    </div>
                    <p className="min-w-20 text-right text-base font-bold text-navy-900">
                      {formatINR(fee)}
                    </p>
                    <button
                      onClick={() => removeItem(slug)}
                      aria-label={`Remove ${title} from cart`}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <div className="p-6 sm:p-8">
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-600">Subtotal</dt>
                    <dd className="font-semibold text-navy-900">{formatINR(subtotal)}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <dt className="text-base font-bold text-navy-900">Total</dt>
                    <dd className="text-lg font-bold text-navy-900">{formatINR(subtotal)}</dd>
                  </div>
                </dl>
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Lock className="h-4 w-4" aria-hidden="true" />
                  )}
                  {checkingOut ? 'Redirecting…' : 'Proceed to Enroll'}
                </button>
                {checkoutError && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" aria-hidden="true" />
                    {checkoutError}
                  </div>
                )}
                <div className="mt-5 space-y-2 text-center text-xs text-slate-500">
                  <p className="flex items-center justify-center gap-2">
                    <Lock aria-hidden="true" className="h-3.5 w-3.5 text-cyan-600" />
                    Secure checkout — no card details stored
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-cyan-600" />
                    Razorpay &amp; UPI accepted · Refund policy applies
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}