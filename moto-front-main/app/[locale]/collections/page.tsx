import { SERVICE_GROQ, client } from "@/lib/sanity";
import { Services } from "@/components/Services/Services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections | NakenMoto",
};

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [services] = await Promise.all([
    client.fetch<any>(SERVICE_GROQ(locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);

  return (
    <>
      <Services topMargin={false} services={services} />
    </>
  );
}
