import { usePageMeta } from '../utils/hooks';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ShareSection from '../components/home/ShareSection';

export default function TestimonialsPage() {
  usePageMeta({
    title: 'Testimonials | Training4Impact',
    description:
      'Hundreds of Indian medical professionals have advanced their careers with Training4impact.com.',
  });

  return (
    <>
      <h1 className="sr-only">Testimonials</h1>
      <TestimonialsSection />
      <ShareSection />
    </>
  );
}