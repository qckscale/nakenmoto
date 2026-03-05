"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils/formatPrice";
import { translate } from "@/lib/utils/lang/translate";
import BlockContent from "@/components/BlockContent/BlockContent";
import styles from "./ProductDetail.module.scss";

interface Props {
  product: Product;
  locale: "sv" | "en";
}

export function ProductDetail({ product, locale }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(
      {
        id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: product.images[0]?.url || "",
      },
      selectedSize
    );
  };

  const isOnSale =
    product.compareAtPrice != null && product.compareAtPrice > product.price;
  const currentImage = product.images?.[activeImage];

  return (
    <div className="container-width container-width-page">
      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            {currentImage && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`${currentImage.url}?auto=format&w=900&q=85`}
                alt={currentImage.alt || product.name}
                className={styles.image}
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img, i) => (
                <button
                  key={img._key}
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${img.url}?auto=format&w=120&q=80`}
                    alt={img.alt || `${product.name} ${i + 1}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          {product.collection && (
            <span className={styles.collection}>
              {product.collection.title}
            </span>
          )}
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.priceBlock}>
            <span className={isOnSale ? styles.salePrice : styles.price}>
              {formatPrice(product.price, locale)}
            </span>
            {isOnSale && (
              <span className={styles.comparePrice}>
                {formatPrice(product.compareAtPrice!, locale)}
              </span>
            )}
          </div>

          {product.sizes?.length > 0 && (
            <div className={styles.sizeSection}>
              <span className={styles.sizeLabel}>
                {translate("select_size", locale)}
              </span>
              <div className={styles.sizes}>
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className={styles.addToCart}
            disabled={!selectedSize}
            onClick={handleAddToCart}
          >
            {translate("add_to_cart", locale)}
          </button>

          {product.description && (
            <div className={styles.description}>
              <BlockContent content={product.description} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
