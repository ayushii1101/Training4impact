import { usePageMeta } from '../utils/hooks';
import { siteContent } from '../data/siteContent';
import Hero from '../components/home/Hero';
import CourseCatalog from '../components/course/CourseCatalog';
import PaymentMethods from '../components/home/PaymentMethods';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FinancialServices from '../components/home/FinancialServices';
import WebDevServices from '../components/home/WebDevServices';
import FAQSection from '../components/home/FAQSection';
import CTASection from '../components/common/CTASection';

export default function HomePage() {
  usePageMeta({
    title:
      'Training4Impact | Medical Fellowships for Doctors, Nurses & Perfusionists',
    description: siteContent.heroDescription,
  });

  return (
    <>
      <Hero />
      <CourseCatalog />
      <PaymentMethods />
      <TestimonialsSection />
      <FinancialServices />
      <WebDevServices />
      <FAQSection />
      <CTASection
        heading={siteContent.careerCta.heading}
        body={siteContent.careerCta.body}
      />
    </>
  );
}