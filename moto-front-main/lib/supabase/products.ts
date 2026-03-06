import { getSupabase } from "./client";

export interface DbProductPricing {
  sanity_id: string;
  price_sek: number;
  price_eur: number;
  compare_at_price_sek: number | null;
  compare_at_price_eur: number | null;
  variants: DbProductVariant[];
}

export interface DbProductVariant {
  size: string;
  stock_count: number;
  sku: string | null;
}

export async function getProductPricing(
  sanityId: string
): Promise<DbProductPricing | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: product } = await supabase
    .from("products")
    .select("id, sanity_id, price_sek, price_eur, compare_at_price_sek, compare_at_price_eur")
    .eq("sanity_id", sanityId)
    .eq("active", true)
    .single();

  if (!product) return null;

  const { data: variants } = await supabase
    .from("product_variants")
    .select("size, stock_count, sku")
    .eq("product_id", product.id)
    .order("size");

  return {
    sanity_id: product.sanity_id,
    price_sek: product.price_sek,
    price_eur: product.price_eur,
    compare_at_price_sek: product.compare_at_price_sek,
    compare_at_price_eur: product.compare_at_price_eur,
    variants: variants || [],
  };
}

export async function getAllProductPricing(): Promise<DbProductPricing[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: products } = await supabase
    .from("products")
    .select("id, sanity_id, price_sek, price_eur, compare_at_price_sek, compare_at_price_eur")
    .eq("active", true);

  if (!products || products.length === 0) return [];

  const productIds = products.map((p) => p.id);
  const { data: allVariants } = await supabase
    .from("product_variants")
    .select("product_id, size, stock_count, sku")
    .in("product_id", productIds)
    .order("size");

  return products.map((p) => ({
    sanity_id: p.sanity_id,
    price_sek: p.price_sek,
    price_eur: p.price_eur,
    compare_at_price_sek: p.compare_at_price_sek,
    compare_at_price_eur: p.compare_at_price_eur,
    variants: (allVariants || [])
      .filter((v) => v.product_id === p.id)
      .map(({ size, stock_count, sku }) => ({ size, stock_count, sku })),
  }));
}

export async function decrementStock(
  productId: string,
  size: string,
  quantity: number
) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.rpc("decrement_stock", {
    p_product_id: productId,
    p_size: size,
    p_quantity: quantity,
  });
  if (error) throw error;
  return data;
}
