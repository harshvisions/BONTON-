"use client";

import React from "react";
import Image from "next/image";
import { ProductCategory } from "@/types";

interface CategoryShowcaseProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
}

const CATEGORY_ITEMS: {
  id: ProductCategory;
  name: string;
  image: string;
  tag: string;
}[] = [
  {
    id: "all",
    name: "All Creations",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    tag: "Full Studio",
  },
  {
    id: "cakes",
    name: "Designer Cakes",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=400&q=80",
    tag: "Bestseller",
  },
  {
    id: "pastries",
    name: "Gourmet Pastries",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    tag: "Fresh Baked",
  },
  {
    id: "breads",
    name: "Artisan Breads",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80",
    tag: "48h Levain",
  },
  {
    id: "cupcakes",
    name: "Cupcakes & Jars",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=400&q=80",
    tag: "Party Favors",
  },
  {
    id: "hampers",
    name: "Luxury Hampers",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
    tag: "Gift Suites",
  },
];

export default function CategoryShowcase({
  activeCategory,
  onSelectCategory,
}: CategoryShowcaseProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="text-xl sm:text-2xl font-bold text-[#5A3E36]"
          >
            Explore by Culinary Atelier
          </h2>
          <p className="text-xs sm:text-sm text-[#7D5A50]">
            Every confection baked fresh daily in Bulandshahr using French butter &amp; Belgian cocoa
          </p>
        </div>
      </div>

      {/* Visual story grid / scrollable container */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar">
        {CATEGORY_ITEMS.map((item) => {
          const isSelected = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`flex flex-col items-center flex-shrink-0 group cursor-pointer focus:outline-none transition-transform ${
                isSelected ? "scale-105" : "hover:scale-102"
              }`}
            >
              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all ${
                  isSelected
                    ? "ring-3 ring-[#F4C6D7] ring-offset-2 ring-offset-[#F7EEDB] shadow-md shadow-[#F4C6D7]/40"
                    : "ring-1 ring-[#E2D2BC] group-hover:ring-[#F4C6D7]"
                }`}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-[#ECE0CA]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="100px"
                  />
                </div>

                {/* Micro badge */}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap transition-colors ${
                  isSelected
                    ? "bg-[#5A3E36] text-[#F4C6D7]"
                    : "bg-[#FDF2F6] text-[#5A3E36] border border-[#F4C6D7]"
                }`}>
                  {item.tag}
                </span>
              </div>

              <span
                className={`mt-2.5 text-xs sm:text-sm font-semibold transition-colors text-center ${
                  isSelected ? "text-[#5A3E36] font-bold" : "text-[#7D5A50] group-hover:text-[#5A3E36]"
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
