import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TicketPercent } from 'lucide-react';
import { courses, getCourseBySlug, formatINR } from '../data/courses';
import { usePageMeta } from '../utils/hooks';
import CourseHero from '../components/course/CourseHero';
import CourseOverview from '../components/course/CourseOverview';
import Curriculum from '../components/course/Curriculum';
import Eligibility from '../components/course/Eligibility';
import Certification from '../components/course/Certification';
import EnrollmentCard from '../components/course/EnrollmentCard';
import CourseCard from '../components/course/CourseCard';

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const course = getCourseBySlug(slug ? slug.toLowerCase() : undefined);

  usePageMeta({
    title: course
      ? `${course.title} | Training4Impact`
      : 'Course Not Found | Training4Impact',
    description: course
      ? `${course.description} ${course.duration}. ${formatINR(course.fee)}. ${course.certification}.`
      : 'The program you are looking for could not be found.',
  });

  if (!course) {
    return (
      <div className="container-site py-24 text-center">
        <p className="text-6xl" aria-hidden="true">🔍</p>
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Program Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          We couldn't find the program you were looking for. It may have been renamed or is no
          longer offered.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to Courses
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-navy-800 transition-colors hover:border-primary-400 hover:text-primary-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const related = courses.filter((c) => c.id !== course.id).slice(0, 3);

  return (
    <>
      <CourseHero course={course} />
      <CourseOverview course={course} />
      <Certification course={course} />
      <Curriculum course={course} />
      <Eligibility course={course} />
      <EnrollmentCard course={course} />

      <section className="bg-white py-14 sm:py-16" aria-labelledby="related-heading">
        <div className="container-site">
          <div className="flex items-center justify-between gap-4">
            <h2 id="related-heading" className="text-xl font-bold sm:text-2xl">
              Explore Other Programs
            </h2>
            <Link
              to="/courses"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
              View all
              <ArrowLeft aria-hidden="true" className="h-4 w-4 rotate-180" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <CourseCard key={item.id} course={item} />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary-300 bg-primary-50 px-6 py-6 text-center">
            <TicketPercent aria-hidden="true" className="h-6 w-6 text-primary-700" />
            <p className="max-w-xl text-sm text-primary-900">
              Discount/coupon systems will be enabled in a future release. For any assistance with
              enrollment, chat with us on WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}