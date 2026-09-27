import { usePageMeta } from '../utils/hooks';
import PaymentMethods from '../components/home/PaymentMethods';
import FinancialServices from '../components/home/FinancialServices';
import WebDevServices from '../components/home/WebDevServices';

export default function ServicesPage() {
  usePageMeta({
    title: 'Services — Payments, Financial Planning & Web Development | Training4Impact',
    description:
      'Secure Razorpay & UPI payments, doctor-focused financial planning with TATA AIA, and healthcare website development services from Training4Impact.',
  });

  return (
    <>
      <div className="border-b border-slate-200 bg-surface-50 py-12">
        <div className="container-site">
          <p className="section-label mb-2">Our Services</p>
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Payments, Financial Planning &amp; Web Development
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Everything you need beyond fellowship training — secure enrollment payments,
            doctor-focused financial planning and healthcare website development.
          </p>
        </div>
      </div>
      <PaymentMethods />
      <FinancialServices />
      <WebDevServices />
    </>
  );
}