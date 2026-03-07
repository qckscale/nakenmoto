import { COLLECTION_BY_SLUG_GROQ, client } from "@/lib/sanity";
import { ProductGrid } from "@/components/ProductGrid/ProductGrid";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const collection = await client.fetch<any>(
    COLLECTION_BY_SLUG_GROQ(slug, locale),
    {},
    { next: { revalidate: 60 } },
  );
  if (!collection) notFound();

  return {
    title: `${collection.seo?.title || collection.title} | NakenMoto`,
    description: collection.seo?.content || collection.description,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const collection = await client.fetch<any>(
    COLLECTION_BY_SLUG_GROQ(slug, locale),
    {},
    { next: { revalidate: 60 } },
  );
  if (!collection) notFound();

  return (
    <div className="container-width">
      <h1 className="heading-2">{collection.title}</h1>
      {collection.description && (
        <p>{collection.description}</p>
      )}
      <ProductGrid products={collection.products || []} locale={locale} />
    </div>
  );
}
