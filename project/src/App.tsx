import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Quality from '@/pages/Quality';
import Contact from '@/pages/Contact';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Account from '@/pages/Account';
import OrderHistory from '@/pages/OrderHistory';
import OrderTracking from '@/pages/OrderTracking';
import Wishlist from '@/pages/Wishlist';
import Admin from '@/pages/Admin';
import Blog from '@/pages/Blog';
import BlogDetail from '@/pages/BlogDetail';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTopButton from '@/components/ScrollToTopButton';

/* ─── Botanical particle effect (whole site) ─────────────────────────────── */
const BOT_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  type: i % 3,            // 0=leaf, 1=pollen, 2=particle
  size:  i % 3 === 0 ? 8 + (i % 4) * 3 : 3 + (i % 4) * 1.5,
  left:  (i * 13 + 3) % 100,
  delay: (i * 1.7) % 14,
  dur:   18 + (i * 2.3) % 16,
  opa:   0.06 + (i % 6) * 0.018,
  drift: (i % 2 === 0 ? 1 : -1) * (8 + i % 12),
}));

function BotanicalParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }} aria-hidden="true">
      <style>{`
        @keyframes botRise {
          0%   { transform: var(--tx0) translateY(105vh) rotate(0deg); opacity:0; }
          8%   { opacity: var(--opa); }
          92%  { opacity: var(--opa); }
          100% { transform: var(--tx1) translateY(-8vh) rotate(var(--rot)); opacity:0; }
        }
        @keyframes botSway {
          0%,100% { margin-left: 0px; }
          25%     { margin-left: var(--sw); }
          75%     { margin-left: calc(var(--sw) * -0.5); }
        }
      `}</style>
      {BOT_PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.left}%`,
          bottom: `-${5 + p.id % 15}%`,
          width:  `${p.size}px`,
          height: p.type === 0 ? `${p.size * 0.55}px` : `${p.size}px`,
          // leaf shape, pollen dot, soft particle
          borderRadius: p.type === 0
            ? '60% 40% 50% 50% / 50% 50% 40% 60%'
            : p.type === 1
            ? '50%'
            : '40% 60% 60% 40% / 60% 30% 70% 40%',
          background: p.type === 0
            ? `rgba(${120 + p.id % 40},${170 + p.id % 30},${100 + p.id % 20},0.75)`
            : p.type === 1
            ? `rgba(${210 + p.id % 30},${190 + p.id % 20},${90 + p.id % 15},0.70)`
            : `rgba(${100 + p.id % 40},${160 + p.id % 30},${90 + p.id % 20},0.65)`,
          opacity: p.opa,
          filter: p.type === 1 ? `blur(0.5px) drop-shadow(0 0 2px rgba(201,164,92,0.20))` : 'none',
          ['--tx0' as any]: `translateX(${p.drift * -0.3}px)`,
          ['--tx1' as any]: `translateX(${p.drift}px)`,
          ['--rot' as any]: `${(p.id % 2 === 0 ? 1 : -1) * (45 + p.id % 90)}deg`,
          ['--opa' as any]: String(p.opa),
          ['--sw'  as any]: `${p.drift * 0.6}px`,
          animation: `botRise ${p.dur}s ${p.delay}s linear infinite, botSway ${p.dur * 0.7}s ${p.delay}s ease-in-out infinite`,
          willChange: 'transform, opacity',
        }} />
      ))}
    </div>
  );
}

function ScrollManager() {
  useScrollToTop();
  return null;
}

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col" style={{ position: 'relative', background: 'transparent' }}>

      {/* ── Misty forest fixed background — ALL pages ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: "url('background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Base dark overlay — lighter so the forest image shows through clearly */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,10,6,0.45)' }} />
      </div>

      {/* ── Botanical particle effect — whole site ── */}
      <BotanicalParticles />
      {/* Header is hidden on home — Home renders its own inline navbar */}
      {!isHome && <Header />}
      <main className="flex-1" style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollManager />
            <AppShell />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
