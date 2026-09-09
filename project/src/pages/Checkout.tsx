import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, Leaf } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatPrice, generateOrderNumber } from '@/lib/format';
import Reveal from '@/components/Reveal';

export default function Checkout() {
  const { items, subtotal, shipping, total, couponCode, couponDiscount, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:    profile?.full_name || '',
    email:   user?.email || '',
    phone:   profile?.phone || '',
    address: '',
    city:    '',
    state:   '',
    pincode: '',
    country: 'India',
  });
  const [submitting,    setSubmitting]    = useState(false);
  const [error,         setError]         = useState('');

  const discountAmount = subtotal > 0 ? (subtotal * couponDiscount) / 100 : 0;
  const afterDiscount  = subtotal - discountAmount;

  function setF(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!user) { setError('Please log in to complete your purchase.'); return; }
    if (items.length === 0) { setError('Your cart is empty.'); return; }
    setSubmitting(true);

    const orderNumber = generateOrderNumber();
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id, order_number: orderNumber, status: 'placed',
        total, subtotal, shipping, discount: discountAmount,
        coupon_code: couponCode, payment_method: 'flipkart', payment_status: 'pending',
        shipping_address: { full_name: form.name, address: form.address, city: form.city,
                            state: form.state, pincode: form.pincode, country: form.country },
        contact_info: { name: form.name, email: form.email, phone: form.phone },
      })
      .select('*').single();

    if (orderErr || !order) { setError('Failed to place order. Please try again.'); setSubmitting(false); return; }

    const { error: itemsErr } = await supabase.from('order_items').insert(
      items.map(i => ({ order_id: order.id, product_id: i.product_id,
                        product_name: i.name, product_image: i.image, quantity: i.quantity, price: i.price }))
    );
    if (itemsErr) { setError('Failed to save order items. Please contact support.'); setSubmitting(false); return; }

    clearCart();
    navigate(`/orders/${order.id}`);
  }

  if (items.length === 0) return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center gap-6 pt-24 px-4">
      <div className="glass-card p-12 text-center max-w-sm w-full">
        <h1 className="font-serif text-2xl font-semibold text-cream-100 mb-4">Your cart is empty</h1>
        <Link to="/products" className="btn-primary w-full justify-center">
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="page-bg min-h-screen pt-24 pb-20">
      <div className="section-pad py-8">
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <Lock className="w-5 h-5" style={{ color: 'var(--color-gold)' }} />
            <h1 className="font-serif text-3xl font-bold text-cream-100">Secure Checkout</h1>
          </div>
        </Reveal>

        {!user && (
          <Reveal>
            <div className="glass-card p-5 mb-8 flex items-center justify-between gap-4">
              <p className="text-sm" style={{ color: 'var(--color-mist)' }}>
                Please log in to complete your purchase.
              </p>
              <Link to="/login" className="btn-primary btn-sm shrink-0">Login</Link>
            </div>
          </Reveal>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left forms */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact */}
            <Reveal>
              <div className="glass-card p-6">
                <h2 className="font-serif text-lg font-semibold text-cream-100 mb-5">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-glass">Full Name *</label>
                    <input required value={form.name} onChange={e => setF('name', e.target.value)}
                      className="input-glass" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="label-glass">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setF('email', e.target.value)}
                      className="input-glass" placeholder="your@email.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label-glass">Phone *</label>
                    <input required type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)}
                      className="input-glass" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Shipping */}
            <Reveal delay={80}>
              <div className="glass-card p-6">
                <h2 className="font-serif text-lg font-semibold text-cream-100 mb-5">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label-glass">Address *</label>
                    <input required value={form.address} onChange={e => setF('address', e.target.value)}
                      className="input-glass" placeholder="House no, Street, Area, Landmark" />
                  </div>
                  <div>
                    <label className="label-glass">City *</label>
                    <input required value={form.city} onChange={e => setF('city', e.target.value)}
                      className="input-glass" placeholder="City" />
                  </div>
                  <div>
                    <label className="label-glass">State *</label>
                    <input required value={form.state} onChange={e => setF('state', e.target.value)}
                      className="input-glass" placeholder="State" />
                  </div>
                  <div>
                    <label className="label-glass">PIN Code *</label>
                    <input required value={form.pincode} onChange={e => setF('pincode', e.target.value)}
                      className="input-glass" placeholder="6-digit PIN code" maxLength={6} />
                  </div>
                  <div>
                    <label className="label-glass">Country *</label>
                    <input required value={form.country} onChange={e => setF('country', e.target.value)}
                      className="input-glass" />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Payment section removed */}

            {error && (
              <div className="p-4 rounded-xl text-sm"
                style={{ background: 'rgba(180,40,40,0.15)', border: '1px solid rgba(180,40,40,0.30)', color: '#f87171' }}>
                {error}
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <Reveal>
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-serif text-lg font-semibold text-cream-100 mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.product_id} className="flex gap-3">
                      <img src={item.image} alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                        style={{ border: '1px solid rgba(255,255,255,0.10)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cream-100 truncate">{item.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-mist)' }}>
                          {item.size} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--color-gold)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.07)' }} />

                <div className="space-y-2.5 text-sm mb-5">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-mist)' }}>Subtotal</span>
                    <span className="text-cream-100">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--color-sage)' }}>Coupon ({couponCode})</span>
                      <span style={{ color: 'var(--color-sage)' }}>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--color-mist)' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? 'var(--color-sage)' : 'var(--color-cream)' }}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.07)' }} />

                <div className="flex justify-between items-baseline mb-6">
                  <span className="font-serif text-lg font-semibold text-cream-100">Total</span>
                  <span className="font-bold text-2xl" style={{ color: 'var(--color-gold)' }}>
                    {formatPrice(total)}
                  </span>
                </div>

                <button type="submit" className="btn-gold w-full justify-center"
                  disabled={submitting || !user}>
                  {submitting ? 'Placing Order…' : (
                    <><Lock className="w-4 h-4" /> Place Order</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--color-sage)' }} />
                  <span className="text-2xs" style={{ color: 'var(--color-mist)' }}>Secure & encrypted checkout</span>
                </div>
              </div>
            </Reveal>
          </div>
        </form>
      </div>
    </div>
  );
}
