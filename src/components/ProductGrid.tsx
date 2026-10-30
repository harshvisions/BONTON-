"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpDown, X } from "lucide-react";
import { Product, ProductCategory } from "@/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  egglessOnly: boolean;
  onToggleEggless: () => void;
  searchQuery: string;
  onClearSearch: () => void;
  onQuickView: (product: Product) => void;
}

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export default function ProductGrid({
  products,
  activeCategory,
  onSelectCategory,
  egglessOnly,
  onToggleEggless,
  searchQuery,
  onClearSearch,
  onQuickView,
}: ProductGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const categories: { label: string; value: ProductCategory }[] = [
    { label: "All Confections", value: "all" },
    { label: "Designer Cakes", value: "cakes" },
    { label: "Gourmet Pastries", value: "pastries" },
    { label: "Artisan Breads", value: "breads" },
    { label: "Cupcakes & Jars", value: "cupcakes" },
    { label: "Celebration Hampers", value: "hampers" },
  ];

  // Filter products by category, eggless, and search
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (activeCategory !== "all" && prod.category !== activeCategory) {
        return false;
      }
      // Eggless filter
      if (egglessOnly && !prod.isEggless) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesTagline = prod.tagline.toLowerCase().includes(q);
        const matchesFlavor = prod.flavor.toLowerCase().includes(q);
        const matchesCategory = prod.category.toLowerCase().includes(q);
        if (!matchesName && !matchesTagline && !matchesFlavor && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [products, activeCategory, egglessOnly, searchQuery]);

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "featured":
      default:
        return list.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return 0;
        });
    }
  }, [filteredProducts, sortBy]);

  return (
    <section id="menu-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Pills & Filters Header */}
      <div className="flex flex-col gap-6 border-b border-[#EBDDC6] pb-6">
        
        {/* Title & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[#D86C93] text-xs font-bold uppercase tracking-widest">
              <span>Haute Confectionery Menu</span>
            </div>
            <h2
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="text-2xl sm:text-4xl font-bold text-[#5A3E36] mt-1"
            >
              Artisanal Studio Collection
            </h2>
          </div>

          <div className="text-xs text-[#7D5A50]">
            Showing <span className="font-bold text-[#5A3E36]">{sortedProducts.length}</span> handcrafted delicacies
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#5A3E36] text-[#F4C6D7] shadow-sm font-bold"
                      : "bg-[#FFFDF9] text-[#5A3E36] border border-[#EBDDC6] hover:bg-[#FDF2F6] hover:border-[#F4C6D7]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Right Filters: Eggless & Sort Dropdown */}
          <div className="flex items-center gap-3">
            
            {/* Eggless Switch */}
            <button
              onClick={onToggleEggless}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                egglessOnly
                  ? "bg-[#15803D] text-white border-[#15803D]"
                  : "bg-[#FFFDF9] text-[#5A3E36] border-[#EBDDC6] hover:border-[#15803D]"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#15803D] border border-white" />
              <span>Eggless Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#EBDDC6] rounded-full px-3 py-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8E6D64]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-[#5A3E36] font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured / Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(activeCategory !== "all" || egglessOnly || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-[#8E6D64]">Active Filters:</span>
            
            {activeCategory !== "all" && (
              <span className="inline-flex items-center gap-1 bg-[#FDF2F6] text-[#5A3E36] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#F4C6D7]">
                Category: {activeCategory}
                <button
                  onClick={() => onSelectCategory("all")}
                  className="hover:text-black ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {egglessOnly && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                100% Eggless Only
                <button onClick={onToggleEggless} className="hover:text-black ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-[#FDF2F6] text-[#5A3E36] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#F4C6D7]">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={onClearSearch} className="hover:text-black ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={() => {
                onSelectCategory("all");
                if (egglessOnly) onToggleEggless();
                onClearSearch();
              }}
              className="text-xs text-[#D86C93] font-bold underline underline-offset-2 ml-2 hover:text-[#5A3E36]"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 bg-[#FFFDF9] rounded-3xl border border-[#EBDDC6] my-8 shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FDF2F6] border border-[#F4C6D7] flex items-center justify-center text-2xl">
            🧁
          </div>
          <h3
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="text-xl font-bold text-[#5A3E36]"
          >
            No Confections Found
          </h3>
          <p className="text-sm text-[#7D5A50] max-w-md mx-auto mt-2">
            We couldn&apos;t find any baked creations matching your current filters. Try resetting the filters to explore our full patisserie collection.
          </p>
          <button
            onClick={() => {
              onSelectCategory("all");
              if (egglessOnly) onToggleEggless();
              onClearSearch();
            }}
            className="mt-6 inline-flex items-center gap-2 bg-[#5A3E36] text-[#F4C6D7] font-bold text-xs px-6 py-3 rounded-full hover:bg-[#3D2721] transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95"
          >
            Show All Confections
          </button>
        </div>
      )}
    </section>
  );
}
