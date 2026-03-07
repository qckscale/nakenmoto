export interface CartItem {
  productId: string;
  size: string;
  quantity: number;
  product: {
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    image: string;
    currency: "SEK" | "EUR";
  };
}
