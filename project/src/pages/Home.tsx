import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight, Leaf, ShieldCheck, Sprout, Star, ChevronRight,
  HeartPulse, FlaskConical, PackageCheck, Factory, TestTube,
  Quote, Sparkles, Wind, Search, Heart, User, ShoppingBag, X,
} from 'lucide-react';
import { supabase, type Product, type ProductImage } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { LOCAL_PRODUCTS, MOCK_REVIEWS } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import productmoring from './assets/productmoring.png';


/* ─── Hero carousel ──────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  { url: 'img1.jpeg', alt: 'Fresh green botanical leaves' },
  { url: 'img2.jpeg', alt: 'Moringa powder in a ceramic bowl' },
  { url: 'img3.jpeg', alt: 'Green botanical powder and mortar' },
  { url: 'img4.jpeg', alt: 'Amla Indian gooseberry' },
];
const SLIDE_MS = 6000;

const HERO_MAIN_IMG = productmoring;
const HERO_SEC_IMG  = 'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=900';

/* ─── Nav / data ─────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',     path: '/' },
  { label: 'Shop',     path: '/products' },
  { label: 'About Us', path: '/about' },
  { label: 'Quality',  path: '/quality' },
  { label: 'Blog',     path: '/blog' },
  { label: 'Contact',  path: '/contact' },
];
const TRUST_BADGES = ['100% Natural', 'No Preservatives', 'Quality Tested', 'Plant-Based'];
const BENEFITS = [
  { icon: Leaf,         title: '100% Natural',        desc: 'Pure botanical ingredients — nothing artificial, nothing unnecessary.' },
  { icon: Sprout,       title: 'Single-Ingredient',   desc: 'Every product contains exactly one ingredient. Full transparency.' },
  { icon: ShieldCheck,  title: 'Quality Verified',    desc: 'Batch-level testing for purity, safety, and nutritional integrity.' },
  { icon: HeartPulse,   title: 'Vegan & Plant-Based', desc: 'Entirely plant-derived. Suitable for all lifestyles and dietary needs.' },
  { icon: PackageCheck, title: 'No Preservatives',    desc: 'Free from synthetic preservatives, colours, fillers, and additives.' },
  { icon: FlaskConical, title: 'Traceable Sourcing',  desc: 'From farm to packaging — we know where every ingredient comes from.' },
];
const PROCESS_STEPS = [
  { icon: Sprout,       num: '01', title: 'Ethical Harvest',      desc: 'Leaves and fruits selected at peak maturity from trusted growers.' },
  { icon: Wind,         num: '02', title: 'Gentle Drying',        desc: 'Low-temperature drying preserves the natural nutrient profile.' },
  { icon: Factory,      num: '03', title: 'Fine Milling',         desc: 'Precision-milled for smooth texture and optimal bioavailability.' },
  { icon: TestTube,     num: '04', title: 'Quality Verification', desc: 'Identity, purity, and safety checks on every single batch.' },
  { icon: PackageCheck, num: '05', title: 'Sealed Freshness',     desc: 'Packed in food-grade, resealable packaging to protect potency.' },
];
const CERTIFICATIONS = [
  { label: 'FSSAI Registered', note: 'Food safety compliance' },
  { label: 'GMP Standards',    note: 'Good Manufacturing Practice' },
  { label: 'Quality Verified', note: 'Batch-level testing' },
  { label: '100% Vegan',       note: 'Certified plant-based' },
];

/* ─── Glass style ────────────────────────────────────────────────────────── */
const G: React.CSSProperties = {
  background:             'rgba(20,30,20,0.55)',
  backdropFilter:         'blur(14px)',
  WebkitBackdropFilter:   'blur(14px)',
  border:                 '1px solid rgba(220,240,190,0.14)',
  boxShadow:              '0 12px 35px rgba(0,0,0,0.28)',
  borderRadius:           '20px',
};

/* ─── NavBadge ───────────────────────────────────────────────────────────── */
function NavBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 text-[9px] font-bold
                     flex items-center justify-center rounded-full leading-none"
      style={{ background: 'var(--color-gold)', color: '#071810' }}>
      {count > 9 ? '9+' : count}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME NAVBAR — ghost at top, solid on scroll
