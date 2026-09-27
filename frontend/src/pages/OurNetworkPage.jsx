import { usePageMeta } from '../utils/hooks';
import AlumniNetwork from '../components/home/AlumniNetwork';

export default function OurNetworkPage() {
  usePageMeta({
    title: 'Our Network | Training4Impact',
    description:
      'Graduates of Training4Impact fellowships are placed across leading hospitals in India, Nepal, Singapore and the UAE.',
  });

  return (
    <>
      <h1 className="sr-only">Our Network</h1>
      <AlumniNetwork />
    </>
  );
}