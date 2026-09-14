import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function LegalPageLayout({ title, subtitle, intro, sections, closing }) {
  return (
    <section className="bg-surface-50 py-12 sm:py-16">
      <div className="container-site">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mx-auto mt-6 max-w-3xl">
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>}

          <div className="mt-8 space-y-8">
            {intro &&
              intro.split('\n\n').map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-slate-700">
                  {paragraph.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < paragraph.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}

            {sections.map((section) => (
              <div key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
                <h2 className="text-lg font-bold text-navy-900">{section.heading}</h2>

                {section.subSections ? (
                  <div className="mt-3 space-y-4">
                    {section.subSections.map((sub, i) => (
                      <div key={i}>
                        {sub.heading && (
                          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                            {sub.heading}
                          </h3>
                        )}
                        {sub.body && (
                          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                            {sub.body}
                          </p>
                        )}
                        {sub.listItems && (
                          <ul className="mt-2 space-y-2">
                            {sub.listItems.map((item) => (
                              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                                <span className="flex-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {section.body && (
                      <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
                        {section.body}
                      </p>
                    )}
                    {section.listItems && (
                      <ul className="mt-3 space-y-2">
                        {section.listItems.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 leading-relaxed text-slate-700">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}

                {section.footer && (
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">
                    {section.footer}
                  </p>
                )}
              </div>
            ))}

            {closing && (
              <div className="rounded-2xl bg-primary-50 p-6 text-sm text-primary-900 ring-1 ring-primary-200">
                {closing}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegalPage({ meta, content }) {
  return <LegalPageLayout {...content} />;
}