import { usePageMeta } from '../utils/hooks';
import { refundPolicyContent } from '../data/legalContent';
import LegalPageLayout from './LegalPage';

export default function RefundPolicyPage() {
  usePageMeta({
    title: 'Refund Policy | Training4Impact',
    description:
      'Refund policy for Training4Impact courses, fellowships and programs — cancellation, refund timelines and exceptional cases.',
  });

  return <LegalPageLayout {...refundPolicyContent} />;
}