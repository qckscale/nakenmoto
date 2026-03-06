"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils/formatPrice";
import { translate } from "@/lib/utils/lang/translate";
import { i18Link } from "@/lib/utils/lang/getLink";
import { CartLineItem } from "@/components/CartLineItem/CartLineItem";
import Link from "next/link";
import styles from "./CartDrawer.module.scss";

export function CartDrawer() {
  const { items, cartTotal, cartCurrency, isDrawerOpen, closeDrawer } = useCart();
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (isDrawerOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      {isDrawerOpen && (
        <div className={styles.overlay} onClick={closeDrawer} />
      )}
      <aside
        className={`${styles.drawer} ${isDrawerOpen ? styles.open : ""}`}
        aria-hidden={!isDrawerOpen}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{translate("your_cart", locale)}</h2>
          <button
            className={styles.closeBtn}
            onClick={closeDrawer}
            aria-label={translate("close", locale)}
          >
            &times;
          </button>
        </div>

        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>{translate("empty_cart", locale)}</p>
              <Link
                href={i18Link("shop", locale)}
                className={styles.continueLink}
                onClick={closeDrawer}
              >
                {translate("continue_shopping", locale)}
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartLineItem
                key={`${item.productId}-${item.size}`}
                item={item}
                locale={locale}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>{translate("subtotal", locale)}</span>
              <span className={styles.subtotalAmount}>
                {formatPrice(cartTotal, locale, cartCurrency)}
              </span>
            </div>
            <Link
              href={i18Link("checkout", locale)}
              className={styles.checkoutBtn}
              onClick={closeDrawer}
            >
              {translate("proceed_to_checkout", locale)}
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
