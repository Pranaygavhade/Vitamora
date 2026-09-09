import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, X, Leaf } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';

const navLinks = [
  { label: 'Home',     path: '/' },
  { label: 'Shop',     path: '/products' },
  { label: 'About Us', path: '/about' },
  { label: 'Quality',  path: '/quality' },
  { label: 'Blog',     path: '/blog' },
  { label: 'Contact',  path: '/contact' },
];

function CartBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 text-[9px] font-bold
                     flex items-center justify-center rounded-full leading-none"
          style={{ background: 'var(--color-gold)', color: '#071810' }}>
      {count > 9 ? '9+' : count}
    </span>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="flex flex-col justify-center items-center w-5 h-4 gap-[5px]">
      <span className="ham-line block h-[1.5px] w-5 rounded-full bg-current"
            style={{ transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
      <span className="ham-line block h-[1.5px] rounded-full bg-current"
            style={{ width: open ? '0px' : '20px', opacity: open ? 0 : 1 }} />
      <span className="ham-line block h-[1.5px] w-5 rounded-full bg-current"
            style={{ transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
    </span>
  );
}

function useHoverPill(navRef: React.RefObject<HTMLElement>) {
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });
  const moveTo = useCallback((el: HTMLElement) => {
    const nav = navRef.current;
    if (!nav) return;
    const nr = nav.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    setPill({ left: er.left - nr.left, width: er.width, opacity: 1 });
  }, [navRef]);
  const hide = useCallback(() => setPill(p => ({ ...p, opacity: 0 })), []);
  return { pill, moveTo, hide };
}

