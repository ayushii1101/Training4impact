import { usePageMeta } from '../utils/hooks';
import { termsContent } from '../data/legalContent';
import LegalPageLayout from './LegalPage';

export default function TermsPage() {
  usePageMeta({
    title: 'Terms & Conditions | Training4Impact',
    description:
      'Terms and conditions for enrollment in Training4Impact courses, fellowships and programs by Future Impact Private Limited.',
  });

  return <LegalPageLayout {...termsContent} />;
}