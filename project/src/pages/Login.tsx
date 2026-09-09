import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate   = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err.includes('Invalid') ? 'Incorrect email or password.' : err);
    } else {
      navigate('/account');
    }
  }

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full overflow-hidden"
              style={{ boxShadow: '0 0 0 1.5px rgba(201,164,92,0.35)' }}>
              <img src="/logo.png" alt="Vitamora" className="w-full h-full object-cover"
                style={{ mixBlendMode: 'screen' }} />
            </div>
            <span className="font-serif text-2xl font-semibold text-cream-100
                             group-hover:text-gold-300 transition-colors duration-300">
              Vitamora
            </span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-mist)' }}>
            Welcome back
          </p>
        </div>

        <div className="glass-card p-8">
          <h1 className="font-serif text-2xl font-bold text-cream-100 mb-6">Sign In</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label-glass">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="input-glass" placeholder="your@email.com" autoComplete="email" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label-glass !mb-0">Password</label>
                <Link to="/forgot-password"
                  className="text-xs transition-colors duration-200 hover:text-cream-100"
                  style={{ color: 'var(--color-gold)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="input-glass pr-10" placeholder="••••••••" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 hover:text-cream-100"
                  style={{ color: 'var(--color-mist)' }} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(180,40,40,0.15)', border: '1px solid rgba(180,40,40,0.30)', color: '#f87171' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full justify-center gap-2 mt-1" disabled={loading}>
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-mist)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold transition-colors duration-200 hover:text-cream-100"
                style={{ color: 'var(--color-gold)' }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
