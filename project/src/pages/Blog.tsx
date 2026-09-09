import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Leaf, Tag } from 'lucide-react';
import { BLOG_POSTS } from '@/data/products';
import Reveal from '@/components/Reveal';

const CATEGORIES = ['All', 'Ayurvedic Wisdom', 'Nutrition & Wellness', 'Daily Ritual'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  return (
    <div className="page-bg min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16"
        style={{ background: 'transparent' }}>
        <div className="ambient-orb w-80 h-80 top-0 right-0 pointer-events-none"
          style={{ background: 'rgba(22,122,69,0.08)', animationDuration: '12s' }} />
        <div className="section-pad relative z-10">
          <Reveal>
            <p className="section-eyebrow">
              <Leaf className="w-3.5 h-3.5" />
              Vitamora Journal
            </p>
            <h1 className="section-title text-4xl sm:text-5xl mb-4">
              Wisdom, Wellness & Ritual
            </h1>
            <p className="section-subtitle text-base max-w-xl">
              Ayurvedic insights, botanical knowledge, and practical wellness guidance — written honestly, without hype.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-alt py-12 lg:py-16">
        <div className="section-pad">

          {/* Category filter */}
          <Reveal>
            <div className="flex gap-2 flex-wrap mb-10">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                             transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? 'rgba(22,122,69,0.25)' : 'rgba(255,255,255,0.05)',
                    border: `1.5px solid ${activeCategory === cat ? 'rgba(22,122,69,0.55)' : 'rgba(255,255,255,0.10)'}`,
                    color: activeCategory === cat ? 'var(--color-sage)' : 'var(--color-mist)',
                  }}>
                  {activeCategory === cat && <Tag className="w-3 h-3" />}
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Featured post */}
          {filtered[0] && (
            <Reveal>
              <Link to={`/blog/${filtered[0].slug}`}
                className="block group mb-8 outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 rounded-2xl">
                <div className="blog-card grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                  <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden"
                    style={{ background: 'rgba(22,62,38,0.60)' }}>
                    <img src={filtered[0].coverImage} alt={filtered[0].title}
                      loading="lazy"
                      className="blog-img w-full h-full object-cover opacity-80 group-hover:opacity-100
                                 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 badge-gold">{filtered[0].category}</span>
                  </div>
                  <div className="p-8 lg:p-10 flex flex-col justify-center gap-4">
                    <span className="badge-glass w-fit">Featured</span>
                    <h2 className="font-serif text-2xl lg:text-3xl font-bold text-cream-100
                                   group-hover:text-gold-300 transition-colors duration-300 leading-snug">
                      {filtered[0].title}
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                      {filtered[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-mist)' }}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {filtered[0].readTime} min read
                      </span>
                      <span>{new Date(filtered[0].publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-300
                                     group-hover:gap-2.5" style={{ color: 'var(--color-gold)' }}>
                      Read Article <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(1).map((post, i) => (
              <Reveal key={post.id} delay={i * 70}>
                <Link to={`/blog/${post.slug}`}
                  className="block group outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 rounded-2xl">
                  <div className="blog-card flex flex-col h-full">
                    <div className="relative aspect-[16/9] overflow-hidden"
                      style={{ background: 'rgba(22,62,38,0.60)' }}>
                      <img src={post.coverImage} alt={post.title} loading="lazy"
                        className="blog-img w-full h-full object-cover opacity-80 group-hover:opacity-100
                                   transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 badge-gold text-[10px]">{post.category}</span>
                    </div>
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <h3 className="font-serif text-base font-semibold text-cream-100 leading-snug
                                     group-hover:text-gold-300 transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-sm leading-relaxed flex-1 line-clamp-3"
                        style={{ color: 'var(--color-mist)' }}>{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-2"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--color-mist)' }}>
                          <Clock className="w-3 h-3" /> {post.readTime} min read
                        </span>
                        <span className="text-xs font-semibold flex items-center gap-1 transition-all group-hover:gap-1.5 duration-300"
                          style={{ color: 'var(--color-gold)' }}>
                          Read <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="glass-card p-16 text-center">
              <p className="text-base" style={{ color: 'var(--color-mist)' }}>
                No articles in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
