// Local product data — used as fallback when Supabase returns no results
// and as the source of truth for static pages / SSR-safe rendering.

export type LocalProduct = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  badge: string;
  short_description: string;
  long_description: string;
  price: number;
  compare_at_price: number;
  sizes: { label: string; price: number; compare: number }[];
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  category: string;
  categorySlug: string;
  ingredients: string;
  how_to_use: string;
  quality_info: string;
  images: { url: string; alt: string; type: string }[];
  benefits: { number: number; icon: string; title: string; description: string }[];
  nutrition: { label: string; per100g: string; perServing: string }[];
  tags: string[];
};

export const LOCAL_PRODUCTS: LocalProduct[] = [
  {
    id: 'moringa-leaf-powder-001',
    name: 'Moringa Leaf Powder',
    slug: 'moringa-leaf-powder',
    tagline: 'The Miracle Tree, Ground to Perfection',
    badge: 'Bestseller',
    short_description:
      'Pure, single-ingredient Moringa leaf powder — gently dried and finely milled to preserve every nutrient. A simple addition to any daily wellness routine.',
    long_description:
      'Vitamora Moringa Leaf Powder is made from carefully selected, ethically harvested Moringa oleifera leaves — one of nature\'s most nutrient-dense botanicals, revered in Ayurvedic tradition for centuries.\n\nOur leaves are harvested at peak maturity, gently dried at low temperatures to preserve the leaf\'s natural profile, and finely milled into a smooth, vibrant green powder. No fillers. No preservatives. No artificial colours. Just pure Moringa.\n\nMoringa has been a cornerstone of traditional wellness practices across South Asia for generations. It is prized for its naturally rich nutrient composition, including iron, calcium, potassium, vitamins A, C, and E, and plant-based protein. As part of a balanced diet, Moringa powder is an easy, versatile way to incorporate more botanical nutrition into your daily routine.',
    price: 599,
    compare_at_price: 799,
    sizes: [
      { label: '100g', price: 349, compare: 449 },
      { label: '200g', price: 599, compare: 799 },
      { label: '500g', price: 1299, compare: 1699 },
    ],
    stock: 150,
    is_featured: true,
    is_active: true,
    rating: 4.7,
    review_count: 128,
    category: 'Moringa',
    categorySlug: 'moringa',
    ingredients: '100% Moringa oleifera leaf powder (dried and milled). No additives, fillers, preservatives, or artificial substances of any kind.',
    how_to_use:
      '• Start with ½ teaspoon (approx. 1–2g) once daily and adjust to your preference.\n• Mix into water, warm milk, smoothies, or fresh juice.\n• Blend into yogurt, oatmeal, soups, or dressings.\n• Best consumed in the morning as part of your daily wellness ritual.\n• Store in a cool, dry place away from direct sunlight. Reseal after every use.',
    quality_info:
      'Each batch undergoes appropriate quality and safety verification before packaging. Our production follows Good Manufacturing Practices (GMP). FSSAI-registered facility.',
    images: [
      {
        url: 'https://images.pexels.com/photos/6941028/pexels-photo-6941028.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Vitamora Moringa Leaf Powder — main product shot',
        type: 'main',
      },
      {
        url: 'https://images.pexels.com/photos/4113831/pexels-photo-4113831.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Moringa leaves, fresh botanical',
        type: 'ingredient',
      },
      {
        url: 'https://images.pexels.com/photos/6045082/pexels-photo-6045082.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Moringa powder in a wooden bowl',
        type: 'usage',
      },
      {
        url: 'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Morning wellness ritual with Moringa',
        type: 'lifestyle',
      },
      {
        url: 'https://images.pexels.com/photos/7208607/pexels-photo-7208607.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Vitamora packaging detail',
        type: 'packaging',
      },
    ],
    benefits: [
      {
        number: 1,
        icon: 'leaf',
        title: 'Naturally Nutrient-Rich',
        description:
          'Moringa leaves are naturally rich in iron, calcium, potassium, and vitamins A, C, and E. Our gentle processing is designed to preserve these naturally occurring nutrients.',
      },
      {
        number: 2,
        icon: 'antioxidant',
        title: 'Antioxidant Plant Compounds',
        description:
          'Moringa contains a range of naturally occurring plant compounds including flavonoids and polyphenols, which contribute to its reputation as a wellness botanical.',
      },
      {
        number: 3,
        icon: 'protein',
        title: 'Plant-Based Protein Source',
        description:
          'Moringa leaf powder contains all essential amino acids, making it a valuable plant-based protein source — particularly useful as part of a vegetarian or vegan diet.',
      },
      {
        number: 4,
        icon: 'balance',
        title: 'Digestive Wellness',
        description:
          'Traditionally used in Ayurveda to support digestive health, Moringa is a gentle, natural botanical that many incorporate as part of their daily nutrition practice.',
      },
      {
        number: 5,
        icon: 'glow',
        title: 'Skin & Hair Nourishment',
        description:
          'Rich in vitamins A and E, Moringa is traditionally associated with skin and hair nourishment. It is a common ingredient in both nutritional and cosmetic Ayurvedic preparations.',
      },
      {
        number: 6,
        icon: 'bone',
        title: 'Bone & Muscle Support',
        description:
          'A natural source of calcium and plant-based protein, Moringa can be a useful addition to support bone health and muscle nutrition as part of a balanced diet.',
      },
    ],
    nutrition: [
      { label: 'Energy',     per100g: '205 kcal', perServing: '4.1 kcal' },
      { label: 'Protein',    per100g: '27g',       perServing: '0.54g' },
      { label: 'Total Fat',  per100g: '2.3g',      perServing: '0.046g' },
      { label: 'Carbohydrates', per100g: '38g',    perServing: '0.76g' },
      { label: 'Dietary Fibre', per100g: '19g',    perServing: '0.38g' },
      { label: 'Iron',       per100g: '28mg',      perServing: '0.56mg' },
      { label: 'Calcium',    per100g: '2000mg',    perServing: '40mg' },
      { label: 'Vitamin C',  per100g: '220mg',     perServing: '4.4mg' },
      { label: 'Vitamin A',  per100g: '378mcg',    perServing: '7.6mcg' },
    ],
    tags: ['moringa', 'superfood', 'ayurvedic', 'vegan', 'natural', 'iron', 'protein'],
  },
  {
    id: 'amla-powder-001',
    name: 'Amla Powder',
    slug: 'amla-powder',
    tagline: 'Ancient Ayurvedic Treasure, Pure & Potent',
    badge: 'Staff Pick',
    short_description:
      'Pure Indian Gooseberry (Amla) powder — single-ingredient, gently processed to preserve Amla\'s naturally high Vitamin C content. A beloved Ayurvedic staple.',
    long_description:
      'Amla (Emblica officinalis), also known as Indian Gooseberry, is one of the most revered botanicals in Ayurvedic practice. Used for thousands of years across the Indian subcontinent, Amla is celebrated for its exceptional natural Vitamin C content — far higher than most common fruits — and its diverse range of beneficial plant compounds.\n\nVitamora Amla Powder is made from whole Indian Gooseberries, carefully sourced from trusted growers and processed with minimal heat to preserve its natural nutrient profile. The result is a tart, vibrant powder that integrates effortlessly into daily routines.\n\nAmla is one of the three fruits in the Ayurvedic formulation Triphala, and has been central to traditional Indian wellness for generations. Today, it is increasingly recognised globally as a functional botanical with remarkable nutritional properties.',
    price: 499,
    compare_at_price: 699,
    sizes: [
      { label: '100g', price: 299, compare: 399 },
      { label: '200g', price: 499, compare: 699 },
      { label: '500g', price: 1099, compare: 1399 },
    ],
    stock: 200,
    is_featured: true,
    is_active: true,
    rating: 4.8,
    review_count: 96,
    category: 'Amla',
    categorySlug: 'amla',
    ingredients: '100% Emblica officinalis (Amla / Indian Gooseberry) fruit powder. No additives, fillers, preservatives, or artificial substances.',
    how_to_use:
      '• Start with ½ teaspoon (approx. 2g) daily, mixed in warm water or juice.\n• Amla powder has a naturally tart flavour — honey can be added to taste.\n• Mix into smoothies, buttermilk, coconut water, or herbal teas.\n• Can be used in hair care preparations as an Ayurvedic tradition.\n• Best consumed in the morning or early evening.',
    quality_info:
      'Each batch is quality verified for identity, purity, and food safety standards. FSSAI-registered production. No synthetic additives used at any stage.',
    images: [
      {
        url: 'https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Vitamora Amla Powder — main product shot',
        type: 'main',
      },
      {
        url: 'https://images.pexels.com/photos/7479781/pexels-photo-7479781.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Fresh Amla (Indian gooseberry) fruits',
        type: 'ingredient',
      },
      {
        url: 'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Amla powder in a spoon',
        type: 'usage',
      },
      {
        url: 'https://images.pexels.com/photos/6045082/pexels-photo-6045082.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Morning ritual with Amla',
        type: 'lifestyle',
      },
      {
        url: 'https://images.pexels.com/photos/4113831/pexels-photo-4113831.jpeg?auto=compress&cs=tinysrgb&w=800',
        alt: 'Vitamora Amla packaging',
        type: 'packaging',
      },
    ],
    benefits: [
      {
        number: 1,
        icon: 'vitamin-c',
        title: 'Exceptional Vitamin C Content',
        description:
          'Amla is one of nature\'s richest natural sources of Vitamin C. A single teaspoon can provide a significant contribution towards your daily Vitamin C intake.',
      },
      {
        number: 2,
        icon: 'antioxidant',
        title: 'Rich in Tannins & Polyphenols',
        description:
          'Amla contains a range of naturally occurring tannins, polyphenols, and flavonoids that contribute to its remarkable reputation in Ayurvedic and modern wellness traditions.',
      },
      {
        number: 3,
        icon: 'glow',
        title: 'Hair & Scalp Nourishment',
        description:
          'Amla is one of the most widely used botanical ingredients in Ayurvedic hair care. Traditionally used both internally and topically for lustrous, healthy hair.',
      },
      {
        number: 4,
        icon: 'balance',
        title: 'Digestive Tonic',
        description:
          'One of the three fruits of Triphala, Amla has been used as a gentle digestive tonic in Ayurveda for thousands of years. A thoughtful addition to any wellness routine.',
      },
    ],
    nutrition: [
      { label: 'Energy',     per100g: '258 kcal', perServing: '5.2 kcal' },
      { label: 'Protein',    per100g: '4g',        perServing: '0.08g' },
      { label: 'Total Fat',  per100g: '1.1g',      perServing: '0.022g' },
      { label: 'Carbohydrates', per100g: '64g',    perServing: '1.28g' },
      { label: 'Dietary Fibre', per100g: '34g',    perServing: '0.68g' },
      { label: 'Vitamin C',  per100g: '921mg',     perServing: '18.4mg' },
      { label: 'Iron',       per100g: '1.2mg',     perServing: '0.024mg' },
      { label: 'Calcium',    per100g: '50mg',      perServing: '1mg' },
    ],
    tags: ['amla', 'vitamin-c', 'ayurvedic', 'vegan', 'hair', 'immunity', 'triphala'],
  },
];

