import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import styles from "./ProductGrid.module.scss";

interface Props {
  products: Product[];
  locale: string;
}

export function ProductGrid({ products, locale }: Props) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} locale={locale} />
      ))}
    </div>
  );
}
