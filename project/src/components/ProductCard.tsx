import { Link } from 'react-router-dom';
import { Heart, Star, ExternalLink } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/format';
import type { Product, ProductImage } from '@/lib/supabase';

type Props = {
  product: Product;
  image?: ProductImage;
};

const FALLBACK_IMAGES: Record<string, string> = {
  'moringa-leaf-powder':
    'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?auto=compress&cs=tinysrgb&w=600',
  'amla-powder':
    'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=600',
};

/* Flipkart search URLs per product slug */
const FLIPKART_LINKS: Record<string, string> = {
  'moringa-leaf-powder':
    'https://www.flipkart.com/search?q=moringa+leaf+powder',
  'amla-powder':
    'https://www.flipkart.com/search?q=amla+powder',
};
const FLIPKART_DEFAULT = 'https://www.flipkart.com/search?q=vitamora+botanical+powder';

export default function ProductCard({ product, image }: Props) {
  const { toggleItem, hasItem } = useWishlist();

  const imgUrl =
    image?.url ||
    FALLBACK_IMAGES[product.slug] ||
    'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?auto=compress&cs=tinysrgb&w=600';

  const discount =
    product.compare_at_price > product.price
      ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
      : 0;

  const flipkartUrl = FLIPKART_LINKS[product.slug] ?? FLIPKART_DEFAULT;

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  }

  const isWishlisted = hasItem(product.id);

  return (
    <Link to={`/products/${product.slug}`}
      className="block group outline-none focus-visible:ring-2 focus-visible:ring-gold-400/60
                 focus-visible:ring-offset-2 rounded-2xl">
      <article className="product-card relative flex flex-col h-full">

        {/* ── Image ── */}
        <div className="relative overflow-hidden rounded-t-2xl aspect-[4/4.5] flex-shrink-0"
          style={{ background: 'linear-gradient(145deg, rgba(22,62,38,0.80), rgba(11,46,26,0.90))' }}>
          <img src={imgUrl} alt={image?.alt || product.name}
            loading="lazy"
            className="product-img w-full h-full object-cover opacity-90 group-hover:opacity-100
                       transition-opacity duration-500" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className="badge-gold text-[10px]">{product.badge}</span>
            )}
            {discount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                style={{ background: 'rgba(22,122,69,0.85)', color: '#d0f0e0', border: '1px solid rgba(22,122,69,0.50)' }}>
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                       transition-all duration-300 hover:scale-110 active:scale-95
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50"
            style={{
              background: isWishlisted ? 'rgba(201,164,92,0.85)' : 'rgba(11,46,26,0.70)',
              border: `1px solid ${isWishlisted ? 'rgba(201,164,92,0.60)' : 'rgba(255,255,255,0.12)'}`,
              backdropFilter: 'blur(8px)',
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}>
            <Heart className="w-3.5 h-3.5 transition-colors duration-200"
              style={{ color: isWishlisted ? '#071810' : 'rgba(247,243,232,0.80)', fill: isWishlisted ? '#071810' : 'none' }} />
          </button>

          {/* Hover overlay — Flipkart quick-buy */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a href={flipkartUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="w-full btn-gold btn-sm justify-center gap-1.5 flex"
              style={{ borderRadius: '10px' }}>
              <ExternalLink className="w-3.5 h-3.5" />
              Buy on Flipkart
            </a>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          <span className="text-2xs font-semibold tracking-[0.18em] uppercase"
            style={{ color: 'var(--color-sage)' }}>
            {product.size || '200g'} · Botanical Powder
          </span>

          <h3 className="font-serif text-lg font-semibold leading-snug text-cream-100
                         group-hover:text-gold-300 transition-colors duration-300">
            {product.name}
          </h3>

          <p className="text-xs leading-relaxed line-clamp-2 flex-1"
            style={{ color: 'var(--color-mist)' }}>
            {product.short_description}
          </p>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-3 h-3"
                    style={{
                      color: i < Math.round(product.rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)',
                      fill:  i < Math.round(product.rating) ? 'var(--color-gold)' : 'rgba(201,164,92,0.22)',
                    }} />
                ))}
              </div>
              <span className="text-2xs" style={{ color: 'var(--color-mist)' }}>
                {product.rating.toFixed(1)} ({product.review_count})
              </span>
            </div>
          )}

          {/* Price row */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-sans text-lg font-bold" style={{ color: 'var(--color-gold)' }}>
              {formatPrice(product.price)}
            </span>
            {product.compare_at_price > product.price && (
              <span className="text-sm line-through opacity-50 text-cream-200">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Flipkart CTA */}
          <a href={flipkartUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="btn-gold w-full justify-center mt-1 flex items-center gap-2"
            style={{ padding: '0.60rem 1rem', fontSize: '0.8125rem', borderRadius: '10px' }}>
            <ExternalLink className="w-3.5 h-3.5" />
            Buy on Flipkart
          </a>
        </div>
      </article>
    </Link>
  );
}
