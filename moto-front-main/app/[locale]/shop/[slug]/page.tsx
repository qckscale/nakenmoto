import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PRODUCT_BY_SLUG_GROQ, PRODUCT_SEO, client } from "@/lib/sanity";
import { Product } from "@/types/product";
import { ProductDetail } from "./ProductDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const data = await client.fetch<any>(
    PRODUCT_SEO(slug, locale),
    {},
    { next: { revalidate: 60 } }
  );
  return {
    title: data?.seo?.title || data?.name || "Product | NakenMoto",
    description: data?.seo?.content || "",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const product = await client.fetch<Product | null>(
    PRODUCT_BY_SLUG_GROQ(slug, locale),
    {},
    { next: { revalidate: 60 } }
  );

  if (!product) notFound();

  return <ProductDetail product={product} locale={locale as "sv" | "en"} />;
}
