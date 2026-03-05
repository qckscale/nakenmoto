import { ARTICLES_GROQ, client } from "@/lib/sanity";
import { News } from "@/components/News/News";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal | NakenMoto",
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [articles] = await Promise.all([
    client.fetch<any[]>(ARTICLES_GROQ(0, 20, locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);

  return (
    <>
      <News articles={articles} />
    </>
  );
}
