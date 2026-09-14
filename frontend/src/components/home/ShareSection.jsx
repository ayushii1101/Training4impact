import { useState } from 'react';
import {
  Users,
  MessageCircle,
  Share2,
  Link as LinkIcon,
  ExternalLink,
  Upload,
  Check,
} from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import SectionHeading from '../common/SectionHeading';

const sharedText =
  "Hi! I'd like to share an amazing platform for medical professionals \uD83C\uDFE5\n\n*Training4impact.com* offers One-Year Fellowships in:\n\u2705 Cardiac Critical Care\n\u2705 Echocardiography\n\u2705 ECMO\n\u2705 Cardio Diabetes\n\u2705 Certificate Courses open to all\n\nSupported by The Simulation Society & ISCU \u{D83C}\u{DFC6}\n\n\uD83D\uDD17 Visit: https://training4impact.com\n\uD83D\uDCDE WhatsApp: +91 96444 88892";

const groupsText =
  "\uD83C\uDF1F *Fellowship Opportunity for Medical Professionals* \uD83C\uDF1F\n\nAttention Doctors, Nurses & Perfusionists!\n\nTraining4impact.com is now accepting enrollments for 2025-26 batches:\n\n\u2705 One Year Fellowship in Cardiac Critical Care — \u20B959,000\n\u2705 One Year Fellowship in Echocardiography — \u20B959,000\n\u2705 One Year Fellowship in ECMO — \u20B959,000\n\u2705 Certificate Course in ECHO — \u20B95,900\n\nInternationally recognised | Online+Hands-On\n\n\uD83D\uDD17 https://training4impact.com\n\uD83D\uDCDE +91 96444 88892";

const EMAIL_SUBJECT = encodeURIComponent('Training4impact.com — Fellowships for Medical Professionals');
const EMAIL_BODY = encodeURIComponent(siteContent.shareSection.copyMessage);

export default function ShareSection({ id = 'share' }) {
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(siteContent.shareSection.copyMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id={id} className="bg-white py-16 sm:py-24" aria-labelledby="share-heading">
      <div className="container-site">
        <SectionHeading
          label="📣 Spread the Word"
          title={siteContent.shareSection.heading}
          subtitle={siteContent.shareSection.paragraph}
        />

        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <button
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(sharedText)}`,
                '_blank',
                'noopener,noreferrer'
              )
            }
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-surface-50 p-5 text-left transition-colors hover:border-green-400"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
              <MessageCircle aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-navy-900">Share on WhatsApp</span>
              <span className="block text-xs text-slate-500">Send to friends, colleagues &amp; groups</span>
            </span>
            <ExternalLink aria-hidden="true" className="ml-auto h-4 w-4 text-slate-400" />
          </button>

          <button
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(groupsText)}`,
                '_blank',
                'noopener,noreferrer'
              )
            }
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-surface-50 p-5 text-left transition-colors hover:border-green-400"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">
              <Users aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-navy-900">Share in WhatsApp Groups</span>
              <span className="block text-xs text-slate-500">Post in medical, hospital &amp; alumni groups</span>
            </span>
            <ExternalLink aria-hidden="true" className="ml-auto h-4 w-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              try {
                navigator.clipboard.writeText('https://training4impact.com');
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } catch {
                setCopied(false);
              }
            }}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-surface-50 p-5 text-left transition-colors hover:border-primary-400"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
              <LinkIcon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-navy-900">Copy Website Link</span>
              <span className="block text-xs text-slate-500">Paste anywhere — email, SMS, LinkedIn</span>
            </span>
            {copied ? (
              <Check aria-hidden="true" className="ml-auto h-4 w-4 text-green-600" />
            ) : (
              <ExternalLink aria-hidden="true" className="ml-auto h-4 w-4 text-slate-400" />
            )}
          </button>

          <a
            href={`mailto:?subject=${EMAIL_SUBJECT}&body=${EMAIL_BODY}`}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-surface-50 p-5 text-left transition-colors hover:border-primary-400"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Share2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-navy-900">More Sharing Options</span>
              <span className="block text-xs text-slate-500">Email, SMS, Twitter, LinkedIn &amp; more</span>
            </span>
            <ExternalLink aria-hidden="true" className="ml-auto h-4 w-4 text-slate-400" />
          </a>
        </div>

        {/* Copy message box */}
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-surface-50 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            📱 Ready-to-send WhatsApp message — tap to copy
          </p>
          <p className="mt-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-navy-800 ring-1 ring-slate-100">
            {siteContent.shareSection.copyMessage}
          </p>
          <button
            onClick={copyMessage}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Upload aria-hidden="true" className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Message'}
          </button>
        </div>
      </div>
    </section>
  );
}