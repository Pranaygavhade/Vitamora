import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Product = {
  id: string;
  name: string;
  slug: string;
  badge: string;
  short_description: string;
  long_description: string;
  price: number;
  compare_at_price: number;
  size: string;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  category_id: string | null;
  ingredients: string;
  how_to_use: string;
  quality_info: string;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  type: string;
  sort_order: number;
};

export type ProductBenefit = {
  id: string;
  product_id: string;
  number: number;
  icon: string;
  title: string;
  description: string;
  status: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  profiles?: { full_name: string } | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Order = {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon_code: string;
  payment_method: string;
  payment_status: string;
  shipping_address: Record<string, string>;
  contact_info: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
};

export type Address = {
  id: string;
  user_id: string;
  full_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  is_default: boolean;
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  role: string;
};
