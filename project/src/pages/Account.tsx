import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, MapPin, ShoppingBag, Heart, Settings, Plus, Trash2,
  Edit3, Save, X, ChevronRight, Leaf,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Address, type Order } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/format';
import Reveal from '@/components/Reveal';

const TABS = [
  { id: 'profile',   label: 'Profile',    icon: User },
  { id: 'addresses', label: 'Addresses',  icon: MapPin },
  { id: 'orders',    label: 'Orders',     icon: ShoppingBag },
  { id: 'wishlist',  label: 'Wishlist',   icon: Heart },
  { id: 'settings',  label: 'Settings',   icon: Settings },
];

const STATUS_LABEL: Record<string, string> = {
  placed: 'Order Placed', confirmed: 'Confirmed', packed: 'Packed',
  shipped: 'Shipped', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function Account() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: profile?.full_name ?? '', phone: profile?.phone ?? '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg,    setProfileMsg]    = useState('');
  const [addrForm,  setAddrForm]  = useState<Partial<Address> | null>(null);
  const [savingAddr, setSavingAddr] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setAddresses(data ?? []));
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data ?? []));
  }, [user]);

  useEffect(() => {
    setProfileForm({ full_name: profile?.full_name ?? '', phone: profile?.phone ?? '' });
  }, [profile]);

  async function saveProfile() {
    if (!user) return;
    setSavingProfile(true);
    await supabase.from('profiles').update(profileForm).eq('id', user.id);
    await refreshProfile();
    setSavingProfile(false);
    setEditProfile(false);
    setProfileMsg('Profile updated.');
    setTimeout(() => setProfileMsg(''), 3000);
  }

  async function saveAddress() {
    if (!user || !addrForm) return;
    setSavingAddr(true);
    if (addrForm.id) {
      const { id, user_id, ...rest } = addrForm as Address;
      await supabase.from('addresses').update(rest).eq('id', id);
      setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...rest } : a));
    } else {
      const { data } = await supabase.from('addresses').insert({ ...addrForm, user_id: user.id }).select('*').single();
      if (data) setAddresses(prev => [data, ...prev]);
    }
    setSavingAddr(false);
    setAddrForm(null);
  }

  async function deleteAddress(id: string) {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses(prev => prev.filter(a => a.id !== id));
  }

  if (!user) return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
      <div className="glass-card p-10 text-center max-w-sm w-full">
        <h2 className="font-serif text-xl font-semibold text-cream-100 mb-4">Sign in to view your account</h2>
        <Link to="/login" className="btn-primary w-full justify-center">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="page-bg min-h-screen pt-24 pb-20">
      <div className="section-pad py-8">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: 'rgba(22,122,69,0.25)', border: '1.5px solid rgba(22,122,69,0.40)', color: 'var(--color-sage)' }}>
              {profile?.full_name?.[0] ?? user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-cream-100">
                {profile?.full_name || 'My Account'}
              </h1>
              <p className="text-sm" style={{ color: 'var(--color-mist)' }}>{user.email}</p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-48 shrink-0">
            <nav className="glass-card p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium
                             whitespace-nowrap transition-all duration-200 text-left w-full"
                  style={{
                    background: tab === t.id ? 'rgba(22,122,69,0.22)' : 'transparent',
                    color: tab === t.id ? 'var(--color-sage)' : 'var(--color-mist)',
                    border: tab === t.id ? '1px solid rgba(22,122,69,0.35)' : '1px solid transparent',
                  }}>
                  <t.icon className="w-4 h-4 shrink-0" />
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Profile */}
            {tab === 'profile' && (
              <Reveal>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-lg font-semibold text-cream-100">Profile Information</h2>
                    {!editProfile && (
                      <button onClick={() => setEditProfile(true)} className="btn-ghost btn-sm flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                  </div>
                  {editProfile ? (
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="label-glass">Full Name</label>
                        <input value={profileForm.full_name}
                          onChange={e => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                          className="input-glass" />
                      </div>
                      <div>
                        <label className="label-glass">Phone</label>
                        <input value={profileForm.phone}
                          onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                          className="input-glass" />
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button onClick={saveProfile} className="btn-primary gap-2" disabled={savingProfile}>
                          <Save className="w-4 h-4" /> {savingProfile ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button onClick={() => setEditProfile(false)} className="btn-ghost">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[
                        { label: 'Full Name', value: profile?.full_name || '—' },
                        { label: 'Email',     value: user.email || '—' },
                        { label: 'Phone',     value: profile?.phone || '—' },
                        { label: 'Role',      value: profile?.role === 'admin' ? 'Administrator' : 'Customer' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex gap-4">
                          <span className="text-sm w-28 shrink-0" style={{ color: 'var(--color-mist)' }}>{label}</span>
                          <span className="text-sm text-cream-100 font-medium">{value}</span>
                        </div>
                      ))}
                      {profileMsg && (
                        <p className="text-sm" style={{ color: 'var(--color-sage)' }}>{profileMsg}</p>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            )}

            {/* Addresses */}
            {tab === 'addresses' && (
              <div className="space-y-4">
                <Reveal>
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-lg font-semibold text-cream-100">Saved Addresses</h2>
                    <button onClick={() => setAddrForm({ full_name: '', address: '', city: '', state: '', pincode: '', country: 'India', phone: '' })}
                      className="btn-primary btn-sm flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> Add Address
                    </button>
                  </div>
                </Reveal>

                {addrForm && (
                  <Reveal>
                    <div className="glass-card p-6">
                      <h3 className="font-serif text-base font-semibold text-cream-100 mb-4">
                        {addrForm.id ? 'Edit Address' : 'New Address'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: 'full_name', label: 'Full Name', placeholder: 'Recipient name' },
                          { key: 'phone',     label: 'Phone',     placeholder: 'Contact number' },
                          { key: 'address',   label: 'Address',   placeholder: 'Street, area', span: true },
                          { key: 'city',      label: 'City',      placeholder: '' },
                          { key: 'state',     label: 'State',     placeholder: '' },
                          { key: 'pincode',   label: 'PIN Code',  placeholder: '' },
                          { key: 'country',   label: 'Country',   placeholder: '' },
                        ].map(({ key, label, placeholder, span }) => (
                          <div key={key} className={span ? 'sm:col-span-2' : ''}>
                            <label className="label-glass">{label}</label>
                            <input value={(addrForm as any)[key] ?? ''} placeholder={placeholder}
                              onChange={e => setAddrForm(f => ({ ...f, [key]: e.target.value }))}
                              className="input-glass" />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button onClick={saveAddress} className="btn-primary gap-2" disabled={savingAddr}>
                          <Save className="w-4 h-4" /> {savingAddr ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={() => setAddrForm(null)} className="btn-ghost">Cancel</button>
                      </div>
                    </div>
                  </Reveal>
                )}

                {addresses.length === 0 && !addrForm ? (
                  <Reveal>
                    <div className="glass-card p-10 text-center">
                      <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: 'var(--color-sage)' }} />
                      <p className="text-sm" style={{ color: 'var(--color-mist)' }}>No saved addresses yet.</p>
                    </div>
                  </Reveal>
                ) : (
                  addresses.map(addr => (
                    <Reveal key={addr.id}>
                      <div className="glass-card p-5 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-cream-100">{addr.full_name}</p>
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                            {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--color-mist)' }}>{addr.country} · {addr.phone}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setAddrForm(addr)}
                            className="p-2 rounded-xl hover:bg-white/8 transition-colors"
                            style={{ color: 'var(--color-mist)' }}>
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteAddress(addr.id)}
                            className="p-2 rounded-xl hover:bg-red-900/25 transition-colors"
                            style={{ color: 'rgba(248,113,113,0.60)' }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </Reveal>
                  ))
                )}
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div className="space-y-4">
                <Reveal>
                  <h2 className="font-serif text-lg font-semibold text-cream-100">Order History</h2>
                </Reveal>
                {orders.length === 0 ? (
                  <Reveal>
                    <div className="glass-card p-10 text-center">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: 'var(--color-sage)' }} />
                      <p className="text-sm mb-4" style={{ color: 'var(--color-mist)' }}>No orders yet.</p>
                      <Link to="/products" className="btn-primary btn-sm">Shop Now</Link>
                    </div>
                  </Reveal>
                ) : (
                  orders.map(order => (
                    <Reveal key={order.id}>
                      <Link to={`/orders/${order.id}`}
                        className="glass-card p-5 flex items-center justify-between gap-4 group block
                                   hover:border-green-dim transition-colors duration-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-sm font-semibold text-cream-100">{order.order_number}</p>
                            <span className={`text-2xs px-2 py-0.5 rounded-full font-medium status-${order.status}`}>
                              {STATUS_LABEL[order.status] ?? order.status}
                            </span>
                          </div>
                          <p className="text-xs" style={{ color: 'var(--color-mist)' }}>
                            {formatDate(order.created_at)} · {formatPrice(order.total)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                          style={{ color: 'var(--color-mist)' }} />
                      </Link>
                    </Reveal>
                  ))
                )}
              </div>
            )}

            {/* Wishlist shortcut */}
            {tab === 'wishlist' && (
              <Reveal>
                <div className="glass-card p-10 text-center">
                  <Heart className="w-10 h-10 mx-auto mb-4 opacity-30" style={{ color: 'var(--color-gold)' }} />
                  <h2 className="font-serif text-lg font-semibold text-cream-100 mb-3">Your Wishlist</h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-mist)' }}>
                    View and manage your saved products.
                  </p>
                  <Link to="/wishlist" className="btn-primary flex items-center justify-center gap-2 w-fit mx-auto">
                    View Wishlist <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            )}

            {/* Settings */}
            {tab === 'settings' && (
              <Reveal>
                <div className="glass-card p-6 flex flex-col gap-5">
                  <h2 className="font-serif text-lg font-semibold text-cream-100">Account Settings</h2>
                  <div className="flex items-center justify-between py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                      <p className="text-sm font-medium text-cream-100">Email</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-mist)' }}>{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                      <p className="text-sm font-medium text-cream-100">Account Type</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-mist)' }}>
                        {profile?.role === 'admin' ? 'Administrator' : 'Customer Account'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button onClick={() => signOut()}
                      className="text-sm px-5 py-2.5 rounded-xl font-medium transition-all duration-200
                                 hover:bg-red-900/25"
                      style={{ color: '#f87171', border: '1px solid rgba(180,40,40,0.25)' }}>
                      Sign Out
                    </button>
                  </div>
                </div>
              </Reveal>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
