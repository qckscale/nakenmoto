import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product | NakenMoto",
};

export default async function ProductDetailPage() {
  return (
    <div className="container-width container-width-page">
      <h1 className="heading-2">Product</h1>
      <p style={{ textAlign: "center", color: "#6b6b6b" }}>Coming soon</p>
    </div>
  );
}
