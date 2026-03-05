import { GET_ONE_SERVICE_GROQ, SERVICE_SEO, client } from "@/lib/sanity";
import BlockContent from "@/components/BlockContent/BlockContent";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const service = await client.fetch<any>(
    SERVICE_SEO(slug, locale),
    {},
    { next: { revalidate: 60 } },
  );
  if (!service) notFound();

  return {
    title: `${service.seo?.title || service.title} | NakenMoto`,
    description: service.seo?.content || service.ingress,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [page] = await Promise.all([
    client.fetch<any>(GET_ONE_SERVICE_GROQ(slug, locale), {}, { next: { revalidate: 60 } }),
  ]);
  if (!page) notFound();

  return (
    <>
      <div className="container-width container-width-page small">
        <h1 className="heading-2">{page.title}</h1>
        <BlockContent content={page.content}></BlockContent>
      </div>
    </>
  );
}
