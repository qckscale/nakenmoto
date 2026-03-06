import { HOMEPAGE_GROQ, client } from "@/lib/sanity";
import styles from "./page.module.scss";
import Link from "next/link";
import { News } from "@/components/News/News";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { i18Link } from "@/lib/utils/lang/getLink";
import Work from "@/components/Work/Work";
import { ProductContent, Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid/ProductGrid";
import { getAllProductPricing } from "@/lib/supabase/products";
import { translate } from "@/lib/utils/lang/translate";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [data, allPricing] = await Promise.all([
    client.fetch<any>(HOMEPAGE_GROQ(locale), {}, { next: { revalidate: 60 } }),
    getAllProductPricing(),
  ]);
  const { page, articles, work } = data || {};

  const pricingMap = new Map(allPricing.map((p) => [p.sanity_id, p]));
  const featuredContent: ProductContent[] =
    page?.homePage?.featuredProducts || [];
  const featuredProducts: Product[] = featuredContent
    .filter((pc) => pricingMap.has(pc._id))
    .map((pc) => ({
      ...pc,
      pricing: pricingMap.get(pc._id)!,
    }));

  return (
    <main className={styles.homepageContainer}>
      <section
        className={styles.heroSection}
        style={{
          background: page?.homePage?.heroImage
            ? `url(${page.homePage.heroImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="container-width">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {page?.homePage?.title || "NakenMoto"}
            </h1>
            <div className={styles.heroCta}>
              <Link tabIndex={-1} href={i18Link("shop", locale)}>
                <button className="primary">
                  {page?.homePage?.ctaPrimary || "Shop now"}
                </button>
              </Link>
              <Link tabIndex={-1} href={i18Link("page/about-us", locale)}>
                <button className="secondary">
                  {page?.homePage?.ctaSecondary || "Our story"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div>
        {featuredProducts.length > 0 && (
          <section className="container-width container-width-page">
            <h2 className="heading-2">
              {page?.homePage?.featuredProductsTitle ||
                translate("featured_products", locale as "sv" | "en")}
            </h2>
            <ProductGrid products={featuredProducts} locale={locale} />
          </section>
        )}
        <Work isHome work={work} />
        <News isHome title={page?.homePage?.newsTitle} articles={articles} />
        <ContactForm />
      </div>
    </main>
  );
}
