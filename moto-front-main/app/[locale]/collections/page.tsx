import { COLLECTIONS_GROQ, client } from "@/lib/sanity";
import { Collection } from "@/types/product";
import { Metadata } from "next";
import Link from "next/link";
import { i18Link } from "@/lib/utils/lang/getLink";
import { translate } from "@/lib/utils/lang/translate";

export const metadata: Metadata = {
  title: "Collections | NakenMoto",
};

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const collections = await client.fetch<Collection[]>(
    COLLECTIONS_GROQ(locale || "en"),
    {},
    { next: { revalidate: 60 } }
  );

  return (
    <div className="container-width container-width-page">
      <h1 className="heading-2">{translate("collections", locale as "sv" | "en")}</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
        {collections?.map((col) => (
          <Link
            key={col._id}
            href={i18Link(`shop?collection=${col.slug}`, locale as string)}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {col.image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`${col.image}?auto=format&w=600&q=80`}
                alt={col.title}
                style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }}
              />
            )}
            <h3 className="heading-3" style={{ marginTop: "0.5rem" }}>
              {col.title}
            </h3>
            {col.description && <p>{col.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
