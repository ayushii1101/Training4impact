import { useState } from 'react';
import { Send, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import { getWhatsAppUrl } from '../../utils/links';

const ROLES = [
  'Select your role',
  'Doctor (MBBS)',
  'Doctor (MD/MS/DNB)',
  'Nurse (GNM/B.Sc)',
  'Perfusionist',
  'Medical Student',
  'Hospital Administrator',
  'Other Healthcare Professional',
];

const SUBJECTS = [
  'Select a topic',
  'Fellowship Enrollment Query',
  'Certificate Course Query',
  'Payment / Fees Query',
  'Schedule / Timing Query',
  'Accreditation / Certificate Query',
  'Website Development Inquiry',
  'Financial Planning Inquiry',
  'Partnership / Collaboration',
  'Other',
];

const INITIAL_FORM = {
  name: '',
  whatsapp: '',
  email: '',
  role: ROLES[0],
  subject: SUBJECTS[0],
  message: '',
};

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Full name is required.';
    if (!form.whatsapp.trim()) next.whatsapp = 'WhatsApp number is required.';
    else if (!/^[+\d][\d\s-]{7,14}$/.test(form.whatsapp.trim()))
      next.whatsapp = 'Enter a valid WhatsApp number.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = 'Enter a valid email address.';
    if (form.role === ROLES[0]) next.role = 'Please select your role.';
    if (form.subject === SUBJECTS[0]) next.subject = 'Please select a subject.';
    if (!form.message.trim()) next.message = 'Message is required.';
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const text = [
      `*New Enquiry — Training4impact.com*`,
      `Name: ${form.name.trim()}`,
      `WhatsApp: ${form.whatsapp.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : '',
      `Role: ${form.role}`,
      `Subject: ${form.subject}`,
      `Message: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(getWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card mx-auto max-w-2xl p-10 text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-green-600" />
        <h2 className="mt-5 text-2xl font-bold">Message Sent!</h2>
        <p className="mt-3 text-slate-600">
          Thank you for reaching out. Your message has been sent via WhatsApp. We'll respond within 24 hours.
        </p>
        <button
          onClick={() => {
            setForm(INITIAL_FORM);
            setSubmitted(false);
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" required error={errors.name}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-field"
            placeholder="Dr. Aarti Sharma"
          />
        </Field>

        <Field label="WhatsApp Number" required error={errors.whatsapp}>
          <input
            type="tel"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            className="input-field"
            placeholder="+91 99999 99999"
          />
        </Field>

        <Field label="Email Address" error={errors.email}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input-field"
            placeholder="you@example.com"
          />
        </Field>

        <Field label="I am a" required error={errors.role}>
          <SelectField name="role" value={form.role} onChange={handleChange} options={ROLES} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Subject" required error={errors.subject}>
            <SelectField name="subject" value={form.subject} onChange={handleChange} options={SUBJECTS} />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Your Message" required error={errors.message}>
            <textarea
              name="message"
              rows={5}
              maxLength={800}
              value={form.message}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Tell us how we can help…"
            />
            <p className="mt-1 text-right text-xs text-slate-400">{form.message.length} / 800</p>
          </Field>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
      >
        <Send aria-hidden="true" className="h-4 w-4" />
        Send Message
      </button>

      <p className="mt-4 text-center text-xs text-slate-500">
        <MessageCircle aria-hidden="true" className="mr-1 inline h-3.5 w-3.5 text-green-600" />
        We typically respond within 24 hours on WhatsApp.
        <br />
        Your message opens in WhatsApp — no data is stored on this preview website.
      </p>
    </form>
  );
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label}{' '}
        {required && (
          <span aria-hidden="true" className="text-red-600">
            *
          </span>
        )}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function SelectField({ name, value, onChange, options }) {
  return (
    <select name={name} value={value} onChange={onChange} className="input-field">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function ContactQuickLinks() {
  return (
    <div className="card p-6 sm:p-8">
      <h3 className="text-lg font-bold">Prefer Direct Contact?</h3>
      <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <Clock aria-hidden="true" className="h-4 w-4 text-cyan-600" />
        {siteContent.contactSection.availability}
      </p>
      <div className="mt-6 space-y-3">
        <a
          href={getWhatsAppUrl('Hi Training4impact, I have a query')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={siteContent.phoneLink}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-primary-400"
        >
          📞 {siteContent.whatsappDisplay}
        </a>
      </div>
    </div>
  );
}