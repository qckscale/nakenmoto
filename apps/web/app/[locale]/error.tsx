"use client";

import { usePathname } from "next/navigation";
import { translate } from "@/lib/utils/lang/translate";
import { i18Link } from "@/lib/utils/lang/getLink";
import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = (pathname.split("/")[1] || "en") as "sv" | "en";
  const t = (key: string) => translate(key, locale);

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "2.5rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: "1rem" }}>{t("error_heading")}</h1>
      <p style={{ color: "#6b6b6b", marginBottom: "2.5rem" }}>{t("error_body")}</p>
      <button onClick={reset} style={{ marginBottom: "1rem", cursor: "pointer", background: "none", border: "none", font: "inherit", textDecoration: "underline", textUnderlineOffset: "3px" }}>
        {t("try_again")}
      </button>
      <Link href={i18Link("shop", locale)} style={{ color: "#1a1a1a", textDecoration: "underline", textUnderlineOffset: "3px" }}>
        &larr; {t("back_to_shop")}
      </Link>
    </main>
  );
}
