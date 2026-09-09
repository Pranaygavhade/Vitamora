import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Leaf } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import Reveal from '@/components/Reveal';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total,
          couponCode, couponDiscount, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput]   = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg,   setCouponMsg]     = useState('');

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMsg('');
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponInput.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle();
    setCouponLoading(false);
    if (!data) { setCouponMsg('Invalid or expired coupon code.'); return; }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponMsg('This coupon has expired.'); return;
    }
    applyCoupon(data.code, data.discount_value);
    setCouponMsg(`Coupon applied — ${data.discount_value}% off!`);
    setCouponInput('');
  }

  if (items.length === 0) return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center gap-8 pt-24 px-4">
      <div className="glass-card p-16 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(22,122,69,0.15)', border: '1px solid rgba(22,122,69,0.25)' }}>
          <ShoppingBag className="w-9 h-9" style={{ color: 'var(--color-sage)' }} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-cream-100 mb-3">Your cart is empty</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-mist)' }}>
          Discover our premium Ayurvedic botanical powders and begin your wellness ritual.
        </p>
        <Link to="/products" className="btn-primary w-full justify-center">
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  const discountAmount = subtotal > 0 ? (subtotal * couponDiscount) / 100 : 0;

  return (
    <div className="page-bg min-h-screen pt-24 pb-24">
      <div className="section-pad py-8">
        <Reveal>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100 mb-8">
            Your Cart
            <span className="ml-3 text-lg font-normal" style={{ color: 'var(--color-mist)' }}>
              ({items.length} item{items.length !== 1 ? 's' : ''})
            </span>
          </h1>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <Reveal key={item.product_id} delay={i * 60}>
                <div className="glass-card p-5 flex gap-4">
                  <Link to={`/products/${item.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0"
                    style={{ background: 'rgba(22,62,38,0.60)' }}>
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/products/${item.slug}`}
                          className="font-serif text-base font-semibold text-cream-100
                                     hover:text-gold-300 transition-colors duration-200">
                          {item.name}
                        </Link>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-mist)' }}>
                          {item.size} · Botanical Powder
                        </p>
                      </div>
                      <button onClick={() => removeItem(item.product_id)}
                        className="p-1.5 rounded-lg hover:bg-red-900/25 transition-colors shrink-0"
                        style={{ color: 'rgba(248,113,113,0.60)' }}
                        aria-label="Remove item">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="qty-btn" disabled={item.quantity <= 1} aria-label="Decrease">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold w-7 text-center text-cream-100 text-sm">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="qty-btn" aria-label="Increase">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-bold" style={{ color: 'var(--color-gold)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* Continue shopping */}
            <Reveal delay={200}>
              <Link to="/products" className="btn-ghost text-sm flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continue Shopping
              </Link>
            </Reveal>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <Reveal>
              <div className="glass-card p-6 flex flex-col gap-4">
                <h2 className="font-serif text-xl font-semibold text-cream-100">Order Summary</h2>

                {/* Coupon */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                      style={{ color: 'var(--color-mist)' }} />
                    <input value={couponInput} onChange={e => setCouponInput(e.target.value)}
                      placeholder="Coupon code" className="input-glass pl-9 text-sm w-full" />
                  </div>
                  <button type="submit" className="btn-outline btn-sm shrink-0" disabled={couponLoading}>
                    {couponLoading ? '…' : 'Apply'}
                  </button>
                </form>
                {couponMsg && (
                  <p className="text-xs" style={{ color: couponMsg.includes('applied') ? 'var(--color-gold)' : '#f87171' }}>
                    {couponMsg}
                  </p>
                )}
                {couponCode && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="badge-gold">{couponCode} — {couponDiscount}% off</span>
                    <button onClick={removeCoupon} className="hover:text-red-400 transition-colors"
                      style={{ color: 'var(--color-mist)' }}>Remove</button>
                  </div>
                )}

                <div className="h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

                {/* Lines */}
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-mist)' }}>Subtotal</span>
                    <span className="text-cream-100">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-sage)' }}>Discount</span>
                      <span style={{ color: 'var(--color-sage)' }}>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-mist)' }}>Shipping</span>
                    <span className={shipping === 0 ? '' : 'text-cream-100'}
                      style={{ color: shipping === 0 ? 'var(--color-sage)' : undefined }}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-2xs" style={{ color: 'var(--color-mist)' }}>
                      Add {formatPrice(499 - (subtotal - discountAmount))} more for free shipping
                    </p>
                  )}
                </div>

                <div className="h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />

                <div className="flex justify-between items-baseline">
                  <span className="font-serif text-lg font-semibold text-cream-100">Total</span>
                  <span className="font-bold text-2xl" style={{ color: 'var(--color-gold)' }}>
                    {formatPrice(total)}
                  </span>
                </div>

                <Link to="/checkout" className="btn-gold w-full justify-center">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Hint */}
                <p className="text-2xs text-center" style={{ color: 'var(--color-mist)' }}>
                  Try code <span className="font-semibold" style={{ color: 'var(--color-gold)' }}>WELCOME10</span> for 10% off
                </p>
              </div>
            </Reveal>

            {/* Trust */}
            <Reveal delay={100}>
              <div className="glass-card p-4">
                <div className="flex flex-col gap-2">
                  {['Free shipping above ₹499', '100% Natural ingredients', 'Quality verified products'].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <Leaf className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                      <span className="text-xs" style={{ color: 'var(--color-mist)' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
