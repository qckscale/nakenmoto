import { GET_ONE_CUSTOMER_CASE, WORK_SEO, client } from "@/lib/sanity";
import BlockContent from "@/components/BlockContent/BlockContent";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const item = await client.fetch<any>(
    WORK_SEO(slug, locale),
    {},
    { next: { revalidate: 60 } },
  );
  if (!item) notFound();

  return {
    title: `${item.seo?.title || item.title} | NakenMoto`,
    description: item.seo?.content || item.ingress,
  };
}

export default async function LookbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const [page] = await Promise.all([
    client.fetch<any>(GET_ONE_CUSTOMER_CASE(slug, locale), {}, { next: { revalidate: 60 } }),
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
