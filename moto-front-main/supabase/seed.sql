-- Seed product data in Supabase
-- Auto-runs on `supabase db reset`. Can also be run manually in SQL Editor.
--
-- To add more products later, copy a row and replace the sanity_id
-- (find IDs via Sanity Studio → Vision tab: *[_type == "product"]{_id, name})

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
