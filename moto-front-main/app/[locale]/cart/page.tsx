import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | NakenMoto",
};

export default async function CartPage() {
  return (
    <div className="container-width container-width-page">
      <h1 className="heading-2">Cart</h1>
      <p style={{ textAlign: "center", color: "#6b6b6b" }}>Your cart is empty</p>
    </div>
  );
}
