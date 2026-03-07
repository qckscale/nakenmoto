import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/formatPrice";
import { getLocalizedPrice } from "@/lib/utils/getLocalizedPrice";
import { i18Link } from "@/lib/utils/lang/getLink";
import styles from "./ProductCard.module.scss";

interface Props {
  product: Product;
  locale: string;
}

export function ProductCard({ product, locale }: Props) {
  const imageUrl = product.images?.[0]?.url;
  const { price, compareAtPrice, currency } = getLocalizedPrice(
    product.pricing,
    locale
  );
  const isOnSale = compareAtPrice != null && compareAtPrice > price;

  return (
    <Link
      href={i18Link(`shop/${product.slug}`, locale)}
      className={styles.card}
    >
      <div className={styles.imageWrap}>
        {imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={styles.image}
            src={`${imageUrl}?auto=format&w=600&q=80`}
            alt={product.name}
            loading="lazy"
          />
        )}
      </div>
      <div className={styles.info}>
        {product.collection && (
          <span className={styles.collection}>{product.collection.title}</span>
        )}
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceBlock}>
          <span className={isOnSale ? styles.salePrice : undefined}>
            {formatPrice(price, locale, currency)}
          </span>
          {isOnSale && (
            <span className={styles.comparePrice}>
              {formatPrice(compareAtPrice!, locale, currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
