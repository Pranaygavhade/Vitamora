import { Link } from 'react-router-dom';
import { Instagram, Facebook, Linkedin, Youtube, ShieldCheck } from 'lucide-react';

const NAV_LINKS: Array<[string, string]> = [
  ['Home',     '/'],
  ['Shop',     '/products'],
  ['About Us', '/about'],
  ['Quality',  '/quality'],
  ['Blog',     '/blog'],
  ['Contact',  '/contact'],
];

const ACCOUNT_LINKS: Array<[string, string]> = [
  ['My Account', '/account'],
  ['Orders',     '/orders'],
  ['Wishlist',   '/wishlist'],
  ['Login',      '/login'],
  ['Sign Up',    '/signup'],
];

const TRUST_ITEMS = [
  'FSSAI Registered',
  'GMP Standards',
  'Quality Verified',
  '100% Vegan',
  'No Preservatives',
];

const SOCIAL_ITEMS = [
  { Label: 'Instagram', Icon: Instagram, href: '#' },
  { Label: 'Facebook',  Icon: Facebook,  href: '#' },
  { Label: 'LinkedIn',  Icon: Linkedin,  href: '#' },
  { Label: 'YouTube',   Icon: Youtube,   href: '#' },
];

export default function Footer() {

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #0d2418 0%, #071810 100%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        zIndex: 2,
      }}
    >

      {/* ── Main grid ─────────────────────────────────────────────────── */}
      <div className="section-pad py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 group mb-5 w-fit">
              <div
                className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                style={{ boxShadow: '0 0 0 1.5px rgba(201,164,92,0.30)' }}
              >
                <img
                  src="/logo.png"
                  alt="Vitamora logo"
                  className="w-full h-full object-cover"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
              <span className="font-serif text-xl font-semibold text-cream-100
                               group-hover:text-gold-300 transition-colors duration-300">
                Vitamora
              </span>
            </Link>

            <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--color-mist)' }}>
              Pure, single-ingredient Ayurvedic botanical powders — ethically sourced, gently
              processed, quality verified.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIAL_ITEMS.map(({ Label, Icon, href }) => (
                <a
                  key={Label}
                  href={href}
                  aria-label={Label}
                  className="w-8 h-8 rounded-full flex items-center justify-center
                             transition-all duration-200 hover:scale-110 focus-visible:outline-none
                             focus-visible:ring-2 focus-visible:ring-gold-400/50"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: 'var(--color-mist)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-mist)')}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* About Us */}
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-4"
              style={{ color: 'var(--color-gold)' }}>
              About Us
            </p>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--color-mist)' }}>
              Vitamora creates pure, single-ingredient Ayurvedic botanical powders rooted in India's
              ancient wellness tradition — Moringa, Amla, and beyond.
            </p>
            <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--color-mist)' }}>
              Every batch is ethically sourced, gently processed at low temperatures, and quality
              verified before it reaches you. No fillers, no preservatives, no compromise.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 hover:text-cream-100"
              style={{ color: 'var(--color-sage)' }}
            >
              Read Our Story
              <span style={{ fontSize: '14px', lineHeight: 1 }}>→</span>
            </Link>
          </div>

          {/* Navigate */}
          <div>
            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase mb-4"
              style={{ color: 'var(--color-gold)' }}
            >
              Navigate
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-200 hover:text-cream-100"
                    style={{ color: 'var(--color-mist)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase mb-4"
              style={{ color: 'var(--color-gold)' }}
            >
              Account
            </p>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-200 hover:text-cream-100"
                    style={{ color: 'var(--color-mist)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust + Contact */}
          <div>
            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase mb-4"
              style={{ color: 'var(--color-gold)' }}
            >
              Quality Standards
            </p>
            <div className="space-y-2 mb-7">
              {TRUST_ITEMS.map(item => (
                <div key={item} className="flex items-center gap-2">
                  <ShieldCheck
                    className="w-3 h-3 shrink-0"
                    style={{ color: 'rgba(168,199,160,0.55)' }}
                    strokeWidth={1.5}
                  />
                  <span className="text-xs" style={{ color: 'var(--color-mist)' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <p
              className="text-xs font-semibold tracking-[0.18em] uppercase mb-3"
              style={{ color: 'var(--color-gold)' }}
            >
              Contact
            </p>
            <a
              href="mailto:care@vitamora.in"
              className="text-xs block mb-1 hover:text-cream-100 transition-colors duration-200"
              style={{ color: 'var(--color-mist)' }}
            >
              care@vitamora.in
            </a>
            <a
              href="mailto:partners@vitamora.in"
              className="text-xs block hover:text-cream-100 transition-colors duration-200"
              style={{ color: 'var(--color-mist)' }}
            >
              partners@vitamora.in
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div
        className="section-pad pb-8"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs" style={{ color: 'rgba(182,200,179,0.38)' }}>
            © {new Date().getFullYear()} Vitamora. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(182,200,179,0.28)' }}>
            Food supplements are not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}