═══════════════════════════════════════════════════════════════════════════ */
function HomeNavbar() {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [mobileClosing, setMobileClosing] = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [scrolled,      setScrolled]      = useState(false);
  const [mounted,       setMounted]       = useState(false);
  const [pill,          setPill]          = useState({ left: 0, width: 0, opacity: 0 });

  const { totalItems }             = useCart();
  const { user, profile, signOut } = useAuth();
  const { items: wishlistItems }   = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef   = useRef<HTMLElement>(null!);

  useEffect(() => { const id = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(id); }, []);
  useEffect(() => { if (mobileOpen) closeMobile(); setSearchOpen(false); }, [location.pathname]); // eslint-disable-line
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  function closeMobile() { if (!mobileOpen) return; setMobileClosing(true); setTimeout(() => { setMobileOpen(false); setMobileClosing(false); }, 340); }
  function movePill(el: HTMLElement) { const nav = navRef.current; if (!nav) return; const nr = nav.getBoundingClientRect(); const er = el.getBoundingClientRect(); setPill({ left: er.left - nr.left, width: er.width, opacity: 1 }); }
  function handleSearch(e: React.FormEvent) { e.preventDefault(); if (searchQuery.trim()) { navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`); setSearchOpen(false); setSearchQuery(''); } }

  const pillBg     = scrolled ? 'rgba(0,0,0,0.38)' : 'rgba(7,24,16,0.12)';
  const pillBorder = scrolled ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)';
  const pillShadow = scrolled ? '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none';
  const textOpa    = scrolled ? '1' : '0.72';
  const ic         = `rgba(247,243,232,${textOpa})`;

  return (
    <div className={`fixed inset-x-0 top-0 z-50 flex flex-col items-center px-3 sm:px-4 pointer-events-none transition-[padding] duration-500 ${scrolled ? 'pt-2' : 'pt-3'}`} style={{ background: 'none' }}>
      <div className={`navbar-float pointer-events-auto w-full max-w-5xl rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${mounted ? 'navbar-enter' : 'opacity-0 -translate-y-6'}`}
        style={{ backgroundColor: pillBg, border: `1px solid ${pillBorder}`, boxShadow: pillShadow, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', transition: 'background-color 0.5s ease,border-color 0.5s ease,box-shadow 0.5s ease' }}>

        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5">
          {/* Logo */}
          <Link to="/" className="nav-item-enter flex items-center gap-2 group shrink-0" style={{ animationDelay: '0.05s' }}>
            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105" style={{ boxShadow: '0 0 0 1.5px rgba(201,164,92,0.35)' }}>
              <img src="/logo.png" alt="Vitamora" className="w-full h-full object-cover" style={{ mixBlendMode: 'screen' }} />
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight text-cream-100 group-hover:text-gold-300 transition-colors duration-300" style={{ opacity: textOpa }}>Vitamora</span>
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden xl:flex items-center relative" onMouseLeave={() => setPill(p => ({ ...p, opacity: 0 }))}>
            <span aria-hidden="true" className="absolute top-0 bottom-0 rounded-full pointer-events-none"
              style={{ left: pill.left, width: pill.width, opacity: pill.opacity, background: 'rgba(22,122,69,0.22)', transition: 'left 0.32s cubic-bezier(0.22,1,0.36,1),width 0.32s cubic-bezier(0.22,1,0.36,1),opacity 0.20s ease' }} />
            {NAV_LINKS.map((link, i) => {
              const active = location.pathname === link.path || (link.path === '/products' && location.pathname.startsWith('/products'));
              return (
                <Link key={link.path} to={link.path} onMouseEnter={e => movePill(e.currentTarget)}
                  className="nav-item-enter relative z-10 px-3.5 py-1.5 rounded-full text-sm font-medium tracking-wide select-none transition-all duration-300 hover:-translate-y-px"
                  style={{ animationDelay: `${0.08 + i * 0.05}s`, color: active ? 'var(--color-gold)' : `rgba(247,243,232,${textOpa})` }}>
                  {link.label}
                  {active && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: 'var(--color-gold)' }} />}
                </Link>
              );
            })}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-0.5">
            <button onClick={() => setSearchOpen(s => !s)} className="nav-item-enter p-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:bg-white/8" style={{ animationDelay: '0.38s', color: ic }} aria-label="Search"><Search className="w-4 h-4" /></button>
            <Link to="/wishlist" className="nav-item-enter relative p-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:bg-white/8" style={{ animationDelay: '0.44s', color: ic }} aria-label="Wishlist">
              <Heart className="w-4 h-4" />{wishlistItems.length > 0 && <NavBadge count={wishlistItems.length} />}
            </Link>
            <div className="nav-item-enter relative group" style={{ animationDelay: '0.50s' }}>
              <Link to={user ? '/account' : '/login'} className="p-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:bg-white/8 block" style={{ color: ic }} aria-label="Account"><User className="w-4 h-4" /></Link>
              {user && (
                <div className="absolute right-0 top-full pt-3 hidden group-hover:block z-50">
                  <div className="rounded-2xl py-2 w-52 overflow-hidden" style={{ background: 'rgba(11,46,26,0.96)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 16px 48px rgba(0,0,0,0.50)', animation: 'navItemFadeIn 0.22s cubic-bezier(0.22,1,0.36,1) forwards' }}>
                    <div className="px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <p className="text-sm font-semibold truncate text-cream-100">{profile?.full_name || 'My Account'}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-mist)' }}>{user.email}</p>
                    </div>
                    {[{ to: '/account', label: 'My Account' }, { to: '/orders', label: 'Orders' }, { to: '/wishlist', label: 'Wishlist' }, ...(profile?.role === 'admin' ? [{ to: '/admin', label: 'Admin Dashboard' }] : [])].map(item => (
                      <Link key={item.to} to={item.to} className="block px-4 py-2 text-sm transition-colors hover:bg-white/6 text-cream-100/80 hover:text-cream-100">{item.label}</Link>
                    ))}
                    <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-red-900/20 mt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: '#f87171' }}>Sign Out</button>
                  </div>
                </div>
              )}
            </div>
            <Link to="/cart" className="nav-item-enter relative p-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:bg-white/8" style={{ animationDelay: '0.56s', color: ic }} aria-label="Cart">
              <ShoppingBag className="w-4 h-4" />{totalItems > 0 && <NavBadge count={totalItems} />}
            </Link>
            <button className="nav-item-enter xl:hidden p-2 ml-0.5 rounded-full transition-all duration-300 hover:bg-white/8" style={{ animationDelay: '0.56s', color: ic }}
              onClick={() => mobileOpen ? closeMobile() : setMobileOpen(true)} aria-label={mobileOpen ? 'Close' : 'Menu'}>
              <span className="flex flex-col justify-center items-center w-5 h-4 gap-[5px]">
                <span className="ham-line block h-[1.5px] w-5 rounded-full bg-current" style={{ transform: (mobileOpen && !mobileClosing) ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
                <span className="ham-line block h-[1.5px] rounded-full bg-current" style={{ width: (mobileOpen && !mobileClosing) ? '0px' : '20px', opacity: (mobileOpen && !mobileClosing) ? 0 : 1 }} />
                <span className="ham-line block h-[1.5px] w-5 rounded-full bg-current" style={{ transform: (mobileOpen && !mobileClosing) ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
              </span>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="px-4 pb-3.5" style={{ animation: 'navItemFadeIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards' }}>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." autoFocus
                className="flex-1 px-4 py-2 rounded-full text-sm focus:outline-none"
                style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--color-cream)' }} />
              <button type="submit" className="btn-primary btn-sm">Search</button>
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2 rounded-full hover:bg-white/8 transition-colors" style={{ color: 'var(--color-mist)' }}><X className="w-4 h-4" /></button>
            </form>
          </div>
        )}
      </div>

      {(mobileOpen || mobileClosing) && (
        <div className={`pointer-events-auto w-full max-w-5xl mt-2 overflow-hidden rounded-3xl ${mobileClosing ? 'mobile-menu-close' : 'mobile-menu-open'}`}
          style={{ background: 'rgba(11,46,26,0.96)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 20px 60px rgba(0,0,0,0.55)' }}>
          <nav className="px-3 py-3">
            {NAV_LINKS.map((link, i) => {
              const active = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}
                  className="nav-item-enter flex items-center gap-3 px-4 py-3 rounded-2xl mb-0.5 text-base font-medium transition-all duration-200"
                  style={{ animationDelay: `${i * 0.04}s`, color: active ? 'var(--color-gold)' : 'rgba(247,243,232,0.80)', background: active ? 'rgba(22,122,69,0.18)' : 'transparent' } as React.CSSProperties}>
                  {active && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--color-gold)' }} />}
                  {link.label}
                </Link>
              );
            })}
            <div className="my-2 mx-1" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            {user ? (
              <>
                {[{ to: '/account', label: 'My Account' }, { to: '/orders', label: 'Orders' }, { to: '/wishlist', label: 'Wishlist' }].map((item, i) => (
                  <Link key={item.to} to={item.to} className="flex items-center px-4 py-2.5 rounded-2xl mb-0.5 text-sm font-medium text-cream-100/75 hover:bg-white/6 hover:text-cream-100"
                    style={{ animationDelay: `${(NAV_LINKS.length + i) * 0.04}s` }}>{item.label}</Link>
                ))}
                <button onClick={() => signOut()} className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium mt-1" style={{ color: '#f87171' }}>Sign Out</button>
              </>
            ) : (
              <div className="flex gap-2 px-1 pt-1">
                <Link to="/login" className="flex-1 btn-outline text-center justify-center py-2.5 text-sm">Login</Link>
                <Link to="/signup" className="flex-1 btn-primary text-center justify-center py-2.5 text-sm">Sign Up</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [products,       setProducts]       = useState<(Product & { images?: ProductImage[] })[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [current,        setCurrent]        = useState(0);
  const [prevSlide,      setPrevSlide]      = useState<number | null>(null);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Auto-advance hero slides */
  useEffect(() => {
    slideTimer.current = setInterval(() => {
      setCurrent(c => { setPrevSlide(c); return (c + 1) % HERO_SLIDES.length; });
    }, SLIDE_MS);
    return () => { if (slideTimer.current) clearInterval(slideTimer.current); };
  }, []);

  useEffect(() => {
    supabase.from('products').select('*, product_images(*)')
      .eq('is_active', true).order('created_at', { ascending: true })
      .then(({ data }) => { setProducts(data ?? []); setLoading(false); });
  }, []);

  const displayProducts = products.length > 0 ? products : [];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>

      {/* Fixed dark bg removed — forest bg now comes from App.tsx */}

      <HomeNavbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO — 4-image auto-sliding carousel
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

        <style>{`
          @keyframes kenBurns   { 0% { transform:scale(1.08); } 100% { transform:scale(1.00); } }
          @keyframes floatCard1 { 0%,100% { transform:rotate(-2.5deg) translateY(0px) translateX(-20px); } 50% { transform:rotate(-2.5deg) translateY(-14px) translateX(-20px); } }
          @keyframes floatCard2 { 0%,100% { transform:rotate(3deg) translateY(0px); } 50% { transform:rotate(3deg) translateY(-10px); } }
          @keyframes leafDrift  { 0%,100% { transform:translateY(0px) rotate(-3deg); } 33% { transform:translateY(-10px) rotate(4deg); } 66% { transform:translateY(5px) rotate(-1deg); } }
        `}</style>

        {/* Slide images */}
        {HERO_SLIDES.map((slide, i) => {
          const isActive  = i === current;
          const isExiting = i === prevSlide;
          return (
            <div key={i} style={{ position: 'absolute', inset: 0, zIndex: isActive ? 2 : isExiting ? 1 : 0, opacity: (isActive || isExiting) ? (isActive ? 1 : 0) : 0, transition: 'opacity 1.6s cubic-bezier(0.4,0,0.2,1)' }}>
              <img src={slide.url} alt={slide.alt} className="w-full h-full object-cover"
                style={{ animation: isActive ? `kenBurns ${SLIDE_MS + 2000}ms cubic-bezier(0.25,0.46,0.45,0.94) forwards` : 'none' }} />
            </div>
          );
        })}

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'linear-gradient(105deg,rgba(4,14,8,0.88) 0%,rgba(7,24,16,0.62) 52%,rgba(7,24,16,0.14) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '220px', zIndex: 3, background: 'linear-gradient(to top,rgba(4,14,8,0.98) 0%,transparent 100%)', pointerEvents: 'none' }} />

        {/* Slide dots */}
        <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '6px' }}>
          {HERO_SLIDES.map((_, i) => (
            <div key={i} style={{ width: i === current ? '28px' : '6px', height: '4px', borderRadius: '2px', background: i === current ? 'var(--color-gold)' : 'rgba(255,255,255,0.25)', transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)' }} />
          ))}
        </div>

        {/* Hero text + product cards */}
        <div className="section-pad w-full" style={{ paddingTop: '120px', paddingBottom: '80px', position: 'relative', zIndex: 10 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              <div className="hero-line-grow w-px h-16 mb-8 hidden lg:block" style={{ background: 'linear-gradient(to bottom,rgba(201,164,92,0.90),transparent)', animationDelay: '0.1s', animationFillMode: 'both' }} />
              <div className="hero-badge-enter mb-5" style={{ animationDelay: '0.20s', animationFillMode: 'both' }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.22em] uppercase"
                  style={{ background: 'rgba(201,164,92,0.12)', border: '1px solid rgba(201,164,92,0.30)', color: 'var(--color-gold)', backdropFilter: 'blur(8px)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-gold)' }} />
                  Ayurvedic Botanical Wellness
                </span>
              </div>
              <h1 className="font-serif font-bold leading-[1.03] mb-6">
                {['Wellness,', 'Rooted in', 'Nature.'].map((word, wi) => (
                  <span key={wi} className="hero-text-enter block" style={{ animationDelay: `${0.32 + wi * 0.14}s`, animationFillMode: 'both' }}>
                    {wi < 2
                      ? <span className="text-5xl sm:text-6xl lg:text-7xl text-cream-100 drop-shadow-lg">{word}</span>
                      : <span className="text-5xl sm:text-6xl lg:text-7xl hero-gradient-text drop-shadow-lg">{word}</span>}
                  </span>
                ))}
              </h1>
              <p className="hero-text-enter text-base sm:text-lg leading-relaxed mb-10 max-w-lg" style={{ color: 'rgba(182,200,179,0.92)', animationDelay: '0.74s', animationFillMode: 'both' }}>
                Single-ingredient Ayurvedic botanicals, thoughtfully sourced and gently prepared for your daily ritual.
              </p>
              <div className="hero-text-enter flex flex-col sm:flex-row gap-3 mb-8" style={{ animationDelay: '0.88s', animationFillMode: 'both' }}>
                <Link to="/products" className="btn-gold btn-lg group">Shop Bestsellers <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" /></Link>
                <Link to="/about" className="btn-outline btn-lg">Our Story</Link>
              </div>
              <div className="hero-text-enter flex flex-wrap gap-2" style={{ animationDelay: '1.02s', animationFillMode: 'both' }}>
                {TRUST_BADGES.map(label => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium"
                    style={{ background: 'rgba(22,122,69,0.16)', border: '1px solid rgba(22,122,69,0.28)', color: 'var(--color-sage)' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: 'var(--color-sage)' }} />{label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — floating product cards */}
            <div className="hero-text-enter hidden lg:flex items-center justify-center relative h-[420px]" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <div style={{ position: 'absolute', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(22,122,69,0.22) 0%,transparent 70%)', filter: 'blur(48px)' }} />
              <div style={{ position: 'relative', zIndex: 2, width: '240px', height: '290px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.60),0 0 0 1px rgba(168,199,160,0.14)', animation: 'floatCard1 7s ease-in-out infinite' }}>
                <img src={HERO_MAIN_IMG} alt="Vitamora Moringa Powder" className="w-full h-full object-cover" loading="eager" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 50%,rgba(4,14,8,0.55) 100%)' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', ...G, borderRadius: '12px', padding: '10px 14px' }}>
                  <p style={{ color: 'var(--color-sage)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Vitamora</p>
                  <p style={{ color: 'var(--color-cream)', fontSize: '13px', fontWeight: 600, fontFamily: 'Playfair Display,serif', marginTop: '2px' }}>Moringa Leaf Powder</p>
                </div>
              </div>
              <div style={{ position: 'absolute', right: '20px', top: '30px', zIndex: 1, width: '150px', height: '180px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.55),0 0 0 1px rgba(168,199,160,0.10)', animation: 'floatCard2 9s ease-in-out infinite' }}>
                <img src={HERO_SEC_IMG} alt="Vitamora Amla Powder" className="w-full h-full object-cover" loading="eager" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 40%,rgba(4,14,8,0.60) 100%)' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', ...G, borderRadius: '8px', padding: '7px 10px' }}>
                  <p style={{ color: 'var(--color-cream)', fontSize: '11px', fontWeight: 600, fontFamily: 'Playfair Display,serif' }}>Amla Powder</p>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '12px', left: '30px', zIndex: 3, animation: 'leafDrift 8s ease-in-out infinite' }}>
                <Leaf className="w-8 h-8" style={{ color: 'rgba(168,199,160,0.38)', transform: 'rotate(25deg)' }} strokeWidth={1.5} />
              </div>
              <div style={{ position: 'absolute', bottom: '40px', left: '10px', zIndex: 3, animation: 'leafDrift 11s 2s ease-in-out infinite' }}>
                <Leaf className="w-5 h-5" style={{ color: 'rgba(168,199,160,0.25)', transform: 'rotate(-15deg)' }} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0 96px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,12,8,0.82)' }} />
        <div className="section-pad" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <div className="text-center mb-14">
              <p className="section-eyebrow justify-center"><Leaf className="w-3.5 h-3.5" />Botanical Bestsellers</p>
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-4">Pure Everyday Nourishment</h2>
              <p className="section-subtitle text-base lg:text-lg max-w-xl mx-auto">From India's most trusted botanicals — single-ingredient, gently processed, ready for your daily ritual.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {loading
              ? Array.from({ length: 2 }, (_, i) => <div key={i} className="rounded-2xl animate-pulse aspect-[4/5.5]" style={{ background: 'rgba(22,62,38,0.40)' }} />)
              : displayProducts.length > 0
              ? displayProducts.slice(0, 4).map((p, i) => <Reveal key={p.id} delay={i * 100}><ProductCard product={p} image={(p.images ?? [])[0]} /></Reveal>)
              : LOCAL_PRODUCTS.map((lp, i) => (
                  <Reveal key={lp.id} delay={i * 100}>
                    <Link to={`/products/${lp.slug}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 rounded-2xl">
                      <article className="product-card flex flex-col h-full">
                        <div className="relative overflow-hidden rounded-t-2xl aspect-[4/5.5]" style={{ background: 'rgba(20,30,20,0.55)' }}>
                          <img src={lp.images[0].url} alt={lp.images[0].alt} loading="lazy" className="product-img w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 badge-gold text-[10px]">{lp.badge}</span>
                        </div>
                        <div className="flex flex-col p-4 gap-2.5">
                          <span className="text-2xs font-semibold tracking-widest uppercase" style={{ color: 'var(--color-sage)' }}>Botanical Powder</span>
                          <h3 className="font-serif text-lg font-semibold text-cream-100 group-hover:text-gold-300 transition-colors duration-300">{lp.name}</h3>
                          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--color-mist)' }}>{lp.short_description}</p>
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: 5 }, (_, si) => <Star key={si} className="w-3 h-3" style={{ color: si < Math.round(lp.rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)', fill: si < Math.round(lp.rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)' }} />)}
                            <span className="text-2xs" style={{ color: 'var(--color-mist)' }}>{lp.rating} ({lp.review_count})</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-lg" style={{ color: 'var(--color-gold)' }}>{formatPrice(lp.price)}</span>
                            <span className="text-sm line-through opacity-50 text-cream-200">{formatPrice(lp.compare_at_price)}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </Reveal>
                ))
            }
          </div>
          <Reveal delay={200}>
            <div className="text-center mt-10">
              <Link to="/products" className="btn-outline group">View All Products <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-pad" style={{ position: 'relative', zIndex: 1 }}><div className="gold-divider" /></div>

      {/* ── BENEFITS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,12,8,0.80)' }} />
        <div className="section-pad" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <div className="text-center mb-14">
              <p className="section-eyebrow justify-center"><Sparkles className="w-3.5 h-3.5" />Why Vitamora</p>
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-4">Naturally Better, Every Day.</h2>
              <p className="section-subtitle text-base lg:text-lg max-w-xl mx-auto">Every choice we make is guided by one principle — nature knows best.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ ...G, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
                  <div className="process-icon-ring"><b.icon className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} /></div>
                  <h3 className="font-serif text-lg font-semibold text-cream-100">{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)', flex: 1 }}>{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,6,0.78)' }} />
        <div className="section-pad" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <div className="text-center mb-16">
              <p className="section-eyebrow justify-center"><Factory className="w-3.5 h-3.5" />Our Process</p>
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl">From Soil to Ritual.</h2>
            </div>
          </Reveal>
          <div className="hidden lg:flex justify-between items-start relative">
            <div className="absolute top-8 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(22,122,69,0.30) 20%,rgba(201,164,92,0.25) 50%,rgba(22,122,69,0.30) 80%,transparent)' }} />
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 90} className="flex-1 text-center relative z-10 px-2">
                <div className="process-icon-ring mx-auto mb-4"><step.icon className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} /></div>
                <span className="font-serif text-2xl font-light block mb-1" style={{ color: 'rgba(201,164,92,0.35)' }}>{step.num}</span>
                <h3 className="font-serif text-sm font-semibold mb-2 text-cream-100">{step.title}</h3>
                <p className="text-xs leading-relaxed max-w-[145px] mx-auto" style={{ color: 'var(--color-mist)' }}>{step.desc}</p>
              </Reveal>
            ))}
          </div>
          <div className="lg:hidden space-y-5">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className="process-icon-ring shrink-0"><step.icon className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} /></div>
                    {i < PROCESS_STEPS.length - 1 && <div className="w-px mt-2" style={{ background: 'rgba(22,122,69,0.22)', height: '32px' }} />}
                  </div>
                  <div className="pt-1 pb-3">
                    <span className="font-serif text-lg font-light block mb-0.5" style={{ color: 'rgba(201,164,92,0.35)' }}>{step.num}</span>
                    <h3 className="font-serif text-base font-semibold mb-1 text-cream-100">{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="text-center mt-12">
              <Link to="/quality" className="btn-outline group">View Our Full Quality Process <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-pad" style={{ position: 'relative', zIndex: 1 }}><div className="gold-divider" /></div>

      {/* ── TESTIMONIALS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,12,8,0.82)' }} />
        <div className="section-pad" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <div className="text-center mb-14">
              <p className="section-eyebrow justify-center"><Quote className="w-3.5 h-3.5" />Customer Stories</p>
              <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl">Trusted by Wellness Seekers</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_REVIEWS.map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
                <div className="testimonial-card p-6 flex flex-col gap-4 h-full">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, si) => <Star key={si} className="w-3.5 h-3.5" style={{ color: si < r.rating ? 'var(--color-gold)' : 'rgba(201,164,92,0.20)', fill: si < r.rating ? 'var(--color-gold)' : 'rgba(201,164,92,0.20)' }} />)}
                  </div>
                  <h4 className="font-serif text-base font-semibold text-cream-100">{r.title}</h4>
                  <blockquote className="text-sm leading-relaxed italic flex-1" style={{ color: 'var(--color-mist)' }}>"{r.body}"</blockquote>
                  <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(22,122,69,0.30)', color: 'var(--color-sage)', border: '1px solid rgba(22,122,69,0.30)' }}>{r.author[0]}</div>
                    <div>
                      <p className="text-xs font-semibold text-cream-100">{r.author}</p>
                      <p className="text-2xs" style={{ color: 'var(--color-mist)' }}>{r.location}</p>
                    </div>
                    {r.verified && <span className="ml-auto text-2xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,122,69,0.18)', color: 'var(--color-sage)', border: '1px solid rgba(22,122,69,0.25)' }}>Verified</span>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '64px 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,6,0.78)' }} />
        <div className="section-pad" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal>
            <div className="text-center mb-10">
              <p className="section-eyebrow justify-center"><ShieldCheck className="w-3.5 h-3.5" />Quality Standards</p>
              <h2 className="section-title text-2xl sm:text-3xl">Our Commitment to Purity</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTIFICATIONS.map((c, i) => (
              <Reveal key={i} delay={i * 70}>
                <div style={{ ...G, padding: '1.25rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                  <ShieldCheck className="w-6 h-6" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                  <h3 className="font-serif text-sm font-semibold text-cream-100">{c.label}</h3>
                  <p className="text-2xs" style={{ color: 'var(--color-mist)' }}>{c.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
