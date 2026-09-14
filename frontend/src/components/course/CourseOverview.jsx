import { Clock, MonitorSmartphone, Users, Award } from 'lucide-react';
import { formatINR } from '../../data/courses';

export default function CourseOverview({ course }) {
  const facts = [
    { icon: Clock, label: 'Duration', value: course.duration },
    { icon: MonitorSmartphone, label: 'Delivery', value: course.deliveryMode },
    { icon: Users, label: 'Audience', value: course.targetAudience },
    { icon: Award, label: 'Program Fee', value: formatINR(course.fee) },
  ];

  return (
    <section aria-labelledby="overview-heading" className="bg-white py-14 sm:py-16">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="section-label mb-3">Overview</p>
            <h2 id="overview-heading" className="text-2xl font-bold sm:text-3xl">
              About This Program
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {course.description}
            </p>
            {course.highlights.length > 0 && (
              <>
                <h3 className="mt-10 text-lg font-bold text-navy-900">Key Highlights</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 rounded-xl bg-surface-50 p-4 text-sm text-navy-800 ring-1 ring-slate-100">
                      <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-[11px] font-bold text-white">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-surface-50 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Quick Facts
              </h3>
              <dl className="mt-4 space-y-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-primary-700">
                      <Icon aria-hidden="true" className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <dt className="text-xs font-medium text-slate-500">{label}</dt>
                      <dd className="text-sm font-semibold text-navy-900">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}