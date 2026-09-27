import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import SectionHeading from '../common/SectionHeading';

export default function AlumniNetwork({ id = 'network', limit, showViewAll = false }) {
  const hospitals = limit ? siteContent.alumniHospitals.slice(0, limit) : siteContent.alumniHospitals;

  return (
    <section id={id} className="bg-white py-16 sm:py-24" aria-labelledby="network-heading">
      <div className="container-site">
        <SectionHeading
          label="Our Network"
          title="Our Alumni Are Working At"
          subtitle="Graduates of Training4Impact fellowships are placed across leading hospitals in India, Nepal, Singapore and the UAE."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hospitals.map(({ name, location }) => (
            <li
              key={name}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-surface-50 px-5 py-4 transition-colors hover:border-primary-300"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-cyan-600 text-sm font-bold text-white">
                {name
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy-900">{name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin aria-hidden="true" className="h-3 w-3 text-cyan-600" />
                  {location}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {showViewAll && (
          <div className="mt-10 text-center">
            <Link
              to="/our-network"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-surface-50 px-5 py-2.5 text-sm font-semibold text-navy-800 transition-colors hover:border-primary-400 hover:text-primary-700"
            >
              View Our Full Network
              <ArrowRight aria-hidden="true" className="h-4 w-4 text-primary-700" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}