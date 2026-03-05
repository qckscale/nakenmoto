export type OrderStatus = "pending" | "confirmed" | "shipped" | "cancelled";

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  customer_email: string;
  customer_name: string;
  shipping_address: ShippingAddress;
  total_amount: number;
  currency: string;
  klarna_order_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image: string;
  size: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}
