import { Link } from 'react-router-dom';
import { Leaf, Sprout, ShieldCheck, Heart, ArrowRight, ChevronRight } from 'lucide-react';
import Reveal from '@/components/Reveal';

const VALUES = [
  {
    icon: Sprout,
    title: 'Honest Sourcing',
    desc: 'We work with growers and suppliers we trust — people who share our commitment to responsible, ethical agricultural practices. We believe knowing where your ingredients come from is not optional.',
  },
  {
    icon: Leaf,
    title: 'Single Ingredient',
    desc: 'No blends. No fillers. No proprietary mixes. Each Vitamora product contains exactly one ingredient so you always know precisely what you are consuming and why.',
  },
  {
    icon: ShieldCheck,
    title: 'Minimal Processing',
    desc: 'Our botanicals are dried at carefully controlled low temperatures and milled to a fine powder — designed to protect the natural character of each ingredient at every stage.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Verification',
    desc: 'Every batch is subject to appropriate identity, purity, and safety testing before it reaches our packaging line. We do not cut corners on quality at any stage.',
  },
  {
    icon: Heart,
    title: 'Botanical Heritage',
    desc: 'India has one of the world\'s oldest and most sophisticated botanical wellness traditions. Vitamora is rooted in that knowledge — bringing ancient Ayurvedic wisdom into everyday modern life.',
  },
  {
    icon: Leaf,
    title: 'Modern Accessibility',
    desc: 'Traditional Ayurvedic botanicals should be easy to use, affordable, and available to everyone. Our goal is to bring premium botanical wellness within reach of every household.',
  },
];

const TIMELINE = [
  {
    year: '2022',
    title: 'The Beginning',
    desc: 'Vitamora was founded with a simple question: why is it so hard to find genuinely pure, single-ingredient botanical powders at a fair price in India?',
  },
  {
    year: '2023',
    title: 'First Products',
    desc: 'After months of sourcing research and quality trials, we launched our first two products — Moringa Leaf Powder and Amla Powder — to an encouraging early response.',
  },
  {
    year: '2024',
    title: 'Growing Trust',
    desc: 'We expanded our distribution, strengthened our supplier relationships, and began building a community of customers who share our commitment to honest, natural wellness.',
  },
  {
    year: '2025',
    title: 'Quality Standards',
    desc: 'We formalised our quality verification processes, achieved FSSAI registration, and adopted GMP-aligned production standards across our entire supply chain.',
  },
  {
    year: '2026',
    title: 'Today & Beyond',
    desc: 'We continue to grow thoughtfully — adding new botanicals, improving our packaging, and working towards making Vitamora a trusted name in Ayurvedic botanical wellness worldwide.',
  },
];

