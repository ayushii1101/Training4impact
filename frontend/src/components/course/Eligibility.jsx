import { CheckCircle2 } from 'lucide-react';

export default function Eligibility({ course }) {
  if (!course.eligibility || course.eligibility.length === 0) return null;

  return (
    <section aria-labelledby="eligibility-heading" className="bg-white py-14 sm:py-16">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <p className="section-label mb-3 text-center">Eligibility</p>
          <h2 id="eligibility-heading" className="text-center text-2xl font-bold sm:text-3xl">
            Who Can Enroll
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {course.eligibility.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-surface-50 p-5"
              >
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />
                <span className="text-sm font-medium text-navy-800">{item}</span>
              </li>
            ))}
          </ul>
          {course.additionalInformation?.seats && (
            <p className="mt-6 rounded-xl bg-primary-50 px-5 py-4 text-center text-sm font-medium text-primary-800 ring-1 ring-primary-200">
              📋 Limited seats — {course.additionalInformation.seats}
            </p>
          )}
          {course.additionalInformation?.minBatch && (
            <p className="mt-6 rounded-xl bg-primary-50 px-5 py-4 text-center text-sm font-medium text-primary-800 ring-1 ring-primary-200">
              📋 Minimum batch required to run this course: {course.additionalInformation.minBatch}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}