export default function Header() {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [mobileClosing, setMobileClosing] = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [scrolled,      setScrolled]      = useState(false);
  const [mounted,       setMounted]       = useState(false);

  const { totalItems }             = useCart();
  const { user, profile, signOut } = useAuth();
  const { items: wishlistItems }   = useWishlist();
  const navigate  = useNavigate();
  const location  = useLocation();
  const navRef    = useRef<HTMLElement>(null!);
  const { pill, moveTo, hide } = useHoverPill(navRef);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setSearchOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function closeMobileMenu() {
    if (!mobileOpen) return;
    setMobileClosing(true);
    setTimeout(() => { setMobileOpen(false); setMobileClosing(false); }, 340);
  }
  function toggleMobile() { mobileOpen ? closeMobileMenu() : setMobileOpen(true); }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  /* ── Pill appearance — always transparent glass, never green ── */
  const pillBg = 'rgba(0,0,0,0.32)';
  const pillBorder = scrolled ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)';
  const pillShadow = scrolled
    ? '0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.06)'
    : 'none';
  const topPad   = scrolled ? 'pt-2' : 'pt-3';
  const padX     = scrolled ? 'px-4' : 'px-5';
  const padY     = scrolled ? 'py-2' : 'py-2.5';
  const scale    = 'scale-100';

  /* ── Text colours (always light — dark glass pill) ── */
  const navTextColor  = 'rgba(247,243,232,0.80)';
  const navActiveColor = 'var(--color-gold)';
  const iconColor     = 'rgba(247,243,232,0.75)';

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-50 flex flex-col items-center
          px-3 sm:px-4 pointer-events-none bg-transparent
          transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${topPad}`}
        style={{ background: 'none' }}
      >
        {/* ── Pill ── */}
        <div
          className={`navbar-glow navbar-float pointer-events-auto w-full max-w-5xl rounded-full
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scale}
            ${mounted ? 'navbar-enter' : 'opacity-0 -translate-y-6'}`}
          style={{
            backgroundColor: pillBg,
            border: `1px solid ${pillBorder}`,
            boxShadow: pillShadow,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'background-color 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
          }}
        >
          {/* Inner row */}
          <div className={`flex items-center justify-between ${padX} ${padY}`}>

            {/* Logo */}
            <Link to="/" className="nav-item-enter flex items-center gap-2 group shrink-0"
                  style={{ animationDelay: '0.05s' }}>
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0
                              transition-transform duration-300 group-hover:scale-105"
                   style={{ boxShadow: '0 0 0 1.5px rgba(201,164,92,0.35)' }}>
                <img src="/logo.png" alt="Vitamora"
                     className="w-full h-full object-cover"
                     style={{ mixBlendMode: 'screen' }} />
              </div>
              <span className="font-serif text-xl font-semibold tracking-tight
                               transition-colors duration-300 text-cream-100
                               group-hover:text-gold-400">
                Vitamora
              </span>
            </Link>

            {/* Desktop nav */}
            <nav ref={navRef} className="hidden xl:flex items-center relative" onMouseLeave={hide}>
              {/* Hover pill */}
              <span aria-hidden="true" className="absolute top-0 bottom-0 rounded-full pointer-events-none"
                    style={{
                      left: pill.left, width: pill.width, opacity: pill.opacity,
                      background: 'rgba(22,122,69,0.20)',
                      transition: 'left 0.32s cubic-bezier(0.22,1,0.36,1), width 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.20s ease',
                    }} />
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path
                  || (link.path === '/products' && location.pathname.startsWith('/products'));
                return (
                  <Link key={link.path} to={link.path}
                        onMouseEnter={e => moveTo(e.currentTarget)}
                        className="nav-item-enter relative z-10 px-3.5 py-1.5 rounded-full
                                   text-sm font-medium tracking-wide select-none
                                   transition-all duration-300 hover:-translate-y-px"
                        style={{
                          animationDelay: `${0.08 + i * 0.05}s`,
                          color: isActive ? navActiveColor : navTextColor,
                        }}>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2
                                       w-1 h-1 rounded-full"
                            style={{ background: 'var(--color-gold)' }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <button onClick={() => setSearchOpen(s => !s)}
                      className="nav-item-enter p-2 rounded-full transition-all duration-300
                                 hover:-translate-y-px hover:bg-white/8"
                      style={{ animationDelay: '0.38s', color: iconColor }}
                      aria-label="Search">
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist"
                    className="nav-item-enter relative p-2 rounded-full transition-all duration-300
                               hover:-translate-y-px hover:bg-white/8"
                    style={{ animationDelay: '0.44s', color: iconColor }}
                    aria-label="Wishlist">
                <Heart className="w-4 h-4" />
                {wishlistItems.length > 0 && <CartBadge count={wishlistItems.length} />}
              </Link>

              {/* Account */}
              <div className="nav-item-enter relative group" style={{ animationDelay: '0.50s' }}>
                <Link to={user ? '/account' : '/login'}
                      className="p-2 rounded-full transition-all duration-300
                                 hover:-translate-y-px hover:bg-white/8 block"
                      style={{ color: iconColor }} aria-label="Account">
                  <User className="w-4 h-4" />
                </Link>
                {user && (
                  <div className="absolute right-0 top-full pt-3 hidden group-hover:block z-50">
                    <div className="rounded-2xl py-2 w-52 overflow-hidden"
                         style={{
                           background: 'rgba(11,46,26,0.95)',
                           backdropFilter: 'blur(20px)',
                           border: '1px solid rgba(255,255,255,0.10)',
                           boxShadow: '0 16px 48px rgba(0,0,0,0.50)',
                           animation: 'navItemFadeIn 0.22s cubic-bezier(0.22,1,0.36,1) forwards',
                         }}>
                      <div className="px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <p className="text-sm font-semibold truncate text-cream-100">
                          {profile?.full_name || 'My Account'}
                        </p>
                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-mist)' }}>
                          {user.email}
                        </p>
                      </div>
                      {[
                        { to: '/account',  label: 'My Account' },
                        { to: '/orders',   label: 'Orders' },
                        { to: '/wishlist', label: 'Wishlist' },
                        ...(profile?.role === 'admin' ? [{ to: '/admin', label: 'Admin Dashboard' }] : []),
                      ].map(item => (
                        <Link key={item.to} to={item.to}
                              className="block px-4 py-2 text-sm transition-colors duration-200
                                         hover:bg-white/6 text-cream-100/80 hover:text-cream-100">
                          {item.label}
                        </Link>
                      ))}
                      <button onClick={() => signOut()}
                              className="w-full text-left px-4 py-2 text-sm transition-colors duration-200
                                         hover:bg-red-900/20 mt-1"
                              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: '#f87171' }}>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart"
                    className="nav-item-enter relative p-2 rounded-full transition-all duration-300
                               hover:-translate-y-px hover:bg-white/8"
                    style={{ animationDelay: '0.56s', color: iconColor }}
                    aria-label="Cart">
                <ShoppingBag className="w-4 h-4" />
                {totalItems > 0 && <CartBadge count={totalItems} />}
              </Link>

              {/* Hamburger */}
              <button className="nav-item-enter xl:hidden p-2 ml-0.5 rounded-full
                                 transition-all duration-300 hover:bg-white/8"
                      style={{ animationDelay: '0.56s', color: iconColor }}
                      onClick={toggleMobile}
                      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                      aria-expanded={mobileOpen}>
                <HamburgerIcon open={mobileOpen && !mobileClosing} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="px-4 pb-3.5"
                 style={{ animation: 'navItemFadeIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards' }}>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                       placeholder="Search products…" autoFocus
                       className="flex-1 px-4 py-2 rounded-full text-sm focus:outline-none
                                  transition-all duration-300"
                       style={{
                         background: 'rgba(0,0,0,0.35)',
                         border: '1px solid rgba(255,255,255,0.12)',
                         color: 'var(--color-cream)',
                       }} />
                <button type="submit" className="btn-primary btn-sm">Search</button>
                <button type="button" onClick={() => setSearchOpen(false)}
                        className="p-2 rounded-full hover:bg-white/8 transition-colors"
                        style={{ color: 'var(--color-mist)' }} aria-label="Close search">
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ── Mobile menu ── */}
        {(mobileOpen || mobileClosing) && (
          <div className={`pointer-events-auto w-full max-w-5xl mt-2 overflow-hidden rounded-3xl
            ${mobileClosing ? 'mobile-menu-close' : 'mobile-menu-open'}`}
               style={{
                 background: 'rgba(11,46,26,0.95)',
                 backdropFilter: 'blur(24px)',
                 border: '1px solid rgba(255,255,255,0.09)',
                 boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
               }}>
            <nav className="px-3 py-3">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path
                  || (link.path === '/products' && location.pathname.startsWith('/products'));
                return (
                  <Link key={link.path} to={link.path}
                        className="nav-item-enter flex items-center gap-3 px-4 py-3 rounded-2xl mb-0.5
                                   text-base font-medium transition-all duration-200"
                        onClick={closeMobileMenu}
                        style={{
                          animationDelay: `${i * 0.04}s`,
                          color: isActive ? 'var(--color-gold)' : 'rgba(247,243,232,0.80)',
                          background: isActive ? 'rgba(22,122,69,0.18)' : 'transparent',
                        } as React.CSSProperties}>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: 'var(--color-gold)' }} />
                    )}
                    {link.label}
                  </Link>
                );
              })}
              <div className="my-2 mx-1" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
              {user ? (
                <>
                  {[
                    { to: '/account', label: 'My Account' },
                    { to: '/orders',  label: 'Orders' },
                    { to: '/wishlist',label: 'Wishlist' },
                    ...(profile?.role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
                  ].map((item, i) => (
                    <Link key={item.to} to={item.to}
                          style={{ animationDelay: `${(navLinks.length + i) * 0.04}s` }}
                          className="nav-item-enter flex items-center px-4 py-2.5 rounded-2xl mb-0.5
                                     text-sm font-medium transition-all duration-200 text-cream-100/75
                                     hover:bg-white/6 hover:text-cream-100"
                          onClick={closeMobileMenu}>
                      {item.label}
                    </Link>
                  ))}
                  <button onClick={() => { signOut(); closeMobileMenu(); }}
                          className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium
                                     transition-all duration-200 mt-1"
                          style={{ color: '#f87171' }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-1 pt-1">
                  <Link to="/login" onClick={closeMobileMenu}
                        className="flex-1 btn-outline text-center justify-center py-2.5 text-sm">
                    Login
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}
                        className="flex-1 btn-primary text-center justify-center py-2.5 text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* No spacer — navbar is fixed/absolute, pages use pt-24 for their own top padding */}
    </>
  );
}