// Blog posts
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishedAt: string;
  author: string;
  coverImage: string;
  tags: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-001',
    slug: 'benefits-of-amla-for-hair-care',
    title: 'Benefits of Amla for Hair Care Rituals',
    excerpt:
      'Discover how Indian Gooseberry has been used in Ayurvedic hair care for centuries — and how to incorporate Amla powder into your modern hair care routine.',
    content: '',
    category: 'Ayurvedic Wisdom',
    readTime: 6,
    publishedAt: '2026-07-15',
    author: 'Vitamora Editorial',
    coverImage:
      'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['amla', 'hair care', 'ayurveda', 'wellness'],
  },
  {
    id: 'blog-002',
    slug: 'moringa-vs-multivitamin',
    title: 'Moringa vs Multivitamin: Understanding Plant-Based Nutrition',
    excerpt:
      'A balanced look at how plant-based botanical powders like Moringa compare to synthetic multivitamins — and why whole-food nutrition matters.',
    content: '',
    category: 'Nutrition & Wellness',
    readTime: 8,
    publishedAt: '2026-08-01',
    author: 'Vitamora Editorial',
    coverImage:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['moringa', 'nutrition', 'plant-based', 'supplements'],
  },
  {
    id: 'blog-003',
    slug: 'botanical-powders-morning-routine',
    title: 'How to Add Botanical Powders to Your Morning Routine',
    excerpt:
      'Simple, practical ideas for weaving Moringa and Amla into your daily morning ritual — from smoothies and teas to traditional Ayurvedic preparations.',
    content: '',
    category: 'Daily Ritual',
    readTime: 5,
    publishedAt: '2026-08-12',
    author: 'Vitamora Editorial',
    coverImage:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['morning routine', 'moringa', 'amla', 'wellness ritual'],
  },
  {
    id: 'blog-004',
    slug: 'ayurvedic-history-of-moringa',
    title: 'Moringa in Ayurveda: A 4,000-Year Wellness Story',
    excerpt:
      'Tracing the roots of Moringa oleifera through ancient Ayurvedic texts, traditional Indian medicine, and into its modern role as a globally celebrated botanical.',
    content: '',
    category: 'Ayurvedic Wisdom',
    readTime: 7,
    publishedAt: '2026-08-20',
    author: 'Vitamora Editorial',
    coverImage:
      'https://images.pexels.com/photos/4113831/pexels-photo-4113831.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['moringa', 'ayurveda', 'history', 'tradition'],
  },
];

