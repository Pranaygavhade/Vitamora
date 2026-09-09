import { useEffect, useState } from 'react';
import {
  Package, ShoppingBag, Users, Star, MessageSquare,
  TrendingUp, CheckCircle, XCircle, Trash2, Edit3,
  ChevronRight, BarChart3, AlertTriangle,
} from 'lucide-react';
import { supabase, type Product, type Order, type Review } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatDate } from '@/lib/format';
import Reveal from '@/components/Reveal';

const TABS = [
  { id: 'overview',  label: 'Overview',   icon: BarChart3 },
  { id: 'products',  label: 'Products',   icon: Package },
  { id: 'orders',    label: 'Orders',     icon: ShoppingBag },
  { id: 'reviews',   label: 'Reviews',    icon: Star },
  { id: 'enquiries', label: 'Enquiries',  icon: MessageSquare },
];

const STATUS_OPTIONS = ['placed','confirmed','packed','shipped','out_for_delivery','delivered','cancelled'];

export default function Admin() {
  const { profile } = useAuth();
  const [tab, setTab] = useState('overview');
  const [products,   setProducts]   = useState<Product[]>([]);
  const [orders,     setOrders]     = useState<Order[]>([]);
  const [reviews,    setReviews]    = useState<(Review & { profiles?: { full_name: string } | null })[]>([]);
  const [enquiries,  setEnquiries]  = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*, profiles(full_name)').order('created_at', { ascending: false }),
      supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false }),
    ]).then(([{ data: p }, { data: o }, { data: r }, { data: e }]) => {
      setProducts(p ?? []);
      setOrders(o ?? []);
      setReviews(r ?? []);
      setEnquiries(e ?? []);
      setLoading(false);
    });
  }, []);

  async function updateOrderStatus(id: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  async function toggleReview(id: string, approved: boolean) {
    await supabase.from('reviews').update({ is_approved: approved }).eq('id', id);
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: approved } : r));
  }

  async function deleteReview(id: string) {
    await supabase.from('reviews').delete().eq('id', id);
    setReviews(prev => prev.filter(r => r.id !== id));
  }

  async function saveProduct() {
    if (!editProduct) return;
    if (editProduct.id) {
      const { id, created_at, updated_at, ...rest } = editProduct as Product;
      await supabase.from('products').update(rest).eq('id', id);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...rest } : p));
    }
    setEditProduct(null);
  }

  const filteredProducts = products.filter(p =>
    productSearch ? p.name.toLowerCase().includes(productSearch.toLowerCase()) : true
  );

  const revenue   = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const pending   = orders.filter(o => !['delivered','cancelled'].includes(o.status)).length;
  const lowStock  = products.filter(p => p.stock < 20).length;

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center pt-24">
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(22,122,69,0.30)', borderTopColor: 'var(--color-gold)' }} />
    </div>
  );

  return (
    <div className="page-bg min-h-screen pt-24 pb-20">
      <div className="section-pad py-8">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-6 h-6" style={{ color: 'var(--color-gold)' }} />
            <div>
              <h1 className="font-serif text-2xl font-bold text-cream-100">Admin Dashboard</h1>
              <p className="text-xs" style={{ color: 'var(--color-mist)' }}>Signed in as {profile?.full_name}</p>
            </div>
          </div>
        </Reveal>

        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-7 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap
                          transition-all duration-200 rounded-t-xl shrink-0
                          ${tab === t.id ? 'tab-active' : 'tab-inactive'}`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue',  value: formatPrice(revenue),        icon: TrendingUp, color: 'var(--color-gold)' },
                { label: 'Total Orders',   value: orders.length,               icon: ShoppingBag,color: 'var(--color-sage)' },
                { label: 'Delivered',      value: delivered,                   icon: CheckCircle,color: '#34d399' },
                { label: 'Pending',        value: pending,                     icon: Package,    color: '#ddc07a' },
                { label: 'Products',       value: products.length,             icon: Package,    color: 'var(--color-mist)' },
                { label: 'Low Stock',      value: lowStock,                    icon: AlertTriangle,color:'#f87171' },
                { label: 'Reviews',        value: reviews.length,              icon: Star,       color: 'var(--color-gold)' },
                { label: 'Enquiries',      value: enquiries.length,            icon: MessageSquare,color:'var(--color-sage)' },
              ].map((card, i) => (
                <Reveal key={card.label} delay={i * 40}>
                  <div className="glass-card p-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium tracking-wide" style={{ color: 'var(--color-mist)' }}>
                        {card.label}
                      </p>
                      <card.icon className="w-4 h-4" style={{ color: card.color }} strokeWidth={1.5} />
                    </div>
                    <p className="font-serif text-2xl font-bold" style={{ color: card.color }}>
                      {card.value}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Recent orders */}
            <Reveal>
              <div className="glass-card overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 className="font-serif text-base font-semibold text-cream-100">Recent Orders</h2>
                  <button onClick={() => setTab('orders')} className="text-xs flex items-center gap-1"
                    style={{ color: 'var(--color-gold)' }}>
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <table className="table-glass">
                  <thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td className="font-medium">{o.order_number}</td>
                        <td>{formatDate(o.created_at)}</td>
                        <td><span className={`text-2xs px-2 py-0.5 rounded-full status-${o.status}`}>{o.status}</span></td>
                        <td style={{ color: 'var(--color-gold)' }}>{formatPrice(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input value={productSearch} onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products…" className="input-glass max-w-xs" />
            </div>

            {editProduct && (
              <Reveal>
                <div className="glass-card p-6">
                  <h3 className="font-serif text-base font-semibold text-cream-100 mb-4">Edit Product</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'name',              label: 'Name' },
                      { key: 'price',             label: 'Price', type: 'number' },
                      { key: 'compare_at_price',  label: 'Compare Price', type: 'number' },
                      { key: 'stock',             label: 'Stock', type: 'number' },
                      { key: 'badge',             label: 'Badge' },
                    ].map(({ key, label, type }) => (
                      <div key={key}>
                        <label className="label-glass">{label}</label>
                        <input type={type ?? 'text'} value={(editProduct as any)[key] ?? ''}
                          onChange={e => setEditProduct(p => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                          className="input-glass" />
                      </div>
                    ))}
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editProduct.is_active ?? true}
                          onChange={e => setEditProduct(p => ({ ...p, is_active: e.target.checked }))}
                          className="accent-emerald-500" />
                        <span className="text-sm text-cream-100">Active</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editProduct.is_featured ?? false}
                          onChange={e => setEditProduct(p => ({ ...p, is_featured: e.target.checked }))}
                          className="accent-emerald-500" />
                        <span className="text-sm text-cream-100">Featured</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={saveProduct} className="btn-primary gap-2">Save</button>
                    <button onClick={() => setEditProduct(null)} className="btn-ghost">Cancel</button>
                  </div>
                </div>
              </Reveal>
            )}

            <div className="glass-card overflow-hidden">
              <table className="table-glass">
                <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id}>
                      <td className="font-medium max-w-[180px] truncate">{p.name}</td>
                      <td style={{ color: 'var(--color-gold)' }}>{formatPrice(p.price)}</td>
                      <td>
                        <span className={`text-2xs px-2 py-0.5 rounded-full ${p.stock < 20 ? 'status-cancelled' : 'status-delivered'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td>
                        <span className={`text-2xs px-2 py-0.5 rounded-full ${p.is_active ? 'status-delivered' : 'status-cancelled'}`}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => setEditProduct(p)}
                          className="p-1.5 rounded-lg hover:bg-white/8 transition-colors"
                          style={{ color: 'var(--color-mist)' }}>
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="glass-card overflow-hidden">
            <table className="table-glass">
              <thead><tr><th>Order</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="font-medium">{o.order_number}</td>
                    <td className="text-xs">{formatDate(o.created_at)}</td>
                    <td style={{ color: 'var(--color-gold)' }}>{formatPrice(o.total)}</td>
                    <td>
                      <select value={o.status}
                        onChange={e => updateOrderStatus(o.id, e.target.value)}
                        className="text-xs rounded-lg px-2 py-1 cursor-pointer"
                        style={{ background: 'rgba(22,62,38,0.70)', border: '1px solid rgba(22,122,69,0.30)',
                                 color: 'var(--color-sage)' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <div className="space-y-3">
            {reviews.map(r => (
              <Reveal key={r.id}>
                <div className="glass-card p-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-sm font-semibold text-cream-100">{r.profiles?.full_name ?? 'Customer'}</p>
                      <span className={`text-2xs px-2 py-0.5 rounded-full ${r.is_approved ? 'status-delivered' : 'status-placed'}`}>
                        {r.is_approved ? 'Approved' : 'Pending'}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--color-gold)' }}>{'★'.repeat(r.rating)}</span>
                    </div>
                    <p className="text-sm font-medium text-cream-100">{r.title}</p>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-mist)' }}>{r.body}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => toggleReview(r.id, !r.is_approved)}
                      className="p-1.5 rounded-lg hover:bg-white/8 transition-colors"
                      style={{ color: r.is_approved ? '#f87171' : 'var(--color-sage)' }}>
                      {r.is_approved ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteReview(r.id)}
                      className="p-1.5 rounded-lg hover:bg-red-900/25 transition-colors"
                      style={{ color: 'rgba(248,113,113,0.60)' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
            {reviews.length === 0 && (
              <div className="glass-card p-10 text-center">
                <p className="text-sm" style={{ color: 'var(--color-mist)' }}>No reviews yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Enquiries */}
        {tab === 'enquiries' && (
          <div className="space-y-3">
            {enquiries.map((e, i) => (
              <Reveal key={e.id} delay={i * 40}>
                <div className="glass-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm font-semibold text-cream-100">{e.name}</p>
                    <span className="text-2xs" style={{ color: 'var(--color-mist)' }}>{e.email}</span>
                    <span className="ml-auto text-2xs px-2 py-0.5 rounded-full status-placed">{e.enquiry_type}</span>
                  </div>
                  {e.subject && <p className="text-xs font-medium text-cream-100 mb-1">{e.subject}</p>}
                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--color-mist)' }}>{e.message}</p>
                  <p className="text-2xs mt-2" style={{ color: 'rgba(182,200,179,0.40)' }}>{formatDate(e.created_at)}</p>
                </div>
              </Reveal>
            ))}
            {enquiries.length === 0 && (
              <div className="glass-card p-10 text-center">
                <p className="text-sm" style={{ color: 'var(--color-mist)' }}>No enquiries yet.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
