import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection({
  heading,
  body,
  primaryLabel = 'View All Programs →',
  primaryTo = '/courses',
  secondaryLabel,
  secondaryHref,
  secondaryMessage,
}) {
  return (
    <section className="border-y border-slate-200 bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900">
      <div className="container-site py-14 text-center sm:py-20">
        <h2 className="mx-auto max-w-3xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">{body}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={primaryTo}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-cyan-600"
          >
            {primaryLabel}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          {secondaryMessage && (
            <a
              href={secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-xs text-slate-400">
          Secure Checkout · Razorpay &amp; UPI Accepted · Refund policy applies
        </p>
      </div>
    </section>
  );
}