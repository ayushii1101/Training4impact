import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Medal, Globe2 } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
      />

      <div className="container-site relative py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 sm:text-sm">
            <Building2 aria-hidden="true" className="h-4 w-4 text-cyan-400" />
            {siteContent.startupIndia}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-widest text-cyan-400 sm:text-sm">
            {siteContent.certifications}
          </p>

          <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Empowering Medical Professionals Through {''}
            <span className="text-cyan-400">Hands-On Learning</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
            {siteContent.heroDescription}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-cyan-600"
            >
              Browse Fellowship Programs
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          {/* Crypto-styled credibility row */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="flex items-center justify-center gap-1.5 text-2xl font-extrabold text-white sm:text-3xl">
                <Medal aria-hidden="true" className="h-5 w-5 text-cyan-400" />
                {siteContent.stats[0].value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{siteContent.stats[0].label}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="flex items-center justify-center gap-1.5 text-2xl font-extrabold text-white sm:text-3xl">
                <GraduationCapIcon />
                {siteContent.stats[1].value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{siteContent.stats[1].label}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="flex items-center justify-center gap-1.5 text-2xl font-extrabold text-white sm:text-3xl">
                <Building2 aria-hidden="true" className="h-5 w-5 text-cyan-400" />
                {siteContent.stats[2].value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{siteContent.stats[2].label}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Globe2 aria-hidden="true" className="h-5 w-5 shrink-0 text-cyan-400" />
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {siteContent.countries.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GraduationCapIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-cyan-400"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}