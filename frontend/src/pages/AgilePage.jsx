import { Link } from 'react-router-dom';
import { Check, Shield, Building2, ArrowRight, MessageCircle } from 'lucide-react';
import { siteContent } from '../data/siteContent';
import { usePageMeta } from '../utils/hooks';

const MODEL_CARDS = [
  {
    label: 'Official SAFe® Courses',
    color: 'border-t-primary-600',
    title: 'SAFe® Certification Training',
    text:
      'Official SAFe® courses are delivered where the applicable trainer eligibility, course-specific enablement/validation and licensed courseware requirements are satisfied.',
    items: [
      'Live instructor-led delivery',
      'Applicable Scaled Agile courseware',
      'Appropriate learner licensing',
      'Applicable learner rostering',
      'Certification administered through the applicable Scaled Agile process',
    ],
  },
  {
    label: 'Independent Services',
    color: 'border-t-teal-600',
    title: 'Agile Consulting & Workshops',
    text:
      'Independent, non-certification consulting and workshops developed using original Training4impact materials.',
    items: [
      'Agile coaching',
      'Agile transformation consulting',
      'Product Management workshops',
      'AI + Agile productivity programs',
      'PMO and enterprise transformation',
    ],
  },
];

const PUBLIC_COURSES = [
  {
    title: 'Leading SAFe®',
    text:
      'Instructor-led learning covering key SAFe® principles, practices and business agility concepts.',
    items: ['Live online delivery', 'Open to professionals', 'Applicable licensed courseware', 'Applicable learner registration'],
  },
  {
    title: 'SAFe® Scrum Master',
    text:
      'Practical learning for Scrum Masters supporting Agile teams within a SAFe® environment.',
    items: ['Live instructor-led training', 'Remote delivery', 'Applicable licensed courseware', 'Applicable Scaled Agile process'],
  },
  {
    title: 'SAFe® Product Owner / Product Manager',
    text:
      'Develop practical skills for Product Ownership and Product Management in a SAFe® environment.',
    items: ['Live online delivery', 'Open enrollment', 'Applicable licensed courseware', 'Applicable learner registration'],
  },
];

const PROCESS_STEPS = [
  { n: '1', title: 'Choose Your Course', text: 'Select an available SAFe® course based on your role and learning objectives.' },
  { n: '2', title: 'Register', text: 'Register for a public course or request a private corporate engagement.' },
  { n: '3', title: 'Attend Live Training', text: 'Participate in the live instructor-led training using the applicable licensed courseware.' },
  { n: '4', title: 'Certification Process', text: 'Where applicable, complete the certification process administered through Scaled Agile, Inc.' },
];

const CONSULTING = [
  {
    title: 'Agile Transformation',
    text:
      'Advisory and coaching services to help organizations improve business agility, ways of working and transformation outcomes.',
  },
  {
    title: 'AI + Agile',
    text:
      'Original workshops helping Agile professionals use generative AI to improve productivity and collaboration.',
  },
  {
    title: 'Agile PMO',
    text:
      'Practical workshops and advisory services for Agile PMO, governance, portfolio visibility and transformation.',
  },
];

const COMPLIANCE_LINKS = [
  {
    text: 'Scaled Agile: How do I prepare to teach a course?',
    href: 'https://support.scaledagile.com/en/articles/9767672-how-do-i-prepare-to-teach-a-course',
  },
  {
    text: "Scaled Agile: I'm an SPC. Can I teach public courses?",
    href: 'https://support.scaledagile.com/en/articles/9787067-i-m-an-spc-can-i-teach-public-courses',
  },
  {
    text: 'Scaled Agile: Course Eligibility for SPC / ASPC / SPCT',
    href: 'https://support.scaledagile.com/en/articles/11250404-i-m-an-spc-aspc-or-spct-what-courses-am-i-allowed-to-teach',
  },
  {
    text: 'Scaled Agile: General Content Usage FAQs',
    href: 'https://support.scaledagile.com/en/articles/9791354-general-content-usage-faqs-and-the-permission-request-form',
  },
];

