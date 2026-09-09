import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

type WishlistContextType = {
  items: string[];
  toggleItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem('vitamora-wishlist');
      if (saved) setItems(JSON.parse(saved));
      else setItems([]);
      return;
    }
    setLoading(true);
    supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setItems(data?.map((d) => d.product_id) ?? []);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('vitamora-wishlist', JSON.stringify(items));
    }
  }, [items, user]);

  async function toggleItem(productId: string) {
    if (user) {
      if (items.includes(productId)) {
        setItems((prev) => prev.filter((id) => id !== productId));
        await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId);
      } else {
        setItems((prev) => [...prev, productId]);
        await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
      }
    } else {
      setItems((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    }
  }

  function hasItem(productId: string) {
    return items.includes(productId);
  }

  return (
    <WishlistContext.Provider value={{ items, toggleItem, hasItem, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
