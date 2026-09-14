import { Award, Star } from 'lucide-react';

export default function Certification({ course }) {
  if (!course.certification) return null;

  return (
    <section aria-labelledby="certification-heading" className="bg-navy-900 py-14 sm:py-16">
      <div className="container-site">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-2xl bg-white/5 p-8 text-center ring-1 ring-white/10 sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-white">
            <Award aria-hidden="true" className="h-7 w-7" />
          </span>
          <h2 id="certification-heading" className="mt-5 text-2xl font-bold text-white">
            Certification & Recognition
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">{course.certification}</p>
          <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
            <Star aria-hidden="true" className="h-3.5 w-3.5" />
            Internationally Recognised
          </p>
        </div>
      </div>
    </section>
  );
}