import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Users, BadgeCheck, ShoppingCart, Zap, Check } from 'lucide-react';
import { formatINR } from '../../data/courses';
import { useCart } from '../../context/CartContext';

const CATEGORY_LABELS = {
  doc: 'Doctors',
  nrs: 'Nurses',
  prf: 'Perfusionists',
  crs: 'Certificate Course',
};

export default function CourseCard({ course }) {
  const detailsPath = `/courses/${course.slug}`;
  const { items, addItem } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const inCart = items.some((it) => it.slug === course.slug);

  const handleAdd = () => {
    addItem(course);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addItem(course);
    navigate('/cart');
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover">
      {/* Image */}
      <Link
        to={detailsPath}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-slate-100"
        aria-label={`View details for ${course.title}`}
      >
        <img
          src={course.image}
          alt={`${course.title} — ${course.shortTitle} program`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          <BadgeCheck aria-hidden="true" className="h-3 w-3" />
          {course.badge}
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-navy-800">
          {CATEGORY_LABELS[course.category] || course.category}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold leading-snug text-navy-900">
          <Link to={detailsPath} className="transition-colors hover:text-primary-600">
            {course.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{course.description}</p>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-1.5 text-slate-500">
              <Clock aria-hidden="true" className="h-4 w-4 text-cyan-600" />
              Duration
            </dt>
            <dd className="font-medium text-navy-800">{course.duration}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt className="flex items-center gap-1.5 text-slate-500">
              <Users aria-hidden="true" className="h-4 w-4 text-cyan-600" />
              Format
            </dt>
            <dd className="text-right font-medium text-navy-800">{course.deliveryMode}</dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xl font-bold text-navy-900">{formatINR(course.fee)}</p>
          {course.additionalInformation?.emi && (
            <p className="text-xs text-slate-500">EMI available · {course.additionalInformation.emi}</p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={inCart ? undefined : handleAdd}
            disabled={inCart}
            aria-disabled={inCart}
            className={
              inCart
                ? 'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700'
                : 'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary-600 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50'
            }
          >
            {inCart || added ? (
              <>
                <Check aria-hidden="true" className="h-4 w-4" />
                {inCart ? 'In Cart' : 'Added'}
              </>
            ) : (
              <>
                <ShoppingCart aria-hidden="true" className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
          <button
            onClick={handleBuyNow}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <Zap aria-hidden="true" className="h-4 w-4" />
            Buy Now
          </button>
        </div>

        <Link
          to={detailsPath}
          className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800"
        >
          More Details
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}