"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Star, Clock, Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { Product, ProductSize } from "@/types";
import { useCart } from "@/context/CartContext";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState("");
  const [activeImage, setActiveImage] = useState<string>("");
  const [isAdded, setIsAdded] = useState(false);

  // Sync state when product opens
  useEffect(() => {
    if (product) {
      setSelectedSizeIndex(0);
      setQuantity(1);
      setCustomMessage("");
      setActiveImage(product.image);
      setIsAdded(false);
    }
  }, [product]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const selectedSize: ProductSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const unitPrice = Math.round(product.price * selectedSize.priceMultiplier);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    setIsAdded(true);
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      sizeLabel: selectedSize.label,
      weight: selectedSize.weight,
      unitPrice: unitPrice,
      quantity: quantity,
      customMessage: customMessage.trim() || undefined,
      isEggless: product.isEggless,
    });
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 600);
  };

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-[#FFFDF9] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#EBDDC6] z-10 animate-modal-in max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#FFFDF9] hover:bg-[#FDF2F6] text-[#5A3E36] flex items-center justify-center shadow-md border border-[#EBDDC6] transition-transform hover:scale-105 cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          
          {/* Left Column: Visual Gallery */}
          <div className="p-6 bg-[#F7EEDB] flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-md border border-[#EBDDC6]">
              <Image
                src={activeImage || product.image}
                alt={product.name}
                fill
                className="object-cover transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>

            {/* Thumbnail selector if multiple images */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      (activeImage || product.image) === img
                        ? "border-[#F4C6D7] scale-105 shadow-sm"
                        : "border-[#EBDDC6] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Dietary purity badge */}
            <div className="mt-4 flex items-center justify-between text-xs text-[#7D5A50]">
              <span className="flex items-center gap-1.5 font-semibold">
                {product.isEggless ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
                    <span className="text-[#15803D]">100% Eggless Kitchen Certified</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]" />
                    <span>Traditional Recipe (With Eggs)</span>
                  </>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D86C93]" />
                <span>{product.prepTime}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Details & Custom Inscription */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-[#FFFDF9]">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D86C93] bg-[#FDF2F6] px-2.5 py-0.5 rounded-full border border-[#F4C6D7]">
                  {product.category}
                </span>

                <div className="flex items-center gap-1 bg-[#FDF2F6] border border-[#F4C6D7]/60 px-2 py-0.5 rounded-md text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#DF688E] text-[#DF688E]" />
                  <span className="font-bold text-[#5A3E36]">{product.rating}</span>
                  <span className="text-[#8E6D64]">({product.reviewsCount})</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                className="text-xl sm:text-2xl font-bold text-[#5A3E36] leading-snug"
              >
                {product.name}
              </h3>
              <p className="text-xs text-[#7D5A50] mt-1.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size / Weight Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8E6D64]">
                <span className="font-semibold text-[#5A3E36]">Select Size / Portion:</span>
                {selectedSize.serves && (
                  <span className="text-[#D86C93] font-medium">{selectedSize.serves}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((size, idx) => {
                  const isSelected = selectedSizeIndex === idx;
                  const price = Math.round(product.price * size.priceMultiplier);
                  return (
                    <button
                      key={size.weight}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#5A3E36] text-[#F4C6D7] border-[#5A3E36] shadow-xs"
                          : "bg-[#F7EEDB] border-[#EBDDC6] text-[#5A3E36] hover:border-[#F4C6D7]"
                      }`}
                    >
                      <div className="font-bold text-xs">{size.weight}</div>
                      <div className="text-[10px] opacity-80">{size.label} &middot; ₹{price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Cake Message (if cake category) */}
            {(product.category === "cakes" || product.category === "cupcakes") && (
              <div>
                <label className="block text-xs font-semibold text-[#5A3E36] mb-1">
                  Custom Inscription on Cake / Gift Card:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={32}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="e.g. Happy Birthday Maya! 🎉"
                    className="w-full bg-[#F7EEDB] border border-[#EBDDC6] rounded-xl px-3 py-2 text-xs text-[#5A3E36] placeholder-[#94766E] focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8E6D64]">
                    {32 - customMessage.length} left
                  </span>
                </div>
              </div>
            )}

            {/* Ingredients Tags */}
            {product.ingredients && (
              <div>
                <span className="text-[11px] font-semibold text-[#8E6D64] block mb-1">
                  Key Ingredients:
                </span>
                <div className="flex flex-wrap gap-1">
                  {product.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#FDF2F6] text-[#5A3E36] px-2 py-0.5 rounded-md border border-[#F4C6D7]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions: Quantity Stepper & Add to Cart */}
            <div className="pt-4 border-t border-[#EBDDC6] flex items-center justify-between gap-4">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#EBDDC6] rounded-xl bg-[#F7EEDB] p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-[#5A3E36] hover:bg-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-xs text-[#5A3E36]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center text-[#5A3E36] hover:bg-white rounded-lg transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className="flex-1 flex items-center justify-center gap-2 bg-[#5A3E36] hover:bg-[#3D2721] text-[#F4C6D7] font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer disabled:opacity-80 active:scale-95"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#F4C6D7]" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#F4C6D7]" />
                    <span>Add to Cart &middot; ₹{totalPrice}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
