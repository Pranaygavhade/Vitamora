/*
# Seed Vitamora Catalog Data

1. Categories
   - moringa, amla, wellness

2. Products
   - Vitamora Moringa Leaf Powder (200g)
   - Vitamora Amla Powder (200g)

3. Product Images
   - Main, lifestyle, ingredient, usage, packaging images for each product

4. Product Benefits
   - 6 benefits for Moringa (with compliant, verified/approved status)
   - Benefits for Amla
*/

-- ============ CATEGORIES ============
INSERT INTO categories (name, slug, description) VALUES
  ('Moringa', 'moringa', 'Moringa-based botanical wellness products'),
  ('Amla', 'amla', 'Amla-based botanical wellness products'),
  ('Wellness', 'wellness', 'General wellness products')
ON CONFLICT (slug) DO NOTHING;

-- ============ PRODUCTS ============
INSERT INTO products (name, slug, badge, short_description, long_description, price, compare_at_price, size, stock, is_featured, is_active, rating, review_count, category_id, ingredients, how_to_use, quality_info)
SELECT
  'Vitamora Moringa Leaf Powder',
  'moringa-leaf-powder',
  'The Green Miracle Leaf',
  'Naturally sourced moringa leaves, gently dried and finely milled into a vibrant emerald-green powder, offering pure plant-based nutrition for your everyday wellness routine.',
  'Vitamora Moringa Leaf Powder is crafted from carefully selected moringa leaves, gently dried and finely milled to preserve their natural qualities. The result is a vibrant, emerald-green powder that delivers pure plant-based nutrition in every spoon. Moringa has been valued in traditional Indian wellness practices for generations, and Vitamora brings it to you in its simplest, most honest form — a single ingredient, nothing added, nothing removed.',
  599.00, 799.00, '200g', 150, true, true, 4.8, 0,
  (SELECT id FROM categories WHERE slug = 'moringa'),
  '100% Moringa Leaf Powder',
  'Add one teaspoon (approx. 3g) to water, smoothies, juices, yogurt, or breakfast bowls. Stir well and consume immediately. For a post-workout wellness drink, mix with water and a squeeze of lemon.',
  'Single ingredient · Naturally processed · Lab tested · No artificial colours · No preservatives · No unnecessary fillers · 100% Vegan'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'moringa-leaf-powder');

INSERT INTO products (name, slug, badge, short_description, long_description, price, compare_at_price, size, stock, is_featured, is_active, rating, review_count, category_id, ingredients, how_to_use, quality_info)
SELECT
  'Vitamora Amla Powder',
  'amla-powder',
  'The Ancient Vitamin C Superfruit',
  'Carefully selected amla fruit, gently dried and finely milled into a naturally vibrant powder, delivering the tangy goodness of India''s traditional superfruit for your everyday wellness routine.',
  'Vitamora Amla Powder is made from carefully selected amla (Indian gooseberry) fruit, gently dried and finely milled to retain its natural character. The result is a fine, tangy powder that captures the essence of one of India''s most cherished botanical superfruits. Amla has been a cornerstone of traditional Indian wellness for centuries, and Vitamora presents it in its purest form — a single ingredient, nothing added, nothing removed.',
  499.00, 699.00, '200g', 200, true, true, 4.7, 0,
  (SELECT id FROM categories WHERE slug = 'amla'),
  '100% Amla Powder',
  'Add one teaspoon (approx. 3g) to water, smoothies, juices, yogurt, or breakfast bowls. Mix well and consume. For a refreshing morning drink, combine with warm water and honey.',
  'Single ingredient · Naturally processed · Lab tested · No artificial colours · No preservatives · No unnecessary fillers · 100% Vegan'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'amla-powder');

-- ============ PRODUCT IMAGES ============
INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/7149595/pexels-photo-7149595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vitamora Moringa Leaf Powder jar', 'main', 0
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/8845102/pexels-photo-8845102.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Moringa powder with spoon', 'ingredient', 1
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_images WHERE product_id = p.id) < 2;

INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/7208607/pexels-photo-7208607.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Wellness drink with moringa', 'usage', 2
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_images WHERE product_id = p.id) < 3;

INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/8474107/pexels-photo-8474107.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Moringa powder in bowl', 'lifestyle', 3
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_images WHERE product_id = p.id) < 4;

INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/8844557/pexels-photo-8844557.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Moringa powder packaging', 'packaging', 4
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_images WHERE product_id = p.id) < 5;

-- Amla images
INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/32112805/pexels-photo-32112805.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Vitamora Amla Powder with fresh amla', 'main', 0
FROM products p WHERE p.slug = 'amla-powder' AND NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = p.id);

INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/34928285/pexels-photo-34928285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Fresh amla fruits', 'ingredient', 1
FROM products p WHERE p.slug = 'amla-powder' AND (SELECT count(*) FROM product_images WHERE product_id = p.id) < 2;

INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/7208608/pexels-photo-7208608.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Wellness drink with amla', 'usage', 2
FROM products p WHERE p.slug = 'amla-powder' AND (SELECT count(*) FROM product_images WHERE product_id = p.id) < 3;

INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/8474061/pexels-photo-8474061.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Amla powder in bowl', 'lifestyle', 3
FROM products p WHERE p.slug = 'amla-powder' AND (SELECT count(*) FROM product_images WHERE product_id = p.id) < 4;

INSERT INTO product_images (product_id, url, alt, type, sort_order)
SELECT p.id, 'https://images.pexels.com/photos/29180993/pexels-photo-29180993.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Fresh amla on branch', 'packaging', 4
FROM products p WHERE p.slug = 'amla-powder' AND (SELECT count(*) FROM product_images WHERE product_id = p.id) < 5;

-- ============ PRODUCT BENEFITS (Moringa) ============
INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 1, 'iron', 'Iron-Rich Plant Nutrition', 'Moringa leaves are a natural source of plant-based iron. When paired with the vitamin C naturally present in moringa, this combination supports your daily nutritional intake.', 'approved'
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND NOT EXISTS (SELECT 1 FROM product_benefits WHERE product_id = p.id);

INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 2, 'antioxidant', 'Natural Antioxidant Support', 'Moringa contains natural antioxidants, including vitamin A and vitamin C, which help support your body''s daily wellness as part of a balanced diet.', 'approved'
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_benefits WHERE product_id = p.id) < 2;

INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 3, 'bone', 'Calcium & Magnesium', 'Moringa powder naturally contains calcium and magnesium, minerals that are part of a balanced daily nutritional routine.', 'approved'
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_benefits WHERE product_id = p.id) < 3;

INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 4, 'protein', 'Plant-Based Protein', 'Moringa is a plant-based food that contains protein as part of its natural nutritional profile, making it a simple addition to an active, balanced lifestyle.', 'approved'
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_benefits WHERE product_id = p.id) < 4;

INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 5, 'leaf', 'Traditional Botanical Wellness', 'Moringa, known as Shigru in traditional Indian wellness practices, has a long history of use as part of everyday nutrition and botanical wellness.', 'approved'
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_benefits WHERE product_id = p.id) < 5;

INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 6, 'balance', 'Balanced Everyday Nutrition', 'Moringa contains a range of naturally occurring plant compounds that make it a simple, balanced addition to your everyday nutritional routine.', 'approved'
FROM products p WHERE p.slug = 'moringa-leaf-powder' AND (SELECT count(*) FROM product_benefits WHERE product_id = p.id) < 6;

-- ============ PRODUCT BENEFITS (Amla) ============
INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 1, 'vitamin-c', 'Natural Vitamin C', 'Amla is widely known as one of nature''s richest sources of vitamin C, supporting your daily wellness as part of a balanced diet.', 'approved'
FROM products p WHERE p.slug = 'amla-powder' AND NOT EXISTS (SELECT 1 FROM product_benefits WHERE product_id = p.id);

INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 2, 'antioxidant', 'Antioxidant Support', 'Amla contains natural antioxidants that help support your body''s everyday wellness routine.', 'approved'
FROM products p WHERE p.slug = 'amla-powder' AND (SELECT count(*) FROM product_benefits WHERE product_id = p.id) < 2;

INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 3, 'leaf', 'Traditional Wellness Heritage', 'Amla has been a cornerstone of Indian wellness traditions for centuries, valued for its natural nutritional properties.', 'approved'
FROM products p WHERE p.slug = 'amla-powder' AND (SELECT count(*) FROM product_benefits WHERE product_id = p.id) < 3;

INSERT INTO product_benefits (product_id, number, icon, title, description, status)
SELECT p.id, 4, 'glow', 'Natural Wellness Support', 'The natural compounds in amla make it a valuable addition to your daily nutritional and wellness routine.', 'approved'
FROM products p WHERE p.slug = 'amla-powder' AND (SELECT count(*) FROM product_benefits WHERE product_id = p.id) < 4;

-- ============ COUPONS ============
INSERT INTO coupons (code, discount_type, discount_value, is_active)
VALUES ('WELCOME10', 'percentage', 10, true)
ON CONFLICT (code) DO NOTHING;
