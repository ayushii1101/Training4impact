import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';
import { siteContent } from '../../data/siteContent';
import { useGoToSection } from '../../utils/hooks';
import { useCart } from '../../context/CartContext';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: 'Fellowship Programs', route: '/courses' },
  { label: 'Agile Training', route: '/agile' },
  { label: 'Contact', route: '/contact' },
];

const MEGA_LINKS = [
  { label: 'Payment Methods', route: '/', section: 'payments' },
  { label: 'Testimonials', route: '/', section: 'testimonials' },
  { label: 'FAQ', route: '/', section: 'faq' },
  { label: 'Our Network', route: '/our-network' },
  { label: 'Web Development', route: '/', section: 'webdev' },
  { label: 'Financial Planning', route: '/', section: 'finance' },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <Link to="/" className="flex shrink-0 items-center" aria-label="Training4Impact home">
        <img
          src="/images/training4impact-logo.png"
          alt="Training4Impact"
          className="h-8 w-auto sm:h-9"
          loading="eager"
        />
      </Link>
      <span className="hidden h-8 w-px bg-slate-200 sm:block" aria-hidden="true" />
      <img
        src="/images/startup-india.jpg"
        alt="Startup India Recognised"
        className="hidden h-7 w-auto sm:block sm:h-8"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <img
        src="/images/training4impact-badge.png"
        alt="Training4Impact"
        className="hidden h-7 w-auto sm:block sm:h-8"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
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
        className={`border-b border-slate-200 bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) =>
              link.route === '/' && link.section ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-surface-100 hover:text-primary-700"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.label}
                  to={link.route}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-surface-100 hover:text-primary-700"
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="relative">
              <button
                onClick={() => setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                aria-controls="mega-menu"
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-navy-800 transition-colors hover:bg-surface-100 hover:text-primary-700"
              >
                More
                <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
              {megaOpen && (
                <div
                  id="mega-menu"
                  className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-cardHover"
                >
                  {MEGA_LINKS.map((link) => (
                    <button
                      key={link.label}
                      onClick={() => {
                        setMegaOpen(false);
                        handleNavClick(link);
                      }}
                      className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-navy-800 transition-colors hover:bg-surface-100 hover:text-primary-700"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${siteContent.whatsappNumber}?text=${encodeURIComponent(siteContent.whatsappDefaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-[#25D366] transition-colors hover:border-green-500 hover:bg-green-50"
            >
              <WhatsAppIcon />
            </a>
            <Link
              to="/cart"
              aria-label={`View cart, ${count} item${count === 1 ? '' : 's'}`}
              className="relative inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-navy-800 transition-colors hover:border-primary-400 hover:text-primary-700"
            >
              <ShoppingCart aria-hidden="true" className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-navy-800 lg:hidden"
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