import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Leaf, Trash2 } from 'lucide-react';
import { supabase, type Product, type ProductImage } from '@/lib/supabase';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import Reveal from '@/components/Reveal';

export default function Wishlist() {
  const { items, toggleItem } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<(Product & { images?: ProductImage[] })[]>([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (items.length === 0) { setProducts([]); return; }
    setLoading(true);
    supabase.from('products').select('*, product_images(*)')
      .in('id', items).eq('is_active', true)
      .then(({ data }) => { setProducts(data ?? []); setLoading(false); });
  }, [items]);

  return (
    <div className="page-bg min-h-screen pt-24 pb-20">
      <div className="section-pad py-8">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-6 h-6" style={{ color: 'var(--color-gold)' }} />
            <h1 className="font-serif text-3xl font-bold text-cream-100">
              Wishlist
              {items.length > 0 && (
                <span className="ml-2 text-lg font-normal" style={{ color: 'var(--color-mist)' }}>
                  ({items.length})
                </span>
              )}
            </h1>
          </div>
        </Reveal>

        {items.length === 0 ? (
          <Reveal>
            <div className="glass-card p-16 text-center max-w-md mx-auto">
              <Heart className="w-14 h-14 mx-auto mb-5 opacity-20" style={{ color: 'var(--color-gold)' }} />
              <h2 className="font-serif text-xl font-semibold text-cream-100 mb-3">Your wishlist is empty</h2>
              <p className="text-sm mb-8" style={{ color: 'var(--color-mist)' }}>
                Save products you love and come back to them anytime.
              </p>
              <Link to="/products" className="btn-primary w-full justify-center">Browse Products</Link>
            </div>
          </Reveal>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: items.length }, (_, i) => (
              <div key={i} className="rounded-2xl animate-pulse aspect-[4/5]"
                style={{ background: 'rgba(22,62,38,0.40)' }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((p, i) => {
              const img = (p.images ?? [])[0];
              const imgUrl = img?.url ?? 'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?auto=compress&cs=tinysrgb&w=600';
              return (
                <Reveal key={p.id} delay={i * 60}>
                  <div className="glass-card overflow-hidden flex flex-col group">
                    <div className="relative overflow-hidden rounded-t-2xl aspect-[4/4]"
                      style={{ background: 'rgba(22,62,38,0.60)' }}>
                      <Link to={`/products/${p.slug}`}>
                        <img src={imgUrl} alt={p.name} loading="lazy"
                          className="product-img w-full h-full object-cover opacity-90
                                     group-hover:opacity-100 transition-opacity duration-500" />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      <button onClick={() => toggleItem(p.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-full transition-all hover:scale-110"
                        style={{ background: 'rgba(201,164,92,0.80)', color: '#071810' }}
                        aria-label="Remove from wishlist">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-4 flex flex-col gap-2.5 flex-1">
                      <Link to={`/products/${p.slug}`}>
                        <h3 className="font-serif text-base font-semibold text-cream-100
                                       hover:text-gold-300 transition-colors duration-300">
                          {p.name}
                        </h3>
                      </Link>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold" style={{ color: 'var(--color-gold)' }}>{formatPrice(p.price)}</span>
                        {p.compare_at_price > p.price && (
                          <span className="text-xs line-through opacity-40 text-cream-200">{formatPrice(p.compare_at_price)}</span>
                        )}
                      </div>
                      <button onClick={() => addItem({ product_id: p.id, name: p.name, slug: p.slug,
                                                       price: p.price, image: imgUrl, size: p.size || '200g' })}
                        className="btn-primary w-full justify-center mt-auto text-sm"
                        style={{ padding: '0.55rem 1rem', borderRadius: '10px' }}>
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
