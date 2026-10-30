"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
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
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
  } = useCart();

  const { user } = useAuth();
  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (!isCartOpen) return null;

  const handleApplyPromo = (codeToApply?: string) => {
    const code = codeToApply || promoInput;
    if (!code.trim()) return;
    const res = applyPromo(code);
    setPromoFeedback(res);
    if (res.success) {
      setPromoInput("");
    }
    setTimeout(() => setPromoFeedback(null), 4000);
  };

  const handleCheckout = () => {
    const generatedId = "BT-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setOrderPlaced(true);
    clearCart();
  };

  const deliveryProgress = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7EEDB] shadow-2xl flex flex-col border-l border-[#EBDDC6] animate-slide-right">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#FFFDF9] border-b border-[#EBDDC6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#5A3E36] text-[#F4C6D7] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  className="text-lg font-bold text-[#5A3E36]"
                >
                  Your Bon Ton Cart
                </h2>
                <p className="text-xs text-[#7D5A50]">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-[#F7EEDB] hover:bg-[#EBDDC6] text-[#5A3E36] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* If checkout completed */}
          {orderPlaced ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FFFDF9] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FDF2F6] border-2 border-[#F4C6D7] flex items-center justify-center text-[#D86C93] animate-bounce">
                <CheckCircle className="w-8 h-8 text-[#15803D]" />
              </div>
              <h3
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                className="text-2xl font-bold text-[#5A3E36]"
              >
                Order Confirmed!
              </h3>
              <div className="bg-[#F7EEDB] p-4 rounded-2xl border border-[#EBDDC6] text-xs space-y-1 w-full max-w-xs">
                <p className="text-[#7D5A50]">Booking ID</p>
                <p className="font-mono font-bold text-base text-[#5A3E36]">{orderId}</p>
                <p className="text-[#15803D] font-semibold pt-1">
                  Scheduled for {deliveryDate} &middot; {deliverySlot}
                </p>
              </div>
              <p className="text-xs text-[#7D5A50] max-w-xs leading-relaxed">
                Our Bulandshahr bakers are preheating the ovens. A live tracking dispatch update will be sent to your mobile.
              </p>
              <button
                onClick={() => {
                  setOrderPlaced(false);
                  closeCart();
                }}
                className="bg-[#5A3E36] text-[#F4C6D7] font-bold text-xs px-6 py-3 rounded-full hover:bg-[#3D2721] transition-colors cursor-pointer shadow-md"
              >
                Continue Exploring
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[#F7EEDB]">
              <div className="w-20 h-20 rounded-full bg-[#FFFDF9] border border-[#EBDDC6] flex items-center justify-center text-3xl shadow-sm">
                🎂
              </div>
              <h3
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                className="text-xl font-bold text-[#5A3E36]"
              >
                Your Cart is Empty
              </h3>
              <p className="text-xs text-[#7D5A50] max-w-xs leading-relaxed">
                Explore our signature Belgian truffle cakes, 100% pure eggless pastries, and handcrafted celebration hampers.
              </p>
              <button
                onClick={closeCart}
                className="bg-[#5A3E36] text-[#F4C6D7] font-bold text-xs px-6 py-3 rounded-full hover:bg-[#3D2721] transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
              >
                Browse Signature Menu
              </button>
            </div>
          ) : (
            /* Cart Items & Checkout Flow */
            <>
              {/* Free Delivery Meter */}
              <div className="bg-[#FFFDF9] border-b border-[#EBDDC6] px-4 py-3">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <div className="flex items-center gap-1.5 text-[#5A3E36]">
                    <Truck className="w-4 h-4 text-[#D86C93]" />
                    {amountNeededForFreeDelivery > 0 ? (
                      <span>
                        Add <span className="font-bold text-[#D86C93]">₹{amountNeededForFreeDelivery}</span> more for FREE Delivery!
                      </span>
                    ) : (
                      <span className="text-[#15803D] flex items-center gap-1 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Unlocked FREE Express Delivery!
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-[#7D5A50]">
                    ₹{subtotal} / ₹{freeDeliveryThreshold}
                  </span>
                </div>
                {/* Progress bar with Blush Pink gradient */}
                <div className="w-full bg-[#EBDDC6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F4C6D7] to-[#D86C93] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${deliveryProgress}%` }}
                  />
                </div>
              </div>

              {/* Scrollable Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FFFDF9] rounded-2xl p-3 border border-[#EBDDC6] shadow-xs flex gap-3 relative"
                  >
                    {/* Item Image */}
                    <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-[#F7EEDB] shrink-0 border border-[#EBDDC6]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5">
                        {item.isEggless && (
                          <div className="w-3.5 h-3.5 rounded-xs border border-[#15803D] bg-white flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                          </div>
                        )}
                        <h4 className="text-xs font-bold text-[#5A3E36] truncate">
                          {item.name}
                        </h4>
                      </div>

                      <p className="text-[11px] text-[#7D5A50] mt-0.5">
                        {item.weight} ({item.sizeLabel})
                      </p>

                      {/* Custom Message preview */}
                      {item.customMessage && (
                        <div className="mt-1 text-[10px] bg-[#FDF2F6] text-[#5A3E36] px-2 py-0.5 rounded-md border border-[#F4C6D7] italic truncate">
                          &ldquo;{item.customMessage}&rdquo;
                        </div>
                      )}

                      {/* Unit Price and Stepper */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono font-bold text-xs text-[#5A3E36]">
                          ₹{item.unitPrice * item.quantity}
                        </span>

                        <div className="flex items-center border border-[#EBDDC6] rounded-lg bg-[#F7EEDB] p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-white rounded text-[#5A3E36] transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-xs text-[#5A3E36]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center hover:bg-white rounded text-[#5A3E36] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-3 right-3 text-[#A3857C] hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Delivery Date & Time Slot Accordion */}
                <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#EBDDC6] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#5A3E36]">
                    <Clock className="w-4 h-4 text-[#D86C93]" />
                    <span>Choose Delivery Timing</span>
                  </div>

                  {/* Day Picker */}
                  <div className="grid grid-cols-2 gap-2">
                    {["Today", "Tomorrow"].map((day) => (
                      <button
                        key={day}
                        onClick={() => setDeliveryDate(day)}
                        className={`text-xs py-1.5 px-3 rounded-xl font-semibold border transition-all cursor-pointer ${
                          deliveryDate === day
                            ? "bg-[#5A3E36] text-[#F4C6D7] border-[#5A3E36]"
                            : "bg-[#F7EEDB] text-[#5A3E36] border-[#EBDDC6] hover:border-[#F4C6D7]"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* Slot selector */}
                  <div className="space-y-1.5">
                    {[
                      "Standard (4:00 PM - 7:00 PM)",
                      "Evening (7:00 PM - 10:00 PM)",
                      "Midnight Special (11:00 PM - 12:00 AM)",
                    ].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setDeliverySlot(slot)}
                        className={`w-full text-left text-xs p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          deliverySlot === slot
                            ? "bg-[#FDF2F6] border-[#F4C6D7] text-[#5A3E36] font-bold"
                            : "bg-[#FFFDF9] border-[#EBDDC6] text-[#7D5A50] hover:border-[#F4C6D7]"
                        }`}
                      >
                        <span>{slot}</span>
                        {deliverySlot === slot && (
                          <div className="w-2 h-2 rounded-full bg-[#D86C93]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo Coupon Section */}
                <div className="bg-[#FFFDF9] rounded-2xl p-3.5 border border-[#EBDDC6] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#5A3E36]">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-[#D86C93]" />
                      <span>Offers &amp; Coupons</span>
                    </div>
                  </div>

                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-[#F4F9F4] border border-[#A7D8A7] p-2.5 rounded-xl text-xs">
                      <div>
                        <div className="flex items-center gap-1 font-bold text-[#15803D]">
                          <span>{appliedPromo.code}</span>
                          <span className="text-[10px] font-normal">({appliedPromo.discountPercent}% OFF)</span>
                        </div>
                        <p className="text-[10px] text-[#4A724A]">{appliedPromo.description}</p>
                      </div>
                      <button
                        onClick={removePromo}
                        className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 bg-[#F7EEDB] border border-[#EBDDC6] rounded-xl px-3 py-1.5 text-xs text-[#5A3E36] uppercase placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
                        />
                        <button
                          onClick={() => handleApplyPromo()}
                          className="bg-[#5A3E36] hover:bg-[#3D2721] text-[#F4C6D7] font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Quick Coupon Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["BONTON20", "SWEET10"].map((code) => (
                          <button
                            key={code}
                            onClick={() => handleApplyPromo(code)}
                            className="text-[10px] font-mono font-semibold bg-[#FDF2F6] text-[#5A3E36] border border-[#F4C6D7] px-2 py-0.5 rounded-md hover:bg-[#F4C6D7] cursor-pointer"
                          >
                            +{code}
                          </button>
                        ))}
                      </div>

                      {promoFeedback && (
                        <p
                          className={`text-[11px] mt-1.5 font-medium ${
                            promoFeedback.success ? "text-[#15803D]" : "text-red-600"
                          }`}
                        >
                          {promoFeedback.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Bill Breakdown & Checkout Button */}
              <div className="bg-[#FFFDF9] p-4 sm:p-5 border-t border-[#EBDDC6] space-y-3">
                <div className="space-y-1.5 text-xs text-[#7D5A50]">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-mono text-[#5A3E36]">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#15803D] font-medium">
                      <span>Coupon Discount</span>
                      <span className="font-mono">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Express Delivery Fee</span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? (
                        <span className="text-[#15803D] font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-[#8E6D64]">
                    <span>Taxes &amp; Patisserie GST (5%)</span>
                    <span className="font-mono">₹{taxAmount}</span>
                  </div>

                  <div className="pt-2 border-t border-[#EBDDC6] flex justify-between text-base font-bold text-[#5A3E36]">
                    <span>To Pay</span>
                    <span className="font-mono text-[#5A3E36]">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-between bg-[#5A3E36] hover:bg-[#3D2721] text-[#F4C6D7] font-bold py-3.5 px-5 rounded-2xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-[#F7EEDB]/80 font-normal">
                      {totalItemsCount} items &middot; {deliveryDate}
                    </span>
                    <span>Proceed to Checkout</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base">
                    <span>₹{totalAmount}</span>
                    <ArrowRight className="w-4 h-4 text-[#F4C6D7]" />
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
