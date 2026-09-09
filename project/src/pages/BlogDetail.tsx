import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowLeft, ChevronRight, Leaf, Tag } from 'lucide-react';
import { BLOG_POSTS } from '@/data/products';
import Reveal from '@/components/Reveal';

const ARTICLE_CONTENT: Record<string, string[]> = {
  'benefits-of-amla-for-hair-care': [
    'Amla — known botanically as Emblica officinalis and commonly as Indian Gooseberry — has been central to Ayurvedic hair care practice for thousands of years. Its use in Ayurveda spans both topical applications (hair oils, pastes, rinses) and internal consumption as a nutritional tonic.',
    'From a nutritional perspective, Amla is notable for its exceptionally high Vitamin C content. Vitamin C plays a role in collagen synthesis, which is important for the structural integrity of hair follicles. It is also a powerful antioxidant, helping to protect cells from oxidative stress.',
    'Amla also contains tannins, gallic acid, and a range of polyphenols — compounds that have been associated with various beneficial properties in traditional and modern botanical research.',
    'In traditional Ayurvedic practice, Amla is used both internally and as part of oil-based preparations for scalp massage. Amla oil (Amla infused into a carrier such as coconut or sesame oil) is a long-standing traditional preparation used widely across South Asia for scalp nourishment.',
    'To incorporate Amla powder into your wellness routine, consider: mixing half a teaspoon into warm water with honey each morning; blending into a smoothie or buttermilk; or preparing a simple hair treatment by combining Amla powder with a carrier oil.',
    'As with all wellness practices, individual responses vary. Amla is a food-grade botanical, not a medicine. If you have specific health concerns, consult a qualified healthcare or Ayurvedic practitioner.',
  ],
  'moringa-vs-multivitamin': [
    'The comparison between botanical whole-food supplements and synthetic multivitamins is a genuinely interesting area of nutritional science — and one worth approaching with care and honesty.',
    'Moringa leaf powder is a whole-food botanical. It contains naturally occurring nutrients in the forms and concentrations that exist in the leaf itself. These include iron, calcium, potassium, Vitamins A, C and E, and plant-based protein — among other compounds.',
    'Synthetic multivitamins, by contrast, contain isolated and often synthetically produced versions of vitamins and minerals, typically at doses significantly higher than those found in natural foods. This has both advantages and limitations.',
    'The advantage of multivitamins is precise, measurable dosing — you know exactly how much Vitamin D or B12 you are consuming. The limitations include questions about bioavailability (how well synthetic forms are absorbed), the absence of co-occurring compounds that may influence absorption, and the risk of exceeding safe intake levels for certain nutrients.',
    'Whole-food botanicals like Moringa work differently. The nutrients are present in lower, more naturally distributed amounts alongside hundreds of other plant compounds. Some researchers argue this matrix effect may support better utilisation, though this is an active area of research.',
    'The honest answer is: they serve different purposes. A targeted synthetic supplement may be appropriate for diagnosed deficiencies. A botanical like Moringa is better understood as a nutritional complement — a way to add more plant-based nutrition to a balanced diet, not to correct clinical deficiencies.',
    'Vitamora does not make medical claims for our products. Our botanicals are food supplements intended to be part of a balanced diet and healthy lifestyle. For specific nutritional advice, please consult a registered dietitian or healthcare provider.',
  ],
  'botanical-powders-morning-routine': [
    'One of the simplest ways to build a consistent wellness practice is to attach new habits to existing routines — and the morning routine is particularly powerful for this purpose.',
    'Here are some practical, evidence-informed ways to incorporate Moringa or Amla powder into your mornings:',
    'Warm Water Ritual: The simplest approach. Add half a teaspoon of Moringa or Amla powder to a glass of warm (not boiling) water. Stir well and drink. Some people add a squeeze of lemon or a small amount of honey. This is a traditional Ayurvedic preparation method and an easy way to start.',
    'Smoothie Addition: Both Moringa and Amla blend easily into smoothies. Moringa has a mild grassy flavour that pairs well with banana, mango, or spinach. Amla has a tart, slightly astringent taste that works well with sweeter fruits.',
    'Yogurt or Oats Bowl: Stirring either powder into plain yogurt or oatmeal is another easy approach. The natural fats in yogurt may support absorption of fat-soluble compounds.',
    'Herbal Tea: Add a small amount to herbal tea (chamomile, tulsi, or ginger work well). Avoid adding to very hot water as extreme heat may degrade some heat-sensitive compounds.',
    'Start with a small amount — half a teaspoon — and observe how your body responds before increasing. Consistency over time matters more than quantity on any given day.',
    'Remember that botanical powders are food supplements, not medicines. They work best as part of a genuinely balanced diet and healthy lifestyle, not as a substitute for either.',
  ],
};

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);
  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);
  const paragraphs = ARTICLE_CONTENT[slug ?? ''] ?? [];

  if (!post) return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
      <Leaf className="w-16 h-16 opacity-20" style={{ color: 'var(--color-sage)' }} />
      <h1 className="font-serif text-3xl font-semibold text-cream-100">Article not found</h1>
      <Link to="/blog" className="btn-primary">Back to Blog</Link>
    </div>
  );

  return (
    <div className="page-bg min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-0"
        style={{ background: 'transparent' }}>
        <div className="section-pad pt-6 pb-10">
          <Reveal>
            <Link to="/blog" className="flex items-center gap-1.5 text-sm mb-6 transition-colors duration-200
              hover:text-cream-100" style={{ color: 'var(--color-mist)' }}>
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="badge-gold">{post.category}</span>
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-mist)' }}>
                <Clock className="w-3 h-3" /> {post.readTime} min read
              </span>
              <span className="text-xs" style={{ color: 'var(--color-mist)' }}>
                {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-100 max-w-3xl
                           leading-tight mb-6">
              {post.title}
            </h1>
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--color-mist)' }}>
              {post.excerpt}
            </p>
          </Reveal>
        </div>
        {/* Cover image */}
        <div className="relative aspect-[21/8] overflow-hidden"
          style={{ background: 'rgba(22,62,38,0.60)' }}>
          <img src={post.coverImage} alt={post.title}
            className="w-full h-full object-cover opacity-75" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />
        </div>
      </section>

      {/* Article body */}
      <section className="section-alt py-12 lg:py-16">
        <div className="section-pad">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-16 max-w-5xl mx-auto">

            {/* Body */}
            <article>
              {paragraphs.length > 0 ? (
                <div className="space-y-5">
                  {paragraphs.map((p, i) => (
                    <Reveal key={i} delay={i * 40}>
                      <p className="text-base leading-[1.85]" style={{ color: 'var(--color-mist)' }}>{p}</p>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <Reveal>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                    Full article content coming soon.
                  </p>
                </Reveal>
              )}

              {/* Disclaimer */}
              <Reveal delay={200}>
                <div className="mt-10 p-5 rounded-xl text-xs leading-relaxed"
                  style={{ background: 'rgba(201,164,92,0.07)', border: '1px solid rgba(201,164,92,0.18)',
                           color: 'rgba(182,200,179,0.55)' }}>
                  <strong style={{ color: 'rgba(201,164,92,0.70)' }}>Disclaimer:</strong> This article is for informational purposes only and does not constitute medical advice. Vitamora products are food supplements intended to complement a balanced diet. They are not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before making changes to your health routine.
                </div>
              </Reveal>
            </article>

            {/* Sidebar */}
            <aside className="space-y-5">
              <Reveal>
                <div className="glass-card p-5 sticky top-24">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-4"
                    style={{ color: 'var(--color-gold)' }}>Written By</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(22,122,69,0.25)', border: '1px solid rgba(22,122,69,0.35)' }}>
                      <Leaf className="w-4 h-4" style={{ color: 'var(--color-sage)' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cream-100">{post.author}</p>
                      <p className="text-xs" style={{ color: 'var(--color-mist)' }}>Vitamora Team</p>
                    </div>
                  </div>
                  <div className="my-4" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-2xs px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(22,122,69,0.15)', border: '1px solid rgba(22,122,69,0.25)',
                                 color: 'var(--color-sage)' }}>
                        <Tag className="w-2.5 h-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div className="glass-card p-5">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-4"
                    style={{ color: 'var(--color-gold)' }}>Shop Related</p>
                  <div className="space-y-3">
                    {[
                      { name: 'Moringa Leaf Powder', slug: 'moringa-leaf-powder' },
                      { name: 'Amla Powder', slug: 'amla-powder' },
                    ].map(p => (
                      <Link key={p.slug} to={`/products/${p.slug}`}
                        className="flex items-center justify-between group">
                        <span className="text-sm text-cream-100 group-hover:text-gold-300 transition-colors duration-200">
                          {p.name}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 duration-200"
                          style={{ color: 'var(--color-mist)' }} />
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="section-dark py-12 lg:py-16">
          <div className="section-pad">
            <Reveal>
              <h2 className="font-serif text-2xl font-semibold text-cream-100 mb-8">
                More from the Journal
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 70}>
                  <Link to={`/blog/${p.slug}`}
                    className="block group outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60 rounded-2xl">
                    <div className="blog-card flex flex-col h-full">
                      <div className="relative aspect-[16/9] overflow-hidden"
                        style={{ background: 'rgba(22,62,38,0.60)' }}>
                        <img src={p.coverImage} alt={p.title} loading="lazy"
                          className="blog-img w-full h-full object-cover opacity-80
                                     group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <span className="text-2xs font-semibold tracking-widest uppercase"
                          style={{ color: 'var(--color-sage)' }}>{p.category}</span>
                        <h3 className="font-serif text-sm font-semibold text-cream-100 leading-snug
                                       group-hover:text-gold-300 transition-colors duration-300">
                          {p.title}
                        </h3>
                        <span className="text-xs flex items-center gap-1 mt-auto pt-2"
                          style={{ color: 'var(--color-mist)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                          <Clock className="w-3 h-3" /> {p.readTime} min
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
