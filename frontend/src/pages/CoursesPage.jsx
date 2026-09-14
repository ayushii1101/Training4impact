import { usePageMeta } from '../utils/hooks';
import CourseCatalog from '../components/course/CourseCatalog';

export default function CoursesPage() {
  usePageMeta({
    title: 'Fellowship & Certificate Programs | Training4Impact',
    description:
      'Browse our fellowship and certificate programs for doctors, nurses and perfusionists — Cardiac Critical Care, Echocardiography, ECMO and more.',
  });

  return (
    <>
      <div className="border-b border-slate-200 bg-surface-50 py-12">
        <div className="container-site">
          <p className="section-label mb-2">Programs</p>
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            All Fellowship &amp; Certificate Programs
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Structured programs designed with clinical experts. Choose your specialty and start your
            journey with India's trusted fellowship platform.
          </p>
        </div>
      </div>
      <CourseCatalog />
    </>
  );
}