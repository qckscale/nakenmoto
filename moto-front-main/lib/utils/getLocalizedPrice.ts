import { ProductPricing } from "@/types/product";

export function getLocalizedPrice(pricing: ProductPricing, locale: string) {
  const isEur = locale === "en";
  return {
    price: isEur ? pricing.price_eur : pricing.price_sek,
    compareAtPrice: isEur
      ? pricing.compare_at_price_eur
      : pricing.compare_at_price_sek,
    currency: isEur ? ("EUR" as const) : ("SEK" as const),
  };
}
