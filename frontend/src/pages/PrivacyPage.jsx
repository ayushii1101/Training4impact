import { usePageMeta } from '../utils/hooks';
import { privacyPolicyContent } from '../data/legalContent';
import LegalPageLayout from './LegalPage';

export default function PrivacyPage() {
  usePageMeta({
    title: 'Privacy Policy | Training4Impact',
    description:
      'Privacy policy of Training4Impact and Future Impact Private Limited — how we collect, use and protect your personal information.',
  });

  return <LegalPageLayout {...privacyPolicyContent} />;
}