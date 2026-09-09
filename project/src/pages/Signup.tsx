import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  function setF(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6)   { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    const { error: err } = await signUp(form.email, form.password, form.fullName, form.phone);
    setLoading(false);
    if (err) { setError(err); } else { navigate('/account'); }
  }

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full overflow-hidden"
              style={{ boxShadow: '0 0 0 1.5px rgba(201,164,92,0.35)' }}>
              <img src="/logo.png" alt="Vitamora" className="w-full h-full object-cover"
                style={{ mixBlendMode: 'screen' }} />
            </div>
            <span className="font-serif text-2xl font-semibold text-cream-100
                             group-hover:text-gold-300 transition-colors duration-300">Vitamora</span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-mist)' }}>Create your account</p>
        </div>

        <div className="glass-card p-8">
          <h1 className="font-serif text-2xl font-bold text-cream-100 mb-6">Create Account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label-glass">Full Name *</label>
              <input required value={form.fullName} onChange={e => setF('fullName', e.target.value)}
                className="input-glass" placeholder="Your full name" />
            </div>
            <div>
              <label className="label-glass">Email *</label>
              <input type="email" required value={form.email} onChange={e => setF('email', e.target.value)}
                className="input-glass" placeholder="your@email.com" />
            </div>
            <div>
              <label className="label-glass">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)}
                className="input-glass" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="label-glass">Password *</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required
                  value={form.password} onChange={e => setF('password', e.target.value)}
                  className="input-glass pr-10" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-cream-100 transition-colors"
                  style={{ color: 'var(--color-mist)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label-glass">Confirm Password *</label>
              <input type={showPw ? 'text' : 'password'} required
                value={form.confirm} onChange={e => setF('confirm', e.target.value)}
                className="input-glass" placeholder="Repeat password" />
            </div>

            {error && (
              <p className="text-sm px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(180,40,40,0.15)', border: '1px solid rgba(180,40,40,0.30)', color: '#f87171' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full justify-center gap-2 mt-1" disabled={loading}>
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-mist)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:text-cream-100 transition-colors"
                style={{ color: 'var(--color-gold)' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
