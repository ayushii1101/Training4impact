import { Hospital, CalendarCheck, Search, MessageSquareText, Smartphone, Video, ArrowRight, Check } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import { getWhatsAppUrl } from '../../utils/links';
import SectionHeading from '../common/SectionHeading';

const ICON_MAP = {
  clinic: Hospital,
  calendar: CalendarCheck,
  search: Search,
  chat: MessageSquareText,
  mobile: Smartphone,
  video: Video,
};

export default function WebDevServices({ id = 'webdev' }) {
  return (
    <section id={id} className="bg-surface-50 py-16 sm:py-24" aria-labelledby="webdev-heading">
      <div className="container-site">
        <SectionHeading
          label="New Service"
          title={siteContent.webDevelopment.heading}
          subtitle={siteContent.webDevelopment.description}
        />

        {/* Stats */}
        <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {siteContent.webDevelopment.stats.map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <dd className="text-2xl font-extrabold text-primary-700 sm:text-3xl">{stat.value}</dd>
              <dt className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">{stat.label}</dt>
            </div>
          ))}
        </dl>

        {/* Features */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteContent.webDevelopment.features.map((feature) => {
            const Icon = ICON_MAP[feature.icon] || Hospital;
            return (
              <div
                key={feature.title}
                className="card flex flex-col p-6 transition-shadow hover:shadow-cardHover"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-cyan-600 text-white">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  {feature.badge && (
                    <span className="rounded-full bg-teal-600/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-700">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold text-navy-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Pricing plans */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {siteContent.webDevelopment.plans.map((plan) => (
            <div
              key={plan.name}
              className={`card relative flex flex-col p-6 sm:p-8 ${
                plan.popular ? 'ring-2 ring-primary-600' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  ⭐ Most Popular
                </span>
              )}
              <h3 className="text-lg font-bold text-navy-900">{plan.name}</h3>
              <p className="mt-3 text-3xl font-extrabold text-navy-900">
                {plan.price}
                <span className="block text-xs font-medium text-slate-500">{plan.priceNote}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-navy-800">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={getWhatsAppUrl(
                  `Hi, I'm a doctor and I want a website for my practice (${plan.name}). Please share details.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'border border-primary-600 text-primary-700 hover:bg-primary-50'
                }`}
              >
                Enquire Now
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-br from-navy-900 to-primary-900 p-8 text-center sm:p-12">
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            Ready to Get Your Practice Online?
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            {siteContent.webDevelopment.footerText}
          </p>
          <a
            href={getWhatsAppUrl(
              "Hi, I'm a doctor and I want a website for my practice. Please share details."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            Book Free Consultation on WhatsApp
          </a>
          <p className="mt-4 text-xs text-slate-400">
            {siteContent.webDevelopment.paymentsNote}
          </p>
        </div>
      </div>
    </section>
  );
}