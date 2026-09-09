import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, X, ChevronDown, Leaf, Star, Grid3X3, List,
} from 'lucide-react';
import { supabase, type Product, type ProductImage, type Category } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Reveal from '@/components/Reveal';
import { LOCAL_PRODUCTS } from '@/data/products';

const SORT_OPTIONS = [
  { value: 'featured',    label: 'Featured' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'price-asc',   label: 'Price: Low to High' },
  { value: 'price-desc',  label: 'Price: High to Low' },
  { value: 'newest',      label: 'Newest' },
];

const WEIGHT_OPTIONS = ['100g', '200g', '500g'];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState<(Product & { images?: ProductImage[]; category?: Category | null })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const q        = searchParams.get('q')        ?? '';
  const cat      = searchParams.get('category') ?? '';
  const sort     = searchParams.get('sort')     ?? 'featured';
  const maxPrice = Number(searchParams.get('maxPrice') ?? 2000);
  const minRating = Number(searchParams.get('minRating') ?? 0);
  const weight   = searchParams.get('weight')   ?? '';

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  }
  function clearFilters() { setSearchParams({}); }

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*, product_images(*), category:categories(*)').eq('is_active', true).order('created_at', { ascending: true }),
      supabase.from('categories').select('*').order('name'),
    ]).then(([{ data: prods }, { data: cats }]) => {
      setProducts(prods ?? []);
      setCategories(cats ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const src = products.length > 0 ? products : LOCAL_PRODUCTS.map(lp => ({
      id: lp.id, name: lp.name, slug: lp.slug, badge: lp.badge,
      short_description: lp.short_description, long_description: lp.long_description,
      price: lp.price, compare_at_price: lp.compare_at_price, size: lp.sizes[1].label,
      stock: lp.stock, is_featured: lp.is_featured, is_active: lp.is_active,
      rating: lp.rating, review_count: lp.review_count,
      category_id: null, ingredients: lp.ingredients, how_to_use: lp.how_to_use,
      quality_info: lp.quality_info, created_at: '', updated_at: '',
      images: lp.images as ProductImage[],
      category: { id: '', name: lp.category, slug: lp.categorySlug, description: '' },
    } as Product & { images?: ProductImage[]; category?: Category | null }));

    return src
      .filter(p => {
        if (q && ![p.name, p.short_description, p.badge].some(f =>
          f?.toLowerCase().includes(q.toLowerCase()))) return false;
        if (cat && (p as any).category?.slug !== cat) return false;
        if (p.price > maxPrice) return false;
        if (minRating > 0 && (p.rating ?? 0) < minRating) return false;
        if (weight && p.size !== weight) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case 'price-asc':   return a.price - b.price;
          case 'price-desc':  return b.price - a.price;
          case 'bestselling': return (b.review_count ?? 0) - (a.review_count ?? 0);
          case 'newest':      return (b.created_at ?? '').localeCompare(a.created_at ?? '');
          default:            return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        }
      });
  }, [products, q, cat, sort, maxPrice, minRating, weight]);

  const hasFilters = !!(q || cat || sort !== 'featured' || maxPrice < 2000 || minRating > 0 || weight);

  return (
    <div className="page-bg min-h-screen">
      {/* ── Page hero ── */}
      <div className="pt-24 pb-12 relative overflow-hidden" style={{ background: 'transparent' }}>
        <div className="ambient-orb w-80 h-80 -top-20 -right-20 pointer-events-none"
          style={{ background: 'rgba(22,122,69,0.08)', animationDuration: '10s' }} />
        <div className="section-pad relative z-10">
          <Reveal>
            <p className="section-eyebrow">
              <Leaf className="w-3.5 h-3.5" />
              Shop Botanical Wellness
            </p>
            <h1 className="section-title text-4xl sm:text-5xl mb-4">
              Pure Botanicals.<br />Zero Shortcuts.
            </h1>
            <p className="section-subtitle text-base max-w-xl">
              Single-ingredient Ayurvedic powders — ethically sourced, gently processed, quality verified.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="section-pad py-8">
        {/* ── Controls bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--color-mist)' }} />
            <input value={q} onChange={e => setParam('q', e.target.value)}
              placeholder="Search products…"
              className="input-glass pl-9 pr-4 w-full" />
            {q && (
              <button onClick={() => setParam('q', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                style={{ color: 'var(--color-mist)' }}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sort} onChange={e => setParam('sort', e.target.value)}
              className="input-glass pr-8 appearance-none cursor-pointer min-w-[180px]">
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--color-mist)' }} />
          </div>

          {/* Filter toggle (mobile) */}
          <button onClick={() => setFilterOpen(v => !v)}
            className="btn-outline sm:hidden flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasFilters && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-gold)' }} />}
          </button>
        </div>

        <div className="flex gap-6">
          {/* ── Desktop Sidebar filter ── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="glass-card p-5 flex flex-col gap-6 sticky top-24">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-semibold text-cream-100">Filters</span>
                {hasFilters && (
                  <button onClick={clearFilters}
                    className="text-2xs hover:text-cream-100 transition-colors"
                    style={{ color: 'var(--color-gold)' }}>
                    Clear all
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <p className="label-glass mb-2">Category</p>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setParam('category', '')}
                    className={`text-left text-sm px-3 py-2 rounded-xl transition-all duration-200 ${!cat ? 'font-semibold' : 'hover:bg-white/5'}`}
                    style={{ color: !cat ? 'var(--color-gold)' : 'var(--color-mist)',
                             background: !cat ? 'rgba(201,164,92,0.10)' : 'transparent' }}>
                    All Products
                  </button>
                  {categories.map(c => (
                    <button key={c.id} onClick={() => setParam('category', c.slug)}
                      className={`text-left text-sm px-3 py-2 rounded-xl transition-all duration-200 ${cat === c.slug ? 'font-semibold' : 'hover:bg-white/5'}`}
                      style={{ color: cat === c.slug ? 'var(--color-gold)' : 'var(--color-mist)',
                               background: cat === c.slug ? 'rgba(201,164,92,0.10)' : 'transparent' }}>
                      {c.name}
                    </button>
                  ))}
                  {categories.length === 0 && ['Moringa', 'Amla', 'Herbal Blends'].map(c => (
                    <button key={c} onClick={() => setParam('category', c.toLowerCase().replace(' ', '-'))}
                      className="text-left text-sm px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/5"
                      style={{ color: 'var(--color-mist)' }}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div>
                <p className="label-glass mb-2">Size / Weight</p>
                <div className="flex flex-wrap gap-2">
                  {WEIGHT_OPTIONS.map(w => (
                    <button key={w} onClick={() => setParam('weight', weight === w ? '' : w)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 font-medium"
                      style={{
                        background: weight === w ? 'rgba(22,122,69,0.30)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${weight === w ? 'rgba(22,122,69,0.55)' : 'rgba(255,255,255,0.10)'}`,
                        color: weight === w ? 'var(--color-sage)' : 'var(--color-mist)',
                      }}>
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max price */}
              <div>
                <p className="label-glass mb-2">Max Price: ₹{maxPrice}</p>
                <input type="range" min={200} max={2000} step={50} value={maxPrice}
                  onChange={e => setParam('maxPrice', e.target.value)}
                  className="w-full accent-emerald-500 cursor-pointer" />
                <div className="flex justify-between text-2xs mt-1" style={{ color: 'var(--color-mist)' }}>
                  <span>₹200</span><span>₹2000</span>
                </div>
              </div>

              {/* Min rating */}
              <div>
                <p className="label-glass mb-2">Min Rating</p>
                <div className="flex gap-1.5">
                  {[0, 3, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setParam('minRating', minRating === r ? '' : String(r))}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-all duration-200"
                      style={{
                        background: minRating === r ? 'rgba(201,164,92,0.18)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${minRating === r ? 'rgba(201,164,92,0.45)' : 'rgba(255,255,255,0.10)'}`,
                        color: minRating === r ? 'var(--color-gold)' : 'var(--color-mist)',
                      }}>
                      {r === 0 ? 'Any' : <><Star className="w-2.5 h-2.5 fill-current" />{r}+</>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Mobile filter drawer ── */}
          {filterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="flex-1 mobile-backdrop" onClick={() => setFilterOpen(false)} />
              <div className="w-72 h-full overflow-y-auto p-5 flex flex-col gap-5"
                style={{ background: 'rgba(11,46,26,0.98)', borderLeft: '1px solid rgba(255,255,255,0.09)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-cream-100">Filters</span>
                  <button onClick={() => setFilterOpen(false)}
                    className="p-1 rounded-lg hover:bg-white/8" style={{ color: 'var(--color-mist)' }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {hasFilters && (
                  <button onClick={() => { clearFilters(); setFilterOpen(false); }}
                    className="text-sm" style={{ color: 'var(--color-gold)' }}>Clear all filters</button>
                )}
                {/* Category */}
                <div>
                  <p className="label-glass mb-2">Category</p>
                  <div className="flex flex-col gap-1">
                    {['All', 'Moringa', 'Amla', 'Herbal Blends'].map(c => {
                      const slug = c === 'All' ? '' : c.toLowerCase().replace(' ', '-');
                      return (
                        <button key={c} onClick={() => setParam('category', slug)}
                          className="text-left text-sm px-3 py-2 rounded-xl transition-all"
                          style={{ color: cat === slug ? 'var(--color-gold)' : 'var(--color-mist)',
                                   background: cat === slug ? 'rgba(201,164,92,0.10)' : 'transparent' }}>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Weight */}
                <div>
                  <p className="label-glass mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {WEIGHT_OPTIONS.map(w => (
                      <button key={w} onClick={() => setParam('weight', weight === w ? '' : w)}
                        className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
                        style={{
                          background: weight === w ? 'rgba(22,122,69,0.30)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${weight === w ? 'rgba(22,122,69,0.50)' : 'rgba(255,255,255,0.10)'}`,
                          color: weight === w ? 'var(--color-sage)' : 'var(--color-mist)',
                        }}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="label-glass mb-2">Max Price: ₹{maxPrice}</p>
                  <input type="range" min={200} max={2000} step={50} value={maxPrice}
                    onChange={e => setParam('maxPrice', e.target.value)}
                    className="w-full accent-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm" style={{ color: 'var(--color-mist)' }}>
                {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
              </p>
              <button onClick={() => setFilterOpen(v => !v)}
                className="lg:hidden btn-ghost text-xs flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="rounded-2xl animate-pulse aspect-[4/5]"
                    style={{ background: 'rgba(22,62,38,0.35)' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <Leaf className="w-12 h-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--color-sage)' }} />
                <h3 className="font-serif text-xl font-semibold text-cream-100 mb-2">No products found</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--color-mist)' }}>
                  Try adjusting your filters or search term.
                </p>
                <button onClick={clearFilters} className="btn-outline btn-sm">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p, i) => (
                  <Reveal key={p.id} delay={i * 50}>
                    <ProductCard product={p} image={(p.images ?? [])[0]} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
