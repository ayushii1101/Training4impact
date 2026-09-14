import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqs } from '../../data/faq';
import SectionHeading from '../common/SectionHeading';

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
      >
        <span className="text-sm font-bold text-navy-900 sm:text-base">{faq.question}</span>
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
            open ? 'bg-primary-600 text-white' : 'bg-surface-100 text-navy-800'
          }`}
        >
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600 sm:px-6">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection({ id = 'faq' }) {
  return (
    <section id={id} className="bg-white py-16 sm:py-24" aria-labelledby="faq-heading">
      <div className="container-site">
        <SectionHeading
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Answers to the questions we hear most about our fellowship programs, payments and training format."
        />

        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}