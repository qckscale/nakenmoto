import { SERVICE_GROQ, client } from "@/lib/sanity";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Contact | NakenMoto",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [services] = await Promise.all([
    client.fetch<any>(SERVICE_GROQ(locale || "en"), {}, { next: { revalidate: 60 } }),
  ]);
  if (!services) notFound();

  return (
    <div className="container-width container-width-page">
      <ContactForm services={services} />
    </div>
  );
}
