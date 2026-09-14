import { usePageMeta } from '../utils/hooks';
import { shippingPolicyContent } from '../data/legalContent';
import LegalPageLayout from './LegalPage';

export default function ShippingPolicyPage() {
  usePageMeta({
    title: 'Shipping & Delivery Policy | Training4Impact',
    description:
      'Shipping and delivery policy for Training4Impact digital courses, materials and physical deliverables.',
  });

  return <LegalPageLayout {...shippingPolicyContent} />;
}