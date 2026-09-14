import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin, ShieldCheck } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import { useGoToSection } from '../../utils/hooks';

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-sm text-slate-400 transition-colors hover:text-cyan-400">
    {children}
  </Link>
);

export default function Footer() {
  const goToSection = useGoToSection();

  return (
    <footer className="bg-navy-900 text-slate-300">
      <div className="container-site py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="text-lg font-bold text-white">Training4<span className="text-cyan-400">Impact</span></p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Future Impact Pvt Ltd
            </p>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              FUTURE IMPACT PRIVATE LIMITED
            </p>
            <p className="mt-2 flex items-start gap-2 text-sm text-slate-400">
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
              <span>{siteContent.address}</span>
            </p>
            <a
              href={`mailto:${siteContent.email}`}
              className="mt-3 flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400"
            >
              <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-500" />
              {siteContent.email}
            </a>
            <a
              href={siteContent.phoneLink}
              className="mt-2 flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400"
            >
              <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-500" />
              {siteContent.whatsappDisplay}
            </a>
          </div>

          {/* Programs */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Programs</p>
            <ul className="space-y-2.5">
              <li><FooterLink to="/courses">Fellowships</FooterLink></li>
              <li><FooterLink to="/courses?category=crs">Certificate Courses</FooterLink></li>
              <li><FooterLink to="/agile">Agile Training (SAFe®)</FooterLink></li>
              <li>
                <button
                  onClick={() => goToSection('testimonials')}
                  className="text-sm text-slate-400 transition-colors hover:text-cyan-400"
                >
                  Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Company</p>
            <ul className="space-y-2.5">
              <li><FooterLink to="/contact">About Us</FooterLink></li>
              <li><FooterLink to="/contact">Contact</FooterLink></li>
              <li className="pt-2">
                <div className="flex gap-3">
                  <a
                    href={siteContent.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                  >
                    <Facebook aria-hidden="true" className="h-4 w-4" />
                  </a>
                  <a
                    href={siteContent.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                  >
                    <Instagram aria-hidden="true" className="h-4 w-4" />
                  </a>
                  <a
                    href={siteContent.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                  >
                    <Linkedin aria-hidden="true" className="h-4 w-4" />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Legal</p>
            <ul className="space-y-2.5">
              <li><FooterLink to="/terms">Terms &amp; Conditions</FooterLink></li>
              <li><FooterLink to="/refund-policy">Refund Policy</FooterLink></li>
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink to="/shipping-delivery-policy">Shipping &amp; Delivery Policy</FooterLink></li>
            </ul>
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 text-cyan-500" />
                Secure Payments
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span
                  title="Razorpay — Payment gateway"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-white px-3 py-2"
                >
                  <img
                    src="/images/razorpay-logo.svg"
                    alt="Razorpay"
                    loading="lazy"
                    className="h-4 w-4"
                  />
                </span>
                <span
                  title="UPI — Unified Payments Interface"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-white px-3 py-2"
                >
                  <img
                    src="/images/upi-logo.svg"
                    alt="UPI"
                    loading="lazy"
                    className="h-5 w-auto"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-center text-xs text-slate-500">
            © 2026 <span className="font-semibold text-slate-400">Future Impact Pvt Ltd</span> · All rights reserved
          </p>
          <p className="mt-2 text-center text-xs text-slate-500">
            {siteContent.domains[0]} · {siteContent.domains[1]} — Both domains owned by Future Impact Pvt Ltd
          </p>
          <p className="mt-2 text-center text-xs text-slate-600">
            🔒 Secured · PCI DSS · SSL/TLS · Razorpay Certified
          </p>
        </div>
      </div>
    </footer>
  );
}