import { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Send, ChevronDown, Leaf, MessageSquare, Building2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Reveal from '@/components/Reveal';

const FAQS = [
  {
    q: 'Where do you ship to?',
    a: 'We currently ship across India. International shipping is available to select countries — please contact us for details on your location.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard delivery is 4–7 business days. Express delivery options are available at checkout for most pin codes.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 14 days of delivery for unopened products in their original packaging. Please contact our support team to initiate a return. We do not accept returns on opened products for hygiene reasons.',
  },
  {
    q: 'Are your products safe for daily use?',
    a: 'Our products are pure food-grade botanical powders suitable for daily use as part of a balanced diet. We recommend starting with a smaller amount. If you have specific medical conditions, please consult your healthcare provider before use.',
  },
  {
    q: 'Do you offer wholesale or bulk pricing?',
    a: 'Yes. We work with retailers, health food stores, wellness clinics, and distributors. Please use the form below and select "Partnership / B2B Enquiry" — our team will respond within 2 business days.',
  },
  {
    q: 'How should I store your products?',
    a: 'Store in a cool, dry place away from direct sunlight. Always reseal the packaging after each use. Do not expose to moisture or steam. Best consumed within 12 months of manufacture date shown on pack.',
  },
  {
    q: 'Are your products suitable for vegans?',
    a: 'Yes. All Vitamora products are 100% plant-derived and contain no animal-derived ingredients or processing aids.',
  },
  {
    q: 'Can I track my order?',
    a: 'Yes. Once your order is dispatched, you will receive a tracking number via email. You can also view your order status in your account under Order History.',
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    business_type: '', subject: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status,     setStatus]     = useState<'idle' | 'success' | 'error'>('idle');
  const [openFaq,    setOpenFaq]    = useState<number | null>(null);

  function setF(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); }

  const isPartnership = !!(form.company || form.business_type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isPartnership) {
        await supabase.from('partnership_enquiries').insert({
          name: form.name, company: form.company, email: form.email,
          phone: form.phone, business_type: form.business_type,
          message: form.message, enquiry_type: form.business_type || 'distributor',
        });
      } else {
        await supabase.from('contact_enquiries').insert({
          name: form.name, email: form.email, phone: form.phone,
          subject: form.subject, message: form.message, enquiry_type: 'customer_support',
        });
      }
      setStatus('success');
      setForm({ name: '', email: '', phone: '', company: '', business_type: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
    setSubmitting(false);
  }

  return (
    <div className="page-bg min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-16"
        style={{ background: 'transparent' }}>
        <div className="ambient-orb w-96 h-96 -top-20 right-0 pointer-events-none"
          style={{ background: 'rgba(22,122,69,0.08)', animationDuration: '12s' }} />
        <div className="section-pad relative z-10">
          <Reveal>
            <p className="section-eyebrow">
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Us
            </p>
            <h1 className="section-title text-4xl sm:text-5xl mb-4">
              We're Here to Help
            </h1>
            <p className="section-subtitle text-base max-w-xl">
              Questions about our products, orders, or partnerships — reach out and we'll get back to you promptly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Info cards + Form ── */}
      <section className="section-alt py-16 lg:py-20">
        <div className="section-pad">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left — Contact info */}
            <div className="space-y-4">
              <Reveal>
                <div className="glass-card p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="process-icon-ring">
                      <Mail className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase mb-0.5"
                        style={{ color: 'var(--color-sage)' }}>Customer Support</p>
                      <a href="mailto:care@vitamora.in" className="text-sm font-medium text-cream-100
                         hover:text-gold-300 transition-colors">care@vitamora.in</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="process-icon-ring">
                      <Building2 className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase mb-0.5"
                        style={{ color: 'var(--color-sage)' }}>Partnerships & B2B</p>
                      <a href="mailto:partners@vitamora.in" className="text-sm font-medium text-cream-100
                         hover:text-gold-300 transition-colors">partners@vitamora.in</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="process-icon-ring">
                      <Clock className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase mb-0.5"
                        style={{ color: 'var(--color-sage)' }}>Response Time</p>
                      <p className="text-sm text-cream-100">Mon–Fri, 9am–6pm IST</p>
                      <p className="text-xs" style={{ color: 'var(--color-mist)' }}>Within 1–2 business days</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="glass-card p-5">
                  <h3 className="font-serif text-base font-semibold text-cream-100 mb-3">
                    B2B & Distribution
                  </h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-mist)' }}>
                    We work with health food retailers, wellness clinics, pharmacies, and international distributors. Fill in the form and mention your business type.
                  </p>
                  <div className="flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                    <span className="text-xs" style={{ color: 'var(--color-mist)' }}>
                      MOQ and wholesale pricing available
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-2">
              <Reveal delay={100}>
                <div className="glass-card p-7">
                  <h2 className="font-serif text-xl font-semibold text-cream-100 mb-6">
                    Send Us a Message
                  </h2>

                  {status === 'success' ? (
                    <div className="flex flex-col items-center gap-4 py-10 text-center">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(22,122,69,0.20)', border: '1.5px solid rgba(22,122,69,0.40)' }}>
                        <Send className="w-6 h-6" style={{ color: 'var(--color-sage)' }} />
                      </div>
                      <h3 className="font-serif text-xl font-semibold text-cream-100">Message Sent!</h3>
                      <p className="text-sm" style={{ color: 'var(--color-mist)' }}>
                        Thank you for reaching out. We'll respond within 1–2 business days.
                      </p>
                      <button onClick={() => setStatus('idle')} className="btn-outline btn-sm mt-2">
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="label-glass">Name *</label>
                          <input required value={form.name} onChange={e => setF('name', e.target.value)}
                            className="input-glass" placeholder="Your full name" />
                        </div>
                        <div>
                          <label className="label-glass">Email *</label>
                          <input required type="email" value={form.email} onChange={e => setF('email', e.target.value)}
                            className="input-glass" placeholder="your@email.com" />
                        </div>
                        <div>
                          <label className="label-glass">Phone</label>
                          <input type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)}
                            className="input-glass" placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div>
                          <label className="label-glass">Company / Organisation</label>
                          <input value={form.company} onChange={e => setF('company', e.target.value)}
                            className="input-glass" placeholder="Optional — for B2B enquiries" />
                        </div>
                      </div>

                      {form.company && (
                        <div>
                          <label className="label-glass">Business Type</label>
                          <select value={form.business_type} onChange={e => setF('business_type', e.target.value)}
                            className="input-glass">
                            <option value="">Select…</option>
                            <option value="retailer">Health Food Retailer</option>
                            <option value="pharmacy">Pharmacy / Medical Store</option>
                            <option value="clinic">Wellness Clinic</option>
                            <option value="distributor">Distributor</option>
                            <option value="export">Export / International</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      )}

                      {!form.company && (
                        <div>
                          <label className="label-glass">Subject</label>
                          <input value={form.subject} onChange={e => setF('subject', e.target.value)}
                            className="input-glass" placeholder="What is your query about?" />
                        </div>
                      )}

                      <div>
                        <label className="label-glass">Message *</label>
                        <textarea required value={form.message} onChange={e => setF('message', e.target.value)}
                          rows={5} className="input-glass resize-none"
                          placeholder="Tell us how we can help…" />
                      </div>

                      {status === 'error' && (
                        <p className="text-sm" style={{ color: '#f87171' }}>
                          Something went wrong. Please try again or email us directly.
                        </p>
                      )}

                      <button type="submit" className="btn-primary w-fit gap-2" disabled={submitting}>
                        <Send className="w-4 h-4" />
                        {submitting ? 'Sending…' : 'Send Message'}
                      </button>

                      {isPartnership && (
                        <p className="text-xs" style={{ color: 'var(--color-sage)' }}>
                          Your enquiry will be routed to our partnerships team.
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Gold divider */}
      <div className="section-pad"><div className="gold-divider" /></div>

      {/* ── FAQ ── */}
      <section className="section-dark py-16 lg:py-20">
        <div className="section-pad">
          <Reveal>
            <div className="text-center mb-12">
              <p className="section-eyebrow justify-center">
                <MessageSquare className="w-3.5 h-3.5" />
                Frequently Asked Questions
              </p>
              <h2 className="section-title text-3xl sm:text-4xl">
                Common Questions
              </h2>
            </div>
          </Reveal>
          <div className="max-w-3xl mx-auto space-y-2">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="accordion-item">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={openFaq === i}>
                    <span className="font-serif text-base font-semibold text-cream-100">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--color-gold)' }} />
                  </button>
                  <div className={`faq-answer ${openFaq === i ? 'open' : ''} px-5 pb-5`}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
