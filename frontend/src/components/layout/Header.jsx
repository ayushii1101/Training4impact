import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import { useGoToSection } from '../../utils/hooks';
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
  { label: 'Fellowship Programs', route: '/courses' },
  { label: 'Agile Training', route: '/agile' },
  { label: 'Contact', route: '/contact' },
];

const MEGA_LINKS = [
  { label: 'Payment Methods', route: '/services' },
  { label: 'Testimonials', route: '/testimonials' },
  { label: 'FAQ', route: '/', section: 'faq' },
  { label: 'Our Network', route: '/our-network' },
  { label: 'Web Development', route: '/services' },
  { label: 'Financial Planning', route: '/services' },
];

function Logo() {
  return (
    <div className="flex shrink-0 items-center gap-2.5 lg:gap-3">
      <Link to="/" className="flex shrink-0 items-center" aria-label="Training4Impact home">
        <img
          src="/images/training4impact-logo.png"
          alt="Training4Impact"
          className="h-9 w-auto sm:h-10 lg:h-12 xl:h-[56px]"
          loading="eager"
        />
      </Link>
      <span className="hidden h-8 w-px shrink-0 bg-slate-300 xl:block xl:h-12" aria-hidden="true" />
      <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-surface-50 px-2 py-1.5 xl:flex">
        <img
          src="/images/startup-india.jpg"
          alt="Startup India Recognised"
          className="h-8 w-auto xl:h-[50px]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <img
          src="/images/training4impact-badge.png"
          alt="Training4Impact"
          className="h-8 w-auto xl:h-[50px]"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const goToSection = useGoToSection();
  const { count } = useCart();

  useEffect(() => {
    setOpen(false);
    setMegaOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open || megaOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, megaOpen]);

  const handleNavClick = (link) => {
    setOpen(false);
    setMegaOpen(false);
    if (link.route === '/' && link.section) {
      goToSection(link.section);
    } else if (link.route) {
      navigate(link.route);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement bar */}
      <div className="bg-navy-900 px-4 py-2 text-center">
        <p className="text-xs font-medium text-slate-200 sm:text-sm">
          <span aria-hidden="true">🎓</span>{' '}
          <span className="text-cyan-400">{siteContent.announcement}</span>{' '}
          <Link
            to="/courses"
            className="ml-1 font-semibold text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
          >
            View Programs →
          </Link>
        </p>
      </div>

      {/* Main header */}
      <div
        className={`border-b border-slate-200 bg-white/95 backdrop-blur transition-shadow duration-300 ${
          scrolled ? 'shadow-card' : 'shadow-sm'
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-[5.5rem] lg:gap-6 xl:h-[5.75rem]">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1.5 lg:flex xl:gap-2" aria-label="Primary">
            {NAV_LINKS.map((link) =>
              link.route === '/' && link.section ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="group relative rounded-lg px-4 py-2.5 text-base font-medium text-navy-800 transition-colors duration-200 hover:text-primary-700"
                >
                  {link.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.route}
                  className="group relative rounded-lg px-4 py-2.5 text-base font-medium text-navy-800 transition-colors duration-200 hover:text-primary-700"
                >
                  {link.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-primary-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                </Link>
              )
            )}
            <div className="relative">
              <button
                onClick={() => setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                className="group relative flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-base font-medium text-navy-800 transition-colors duration-200 hover:text-primary-700"
              >
                More
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                />
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </button>
              {megaOpen && (
                <div
                  id="mega-menu"
                  className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-cardHover"
                >
                  {MEGA_LINKS.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        setMegaOpen(false);
                        handleNavClick(link);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-sm font-medium text-navy-800 transition-colors duration-150 hover:bg-surface-100 hover:text-primary-700"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2 lg:gap-3">
            <Link
              to="/cart"
              aria-label={`View cart, ${count} item${count === 1 ? '' : 's'}`}
              className="relative inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-navy-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 hover:shadow-card lg:h-11 lg:w-11"
            >
              <ShoppingCart aria-hidden="true" className="h-5 w-5 lg:h-6 lg:w-6" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white shadow-sm">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-navy-800 shadow-sm lg:hidden"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 bg-white shadow-cardHover lg:hidden">
          <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobile">
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Navigation
            </p>
            {NAV_LINKS.map((link) =>
              link.route === '/' && link.section ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="rounded-lg px-3 py-3 text-left text-base font-medium text-navy-800 hover:bg-surface-100"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.route}
                  className="rounded-lg px-3 py-3 text-base font-medium text-navy-800 hover:bg-surface-100"
                >
                  {link.label}
                </Link>
              )
            )}
            <p className="px-3 pb-2 pt-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              More
            </p>
            {MEGA_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="rounded-lg px-3 py-3 text-left text-base font-medium text-navy-800 hover:bg-surface-100"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-3 border-t border-slate-200 pt-4">
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-primary-600 px-4 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                <ShoppingCart aria-hidden="true" className="h-4 w-4" />
                View Cart{count > 0 ? ` (${count})` : ''}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}