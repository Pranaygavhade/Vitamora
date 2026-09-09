import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, CheckCircle, Circle, RotateCcw, Leaf, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase, type Order, type OrderItem } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/format';
import Reveal from '@/components/Reveal';

const STEPS = [
  { key: 'placed',           label: 'Order Placed' },
  { key: 'confirmed',        label: 'Confirmed' },
  { key: 'packed',           label: 'Packed' },
  { key: 'shipped',          label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered',        label: 'Delivered' },
];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [order, setOrder]   = useState<Order | null>(null);
  const [items, setItems]   = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reordered, setReordered] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    Promise.all([
      supabase.from('orders').select('*').eq('id', id).eq('user_id', user.id).maybeSingle(),
      supabase.from('order_items').select('*').eq('order_id', id),
    ]).then(([{ data: ord }, { data: its }]) => {
      if (!ord) { setNotFound(true); } else { setOrder(ord); setItems(its ?? []); }
      setLoading(false);
    });
  }, [id, user]);

  function handleReorder() {
    items.forEach(item => {
      addItem({
        product_id: item.product_id ?? item.id,
        name: item.product_name, slug: item.product_name.toLowerCase().replace(/\s+/g, '-'),
        price: item.price, image: item.product_image, size: '200g',
      }, item.quantity);
    });
    setReordered(true);
    setTimeout(() => setReordered(false), 2500);
  }

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center pt-24">
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(22,122,69,0.30)', borderTopColor: 'var(--color-gold)' }} />
    </div>
  );

  if (notFound || !order) return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
      <Package className="w-16 h-16 opacity-20" style={{ color: 'var(--color-sage)' }} />
      <h1 className="font-serif text-2xl font-semibold text-cream-100">Order not found</h1>
      <Link to="/orders" className="btn-primary">View All Orders</Link>
    </div>
  );

  const currentStepIdx = STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="page-bg min-h-screen pt-24 pb-20">
      <div className="section-pad py-8">
        <Reveal>
          <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: 'var(--color-mist)' }}>Order</p>
              <h1 className="font-serif text-2xl font-bold text-cream-100">{order.order_number}</h1>
              <p className="text-xs mt-1" style={{ color: 'var(--color-mist)' }}>
                Placed {formatDate(order.created_at)}
              </p>
            </div>
            {order.status === 'delivered' && (
              <button onClick={handleReorder} className="btn-outline btn-sm flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                {reordered ? 'Added to Cart!' : 'Reorder'}
              </button>
            )}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — tracking + items */}
          <div className="lg:col-span-2 space-y-6">

            {/* Progress tracker */}
            {!isCancelled && (
              <Reveal>
                <div className="glass-card p-6">
                  <h2 className="font-serif text-base font-semibold text-cream-100 mb-6">Tracking</h2>

                  {/* Desktop horizontal */}
                  <div className="hidden sm:flex justify-between items-start relative">
                    <div className="absolute top-4 left-0 right-0 h-px"
                      style={{ background: 'rgba(22,122,69,0.20)' }} />
                    <div className="absolute top-4 left-0 h-px"
                      style={{
                        background: 'linear-gradient(90deg,var(--color-gold),rgba(22,122,69,0.60))',
                        width: currentStepIdx < 0 ? '0%' : `${(currentStepIdx / (STEPS.length - 1)) * 100}%`,
                        transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
                      }} />
                    {STEPS.map((step, i) => {
                      const done = currentStepIdx >= i;
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10" style={{ flex: 1 }}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500`}
                            style={{
                              background: done ? 'rgba(22,122,69,0.35)' : 'rgba(255,255,255,0.05)',
                              border: `1.5px solid ${done ? 'rgba(22,122,69,0.65)' : 'rgba(255,255,255,0.12)'}`,
                              boxShadow: done ? '0 0 12px rgba(22,122,69,0.30)' : 'none',
                            }}>
                            {done
                              ? <CheckCircle className="w-4 h-4" style={{ color: 'var(--color-sage)' }} />
                              : <Circle className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.20)' }} />
                            }
                          </div>
                          <p className={`text-[10px] mt-2 text-center leading-tight max-w-[70px] transition-colors duration-300`}
                            style={{ color: done ? 'var(--color-sage)' : 'rgba(182,200,179,0.35)' }}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile vertical */}
                  <div className="sm:hidden space-y-3">
                    {STEPS.map((step, i) => {
                      const done = currentStepIdx >= i;
                      return (
                        <div key={step.key} className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0`}
                            style={{
                              background: done ? 'rgba(22,122,69,0.30)' : 'rgba(255,255,255,0.05)',
                              border: `1.5px solid ${done ? 'rgba(22,122,69,0.60)' : 'rgba(255,255,255,0.10)'}`,
                            }}>
                            {done
                              ? <CheckCircle className="w-3.5 h-3.5" style={{ color: 'var(--color-sage)' }} />
                              : <Circle className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.18)' }} />
                            }
                          </div>
                          <span className="text-sm transition-colors duration-300"
                            style={{ color: done ? 'var(--color-cream)' : 'rgba(182,200,179,0.35)' }}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            )}

            {isCancelled && (
              <Reveal>
                <div className="p-5 rounded-2xl text-sm"
                  style={{ background: 'rgba(180,40,40,0.12)', border: '1px solid rgba(180,40,40,0.25)', color: '#f87171' }}>
                  This order has been cancelled.
                </div>
              </Reveal>
            )}

            {/* Items */}
            <Reveal delay={80}>
              <div className="glass-card p-5 space-y-4">
                <h2 className="font-serif text-base font-semibold text-cream-100">Order Items</h2>
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    {item.product_image && (
                      <img src={item.product_image} alt={item.product_name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                        style={{ border: '1px solid rgba(255,255,255,0.10)' }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cream-100 truncate">{item.product_name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-mist)' }}>
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold shrink-0" style={{ color: 'var(--color-gold)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — summary */}
          <div className="space-y-5">
            {/* Price summary */}
            <Reveal>
              <div className="glass-card p-5">
                <h2 className="font-serif text-base font-semibold text-cream-100 mb-4">Order Summary</h2>
                <div className="space-y-2.5 text-sm">
                  {[
                    { label: 'Subtotal',  value: formatPrice(order.subtotal) },
                    { label: 'Shipping',  value: order.shipping === 0 ? 'Free' : formatPrice(order.shipping) },
                    ...(order.discount > 0 ? [{ label: 'Discount', value: `-${formatPrice(order.discount)}` }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span style={{ color: 'var(--color-mist)' }}>{label}</span>
                      <span className="text-cream-100">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-cream-100">Total</span>
                    <span style={{ color: 'var(--color-gold)' }}>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Shipping address */}
            <Reveal delay={60}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                  <h3 className="text-sm font-semibold text-cream-100">Delivery Address</h3>
                </div>
                <div className="text-xs leading-relaxed space-y-0.5" style={{ color: 'var(--color-mist)' }}>
                  <p>{order.shipping_address?.full_name}</p>
                  <p>{order.shipping_address?.address}</p>
                  <p>{order.shipping_address?.city}, {order.shipping_address?.state} — {order.shipping_address?.pincode}</p>
                  <p>{order.shipping_address?.country}</p>
                </div>
              </div>
            </Reveal>

            {/* Payment */}
            <Reveal delay={100}>
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                  <h3 className="text-sm font-semibold text-cream-100">Payment</h3>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-mist)' }}>
                  {order.payment_method?.toUpperCase()} · {order.payment_status}
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <Link to="/orders" className="btn-outline w-full justify-center btn-sm">
                All Orders
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
