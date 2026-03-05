"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { i18Link } from "@/lib/utils/lang/getLink";

export default function CartPage() {
  const { openDrawer } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";

  useEffect(() => {
    openDrawer();
    router.replace(i18Link("shop", locale));
  }, [openDrawer, router, locale]);

  return null;
}
