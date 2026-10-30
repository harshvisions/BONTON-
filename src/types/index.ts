export type ProductCategory = "all" | "cakes" | "pastries" | "breads" | "cupcakes" | "hampers";

export interface ProductSize {
  label: string;
  weight: string;
  priceMultiplier: number;
  serves?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: "cakes" | "pastries" | "breads" | "cupcakes" | "hampers";
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  description: string;
  flavor: string;
  sizes: ProductSize[];
  isEggless: boolean;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  prepTime: string;
  ingredients: string[];
}

export interface CartItem {
  id: string; // unique id per cart entry
  productId: string;
  name: string;
  image: string;
  category: string;
  sizeLabel: string;
  weight: string;
  unitPrice: number;
  quantity: number;
  customMessage?: string;
  isEggless: boolean;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
}

export interface OfferBanner {
  id: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  code: string;
  image: string;
  ctaText: string;
  categoryTarget: ProductCategory;
  accentColor: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  sweetCredits: number;
  tier: "Silver" | "Gold" | "Platinum";
}
