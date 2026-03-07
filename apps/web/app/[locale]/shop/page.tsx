import { Metadata } from "next";
import {
  ALL_PRODUCTS_GROQ,
  PRODUCTS_BY_COLLECTION_GROQ,
  COLLECTIONS_GROQ,
  client,
} from "@/lib/sanity";
import { ProductContent, Product, Collection } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid/ProductGrid";
import { CollectionFilter } from "@/components/CollectionFilter/CollectionFilter";
import { Suspense } from "react";
import { getAllProductPricing } from "@/lib/supabase/products";

export const metadata: Metadata = {
  title: "Shop | NakenMoto",
};

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ collection?: string }>;
}) {
  const { locale } = await params;
  const { collection } = await searchParams;

  const [productContent, collections, allPricing] = await Promise.all([
    collection
      ? client.fetch<ProductContent[]>(
          PRODUCTS_BY_COLLECTION_GROQ(collection, locale),
          {},
          { next: { revalidate: 60 } }
        )
      : client.fetch<ProductContent[]>(
          ALL_PRODUCTS_GROQ(locale),
          {},
          { next: { revalidate: 60 } }
        ),
    client.fetch<Collection[]>(
      COLLECTIONS_GROQ(locale),
      {},
      { next: { revalidate: 60 } }
    ),
    getAllProductPricing(),
  ]);

  const pricingMap = new Map(allPricing.map((p) => [p.sanity_id, p]));

  const products: Product[] = (productContent || [])
    .filter((pc) => pricingMap.has(pc._id))
    .map((pc) => ({
      ...pc,
      pricing: pricingMap.get(pc._id)!,
    }));

  return (
    <div className="container-width container-width-page">
      <h1 className="heading-2">Shop</h1>
      <Suspense>
        <CollectionFilter
          collections={collections || []}
          locale={locale as "sv" | "en"}
        />
      </Suspense>
      <ProductGrid products={products} locale={locale} />
    </div>
  );
}
