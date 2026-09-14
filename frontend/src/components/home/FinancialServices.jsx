import { BarChart3, BriefcaseBusiness, Wallet, ShieldCheck, LineChart, ClipboardCheck, MessageCircle } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

const ICONS = {
  chart: BarChart3,
  briefcase: BriefcaseBusiness,
  wallet: Wallet,
};

const FEATURE_ICONS = [
  ShieldCheck,
  HeartPulseIcon,
  LineChart,
  PiggyBankIcon,
  LandmarkIcon,
  ClipboardCheck,
];

function HeartPulseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
    </svg>
  );
}

function PiggyBankIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11h.01" />
    </svg>
  );
}

function LandmarkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12,2 20,7 4,7" />
    </svg>
  );
}

export default function FinancialServices({ id = 'finance' }) {
  return (
    <section id={id} className="bg-navy-900 py-16 sm:py-24" aria-labelledby="finance-heading">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label mb-3">New Service · Financial Solutions</p>
          <h2 id="finance-heading" className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Top Doctors Don't Just
            <br className="hidden sm:block" /> Earn Well... They Protect Wealth{' '}
            <span className="text-cyan-400">Intelligently</span>
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {siteContent.financialPlanning.bullets.map((bullet) => {
            const Icon = ICONS[bullet.icon] || BarChart3;
            return (
              <div
                key={bullet.text}
                className="flex items-start gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">{bullet.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {siteContent.financialPlanning.features.map((feature, index) => {
            const Icon = FEATURE_ICONS[index] || ShieldCheck;
            return (
              <span
                key={feature}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 ring-1 ring-white/10"
              >
                <Icon aria-hidden="true" className="h-4 w-4 text-cyan-400" />
                {feature}
              </span>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <a
            href={siteContent.financialPlanning.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Reply YES on WhatsApp
          </a>
          <p className="mt-4 text-sm text-slate-400">
            {siteContent.financialPlanning.partner}
          </p>
        </div>
      </div>
    </section>
  );
}