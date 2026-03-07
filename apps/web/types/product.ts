export interface ProductImage {
  _key: string;
  url: string;
  alt: string | null;
  lqip: string;
}

export interface Collection {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
}

// Content from Sanity
export interface ProductContent {
  _id: string;
  name: string;
  slug: string;
  description: any[];
  images: ProductImage[];
  collection: { title: string; slug: string } | null;
}

// Pricing/inventory from Supabase
export interface ProductPricing {
  sanity_id: string;
  price_sek: number;
  price_eur: number;
  compare_at_price_sek: number | null;
  compare_at_price_eur: number | null;
  variants: ProductVariant[];
}

export interface ProductVariant {
  size: string;
  stock_count: number;
  sku: string | null;
}

// Combined for display
export interface Product extends ProductContent {
  pricing: ProductPricing;
}
