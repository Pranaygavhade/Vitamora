import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, ShoppingBag, Zap, Star, ChevronLeft, ChevronRight,
  Leaf, ShieldCheck, Truck, Package, Plus, Minus, X,
  ChevronDown, FlaskConical, BookOpen, Utensils, HelpCircle,
} from 'lucide-react';
import { supabase, type Product, type ProductImage, type ProductBenefit, type Review } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/format';
import Reveal from '@/components/Reveal';
import { LOCAL_PRODUCTS, MOCK_REVIEWS } from '@/data/products';

const TABS = [
  { id: 'description', label: 'Description',     icon: BookOpen },
  { id: 'benefits',    label: 'Benefits',         icon: Leaf },
  { id: 'how-to-use',  label: 'How to Use',       icon: Utensils },
  { id: 'nutrition',   label: 'Nutrition Facts',  icon: FlaskConical },
  { id: 'reviews',     label: 'Reviews',          icon: Star },
  { id: 'faq',         label: 'FAQ',              icon: HelpCircle },
];

const FAQS = [
  { q: 'Is this product suitable for daily use?', a: 'Yes. Our powders are designed for everyday use as part of a balanced diet. We recommend starting with a smaller amount and adjusting to your preference.' },
  { q: 'How should I store the powder?', a: 'Store in a cool, dry place away from direct sunlight. Always reseal after use. Avoid exposing the powder to moisture or steam.' },
  { q: 'Are there any known allergens?', a: 'Our products are made in facilities that may handle common allergens. Please review the ingredients carefully and consult your healthcare provider if you have concerns.' },
  { q: 'Can pregnant or breastfeeding women use this product?', a: 'We recommend consulting a qualified healthcare professional before use during pregnancy or breastfeeding.' },
  { q: 'How long does shipping take?', a: 'Standard delivery is 4–7 business days. Expedited options are available at checkout.' },
  { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery for unopened products. Please contact our support team to initiate a return.' },
  { q: 'Is the packaging recyclable?', a: 'We use food-grade, resealable packaging. We are working towards more sustainable packaging options and will update our customers as these become available.' },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const { user } = useAuth();

  const [product,  setProduct]  = useState<Product | null>(null);
  const [images,   setImages]   = useState<ProductImage[]>([]);
  const [benefits, setBenefits] = useState<ProductBenefit[]>([]);
  const [reviews,  setReviews]  = useState<(Review & { profiles?: { full_name: string } | null })[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImg, setSelectedImg] = useState(0);
  const [lightbox,    setLightbox]    = useState(false);
  const [quantity,    setQuantity]    = useState(1);
  const [selectedSize, setSelectedSize] = useState('200g');
  const [activeTab,   setActiveTab]   = useState('description');
  const [addedMsg,    setAddedMsg]    = useState('');
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);
  const [reviewForm,  setReviewForm]  = useState({ rating: 5, title: '', body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg,  setReviewMsg]    = useState('');

  const localProduct = LOCAL_PRODUCTS.find(p => p.slug === slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from('products').select('*').eq('slug', slug).maybeSingle()
      .then(({ data: prod }) => {
        if (!prod) { setNotFound(true); setLoading(false); return; }
        setProduct(prod);
        return Promise.all([
          supabase.from('product_images').select('*').eq('product_id', prod.id).order('sort_order'),
          supabase.from('product_benefits').select('*').eq('product_id', prod.id).in('status', ['approved', 'verified']).order('number'),
          supabase.from('reviews').select('*, profiles(full_name)').eq('product_id', prod.id).eq('is_approved', true).order('created_at', { ascending: false }),
        ]);
      })
      .then(results => {
        if (!results) return;
        const [{ data: imgs }, { data: bens }, { data: revs }] = results;
        setImages(imgs ?? []);
        setBenefits(bens ?? []);
        setReviews(revs ?? []);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div className="page-bg min-h-screen flex items-center justify-center pt-24">
      <div className="w-10 h-10 rounded-full border-2 animate-spin"
        style={{ borderColor: 'rgba(22,122,69,0.30)', borderTopColor: 'var(--color-gold)' }} />
    </div>
  );

  if (notFound && !localProduct) return (
    <div className="page-bg min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
      <Leaf className="w-16 h-16 opacity-20" style={{ color: 'var(--color-sage)' }} />
      <h1 className="font-serif text-3xl font-semibold text-cream-100">Product not found</h1>
      <Link to="/products" className="btn-primary">Browse Products</Link>
    </div>
  );

  const prod = product ?? (localProduct ? {
    id: localProduct.id, name: localProduct.name, slug: localProduct.slug,
    badge: localProduct.badge, short_description: localProduct.short_description,
    long_description: localProduct.long_description,
    price: localProduct.price, compare_at_price: localProduct.compare_at_price,
    size: selectedSize, stock: localProduct.stock,
    is_featured: localProduct.is_featured, is_active: true,
    rating: localProduct.rating, review_count: localProduct.review_count,
    category_id: null, ingredients: localProduct.ingredients,
    how_to_use: localProduct.how_to_use, quality_info: localProduct.quality_info,
    created_at: '', updated_at: '',
  } as Product : null);

  if (!prod) return null;

  const displayImages = images.length > 0
    ? images
    : (localProduct?.images ?? []).map((img, idx) => ({
        id: idx.toString(), product_id: prod.id, url: img.url, alt: img.alt, type: img.type, sort_order: idx,
      })) as ProductImage[];

  const displayBenefits = benefits.length > 0 ? benefits : (localProduct?.benefits ?? []).map(b => ({
    id: b.number.toString(), product_id: prod.id, number: b.number, icon: b.icon,
    title: b.title, description: b.description, status: 'approved',
  }));

  const displayReviews = reviews;

  const allReviews = displayReviews.length > 0
    ? displayReviews.map(r => ({
        id: r.id, author: r.profiles?.full_name ?? 'Customer',
        location: '', rating: r.rating, title: r.title, body: r.body,
        date: r.created_at.slice(0, 10), verified: r.is_verified_purchase,
      }))
    : MOCK_REVIEWS.filter(r => localProduct ? r.id.startsWith('r') : false);

  const discount = prod.compare_at_price > prod.price
    ? Math.round(((prod.compare_at_price - prod.price) / prod.compare_at_price) * 100) : 0;

  const localSizes = localProduct?.sizes ?? [{ label: '200g', price: prod.price, compare: prod.compare_at_price }];
  const activeSize = localSizes.find(s => s.label === selectedSize) ?? localSizes[0];
  const displayPrice = activeSize?.price ?? prod.price;
  const displayCompare = activeSize?.compare ?? prod.compare_at_price;

  function handleAddToCart() {
    const imgUrl = displayImages[0]?.url ?? '';
    addItem({ product_id: prod!.id, name: prod!.name, slug: prod!.slug,
              price: displayPrice, image: imgUrl, size: selectedSize }, quantity);
    setAddedMsg('Added to cart!');
    setTimeout(() => setAddedMsg(''), 2500);
  }

  function handleBuyNow() {
    const imgUrl = displayImages[0]?.url ?? '';
    addItem({ product_id: prod!.id, name: prod!.name, slug: prod!.slug,
              price: displayPrice, image: imgUrl, size: selectedSize }, quantity);
    navigate('/checkout');
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setReviewMsg('Please log in to leave a review.'); return; }
    setSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert({
      product_id: prod!.id, user_id: user.id,
      rating: reviewForm.rating, title: reviewForm.title, body: reviewForm.body,
      is_approved: false,
    });
    setSubmittingReview(false);
    if (error) { setReviewMsg('Something went wrong. Please try again.'); }
    else { setReviewMsg('Thank you! Your review is pending approval.'); setReviewForm({ rating: 5, title: '', body: '' }); }
  }

  return (
    <div className="page-bg min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="section-pad pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-mist)' }}>
          <Link to="/" className="hover:text-cream-100 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-cream-100 transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-cream-100">{prod.name}</span>
        </nav>
      </div>

      {/* ── Main product area ── */}
      <div className="section-pad py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Gallery ── */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl aspect-square cursor-zoom-in group"
              style={{ background: 'linear-gradient(145deg,rgba(22,62,38,0.70),rgba(11,46,26,0.85))' }}
              onClick={() => setLightbox(true)}>
              {displayImages[selectedImg] && (
                <img src={displayImages[selectedImg].url} alt={displayImages[selectedImg].alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              {prod.badge && (
                <span className="absolute top-4 left-4 badge-gold">{prod.badge}</span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(22,122,69,0.85)', color: '#d0f0e0', border: '1px solid rgba(22,122,69,0.50)' }}>
                  -{discount}%
                </span>
              )}
              {/* Arrows */}
              {displayImages.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImg(i => (i - 1 + displayImages.length) % displayImages.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(11,46,26,0.75)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--color-cream)' }}>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImg(i => (i + 1) % displayImages.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(11,46,26,0.75)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--color-cream)' }}>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {displayImages.map((img, i) => (
                  <button key={img.id} onClick={() => setSelectedImg(i)}
                    className="w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all duration-200"
                    style={{
                      border: `2px solid ${i === selectedImg ? 'var(--color-gold)' : 'rgba(255,255,255,0.10)'}`,
                      opacity: i === selectedImg ? 1 : 0.6,
                    }}>
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-2xs font-semibold tracking-widest uppercase"
                style={{ color: 'var(--color-sage)' }}>
                {localProduct?.category ?? 'Botanical Powder'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cream-100 mt-1 mb-3">
                {prod.name}
              </h1>
              {prod.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="w-4 h-4"
                        style={{ color: i < Math.round(prod.rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)',
                                 fill: i < Math.round(prod.rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)' }} />
                    ))}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--color-mist)' }}>
                    {prod.rating.toFixed(1)} ({prod.review_count} reviews)
                  </span>
                </div>
              )}
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                {prod.short_description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-3xl" style={{ color: 'var(--color-gold)' }}>
                {formatPrice(displayPrice)}
              </span>
              {displayCompare > displayPrice && (
                <span className="text-xl line-through opacity-45 text-cream-200">
                  {formatPrice(displayCompare)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(22,122,69,0.25)', color: 'var(--color-sage)', border: '1px solid rgba(22,122,69,0.35)' }}>
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Size selector */}
            <div>
              <p className="label-glass mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {localSizes.map(s => (
                  <button key={s.label} onClick={() => setSelectedSize(s.label)}
                    className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: selectedSize === s.label ? 'rgba(22,122,69,0.30)' : 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${selectedSize === s.label ? 'rgba(22,122,69,0.60)' : 'rgba(255,255,255,0.12)'}`,
                      color: selectedSize === s.label ? 'var(--color-sage)' : 'var(--color-mist)',
                    }}>
                    {s.label}
                    <span className="ml-2 text-xs opacity-70">{formatPrice(s.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="label-glass mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="qty-btn"
                  disabled={quantity <= 1} aria-label="Decrease">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-semibold text-lg w-8 text-center text-cream-100">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(prod.stock, q + 1))} className="qty-btn"
                  disabled={quantity >= prod.stock} aria-label="Increase">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs ml-2" style={{ color: 'var(--color-mist)' }}>
                  {prod.stock > 10 ? 'In stock' : `Only ${prod.stock} left`}
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {addedMsg || 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} className="btn-gold flex-1 justify-center gap-2">
                <Zap className="w-4 h-4" />
                Buy Now
              </button>
              <button onClick={() => toggleItem(prod.id)}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0"
                style={{
                  background: hasItem(prod.id) ? 'rgba(201,164,92,0.20)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${hasItem(prod.id) ? 'rgba(201,164,92,0.55)' : 'rgba(255,255,255,0.12)'}`,
                  color: hasItem(prod.id) ? 'var(--color-gold)' : 'var(--color-mist)',
                }}
                aria-label={hasItem(prod.id) ? 'Remove from wishlist' : 'Add to wishlist'}>
                <Heart className="w-4.5 h-4.5" style={{ fill: hasItem(prod.id) ? 'currentColor' : 'none' }} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { icon: Truck,       label: 'Free shipping above ₹499' },
                { icon: ShieldCheck, label: 'Quality verified batch' },
                { icon: Leaf,        label: '100% Natural ingredients' },
                { icon: Package,     label: 'No preservatives added' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                  <span className="text-xs" style={{ color: 'var(--color-mist)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="section-pad pb-16">
        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-8 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap
                          transition-all duration-200 shrink-0
                          ${activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Description */}
        {activeTab === 'description' && (
          <Reveal>
            <div className="max-w-3xl">
              <div className="prose prose-invert max-w-none text-sm leading-relaxed"
                style={{ color: 'var(--color-mist)' }}>
                {prod.long_description.split('\n').map((para, i) => para.trim() && (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
              {prod.ingredients && (
                <div className="glass-card p-5 mt-8">
                  <h3 className="font-serif text-base font-semibold text-cream-100 mb-2">Ingredients</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                    {prod.ingredients}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* Benefits */}
        {activeTab === 'benefits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {displayBenefits.map((b, i) => (
              <Reveal key={b.id} delay={i * 60}>
                <div className="glass-card p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="process-icon-ring w-10 h-10">
                      <Leaf className="w-4 h-4" style={{ color: 'var(--color-gold)' }} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-cream-100">{b.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                    {b.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* How to Use */}
        {activeTab === 'how-to-use' && (
          <Reveal>
            <div className="max-w-2xl glass-card p-6">
              <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">Usage Guide</h3>
              <div className="space-y-3">
                {(prod.how_to_use || '').split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                      style={{ background: 'rgba(22,122,69,0.25)', color: 'var(--color-sage)', border: '1px solid rgba(22,122,69,0.35)' }}>
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>
                      {line.replace(/^[•\-\*]\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Nutrition */}
        {activeTab === 'nutrition' && (
          <Reveal>
            <div className="max-w-lg">
              <div className="glass-card overflow-hidden">
                <div className="px-6 py-4" style={{ borderBottom: '2px solid rgba(201,164,92,0.30)' }}>
                  <h3 className="font-serif text-lg font-bold text-cream-100">Nutrition Facts</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-mist)' }}>
                    Serving size: 2g (approx. 1 tsp) | Per 100g values shown
                  </p>
                </div>
                <table className="table-glass">
                  <thead>
                    <tr>
                      <th>Nutrient</th>
                      <th>Per 100g</th>
                      <th>Per Serving (2g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(localProduct?.nutrition ?? []).map((n, i) => (
                      <tr key={i}>
                        <td className="font-medium">{n.label}</td>
                        <td>{n.per100g}</td>
                        <td>{n.perServing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="px-6 py-4 text-2xs leading-relaxed" style={{ color: 'rgba(182,200,179,0.50)' }}>
                  * Values are approximate and may vary by batch. This product is a food supplement and should be consumed as part of a balanced diet. Not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare professional before use if you have medical conditions.
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-6 mb-8 glass-card p-5">
              <div className="text-center">
                <p className="font-serif text-5xl font-bold" style={{ color: 'var(--color-gold)' }}>
                  {prod.rating.toFixed(1)}
                </p>
                <div className="flex gap-0.5 justify-center my-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-4 h-4"
                      style={{ color: i < Math.round(prod.rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)',
                               fill: i < Math.round(prod.rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)' }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'var(--color-mist)' }}>{prod.review_count} reviews</p>
              </div>
              <div className="flex-1">
                {[5,4,3,2,1].map(n => {
                  const pct = prod.review_count > 0 ? Math.round((n / 5) * 60 + 10) : 0;
                  return (
                    <div key={n} className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs w-3 text-right" style={{ color: 'var(--color-mist)' }}>{n}</span>
                      <Star className="w-3 h-3" style={{ color: 'var(--color-gold)', fill: 'var(--color-gold)' }} />
                      <div className="rating-bar-track flex-1">
                        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review list */}
            <div className="space-y-4 mb-10">
              {(allReviews.length > 0 ? allReviews : []).map((r, i) => (
                <Reveal key={r.id} delay={i * 60}>
                  <div className="glass-card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: 'rgba(22,122,69,0.25)', color: 'var(--color-sage)', border: '1px solid rgba(22,122,69,0.30)' }}>
                          {r.author[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-cream-100">{r.author}</p>
                          <p className="text-2xs" style={{ color: 'var(--color-mist)' }}>{r.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, si) => (
                          <Star key={si} className="w-3 h-3"
                            style={{ color: si < r.rating ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)',
                                     fill: si < r.rating ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)' }} />
                        ))}
                      </div>
                    </div>
                    {r.title && <p className="font-semibold text-sm text-cream-100 mb-1">{r.title}</p>}
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>{r.body}</p>
                  </div>
                </Reveal>
              ))}
              {allReviews.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: 'var(--color-mist)' }}>
                  No approved reviews yet. Be the first to review this product!
                </p>
              )}
            </div>

            {/* Write review */}
            <div className="glass-card p-6">
              <h3 className="font-serif text-lg font-semibold text-cream-100 mb-4">Write a Review</h3>
              {!user ? (
                <p className="text-sm" style={{ color: 'var(--color-mist)' }}>
                  <Link to="/login" className="underline" style={{ color: 'var(--color-gold)' }}>Log in</Link> to leave a review.
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div>
                    <p className="label-glass mb-2">Your Rating</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <button key={i} type="button"
                          onClick={() => setReviewForm(f => ({ ...f, rating: i + 1 }))}
                          className="p-1 rounded transition-transform hover:scale-110">
                          <Star className="w-6 h-6"
                            style={{ color: i < reviewForm.rating ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)',
                                     fill: i < reviewForm.rating ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label-glass">Review Title</label>
                    <input value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Summarise your experience" className="input-glass" maxLength={100} />
                  </div>
                  <div>
                    <label className="label-glass">Your Review</label>
                    <textarea value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                      placeholder="Tell others about your experience…" rows={4}
                      required className="input-glass resize-none" />
                  </div>
                  {reviewMsg && (
                    <p className="text-sm" style={{ color: reviewMsg.includes('Thank') ? 'var(--color-gold)' : '#f87171' }}>
                      {reviewMsg}
                    </p>
                  )}
                  <button type="submit" className="btn-primary w-fit" disabled={submittingReview}>
                    {submittingReview ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="max-w-2xl space-y-2">
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="accordion-item">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left gap-4">
                    <span className="font-serif text-base font-semibold text-cream-100">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300
                      ${openFaq === i ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--color-gold)' }} />
                  </button>
                  <div className={`faq-answer ${openFaq === i ? 'open' : ''} px-5 pb-5`}>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-mist)' }}>{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(7,24,16,0.96)' }}
          onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: 'var(--color-cream)' }}>
            <X className="w-6 h-6" />
          </button>
          <img src={displayImages[selectedImg]?.url} alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4"
        style={{ background: 'rgba(11,46,26,0.95)', backdropFilter: 'blur(16px)',
                 borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex gap-3">
          <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center">
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
          <button onClick={handleBuyNow} className="btn-gold flex-1 justify-center">
            <Zap className="w-4 h-4" /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