export default function About() {
  return (
    <div className="page-bg min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pb-28"
        style={{ background: 'transparent' }}>
        <div className="ambient-orb w-[500px] h-[500px] -top-40 -right-40 pointer-events-none"
          style={{ background: 'rgba(22,122,69,0.09)', animationDuration: '11s' }} />
        <div className="ambient-orb w-80 h-80 bottom-0 left-0 -translate-x-1/3 pointer-events-none"
          style={{ background: 'rgba(201,164,92,0.06)', animationDuration: '14s', animationDelay: '4s' }} />
        <div className="section-pad relative z-10">
          <Reveal>
            <p className="section-eyebrow">
              <Leaf className="w-3.5 h-3.5" />
              Our Story
            </p>
            <h1 className="section-title text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
              Rooted in Nature.<br />Guided by Tradition.
            </h1>
            <p className="section-subtitle text-base lg:text-lg max-w-2xl leading-relaxed">
              Vitamora began with a conviction that Ayurvedic botanical wellness should be honest, accessible, and free from compromise. We source single ingredients, process them gently, verify every batch, and bring them directly to you — nothing more, nothing less.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="gold-divider section-pad" />

      {/* ── Mission ── */}
      <section className="section-alt py-20 lg:py-28">
        <div className="section-pad">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div>
                <p className="section-eyebrow">
                  <Leaf className="w-3.5 h-3.5" />
                  Our Mission
                </p>
                <h2 className="section-title text-3xl sm:text-4xl mb-6">
                  To make pure Ayurvedic botanicals a natural part of everyday life.
                </h2>
                <p className="section-subtitle text-base leading-relaxed mb-6">
                  India's botanical tradition is thousands of years old — a vast and sophisticated body of knowledge about plants, their properties, and their role in human wellbeing. Yet today, most botanical supplements are full of fillers, blends, and synthetic additives that dilute or obscure the natural ingredient.
                </p>
                <p className="section-subtitle text-base leading-relaxed mb-8">
                  We believe people deserve better. Vitamora exists to offer something genuinely pure: single-ingredient botanical powders, gently processed, honestly labelled, and made available at a price that reflects their true value — not artificial scarcity.
                </p>
                <Link to="/products" className="btn-primary group">
                  Explore Our Products
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]"
                style={{ background: 'linear-gradient(145deg,rgba(22,62,38,0.60),rgba(11,46,26,0.80))' }}>
                <img
                  src="https://images.pexels.com/photos/4113831/pexels-photo-4113831.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Fresh Moringa leaves — botanical sourcing"
                  className="w-full h-full object-cover opacity-80"
                  loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="badge-gold">Ethically Sourced</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Ayurvedic Heritage ── */}
      <section className="section-dark py-20 lg:py-28">
        <div className="section-pad">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center mb-14">
              <p className="section-eyebrow justify-center">
                <Sprout className="w-3.5 h-3.5" />
                Ayurvedic Heritage
              </p>
              <h2 className="section-title text-3xl sm:text-4xl mb-6">
                4,000 Years of Botanical Wisdom
              </h2>
              <p className="section-subtitle text-base leading-relaxed">
                Ayurveda — the science of life — is one of humanity's oldest and most comprehensive systems of natural wellness. For millennia, Indian physicians and healers documented the properties of hundreds of plants, developed processing methods to preserve their potency, and integrated botanical preparations into everyday life.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                image: 'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'Moringa in Ayurveda',
                desc: 'Known as Shigru in Sanskrit, Moringa oleifera is referenced in ancient Ayurvedic texts as a plant of exceptional utility — nutritive, digestive, and restorative.',
              },
              {
                image: 'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'Amla — The Fruit of Longevity',
                desc: 'Amalaki (Amla) is one of the most sacred plants in Ayurvedic pharmacopoeia. Believed to be the first tree to appear on earth, it is central to the famous Triphala formulation.',
              },
              {
                image: 'https://images.pexels.com/photos/6045082/pexels-photo-6045082.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'The Rasayana Tradition',
                desc: 'Rasayana — the Ayurvedic science of rejuvenation — uses carefully prepared botanical substances to support vitality, immunity, and longevity as part of a balanced lifestyle.',
              },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="glass-card overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden"
                    style={{ background: 'rgba(4, 247, 101, 0.6)' }}>
                    <img src={card.image} alt={card.title} loading="lazy"
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="font-serif text-base font-semibold text-cream-100">{card.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>{card.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="section-alt py-20 lg:py-28">
        <div className="section-pad">
          <Reveal>
            <div className="text-center mb-14">
              <p className="section-eyebrow justify-center">
                <Heart className="w-3.5 h-3.5" />
                What We Stand For
              </p>
              <h2 className="section-title text-3xl sm:text-4xl">
                Our Principles
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v, i) => (
              <Reveal key={i} delay={i * 70}>
                <div className="glass-card p-6 flex flex-col gap-4 h-full">
                  <div className="process-icon-ring">
                    <v.icon className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-cream-100">{v.title}</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--color-mist)' }}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section className="section-dark py-20 lg:py-28">
        <div className="section-pad">
          <Reveal>
            <div className="text-center mb-14">
              <p className="section-eyebrow justify-center">
                <Sprout className="w-3.5 h-3.5" />
                Our Journey
              </p>
              <h2 className="section-title text-3xl sm:text-4xl">
                Growing Thoughtfully
              </h2>
            </div>
          </Reveal>
          <div className="max-w-2xl mx-auto">
            {TIMELINE.map((item, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="flex gap-5 pb-10 last:pb-0 relative">
                  {/* Line */}
                  {i < TIMELINE.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-px"
                      style={{ background: 'rgba(22,122,69,0.25)' }} />
                  )}
                  {/* Dot */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10"
                    style={{ background: 'rgba(22,122,69,0.20)', border: '1.5px solid rgba(22,122,69,0.45)' }}>
                    <span className="text-[10px] font-bold" style={{ color: 'var(--color-gold)' }}>
                      {item.year.slice(2)}
                    </span>
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--color-gold)' }}>
                        {item.year}
                      </span>
                      <h3 className="font-serif text-base font-semibold text-cream-100">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-alt py-16 lg:py-20">
        <div className="section-pad">
          <Reveal>
            <div className="glass-card p-10 lg:p-14 text-center max-w-2xl mx-auto"
              style={{ background: 'linear-gradient(145deg,rgba(22,62,38,0.60),rgba(11,46,26,0.78))' }}>
              <p className="section-eyebrow justify-center mb-4">
                <Leaf className="w-3.5 h-3.5" />
                Begin Your Ritual
              </p>
              <h2 className="section-title text-2xl sm:text-3xl mb-5">
                Experience Vitamora for Yourself
              </h2>
              <p className="section-subtitle text-sm mb-8 max-w-md mx-auto">
                Pure, single-ingredient botanical powders — ready to become part of your daily wellness practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/products" className="btn-gold group">
                  Shop Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                </Link>
                <Link to="/quality" className="btn-outline">
                  Our Quality Process
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
