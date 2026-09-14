import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/hooks';

export default function NotFoundPage() {
  usePageMeta({
    title: 'Page Not Found | Training4Impact',
    description: 'The page you are looking for does not exist.',
  });

  return (
    <div className="container-site py-24 text-center">
      <p className="text-6xl font-bold text-primary-600" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Page Not Found</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
      >
        Back to Home
      </Link>
    </div>
  );
}