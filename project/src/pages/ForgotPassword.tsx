import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (err) { setError(err.message); } else { setSent(true); }
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
        </div>

        <div className="glass-card p-8">
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(22,122,69,0.20)', border: '1.5px solid rgba(22,122,69,0.40)' }}>
                <Mail className="w-6 h-6" style={{ color: 'var(--color-sage)' }} />
              </div>
              <h2 className="font-serif text-xl font-bold text-cream-100">Check Your Email</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                We've sent a password reset link to <span className="text-cream-100 font-medium">{email}</span>.
                Please check your inbox and follow the instructions.
              </p>
              <Link to="/login" className="btn-outline btn-sm mt-2 flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-cream-100"
                style={{ color: 'var(--color-mist)' }}>
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
              <h1 className="font-serif text-2xl font-bold text-cream-100 mb-2">Reset Password</h1>
              <p className="text-sm mb-6" style={{ color: 'var(--color-mist)' }}>
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="label-glass">Email *</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className="input-glass" placeholder="your@email.com" />
                </div>
                {error && (
                  <p className="text-sm px-4 py-2.5 rounded-xl"
                    style={{ background: 'rgba(180,40,40,0.15)', border: '1px solid rgba(180,40,40,0.30)', color: '#f87171' }}>
                    {error}
                  </p>
                )}
                <button type="submit" className="btn-primary w-full justify-center gap-2" disabled={loading}>
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
