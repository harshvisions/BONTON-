"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Gift,
  ChevronDown
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ProductCategory } from "@/types";

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  egglessOnly: boolean;
  onToggleEggless: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Navbar({
  activeCategory,
  onSelectCategory,
  egglessOnly,
  onToggleEggless,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const { totalItemsCount, openCart, subtotal } = useCart();
  const { user, openAuthModal, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const categories: { label: string; value: ProductCategory }[] = [
    { label: "All Creations", value: "all" },
    { label: "Designer Cakes", value: "cakes" },
    { label: "Gourmet Pastries", value: "pastries" },
    { label: "Artisan Breads", value: "breads" },
    { label: "Cupcakes & Jars", value: "cupcakes" },
    { label: "Luxury Hampers", value: "hampers" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F7EEDB]/95 backdrop-blur-md border-b border-[#EBDDC6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#5A3E36] hover:text-[#D86C93] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo: BON TON BAKERY */}
          <div className="flex flex-col items-center lg:items-start select-none cursor-pointer">
            <a href="#" className="group flex flex-col items-center lg:items-start">
              <div className="flex items-center">
                <span
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  className="text-2xl sm:text-3xl font-extrabold tracking-[0.16em] text-[#5A3E36] group-hover:text-[#3D2721] transition-colors"
                >
                  BON TON BAKERY
                </span>
              </div>
              <span className="text-[10px] tracking-[0.25em] text-[#7D5A50] uppercase font-semibold -mt-0.5">
                Bulandshahr &middot; Est. 1990
              </span>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E6D64]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Belgian Truffle, Sourdough, Macarons..."
                className="w-full bg-[#FFFDF9] border border-[#E2D2BC] rounded-full pl-10 pr-10 py-2.5 text-sm text-[#5A3E36] placeholder-[#94766E] focus:outline-none focus:ring-2 focus:ring-[#F4C6D7] focus:border-[#F4C6D7] transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#94766E] hover:text-[#5A3E36]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons: Eggless switch, User profile, Cart button */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* 100% Eggless Toggle Pill */}
            <button
              onClick={onToggleEggless}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                egglessOnly
                  ? "bg-[#15803D] text-white border-[#15803D] shadow-sm"
                  : "bg-[#FFFDF9] text-[#5A3E36] border-[#DECFC2] hover:border-[#15803D]"
              }`}
              title="Filter Eggless confections"
            >
              <span className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                egglessOnly ? "border-white bg-white" : "border-[#15803D] bg-white"
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></span>
              </span>
              <span>100% Eggless</span>
            </button>

            {/* User Account / Auth */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-[#FFFDF9] border border-[#E2D2BC] hover:border-[#F4C6D7] px-3 py-1.5 rounded-full text-xs font-medium text-[#5A3E36] transition-all cursor-pointer shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#F4C6D7] text-[#5A3E36] font-extrabold flex items-center justify-center text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-semibold">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#7D5A50]" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#FFFDF9] rounded-2xl shadow-xl border border-[#E2D2BC] py-2 z-50 animate-modal-in">
                      <div className="px-4 py-2 border-b border-[#F0E4D3]">
                        <p className="text-xs text-[#7D5A50]">Signed in as</p>
                        <p className="text-sm font-bold text-[#5A3E36] truncate">{user.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-[#5A3E36] bg-[#FDF2F6] px-2.5 py-1 rounded-md border border-[#F4C6D7]">
                          <span className="font-semibold">{user.sweetCredits} Sweet Credits</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          alert("Order history & loyalty dashboard modal!");
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#5A3E36] hover:bg-[#F7EEDB] flex items-center gap-2"
                      >
                        <Gift className="w-3.5 h-3.5 text-[#D86C93]" />
                        <span>Loyalty Rewards ({user.tier} Tier)</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal("signin")}
                  className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#DECFC2] hover:border-[#F4C6D7] hover:bg-[#FDF2F6] px-3.5 py-2 rounded-full text-xs font-semibold text-[#5A3E36] transition-all hover:shadow-xs cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#D86C93]" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-[#5A3E36] hover:bg-[#3D2721] text-[#F7EEDB] px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer group"
              aria-label="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#F4C6D7] group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F4C6D7] text-[#5A3E36] font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-[#F7EEDB]">Cart</span>
              {subtotal > 0 && (
                <span className="hidden sm:inline font-mono font-bold text-[#F4C6D7] border-l border-[#7D5A50] pl-2">
                  ₹{subtotal}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E6D64]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search cakes, pastries, breads..."
              className="w-full bg-[#FFFDF9] border border-[#E2D2BC] rounded-full pl-9 pr-8 py-2 text-xs text-[#5A3E36] placeholder-[#94766E] focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94766E]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Desktop Category Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-center gap-1.5 py-2 border-t border-[#EBDDC6]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#5A3E36] text-[#F4C6D7] shadow-sm font-bold"
                    : "text-[#5A3E36] hover:text-[#3D2721] hover:bg-[#EBDDC6]/60"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
          <Link
            href="/admin"
            className="ml-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#5A3E36] bg-[#FDF2F6] border border-[#F4C6D7] hover:bg-[#F4C6D7] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>Admin Atelier</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-[#E2D2BC] px-4 py-4 space-y-2 animate-modal-in">
          <p className="text-[11px] font-bold text-[#8E6D64] uppercase tracking-wider px-2">
            Categories
          </p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  onSelectCategory(cat.value);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeCategory === cat.value
                    ? "bg-[#5A3E36] text-[#F4C6D7] font-bold"
                    : "text-[#5A3E36] hover:bg-[#F7EEDB]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#F0E4D3] flex items-center justify-between">
            <span className="text-xs text-[#5A3E36] font-semibold">100% Eggless Only</span>
            <button
              onClick={onToggleEggless}
              className={`w-11 h-6 rounded-full transition-colors p-1 ${
                egglessOnly ? "bg-[#15803D]" : "bg-[#DECFC2]"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  egglessOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="pt-2">
            <Link
              href="/admin"
              className="w-full py-2.5 px-3 rounded-xl bg-[#5A3E36] text-[#F4C6D7] font-bold text-xs flex items-center justify-center gap-2"
            >
              <span>Launch Admin Atelier Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
