"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import offersData from "@/data/offers.json";
import { OfferBanner, ProductCategory } from "@/types";
import { useCart } from "@/context/CartContext";

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
}

export default function HeroBanner({ onSelectCategory }: HeroBannerProps) {
  const offers: OfferBanner[] = offersData as OfferBanner[];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const { applyPromo } = useCart();

  // Auto rotate slides every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [offers.length]);

  // Flash sale countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyAndApply = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyPromo(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const slide = offers[currentSlide];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#3D2721] via-[#5A3E36] to-[#4A3029] text-white">
      {/* Background ambient lighting with soft blush pink & cream glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#F4C6D7]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-[#F7EEDB]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px]">
          
          {/* Left Column: Offer Content */}
          <div className="lg:col-span-7 space-y-6 z-10 animate-fade-in-up">
            {/* Offer Badge + Live Flash Timer */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="shimmer-badge inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F4C6D7]/20 text-[#F4C6D7] border border-[#F4C6D7]/40 shadow-xs">
                {slide.badge}
              </span>

              {/* Countdown Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-[#3D2721]/80 text-[#F7EEDB] border border-[#7D5A50]">
                <Clock className="w-3.5 h-3.5 text-[#F4C6D7]" />
                <span>Ends in:</span>
                <span className="text-[#F4C6D7] font-bold">
                  {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                  {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>

            {/* Typography Heading */}
            <div className="space-y-2">
              <h1
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white"
              >
                {slide.title} <br />
                <span className="text-[#F4C6D7] italic font-normal">
                  {slide.highlight}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[#F7EEDB]/90 max-w-xl font-light leading-relaxed">
                {slide.subtitle}
              </p>
            </div>

            {/* Coupon Clip Card */}
            <div className="inline-flex items-center gap-3 bg-[#3D2721]/90 backdrop-blur-md p-2 pl-4 rounded-2xl border border-[#7D5A50] shadow-lg">
              <div className="text-xs">
                <span className="text-[#F7EEDB]/80 block text-[10px] uppercase font-bold tracking-wider">
                  Exclusive Promo Code
                </span>
                <span className="font-mono font-extrabold text-[#F4C6D7] tracking-widest text-sm">
                  {slide.code}
                </span>
              </div>

              <button
                onClick={() => handleCopyAndApply(slide.code)}
                className="flex items-center gap-1.5 bg-[#F4C6D7] hover:bg-[#EEB3C7] text-[#5A3E36] font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {copiedCode === slide.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy & Apply</span>
                  </>
                )}
              </button>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSelectCategory("cakes")}
                className="inline-flex items-center gap-2 bg-[#F4C6D7] hover:bg-[#EEB3C7] text-[#5A3E36] font-extrabold px-7 py-3.5 rounded-full text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#5A3E36]" />
              </button>

              <button
                onClick={() => onSelectCategory("all")}
                className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-[#F7EEDB] font-semibold px-6 py-3.5 rounded-full text-sm border border-[#F7EEDB]/30 transition-all cursor-pointer"
              >
                <span>View Full Menu</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Confectionery Showcase */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Soft decorative glow ring */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#F4C6D7]/30 to-[#F7EEDB]/20 blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/15 group">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Gradient overlay for aesthetic depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Floating Chef's Stamp Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#FFFDF9]/95 backdrop-blur-md text-[#5A3E36] p-3.5 rounded-2xl border border-[#F4C6D7]/50 shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-[#D86C93] uppercase">
                    Master Patissier &middot; Bulandshahr
                  </p>
                  <p className="text-xs font-bold truncate">Handcrafted Fresh on Order</p>
                </div>
                <div className="flex items-center gap-1 bg-[#15803D] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  <span>★ 4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators & Arrows */}
        <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-4">
          <div className="flex items-center gap-2">
            {offers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? "w-8 bg-[#F4C6D7]"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Animated Scroll Down Indicator */}
          <button
            onClick={() => {
              const el = document.getElementById("menu-grid");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="hidden sm:flex items-center gap-2 text-xs text-[#F7EEDB] hover:text-[#F4C6D7] transition-colors cursor-pointer group"
          >
            <span className="text-[11px] font-semibold tracking-wider uppercase">
              Scroll Down to Explore
            </span>
            <ChevronDown className="w-4 h-4 text-[#F4C6D7] animate-scroll-down" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length)
              }
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F4C6D7] hover:text-[#5A3E36] flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Previous Offer Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % offers.length)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#F4C6D7] hover:text-[#5A3E36] flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Next Offer Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
