import { Lock, ShieldCheck, IndianRupee } from 'lucide-react';
import { formatINR } from '../../data/courses';
import PaymentPlaceholder from './PaymentPlaceholder';

export default function EnrollmentCard({ course }) {
  const emi = course.additionalInformation?.emi;

  return (
    <section id="enroll" aria-labelledby="enrollment-heading" className="bg-surface-50 py-14 sm:py-16">
      <div className="container-site">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            {/* Header */}
            <div className="bg-gradient-to-br from-navy-900 to-primary-900 px-6 py-6 text-center sm:px-8">
              <h2 id="enrollment-heading" className="text-lg font-bold uppercase tracking-wider text-slate-300">
                Program Fee
              </h2>
              <p className="mt-2 flex items-center justify-center gap-2 text-3xl font-extrabold text-white sm:text-4xl">
                <IndianRupee aria-hidden="true" className="h-7 w-7 text-cyan-400" />
                {formatINR(course.fee).replace('₹', '').toLocaleString('en-IN')}
              </p>
              {emi && <p className="mt-2 text-sm font-medium text-cyan-300">EMI available · {emi}</p>}
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row">
                <PaymentPlaceholder course={course} />
              </div>

              <ul className="mt-6 space-y-2.5 text-sm text-slate-600">
                <li className="flex items-center gap-2.5">
                  <Lock aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-600" />
                  Secure checkout — no card details stored
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-600" />
                  Razorpay &amp; UPI accepted · Refund policy applies
                </li>
              </ul>

              <p className="mt-6 rounded-xl bg-surface-50 px-4 py-3 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-100">
                Enrollment is confirmed only after successful payment and verification by our team.
                Access details are shared within 24–72 hours after confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}