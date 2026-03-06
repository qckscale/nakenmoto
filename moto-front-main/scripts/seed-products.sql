-- Seed product data in Supabase
-- Run this in the Supabase SQL Editor after your Sanity products exist.
--
-- INSTRUCTIONS:
-- 1. Run this SQL in the Supabase Dashboard → SQL Editor
-- 2. To add more products later, copy a row and replace the sanity_id
--    (find IDs via Sanity Studio → Vision tab: *[_type == "product"]{_id, name})
-- 3. The variant loop below auto-generates S/M/L/XL for all active products

-- ============================================================
-- PRODUCTS
-- ============================================================

INSERT INTO products (sanity_id, price_sek, price_eur, compare_at_price_sek, compare_at_price_eur, active)
VALUES
  ('0b054f66-3c79-4e8e-8563-74efb5113ef8', 799, 69, NULL, NULL, true),
  ('ce14b1b7-f9dc-493a-9dbb-96bc2f82889d', 599, 52, NULL, NULL, true),
  ('c210b10d-7682-4bf4-98fe-10187d585950', 1099, 96, 1299, 113, true)
ON CONFLICT (sanity_id) DO UPDATE SET
  price_sek = EXCLUDED.price_sek,
  price_eur = EXCLUDED.price_eur,
  compare_at_price_sek = EXCLUDED.compare_at_price_sek,
  compare_at_price_eur = EXCLUDED.compare_at_price_eur,
  active = EXCLUDED.active;

-- ============================================================
-- VARIANTS — S, M, L, XL for each product
-- ============================================================

DO $$
DECLARE
  prod RECORD;
  sizes TEXT[] := ARRAY['S', 'M', 'L', 'XL'];
  s TEXT;
  slug TEXT;
  stock INT;
BEGIN
  FOR prod IN SELECT id, sanity_id FROM products WHERE active = true
  LOOP
    -- derive a short slug from the sanity_id for SKU generation
    slug := replace(prod.sanity_id, '-', '');
    slug := left(slug, 8);

    FOREACH s IN ARRAY sizes
    LOOP
      stock := 5 + floor(random() * 16)::int; -- random 5-20
      INSERT INTO product_variants (product_id, size, sku, stock_count)
      VALUES (
        prod.id,
        s,
        upper(slug || '-' || s),
        stock
      )
      ON CONFLICT (product_id, size) DO UPDATE SET
        stock_count = EXCLUDED.stock_count,
        sku = EXCLUDED.sku;
    END LOOP;
  END LOOP;
END $$;

-- Verify
SELECT p.sanity_id, p.price_sek, p.price_eur, v.size, v.stock_count, v.sku
FROM products p
JOIN product_variants v ON v.product_id = p.id
ORDER BY p.sanity_id, v.size;
