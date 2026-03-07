"use client";
import Link from "next/link";
import styles from "./News.module.scss";
import { usePathname } from "next/navigation";
import { translate } from "@/lib/utils/lang/translate";
import { i18Link } from "@/lib/utils/lang/getLink";

interface NewsProps {
  articles: any[];
  title?: string;
  isHome?: boolean;
}
export function News({ articles, title, isHome = false }: NewsProps) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  title = title || translate("journal", locale);
  return (
    <>
      <section
        className={`${styles.news} container-width ${
          isHome ? "" : "container-width-page"
        }`}
      >
        <div className={`${isHome ? "d-flex justify-between" : ""}`}>
          <h2 className="heading-2">{title}</h2>
          {isHome && (
            <div>
              <Link href={i18Link("news", locale)}>
                <button tabIndex={-1} className="secondary">
                  {translate("show_all", locale)}{" "}
                  <span className="hide-on-mob">
                    {translate("journal", locale)}
                  </span>
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className={styles.newsContainer}>
          {articles?.map((s: any) => (
            <Link
              key={s.title}
              className={styles.newsContainerItem}
              href={i18Link(`news/${s.url}`, locale)}
            >
              <img src={`${s.thumbnail}?auto=format&w=404`} alt={s.title} />
              <div className={styles.newsContainerItemContent}>
                <h3 className="heading-3">{s.title}</h3>
                <p className={styles.newsItemDescription}>{s.ingress}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
