const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export function getRazorpayKeyId() {
  return import.meta.env.VITE_RAZORPAY_KEY_ID ?? '';
}

async function parseResponse(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }
  if (!res.ok) {
    const msg = typeof data === 'object' && data !== null ? data.message : undefined;
    throw new Error(msg || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function createOrder(courseId) {
  const res = await fetch(`${API_URL}/api/payments/create-order`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ courseId }),
  });
  return parseResponse(res);
}

export async function verifyPayment({ courseId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const res = await fetch(`${API_URL}/api/payments/verify`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ courseId, razorpay_order_id, razorpay_payment_id, razorpay_signature }),
  });
  return parseResponse(res);
}

let checkoutScriptPromise = null;

export function loadRazorpayCheckoutScript() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!checkoutScriptPromise) {
    checkoutScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => {
        checkoutScriptPromise = null;
        reject(new Error('Failed to load Razorpay Checkout'));
      };
      document.body.appendChild(script);
    });
  }
  return checkoutScriptPromise;
}

export async function startRazorpayCheckout({ order, courseId, courseName }) {
  const key = getRazorpayKeyId();
  if (!key) throw new Error('Payment is not configured yet. Please contact us on WhatsApp +91 96444 88892.');

  const RazorpayConstructor = await loadRazorpayCheckoutScript();

  return new Promise((resolve, reject) => {
    let settled = false;

    const settle = (fn) => {
      if (settled) return;
      settled = true;
      fn();
    };

    const rzp = new RazorpayConstructor({
      key,
      amount: order.amount,
      currency: order.currency,
      name: 'Training4Impact',
      description: courseName || 'Course Enrollment',
      order_id: order.id,
      prefill: {},
      theme: { color: '#1d4ed8' },
      handler: async (response) => {
        try {
          const result = await verifyPayment({
            courseId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          settle(() => resolve(result));
        } catch (err) {
          settle(() => reject(err));
        }
      },
      modal: {
        ondismiss: () => settle(() => reject(new Error('Payment cancelled'))),
      },
    });

    rzp.on('payment.failed', (response) => {
      settle(() => reject(new Error(response?.error?.description || 'Payment failed')));
    });

    rzp.open();
  });
}