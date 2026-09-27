import { usePageMeta } from '../utils/hooks';
import { siteContent } from '../data/siteContent';
import Hero from '../components/home/Hero';
import CourseCatalog from '../components/course/CourseCatalog';
import AlumniNetwork from '../components/home/AlumniNetwork';
import TestimonialsSection from '../components/home/TestimonialsSection';
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
      <CourseCatalog limit={3} hideFilters showViewAll />
      <AlumniNetwork limit={6} showViewAll />
      <TestimonialsSection limit={3} showViewAll />
      <FAQSection />
      <CTASection
        heading={siteContent.careerCta.heading}
        body={siteContent.careerCta.body}
      />
    </>
  );
}