export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: any[];
  price: number;
  compareAtPrice: number | null;
  images: ProductImage[];
  sizes: string[];
  collection: { title: string; slug: string } | null;
}

export interface ProductImage {
  _key: string;
  url: string;
  alt: string | null;
  lqip: string;
}

export interface Collection {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
}
