"use client";

import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils/formatPrice";
import { CartItem } from "@/types/cart";
import styles from "./CartLineItem.module.scss";

interface Props {
  item: CartItem;
  locale: string;
}

export function CartLineItem({ item, locale }: Props) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className={styles.lineItem}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.image}
        src={`${item.product.image}?auto=format&w=128&q=80`}
        alt={item.product.name}
        width={64}
        height={80}
      />
      <div className={styles.details}>
        <div className={styles.name}>{item.product.name}</div>
        <div className={styles.size}>{item.size}</div>
        <div className={styles.controls}>
          <button
            className={styles.qtyBtn}
            onClick={() =>
              updateQuantity(item.productId, item.size, item.quantity - 1)
            }
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span className={styles.qty}>{item.quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() =>
              updateQuantity(item.productId, item.size, item.quantity + 1)
            }
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.lineTotal}>
          {formatPrice(item.product.price * item.quantity, locale)}
        </div>
        <button
          className={styles.remove}
          onClick={() => removeItem(item.productId, item.size)}
          aria-label="Remove item"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
