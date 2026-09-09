import { Link } from 'react-router-dom';
import {
  Sprout, Wind, Factory, TestTube, PackageCheck, ShieldCheck,
  ArrowRight, Leaf, CheckCircle,
} from 'lucide-react';
import Reveal from '@/components/Reveal';

const STEPS = [
  {
    num: '01', icon: Sprout,
    title: 'Ethical Sourcing & Harvest',
    image: 'https://images.pexels.com/photos/4113831/pexels-photo-4113831.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'We work directly with growers who share our commitment to responsible agricultural practices. Moringa leaves are harvested at peak maturity; Amla fruits are selected for size, colour, and ripeness. We visit our source partners to verify practices and maintain accountability throughout the supply chain.',
    points: ['Supplier verification and relationship building', 'Harvest at optimal botanical maturity', 'Responsible land and agricultural practices', 'Transparent supply chain documentation'],
  },
  {
    num: '02', icon: Wind,
    title: 'Cleaning & Preparation',
    image: 'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'After harvest, all botanicals undergo careful sorting and cleaning to remove any foreign matter, damaged material, or sub-standard specimens. This stage ensures only the finest quality raw material proceeds to drying and processing.',
    points: ['Manual and mechanical sorting', 'Foreign matter removal', 'Quality inspection at intake', 'Rejection of sub-standard material'],
  },
  {
    num: '03', icon: Wind,
    title: 'Gentle Low-Temperature Drying',
    image: 'https://images.pexels.com/photos/6045082/pexels-photo-6045082.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'Drying is one of the most critical stages in botanical powder production. We use carefully controlled low-temperature drying processes designed to remove moisture while protecting the natural composition of each ingredient. High heat can degrade heat-sensitive compounds — our process is designed to prevent this.',
    points: ['Controlled low-temperature drying', 'Process monitoring at each stage', 'Protection of heat-sensitive botanicals', 'Consistent moisture level targets'],
  },
  {
    num: '04', icon: Factory,
    title: 'Precision Milling',
    image: 'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'Dried botanicals are milled to a consistent fine powder using food-grade equipment. We target specific mesh sizes to ensure a smooth, even texture that mixes easily into liquids and foods. Equipment is cleaned and verified between batches to prevent cross-contamination.',
    points: ['Food-grade milling equipment', 'Target mesh size for smooth texture', 'Equipment cleaning between batches', 'Batch segregation and traceability'],
  },
  {
    num: '05', icon: TestTube,
    title: 'Quality Verification',
    image: 'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'Before any batch is approved for packaging, it undergoes appropriate quality and safety verification. This includes botanical identity confirmation, moisture and particle size testing, and food safety screening. We do not release batches that do not meet our quality specifications.',
    points: ['Botanical identity verification', 'Moisture content testing', 'Particle size analysis', 'Food safety screening per applicable standards'],
  },
  {
    num: '06', icon: PackageCheck,
    title: 'Packaging & Sealed Freshness',
    image: 'https://images.pexels.com/photos/7208607/pexels-photo-7208607.jpeg?auto=compress&cs=tinysrgb&w=800',
    desc: 'Approved batches are packed in food-grade, resealable packaging designed to protect against moisture, light, and oxygen — the three main factors that degrade botanical powder quality over time. Each pack carries a clear label showing ingredients, batch information, and best-before date.',
    points: ['Food-grade, resealable packaging', 'Protection from moisture, light, and oxygen', 'Clear and accurate labelling', 'Batch traceability information on pack'],
  },
];

const STANDARDS = [
  { label: 'FSSAI Registered',  note: 'Food Safety and Standards Authority of India' },
  { label: 'GMP Standards',     note: 'Good Manufacturing Practice aligned production' },
  { label: 'Quality Verified',  note: 'Batch-level testing before release' },
  { label: '100% Vegan',        note: 'No animal-derived ingredients or processes' },
  { label: 'No Preservatives',  note: 'Clean, additive-free formulations' },
  { label: 'Single Ingredient', note: 'Full transparency — one ingredient per product' },
];

export default function Quality() {
  return (
    <div className="page-bg min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-20"
        style={{ background: 'transparent' }}>
        <div className="ambient-orb w-96 h-96 top-0 right-0 translate-x-1/3 pointer-events-none"
          style={{ background: 'rgba(22,122,69,0.09)', animationDuration: '10s' }} />
        <div className="section-pad relative z-10">
          <Reveal>
            <p className="section-eyebrow">
              <ShieldCheck className="w-3.5 h-3.5" />
              Quality Process
            </p>
            <h1 className="section-title text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
              Purity You Can Trace.
            </h1>
            <p className="section-subtitle text-base lg:text-lg max-w-2xl leading-relaxed">
              Every step in our process is designed with one purpose: to deliver a product that is as pure, potent, and honest as the botanical it contains. Here is exactly how we do it.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="gold-divider section-pad" />

      {/* ── Process steps ── */}
      <section className="section-alt py-20 lg:py-28">
        <div className="section-pad">
          <div className="space-y-20 lg:space-y-28">
            {STEPS.map((step, i) => (
              <Reveal key={i} delay={60}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center
                  ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  {/* Image */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3]"
                    style={{ background: 'linear-gradient(145deg,rgba(22,62,38,0.70),rgba(11,46,26,0.85))' }}>
                    <img src={step.image} alt={step.title} loading="lazy"
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="font-serif text-4xl font-bold"
                        style={{ color: 'rgba(201,164,92,0.25)' }}>
                        {step.num}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="process-icon-ring">
                        <step.icon className="w-5 h-5" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                      </div>
                      <span className="font-serif text-sm font-light" style={{ color: 'rgba(201,164,92,0.50)' }}>
                        Step {step.num}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mb-4">
                      {step.title}
                    </h2>
                    <p className="text-sm lg:text-base leading-relaxed mb-6"
                      style={{ color: 'var(--color-mist)' }}>
                      {step.desc}
                    </p>
                    <ul className="space-y-2">
                      {step.points.map((pt, pi) => (
                        <li key={pi} className="flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5"
                            style={{ color: 'var(--color-sage)' }} strokeWidth={1.5} />
                          <span className="text-sm" style={{ color: 'var(--color-mist)' }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quality Standards ── */}
      <section className="section-dark py-20 lg:py-24">
        <div className="section-pad">
          <Reveal>
            <div className="text-center mb-12">
              <p className="section-eyebrow justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
                Quality Standards
              </p>
              <h2 className="section-title text-3xl sm:text-4xl mb-4">
                Our Commitment
              </h2>
              <p className="section-subtitle text-sm max-w-lg mx-auto">
                We operate to the following quality and compliance standards. Where we hold formal certifications, these are indicated below.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STANDARDS.map((s, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="glass-card p-5 text-center flex flex-col gap-2 items-center">
                  <ShieldCheck className="w-6 h-6" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                  <h3 className="font-serif text-sm font-semibold text-cream-100 leading-tight">{s.label}</h3>
                  <p className="text-2xs leading-tight" style={{ color: 'var(--color-mist)' }}>{s.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="text-center text-xs mt-8 max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'rgba(182,200,179,0.50)' }}>
              * Quality Standards listed reflect our operational practices and commitments. Formal third-party certification status is indicated individually. We operate under FSSAI registration and follow GMP-aligned practices. We do not make claims beyond what is accurate and verifiable.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-alt py-16">
        <div className="section-pad">
          <Reveal>
            <div className="text-center">
              <h2 className="section-title text-2xl sm:text-3xl mb-5">
                Ready to experience the difference?
              </h2>
              <Link to="/products" className="btn-primary group">
                Shop Our Products
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