export const MOCK_REVIEWS = [
  {
    id: 'r1',
    author: 'Priya S.',
    location: 'Mumbai',
    rating: 5,
    title: 'Finally, a moringa powder that actually tastes clean',
    body: 'I\'ve tried several brands and Vitamora\'s Moringa is noticeably fresher. The colour is vibrant green and there is no bitterness. I mix it into warm water every morning. Genuinely happy with this.',
    date: '2026-08-10',
    verified: true,
  },
  {
    id: 'r2',
    author: 'Arjun M.',
    location: 'Bengaluru',
    rating: 5,
    title: 'The Amla powder is excellent quality',
    body: 'Very fine texture, strong natural Amla aroma, and mixes well into buttermilk. Have been using it for three weeks and it has become a consistent part of my morning. Good packaging too — stays sealed well.',
    date: '2026-07-28',
    verified: true,
  },
  {
    id: 'r3',
    author: 'Meera K.',
    location: 'Delhi',
    rating: 4,
    title: 'Good product, fast delivery',
    body: 'Moringa powder is good quality and the quantity feels right for the price. I would love to see a larger 500g option more prominently featured. Will reorder.',
    date: '2026-07-15',
    verified: true,
  },
  {
    id: 'r4',
    author: 'Sunita R.',
    location: 'Pune',
    rating: 5,
    title: 'Best Amla powder I\'ve found',
    body: 'I\'ve been using Amla for years in my hair care routine and also internally. The Vitamora Amla is the most consistent in quality I\'ve used. Tart flavour, fine texture, good solubility. Happy customer.',
    date: '2026-08-05',
    verified: true,
  },
];
