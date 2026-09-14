import { useState } from 'react';
import { Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { testimonials } from '../../data/testimonials';
import SectionHeading from '../common/SectionHeading';

export default function TestimonialsSection({ id = 'testimonials' }) {
  const [open, setOpen] = useState(true);

  return (
    <section id={id} className="bg-surface-50 py-16 sm:py-24" aria-labelledby="testimonials-heading">
      <div className="container-site">
        <SectionHeading
          label="Testimonials"
          title="What Our Alumni Say"
          subtitle="Hundreds of Indian medical professionals have advanced their careers with Training4impact.com."
        />

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-primary-400 hover:text-primary-700"
          >
            {open ? (
              <ChevronUp aria-hidden="true" className="h-4 w-4 text-primary-700" />
            ) : (
              <ChevronDown aria-hidden="true" className="h-4 w-4 text-primary-700" />
            )}
            {open ? 'Collapse Testimonials' : 'Show Testimonials'}
          </button>
        </div>

        {open && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.id}
                className="card flex flex-col p-6 transition-shadow hover:shadow-cardHover"
              >
                <Quote aria-hidden="true" className="h-7 w-7 text-cyan-500" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-800">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600/10 text-sm font-bold text-primary-700"
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.credential}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}