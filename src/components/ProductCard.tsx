"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Eye, Plus, Minus, Check, Clock } from "lucide-react";
import { Product, ProductSize } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const selectedSize: ProductSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const currentPrice = Math.round(product.price * selectedSize.priceMultiplier);
  const currentOriginalPrice = Math.round(product.originalPrice * selectedSize.priceMultiplier);
  const discountPercent = Math.round(
    ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
  );

  // Check if this specific size is currently in cart
  const cartItemId = `${product.id}-${selectedSize.weight}-plain`;
  const existingCartItem = cartItems.find((item) => item.id === cartItemId);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      sizeLabel: selectedSize.label,
      weight: selectedSize.weight,
      unitPrice: currentPrice,
      quantity: 1,
      isEggless: product.isEggless,
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className="group bg-[#FFFDF9] rounded-2xl border border-[#EBDDC6] hover:border-[#F4C6D7] bakery-card-hover transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F7EEDB]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges: Eggless indicator & Discount/Bestseller */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isEggless ? (
            <div
              className="w-5 h-5 rounded-xs border-2 border-[#15803D] bg-white flex items-center justify-center shadow-xs"
              title="100% Eggless Certified"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#15803D]"></div>
            </div>
          ) : (
            <div
              className="w-5 h-5 rounded-xs border-2 border-[#B91C1C] bg-white flex items-center justify-center shadow-xs"
              title="Contains Egg"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]"></div>
            </div>
          )}

          {product.isBestseller && (
            <span className="bg-[#5A3E36] text-[#F4C6D7] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider border border-[#F4C6D7]/30">
              Bestseller
            </span>
          )}

          {product.isChefSpecial && !product.isBestseller && (
            <span className="bg-[#FDF2F6] text-[#5A3E36] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider border border-[#F4C6D7]">
              Chef&apos;s Special
            </span>
          )}
        </div>

        {/* Top Right: Discount Badge in Blush Pink */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-[#F4C6D7] text-[#5A3E36] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs border border-[#5A3E36]/10">
            {discountPercent}% OFF
          </div>
        )}

        {/* Hover Quick View Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-4 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#FFFDF9]/95 backdrop-blur-xs hover:bg-[#FDF2F6] text-[#5A3E36] text-xs font-semibold py-2 px-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transform translate-y-2 group-hover:translate-y-0 cursor-pointer border border-[#EBDDC6]"
        >
          <Eye className="w-3.5 h-3.5 text-[#D86C93]" />
          <span>Quick View &amp; Inscribe Message</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3 bg-[#FFFDF9]">
        
        {/* Rating & Prep Time */}
        <div className="flex items-center justify-between text-xs text-[#7D5A50]">
          <div className="flex items-center gap-1 bg-[#FDF2F6] border border-[#F4C6D7]/60 px-2 py-0.5 rounded-md">
            <Star className="w-3.5 h-3.5 fill-[#DF688E] text-[#DF688E]" />
            <span className="font-bold text-[#5A3E36]">{product.rating}</span>
            <span className="text-[#8E6D64]">({product.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#7D5A50]">
            <Clock className="w-3 h-3 text-[#D86C93]" />
            <span>{product.prepTime}</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <div>
          <h3
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="text-base sm:text-lg font-bold text-[#5A3E36] group-hover:text-[#3D2721] transition-colors line-clamp-1"
          >
            {product.name}
          </h3>
          <p className="text-xs text-[#7D5A50] line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Size / Weight Selector Pills */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-[#8E6D64]">
            <span>Select Size / Weight:</span>
            {selectedSize.serves && (
              <span className="text-[#D86C93] font-medium">{selectedSize.serves}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size, idx) => {
              const isSelected = selectedSizeIndex === idx;
              return (
                <button
                  key={size.weight}
                  onClick={() => setSelectedSizeIndex(idx)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#5A3E36] text-[#F4C6D7] font-bold shadow-xs"
                      : "bg-[#F7EEDB] text-[#5A3E36] hover:bg-[#EBDDC6]"
                  }`}
                >
                  {size.weight}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-[#EBDDC6] flex items-center justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold font-mono text-[#5A3E36]">
                ₹{currentPrice}
              </span>
              {currentOriginalPrice > currentPrice && (
                <span className="text-xs font-mono text-[#8E6D64] line-through">
                  ₹{currentOriginalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#8E6D64]">Taxes incl.</span>
          </div>

          {/* Add to Cart or Stepper if already added */}
          {existingCartItem ? (
            <div className="flex items-center bg-[#5A3E36] text-white rounded-xl p-1 gap-2 shadow-xs">
              <button
                onClick={() => updateQuantity(cartItemId, -1)}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-xs px-1 text-[#F4C6D7]">
                {existingCartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(cartItemId, 1)}
                className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="inline-flex items-center gap-1.5 bg-[#5A3E36] hover:bg-[#3D2721] text-[#F4C6D7] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-80 active:scale-95"
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#F4C6D7]" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
