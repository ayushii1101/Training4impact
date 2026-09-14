import { Mail, MapPin, Phone } from 'lucide-react';
import { siteContent } from '../data/siteContent';
import { usePageMeta } from '../utils/hooks';
import ContactForm, { ContactQuickLinks } from '../components/contact/ContactForm';

export default function ContactPage() {
  usePageMeta({
    title: 'Contact Us | Training4Impact — Future Impact Pvt Ltd',
    description:
      'Have a question about fellowships, payments, or anything else? Contact Training4Impact. We reply within 24 hours on WhatsApp +91 96444 88892.',
  });

  return (
    <>
      <section className="border-b border-slate-200 bg-surface-50 py-12">
        <div className="container-site">
          <p className="section-label mb-2">Contact Us</p>
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">We're Here to Help</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Have a question about fellowships, payments, or anything else? We reply within 24 hours
            on WhatsApp.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold sm:text-2xl">Send Us a Message</h2>
              <p className="mt-2 text-sm text-slate-600">
                Fill in the form and we'll reply on WhatsApp. Fields marked <span className="text-red-600">*</span>{' '}
                are required.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>

            <div className="space-y-6">
              <ContactQuickLinks />

              <div className="card p-6 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-wider text-navy-900">
                  FUTURE IMPACT PRIVATE LIMITED
                </p>
                <h3 className="mt-2 text-lg font-bold">Company Address</h3>
                <p className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                  <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                  {siteContent.address}
                </p>
                <div className="mt-4 space-y-2">
                  <a
                    href={`mailto:${siteContent.email}`}
                    className="flex items-center gap-2 text-sm font-medium text-primary-700 hover:underline"
                  >
                    <Mail aria-hidden="true" className="h-4 w-4" />
                    {siteContent.email}
                  </a>
                  <a
                    href={siteContent.phoneLink}
                    className="flex items-center gap-2 text-sm font-medium text-primary-700 hover:underline"
                  >
                    <Phone aria-hidden="true" className="h-4 w-4" />
                    {siteContent.whatsappDisplay}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}