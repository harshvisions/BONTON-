"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowUp } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import CategoryShowcase from "@/components/CategoryShowcase";
import ProductGrid from "@/components/ProductGrid";
import QuickViewModal from "@/components/QuickViewModal";
import PincodeModal from "@/components/PincodeModal";
import WhyChooseUs from "@/components/WhyChooseUs";
import CustomerReviews from "@/components/CustomerReviews";
import Footer from "@/components/Footer";

import productsData from "@/data/products.json";
import { Product, ProductCategory } from "@/types";

export default function HomePage() {
  const products: Product[] = productsData as Product[];

  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const [egglessOnly, setEgglessOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bulandshahr (Yamunapuram 45-Min)");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  // Dynamic Scroll Progress and Floating Button Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      setIsScrolledDown(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectCategory = (cat: ProductCategory) => {
    setActiveCategory(cat);
    // Smooth scroll to product grid if triggered from hero or showcase
    const gridEl = document.getElementById("menu-grid");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleToggleEggless = () => {
    setEgglessOnly((prev) => !prev);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToExplore = () => {
    const el = document.getElementById("menu-grid");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EEDB] text-[#5A3E36] relative selection:bg-[#F4C6D7] selection:text-[#5A3E36]">
      {/* 1. Dynamic Scroll Progress Bar (Top of Window) */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-[#EBDDC6]/40 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#F4C6D7] via-[#D86C93] to-[#5A3E36] transition-all duration-150 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Top Announcement Bar */}
      <AnnouncementBar onOpenPincode={() => setIsPincodeModalOpen(true)} />

      {/* 3. Main Sticky Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        egglessOnly={egglessOnly}
        onToggleEggless={handleToggleEggless}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* Grand Centered Brand Masthead: BON TON BAKERY */}
        <section className="bg-gradient-to-b from-[#F7EEDB] via-[#FFFDF9] to-[#F7EEDB] border-b border-[#EBDDC6] py-8 sm:py-12 text-center px-4 relative overflow-hidden">
          <div className="max-w-5xl mx-auto flex flex-col items-center justify-center relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-12 sm:w-24 bg-[#5A3E36]/30" />
              <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#7D5A50] font-bold">
                Artisan Cake Studio &middot; Bulandshahr
              </span>
              <div className="h-[1px] w-12 sm:w-24 bg-[#5A3E36]/30" />
            </div>

            <h1
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.16em] text-[#5A3E36] uppercase select-none drop-shadow-xs my-2 leading-none"
            >
              BON TON BAKERY
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 text-xs sm:text-sm text-[#7D5A50] tracking-[0.22em] uppercase font-semibold">
              <span>Bhoor Crossing</span>
              <span className="text-[#F4C6D7] font-bold">&bull;</span>
              <span>Yamunapuram</span>
              <span className="text-[#F4C6D7] font-bold">&bull;</span>
              <span>Handcrafted Confections &middot; Est. 1990</span>
            </div>
          </div>
        </section>

        {/* Dynamic Hero Banner for Current Offers */}
        <HeroBanner onSelectCategory={handleSelectCategory} />

        {/* Visual Category Showcase (Stories / Circles) */}
        <CategoryShowcase
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Product Grid with Category Filters & Search */}
        <ProductGrid
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          egglessOnly={egglessOnly}
          onToggleEggless={handleToggleEggless}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          onQuickView={(prod) => setQuickViewProduct(prod)}
        />

        {/* Brand Highlights & Guarantees */}
        <WhyChooseUs />

        {/* Customer Testimonials & Social Proof */}
        <CustomerReviews />
      </main>

      {/* Luxury Patisserie Footer */}
      <Footer />

      {/* Quick View & Customization Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Delivery Zone Pincode Modal */}
      <PincodeModal
        isOpen={isPincodeModalOpen}
        onClose={() => setIsPincodeModalOpen(false)}
        onSelectCity={(cityText) => setSelectedCity(cityText)}
      />

      {/* 4. Best Dynamic Floating Scroll Indicator / Back-To-Top Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        {isScrolledDown ? (
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 bg-[#5A3E36] hover:bg-[#3D2721] text-[#F4C6D7] text-xs font-bold px-4 py-3 rounded-full shadow-2xl border border-[#F4C6D7]/40 transition-all hover:scale-105 cursor-pointer animate-fade-in-up"
            aria-label="Back to top"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4 text-[#F4C6D7] group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline">Top</span>
          </button>
        ) : (
          <button
            onClick={scrollToExplore}
            className="group flex items-center gap-2 bg-[#5A3E36]/95 hover:bg-[#3D2721] text-[#F7EEDB] text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-[#F4C6D7]/50 transition-all cursor-pointer animate-blush-glow hover:scale-105"
            aria-label="Scroll down to explore confections"
          >
            <span>Scroll to Explore</span>
            <ChevronDown className="w-4 h-4 text-[#F4C6D7] animate-scroll-down" />
          </button>
        )}
      </div>
    </div>
  );
}
