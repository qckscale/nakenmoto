import Link from "next/link";
import { translate } from "@/lib/utils/lang/translate";
import { i18Link } from "@/lib/utils/lang/getLink";
import styles from "./page.module.scss";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = (key: string) => translate(key, locale as "sv" | "en");

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>{t("checkout_coming_soon")}</h1>
      <p className={styles.text}>{t("checkout_coming_soon_body")}</p>
      <Link href={i18Link("shop", locale)} className={styles.link}>
        &larr; {t("continue_shopping")}
      </Link>
    </main>
  );
}
