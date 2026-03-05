"use client";
import Link from "next/link";
import styles from "./Services.module.scss";
import { translate } from "@/lib/utils/lang/translate";
import { usePathname } from "next/navigation";
import { i18Link } from "@/lib/utils/lang/getLink";

interface ServicesProps {
  services: any[];
  topMargin?: boolean;
  isHome?: boolean;
}

export function Services({
  services,
  topMargin = true,
  isHome = false,
}: ServicesProps) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  return (
    <section
      className={`${styles.services} ${
        isHome ? "" : "container-width-page"
      } container-width ${topMargin ? "" : styles.blockMt}`}
    >
      <div className={`${isHome ? "d-flex justify-between" : ""}`}>
        <h2 className="heading-2">{translate("collections", locale)}</h2>
        {isHome && (
          <div>
            <Link href={i18Link("collections", locale)}>
              <button tabIndex={-1} className="secondary">
                {translate("show_all", locale)}{" "}
                <span className="hide-on-mob">
                  {translate("collections", locale)}
                </span>
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className={styles.servicesContainer}>
        {services?.map((s: any) => (
          <Link
            className={styles.servicesItem}
            key={s.title}
            href={i18Link(`collections/${s.url}`, locale)}
          >
            {s.icon && (
              <img
                className={styles.servicesItemIcon}
                src={`${s.icon}?auto=format&w=64`}
                alt={s.title}
              />
            )}
            <div>
              <h3 className="heading-3">{s.title}</h3>
              <p className={styles.servicesItemDescription}>{s.ingress}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
