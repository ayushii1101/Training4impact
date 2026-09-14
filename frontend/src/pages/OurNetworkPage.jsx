import { usePageMeta } from '../utils/hooks';

export default function OurNetworkPage() {
  usePageMeta({
    title: 'Our Network | Training4Impact',
    description:
      'Graduates of Training4Impact fellowships are placed across leading hospitals in India, Nepal, Singapore and the UAE.',
  });

  return (
    <section className="border-b border-slate-200 bg-surface-50 py-12 sm:py-16">
      <div className="container-site text-center">
        <p className="section-label mb-2">Our Network</p>
        <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">Our Alumni Are Working At</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Graduates of Training4Impact fellowships are placed across leading hospitals in India,
          Nepal, Singapore and the UAE.
        </p>
      </div>
    </section>
  );
}