export default function AgilePage() {
  usePageMeta({
    title: 'SAFe® Training & Agile Consulting | Training4Impact',
    description:
      'Live instructor-led SAFe® training, corporate private training, public open-enrollment courses, Agile coaching and transformation consulting.',
  });

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-primary-900">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="container-site relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 sm:text-sm">
              Advanced SAFe Practice Consultant (ASPC)
            </p>
            <h1 className="mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              SAFe® Training for{' '}
              <span className="text-cyan-400">Real-World Agility</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Live instructor-led SAFe® learning for professionals and organizations, combined
              with practical Agile coaching, consulting and transformation services.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#agile-courses"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-cyan-600"
              >
                Explore Public Courses
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href="#agile-corporate"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Corporate Training
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 lg:ml-8">
            <h2 className="text-lg font-bold text-white">Choose the right learning path</h2>
            <ul className="mt-4 space-y-4 text-sm text-slate-300">
              <li>
                <strong className="text-white">Individuals</strong>
                <span className="mt-0.5 block">Join a public/open-enrollment SAFe® course.</span>
              </li>
              <li>
                <strong className="text-white">Organizations</strong>
                <span className="mt-0.5 block">Request a dedicated private enterprise course.</span>
              </li>
              <li>
                <strong className="text-white">Transformation</strong>
                <span className="mt-0.5 block">Explore independent Agile &amp; AI consulting.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Two models */}
      <section className="bg-surface-50 py-16 sm:py-24">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label mb-3">Two Distinct Ways We Work</p>
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">Two Distinct Ways We Work</h2>
            <p className="mt-4 text-slate-600 sm:text-lg">
              We clearly distinguish official SAFe® certification courses from independent
              Agile consulting and workshops.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {MODEL_CARDS.map((model) => (
              <div
                key={model.label}
                className={`card flex flex-col border-t-4 p-8 ${model.color}`}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-primary-700">
                  {model.label}
                </p>
                <h3 className="mt-3 text-xl font-bold text-navy-900">{model.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{model.text}</p>
                <ul className="mt-6 space-y-2.5">
                  {model.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-navy-800">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public courses */}
      <section id="agile-courses" className="bg-white py-16 sm:py-24">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label mb-3">Public SAFe® Training</p>
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">Public SAFe® Training</h2>
            <p className="mt-4 text-slate-600 sm:text-lg">
              Open-enrollment, instructor-led courses for professionals from different organizations.
              Course availability is subject to applicable trainer eligibility and Scaled Agile
              requirements.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PUBLIC_COURSES.map((course) => (
              <div key={course.title} className="card flex flex-col p-7">
                <p className="text-xs font-bold uppercase tracking-widest text-primary-700">
                  Public / Open Enrollment
                </p>
                <h3 className="mt-3 text-lg font-bold text-navy-900">{course.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{course.text}</p>
                <ul className="mt-5 space-y-2 text-sm text-navy-800">
                  {course.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Check Upcoming Batch
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate */}
      <section id="agile-corporate" className="bg-navy-900 py-16 text-white sm:py-24">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Private SAFe® Training for Organizations
            </h2>
            <p className="mt-4 text-slate-300">
              Give your teams a dedicated learning experience designed for one enterprise.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Private remote delivery',
                'One enterprise / organization',
                'Dedicated employee cohort',
                'Applicable licensed courseware',
                'Appropriate learner rostering',
                'Course-specific trainer requirements',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600"
            >
              Request Corporate Training
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
            <h3 className="text-lg font-bold text-white">Example Private Engagement</h3>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="border-b border-white/10 pb-3"><dt className="text-slate-400">Client</dt><dd className="text-white">One enterprise</dd></div>
              <div className="border-b border-white/10 pb-3"><dt className="text-slate-400">Participants</dt><dd className="text-white">Employees of that enterprise</dd></div>
              <div className="border-b border-white/10 pb-3"><dt className="text-slate-400">Format</dt><dd className="text-white">Live remote instructor-led</dd></div>
              <div className="border-b border-white/10 pb-3"><dt className="text-slate-400">Courseware</dt><dd className="text-white">Licensed as applicable</dd></div>
              <div><dt className="text-slate-400">Delivery</dt><dd className="text-white">Subject to applicable Scaled Agile requirements</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-surface-50 py-16 sm:py-24">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label mb-3">How SAFe® Training Works</p>
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">How SAFe® Training Works</h2>
            <p className="mt-4 text-slate-600 sm:text-lg">
              A transparent process designed around the applicable Scaled Agile requirements.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div key={step.n} className="card p-7">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                  {step.n}
                </span>
                <h3 className="mt-4 text-base font-bold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consulting */}
      <section id="agile-consulting" className="bg-white py-16 sm:py-24">
        <div className="container-site">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label mb-3">Agile Consulting &amp; Independent Workshops</p>
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Agile Consulting &amp; Independent Workshops
            </h2>
            <p className="mt-4 text-slate-600 sm:text-lg">
              Beyond certification training, Training4impact provides independent Agile,
              transformation and AI-enabled learning services.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CONSULTING.map((card) => (
              <div key={card.title} className="card p-7">
                <h3 className="text-lg font-bold text-navy-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="agile-info" className="bg-surface-50 py-16 sm:py-24">
        <div className="container-site">
          <div className="card p-8 sm:p-10">
            <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">
              Important SAFe® Information
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
              <p>
                <strong className="text-navy-900">SAFe® and Scaled Agile Framework® are registered
                trademarks of Scaled Agile, Inc.</strong>
              </p>
              <p>
                Training4impact is an independent professional services and training brand.
                Training4impact does not represent itself as a Scaled Agile Partner unless
                separately authorized to do so.
              </p>
              <p>
                Official SAFe® courses are delivered only where the applicable trainer
                eligibility, course-specific enablement/validation and Scaled Agile-licensed
                courseware requirements are satisfied.
              </p>
              <p>
                SAFe® courseware and copyrighted Scaled Agile content are not reproduced,
                modified or distributed as part of independent workshops or consulting services.
              </p>
              <p>
                Training4impact does not independently issue SAFe® certifications. Where an
                official SAFe® course is delivered through the applicable Scaled Agile program,
                certification is administered through Scaled Agile, Inc.
              </p>
              <p>
                Public/open-enrollment and private corporate courses are subject to the applicable
                Scaled Agile requirements. Private courses are intended for participants within a
                single enterprise.
              </p>
              <p>
                For current requirements regarding course delivery, trademarks and content usage,
                please consult Scaled Agile's official guidance:
              </p>
              <ul className="space-y-2">
                {COMPLIANCE_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary-700 hover:underline"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-700 via-navy-800 to-navy-900 py-16 text-center text-white sm:py-20">
        <div className="container-site">
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Ready to Build Agile Capability?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Join an upcoming public SAFe® course, discuss private corporate training, or explore
            independent Agile and AI transformation services.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-600"
            >
              Contact Training4impact
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:${siteContent.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              {siteContent.email}
            </a>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Shield aria-hidden="true" className="h-4 w-4 text-teal-400" />
            FUTURE IMPACT PRIVATE LIMITED · Startup India Recognised
          </p>
          <p className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Building2 aria-hidden="true" className="h-4 w-4" />
            {siteContent.address}
          </p>
        </div>
      </section>
    </article>
  );
}