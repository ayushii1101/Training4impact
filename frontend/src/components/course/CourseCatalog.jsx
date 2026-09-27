import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { courses, getCoursesByCategory } from '../../data/courses';
import { siteContent } from '../../data/siteContent';
import CourseCard from './CourseCard';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'doc', label: 'Doctors' },
  { id: 'nrs', label: 'Nurses' },
  { id: 'prf', label: 'Perfusionists' },
  { id: 'crs', label: 'Certificate Courses' },
];

export default function CourseCatalog({
  id = 'programs',
  initialCategory = 'all',
  limit,
  hideFilters = false,
  showViewAll = false,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const activeCategory =
    urlCategory && CATEGORIES.some((cat) => cat.id === urlCategory) ? urlCategory : initialCategory;

  const handleCategory = (catId) => {
    if (catId === 'all') {
      setSearchParams({}, { replace: false });
    } else {
      setSearchParams({ category: catId }, { replace: false });
    }
  };

  const coursesToShow = limit
    ? getCoursesByCategory(activeCategory).slice(0, limit)
    : getCoursesByCategory(activeCategory);

  return (
    <section id={id} className="bg-surface-50 py-16 sm:py-24" aria-labelledby="course-catalog-heading">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-label mb-3">Fellowship Programs</p>
          <h2 id="course-catalog-heading" className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Choose Your Specialty
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Structured fellowships designed with clinical experts.{' '}
            {siteContent.announcement}
          </p>
        </div>

        {/* Category filters */}
        {!hideFilters && (
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
            role="group"
            aria-label="Filter courses by category"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-navy-800 hover:border-primary-400 hover:text-primary-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coursesToShow.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {coursesToShow.length === 0 && (
          <p className="mt-10 text-center text-slate-500">
            No programs in this category yet. Please contact us on WhatsApp for the latest batches.
          </p>
        )}

        {showViewAll && (
          <div className="mt-10 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-primary-400 hover:text-primary-700"
            >
              View All Programs
              <ArrowRight aria-hidden="true" className="h-4 w-4 text-primary-700" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}