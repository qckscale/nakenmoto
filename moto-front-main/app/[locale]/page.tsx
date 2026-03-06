import { HOMEPAGE_GROQ, client } from "@/lib/sanity";
import styles from "./page.module.scss";
import { News } from "@/components/News/News";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { ProductContent, Product } from "@/types/product";
import { ProductGrid } from "@/components/ProductGrid/ProductGrid";
import { getAllProductPricing } from "@/lib/supabase/products";
import { translate } from "@/lib/utils/lang/translate";
import { HeroSlider } from "@/components/HeroSlider/HeroSlider";
import Link from "next/link";
import { i18Link } from "@/lib/utils/lang/getLink";

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
  const { page, articles, collections } = data || {};

  const pricingMap = new Map(allPricing.map((p) => [p.sanity_id, p]));
  const featuredContent: ProductContent[] =
    page?.homePage?.featuredProducts || [];
  const featuredProducts: Product[] = featuredContent
    .filter((pc) => pricingMap.has(pc._id))
    .map((pc) => ({
      ...pc,
      pricing: pricingMap.get(pc._id)!,
    }));

  const heroSlides = page?.homePage?.heroSlides || [];

  // Collection spotlight — rotate daily
  const validCollections = (collections || []).filter(
    (c: any) => c.products && c.products.length > 0
  );
  const dayIndex =
    validCollections.length > 0
      ? Math.floor(Date.now() / 86400000) % validCollections.length
      : 0;
  const spotlightCollection = validCollections[dayIndex] as
    | { title: string; slug: string; products: ProductContent[] }
    | undefined;

  const spotlightProducts: Product[] = (spotlightCollection?.products || [])
    .filter((pc) => pricingMap.has(pc._id))
    .map((pc) => ({
      ...pc,
      pricing: pricingMap.get(pc._id)!,
    }));

  return (
    <main className={styles.homepageContainer}>
      <HeroSlider
        slides={heroSlides}
        ctaLabel={page?.homePage?.ctaPrimary}
        locale={locale}
      />
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
        <News isHome title={page?.homePage?.newsTitle} articles={articles} />
        {spotlightCollection && spotlightProducts.length > 0 && (
          <section className="container-width container-width-page">
            <div className={styles.spotlightHeader}>
              <h2 className="heading-2">{spotlightCollection.title}</h2>
              <Link
                href={i18Link(
                  `collections/${spotlightCollection.slug}`,
                  locale
                )}
                className={styles.spotlightLink}
              >
                {translate("view_collection", locale as "sv" | "en")} &rarr;
              </Link>
            </div>
            <ProductGrid products={spotlightProducts} locale={locale} />
          </section>
        )}
        <ContactForm />
      </div>
    </main>
  );
}
