import { PromoCode } from "@/types";

export const PROMO_CODES: Record<string, PromoCode> = {
  BONTON20: {
    code: "BONTON20",
    discountPercent: 20,
    maxDiscount: 500,
    minOrder: 799,
    description: "Flat 20% OFF on Bon Ton signature celebration cakes (Up to ₹500)"
  },
  SWEET10: {
    code: "SWEET10",
    discountPercent: 10,
    maxDiscount: 300,
    minOrder: 399,
    description: "10% OFF on all fresh bakes & pastries"
  },
  FIRSTSWEET: {
    code: "FIRSTSWEET",
    discountPercent: 15,
    maxDiscount: 400,
    minOrder: 499,
    description: "Welcome treat: 15% OFF for new patrons"
  },
  MIDNIGHT15: {
    code: "MIDNIGHT15",
    discountPercent: 15,
    maxDiscount: 350,
    minOrder: 899,
    description: "15% OFF for midnight birthday celebrations in Bulandshahr"
  }
};
