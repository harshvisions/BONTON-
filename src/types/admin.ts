export type AdminView = "inventory" | "discounts" | "orders";

export interface InventoryItem {
  id: string;
  name: string;
  tagline: string;
  category: "cakes" | "pastries" | "breads" | "cupcakes" | "hampers";
  basePrice: number;
  originalPrice: number;
  stock: number;
  isEggless: boolean;
  image: string;
  prepTime: string;
  sizes: { label: string; weight: string; priceMultiplier: number }[];
  status: "In Stock" | "Low Stock" | "Sold Out";
}

export interface DiscountRule {
  id: string;
  code: string;
  type: "percentage" | "flat";
  value: number;
  targetScope: "item" | "category" | "storewide";
  targetName: string;
  minOrder: number;
  maxDiscount: number;
  status: "Active" | "Inactive";
  usageCount: number;
  validUntil: string;
}

export interface OrderItem {
  id: string;
  name: string;
  weight: string;
  quantity: number;
  price: number;
  image: string;
  customMessage?: string;
}

export type FulfillmentStatus =
  | "Baking in Oven"
  | "Ready for Dispatch"
  | "Out for Chilled Delivery"
  | "Delivered"
  | "Cancelled";

export interface OrderTransaction {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: OrderItem[];
  slot: string;
  date: string;
  subtotal: number;
  discount: number;
  total: number;
  payment: {
    method: string;
    status: string;
  };
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  notes?: string;
}
