import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Order } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/format';
import Reveal from '@/components/Reveal';

const STATUS_LABEL: Record<string, string> = {
  placed: 'Placed', confirmed: 'Confirmed', packed: 'Packed',
  shipped: 'Shipped', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('orders').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false); });
  }, [user]);

  return (
    <div className="page-bg min-h-screen pt-24 pb-20">
      <div className="section-pad py-8 max-w-3xl">
        <Reveal>
          <h1 className="font-serif text-3xl font-bold text-cream-100 mb-8">Order History</h1>
        </Reveal>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="rounded-2xl animate-pulse h-20"
                style={{ background: 'rgba(22,62,38,0.35)' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Reveal>
            <div className="glass-card p-14 text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-25" style={{ color: 'var(--color-sage)' }} />
              <h2 className="font-serif text-lg font-semibold text-cream-100 mb-3">No orders yet</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-mist)' }}>
                Your order history will appear here.
              </p>
              <Link to="/products" className="btn-primary btn-sm">Start Shopping</Link>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => (
              <Reveal key={order.id} delay={i * 50}>
                <Link to={`/orders/${order.id}`}
                  className="glass-card p-5 flex items-center justify-between gap-4 group block">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-cream-100">{order.order_number}</p>
                      <span className={`text-2xs px-2.5 py-0.5 rounded-full font-medium status-${order.status}`}>
                        {STATUS_LABEL[order.status] ?? order.status}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-mist)' }}>
                      {formatDate(order.created_at)} · {formatPrice(order.total)} ·{' '}
                      {order.payment_method?.toUpperCase()}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                    style={{ color: 'var(--color-mist)' }} />
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
