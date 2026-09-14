import { Users, BookOpen, Award, Globe2 } from 'lucide-react';
import { siteContent } from '../../data/siteContent';

const ICONS = [Users, BookOpen, Award, Globe2];

export default function Stats() {
  return (
    <section className="border-b border-slate-200 bg-white py-14">
      <div className="container-site">
        <dl className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {siteContent.stats.map((stat, index) => {
            const Icon = ICONS[index];
            return (
              <div key={stat.label} className="text-center">
                <dt className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                  <Icon aria-hidden="true" className="h-4 w-4 text-cyan-600" />
                  {stat.label}
                </dt>
                <dd className="mt-2 text-3xl font-extrabold text-navy-900 sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            );
          })}
        </dl>
        <p className="mt-10 text-center text-sm font-medium text-slate-600">
          🇮🇳 India · 🇳🇵 Nepal · 🇸🇬 Singapore · 🇦🇪 UAE — Countries Represented
        </p>
      </div>
    </section>
  );
}