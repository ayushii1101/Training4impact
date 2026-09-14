import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Users, BadgeCheck, Filter, ArrowRight, MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../../utils/links';

const CATEGORY_LABELS = {
  doc: 'Doctors',
  nrs: 'Nurses',
  prf: 'Perfusionists & Medical Fraternity',
  crs: 'Certificate Course — Open to All',
};

export default function CourseHero({ course }) {
  const handleEnroll = () => {
    document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${course.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/95 to-primary-900/80" />

      <div className="container-site relative py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 sm:text-sm">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li>
              <Link to="/courses" className="hover:text-white">
                Programs
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
            <li className="font-medium text-cyan-400" aria-current="page">
              {course.shortTitle}
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
                {course.badge}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-200">
                <Filter aria-hidden="true" className="h-3.5 w-3.5" />
                {CATEGORY_LABELS[course.category] || course.category}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">{course.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Clock aria-hidden="true" className="h-4 w-4 text-cyan-400" />
                  Duration
                </dt>
                <dd className="mt-1 text-lg font-bold text-white">{course.duration}</dd>
              </div>
              <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Users aria-hidden="true" className="h-4 w-4 text-cyan-400" />
                  Format
                </dt>
                <dd className="mt-1 text-lg font-bold text-white">{course.deliveryMode}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleEnroll}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600"
              >
                Enroll Now
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
              <a
                href={getWhatsAppUrl(
                  `Hi, I'm interested in enrolling in the ${course.title} program at Training4impact.com`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:pl-8">
            <img
              src={course.image}
              alt={`${course.title} — program illustration`}
              className="aspect-[16/9] w-full rounded-2xl object-cover shadow-cardHover ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}