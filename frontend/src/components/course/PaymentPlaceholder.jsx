import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../data/courses';
import { createOrder, startRazorpayCheckout, getRazorpayKeyId } from '../../utils/payments';

const PAYMENT_METHODS = [
  {
    id: 'razorpay',
    label: 'Razorpay · Secure Payment Gateway',
    icon: ShieldCheck,
    note: 'Pay via UPI · Debit / Credit Cards',
  },
];

export default function PaymentPlaceholder({ course }) {
  const [method, setMethod] = useState('razorpay');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { items, removeItem } = useCart();
  const keyId = getRazorpayKeyId();

  const handlePayment = async () => {
    if (pending) return;
    setError('');
    if (!keyId) {
      setError(
        'Razorpay is not configured yet. Please contact us on WhatsApp +91 96444 88892 to complete your enrollment.'
      );
      return;
    }
    if (!course?.id) {
      setError('Course information is missing. Please reload and try again.');
      return;
    }

    setPending(true);
    try {
      const { order } = await createOrder(course.id);
      const result = await startRazorpayCheckout({
        order,
        courseId: course.id,
        courseName: course.title,
      });

      if (items.some((it) => it.slug === course.slug)) {
        removeItem(course.slug);
      }

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
        setError(msg);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-surface-50 p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-900">
        <Lock aria-hidden="true" className="h-4 w-4 text-cyan-600" />
        Choose Payment Method
      </h3>

      <div className="mt-4 space-y-3" role="radiogroup" aria-label="Payment method">
        {PAYMENT_METHODS.map(({ id, label, icon: Icon, note }) => (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
              method === id
                ? 'border-primary-600 bg-primary-50 ring-1 ring-primary-200'
                : 'border-slate-200 bg-white hover:border-primary-300'
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              value={id}
              checked={method === id}
              onChange={() => setMethod(id)}
              className="h-4 w-4 accent-primary-600"
            />
            <Icon aria-hidden="true" className={`h-5 w-5 ${method === id ? 'text-primary-700' : 'text-slate-400'}`} />
            <span className="flex-1">
              <span className="block text-sm font-semibold text-navy-900">{label}</span>
              <span className="block text-xs text-slate-500">{note}</span>
            </span>
          </label>
        ))}
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-800">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" aria-hidden="true" />
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={pending || !keyId}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Zap aria-hidden="true" className="h-4 w-4" />
        )}
        {pending
          ? 'Redirecting…'
          : keyId
            ? `Pay ${formatINR(course.fee)} · Proceed Securely`
            : 'Payment not available'}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
        🔒 256-bit SSL encrypted · PCI DSS compliant · Powered by Razorpay
      </p>
    </div>
  );
}