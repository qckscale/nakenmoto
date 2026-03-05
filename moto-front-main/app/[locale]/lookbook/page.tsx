import { ALL_WORK_GROQ, client } from "@/lib/sanity";
import Work from "@/components/Work/Work";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lookbook | NakenMoto",
};

export default async function LookbookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [work] = await Promise.all([
    client.fetch<any>(ALL_WORK_GROQ(locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);

  return (
    <>
      <Work work={work} isHome={false} />
    </>
  );
}
