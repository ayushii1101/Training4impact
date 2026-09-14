import { MapPin } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const ALPHA = [
  { text: 'Yashoda Hospitals', sub: 'Hyderabad' },
  { text: 'Max Healthcare', sub: 'Delhi NCR' },
  { text: 'AIIMS Jodhpur', sub: 'Jodhpur' },
  { text: 'AIIMS Bhopal', sub: 'Bhopal' },
  { text: 'AIIMS Rishikesh', sub: 'Rishikesh' },
  { text: 'Geetanjali Hospital', sub: 'Udaipur' },
  { text: 'Ruby Hall Clinic', sub: 'Pune' },
  { text: 'Nepal Mediciti', sub: 'Nepal' },
  { text: 'Shahid Gangalal Heart Centre', sub: 'Kathmandu' },
  { text: 'NHS Singapore', sub: 'Singapore' },
  { text: 'KGMU Lucknow', sub: 'Lucknow' },
];

export default function AlumniNetwork({ id = 'network' }) {
  return (
    <section id={id} className="bg-white py-16 sm:py-24" aria-labelledby="network-heading">
      <div className="container-site">
        <SectionHeading
          label="Our Network"
          title="Our Alumni Are Working At"
          subtitle="Graduates of Training4Impact fellowships are placed across leading hospitals in India, Nepal, Singapore and the UAE."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ALPHA.map(({ text, sub }) => (
            <li
              key={text}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-surface-50 px-5 py-4 transition-colors hover:border-primary-300"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-cyan-600 text-sm font-bold text-white">
                {text
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-navy-900">{text}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin aria-hidden="true" className="h-3 w-3 text-cyan-600" />
                  {sub}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}