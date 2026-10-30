"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, PromoCode } from "@/types";
import { PROMO_CODES } from "@/data/promos";

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  deliverySlot: string;
  setDeliverySlot: (slot: string) => void;
  deliveryDate: string;
  setDeliveryDate: (date: string) => void;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalAmount: number;
  totalItemsCount: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 799;
const STANDARD_DELIVERY_FEE = 99;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [deliverySlot, setDeliverySlot] = useState("Standard (4:00 PM - 7:00 PM)");
  const [deliveryDate, setDeliveryDate] = useState("Today");

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("bonton_cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch {
      // fallback to empty
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bonton_cart", JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    const id = `${newItem.productId}-${newItem.weight}-${newItem.customMessage || "plain"}`;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, { ...newItem, id }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const applyPromo = (rawCode: string): { success: boolean; message: string } => {
    const code = rawCode.trim().toUpperCase();
    const promo = PROMO_CODES[code];

    if (!promo) {
      return { success: false, message: "Invalid coupon code. Try 'BONTON20' or 'SWEET10'" };
    }

    if (subtotal < promo.minOrder) {
      return {
        success: false,
        message: `Min order of ₹${promo.minOrder} required for ${code}`,
      };
    }

    setAppliedPromo(promo);
    return {
      success: true,
      message: `Coupon ${code} applied! You saved ${promo.discountPercent}%`,
    };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Re-check promo validity when subtotal changes
  useEffect(() => {
    if (appliedPromo && subtotal < appliedPromo.minOrder) {
      setAppliedPromo(null);
    }
  }, [subtotal, appliedPromo]);

  const discountAmount = appliedPromo
    ? Math.min(
        Math.round((subtotal * appliedPromo.discountPercent) / 100),
        appliedPromo.maxDiscount
      )
    : 0;

  const deliveryFee =
    cartItems.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD
      ? 0
      : STANDARD_DELIVERY_FEE;

  // 5% patisserie GST
  const taxAmount = Math.round((subtotal - discountAmount) * 0.05);

  const totalAmount = Math.max(
    0,
    subtotal - discountAmount + deliveryFee + taxAmount
  );

  const totalItemsCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const amountNeededForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - subtotal
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        applyPromo,
        removePromo,
        deliverySlot,
        setDeliverySlot,
        deliveryDate,
        setDeliveryDate,
        subtotal,
        discountAmount,
        deliveryFee,
        taxAmount,
        totalAmount,
        totalItemsCount,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountNeededForFreeDelivery,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
