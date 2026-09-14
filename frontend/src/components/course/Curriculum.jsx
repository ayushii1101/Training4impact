export default function Curriculum({ course }) {
  if (!course.curriculum || course.curriculum.length === 0) return null;

  return (
    <section aria-labelledby="curriculum-heading" className="bg-surface-50 py-14 sm:py-16">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <p className="section-label mb-3 text-center">Curriculum</p>
          <h2 id="curriculum-heading" className="text-center text-2xl font-bold sm:text-3xl">
            Topics Covered
          </h2>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <ul className="grid gap-3 sm:grid-cols-2">
              {course.curriculum.map((topic, index) => (
                <li
                  key={topic}
                  className="flex items-start gap-2.5 rounded-xl bg-surface-50 px-4 py-3 text-sm text-navy-800 ring-1 ring-slate-100"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-600/10 text-xs font-bold text-primary-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}