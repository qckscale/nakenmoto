"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Collection } from "@/types/product";
import { translate } from "@/lib/utils/lang/translate";
import { i18Link } from "@/lib/utils/lang/getLink";
import styles from "./CollectionFilter.module.scss";

interface Props {
  collections: Collection[];
  locale: "sv" | "en";
}

export function CollectionFilter({ collections, locale }: Props) {
  const searchParams = useSearchParams();
  const active = searchParams.get("collection") || "";

  return (
    <nav className={styles.filter}>
      <Link
        href={i18Link("shop", locale)}
        className={`${styles.link} ${active === "" ? styles.active : ""}`}
      >
        {translate("show_all", locale)}
      </Link>
      {collections.map((c) => (
        <Link
          key={c._id}
          href={i18Link(`shop?collection=${c.slug}`, locale)}
          className={`${styles.link} ${active === c.slug ? styles.active : ""}`}
        >
          {c.title}
        </Link>
      ))}
    </nav>
  );
}
