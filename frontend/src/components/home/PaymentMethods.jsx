import { ShieldCheck, Smartphone } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import SectionHeading from '../common/SectionHeading';

const ICON_MAP = {
  mobile: Smartphone,
  shield: ShieldCheck,
};

export default function PaymentMethods({ id = 'payments' }) {
  return (
    <section id={id} className="bg-surface-50 py-16 sm:py-24" aria-labelledby="payments-heading">
      <div className="container-site">
        <SectionHeading
          label="Secure Payments"
          title={siteContent.paymentMethodsHeading || 'Pay Securely with Razorpay & UPI'}
          subtitle={
            siteContent.paymentMethodsSubtitle ||
            'Every payment is encrypted and processed on Razorpay. UPI and card payments accepted.'
          }
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {siteContent.paymentMethods.map((method) => {
            const Icon = ICON_MAP[method.icon] || Smartphone;
            return (
              <div
                key={method.id}
                className="card flex flex-col p-6 transition-shadow hover:shadow-cardHover sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/10 text-primary-700">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      method.id === 'upi'
                        ? 'bg-teal-600/10 text-teal-700'
                        : 'bg-cyan-500/10 text-cyan-700'
                    }`}
                  >
                    {method.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy-900">{method.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{method.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {method.methods.map((m) => (
                    <span
                      key={m}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-navy-800"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm font-medium text-slate-600">
          <ShieldCheck aria-hidden="true" className="h-4 w-4 text-teal-600" />
          {siteContent.paymentNote}
        </p>
      </div>
    </section>
  );
}