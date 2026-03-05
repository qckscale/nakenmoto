import { HOMEPAGE_GROQ, client } from "@/lib/sanity";
import styles from "./page.module.scss";
import { Services } from "@/components/Services/Services";
import Link from "next/link";
import { News } from "@/components/News/News";
import { ContactForm } from "@/components/ContactForm/ContactForm";
import { i18Link } from "@/lib/utils/lang/getLink";
import Work from "@/components/Work/Work";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [data] = await Promise.all([
    client.fetch<any>(HOMEPAGE_GROQ(locale), {}, { next: { revalidate: 60 } }),
  ]);
  const { page, articles, work } = data;

  return (
    <main className={styles.homepageContainer}>
      <section
        className={styles.heroSection}
        style={{
          background: page.homePage?.heroImage
            ? `url(${page.homePage.heroImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div className="container-width">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {page.homePage?.title || "NakenMoto"}
            </h1>
            <div className={styles.heroCta}>
              <Link tabIndex={-1} href={i18Link("shop", locale)}>
                <button className="primary">
                  {page.homePage?.ctaPrimary || "Shop now"}
                </button>
              </Link>
              <Link tabIndex={-1} href={i18Link("page/about-us", locale)}>
                <button className="secondary">
                  {page.homePage?.ctaSecondary || "Our story"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div>
        <Services isHome services={page.homePage?.services || []} />
        <Work isHome work={work} />
        <News isHome title={page.homePage?.newsTitle} articles={articles} />
        <ContactForm services={page.homePage?.services || []} />
      </div>
    </main>
  );
}
