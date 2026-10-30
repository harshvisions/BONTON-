"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  Tag,
  Truck,
  ArrowLeft,
  CircleDot,
  LogOut,
  Layers,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { AdminView } from "@/types/admin";

interface AdminSidebarProps {
  currentView: AdminView;
  onSelectView: (view: AdminView) => void;
  inventoryCount: number;
  activeDiscountsCount: number;
  activeOrdersCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  currentView,
  onSelectView,
  inventoryCount,
  activeDiscountsCount,
  activeOrdersCount,
  isOpenMobile,
  onCloseMobile,
  onLogout,
}: AdminSidebarProps) {
  const navItems: {
    id: AdminView;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    {
      id: "inventory",
      label: "Inventory Management",
      description: "Catalog & recipe specs",
      icon: Package,
      count: inventoryCount,
    },
    {
      id: "discounts",
      label: "Discount Engine",
      description: "Item markdowns & coupons",
      icon: Tag,
      count: activeDiscountsCount,
    },
    {
      id: "orders",
      label: "Order Tracking",
      description: "Transactions & fulfillment",
      icon: Truck,
      count: activeOrdersCount,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Minimalist Fixed Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#111113] text-[#E4E4E7] border-r border-[#27272A] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-[#27272A] flex flex-col">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors mb-3 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Storefront</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F7EEDB] text-[#5A3E36] flex items-center justify-center font-black text-sm shadow-xs">
                B
              </div>
              <div>
                <span
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  className="text-base font-extrabold tracking-wider text-white block uppercase"
                >
                  BON TON BAKERY
                </span>
                <span className="text-[10px] text-[#A1A1AA] tracking-wider uppercase font-mono block">
                  Admin Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-[#71717A] px-3 py-2">
              Management
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left ${
                    isActive
                      ? "bg-[#27272A] text-white font-semibold"
                      : "text-[#A1A1AA] hover:bg-[#1C1C1F] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-[#71717A]"}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md ${
                        isActive ? "bg-white text-black" : "bg-[#27272A] text-[#A1A1AA]"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Minimalist Bottom Section with Status & Logout */}
        <div className="p-3 border-t border-[#27272A] space-y-2">
          {/* Live System Indicator */}
          <div className="px-3 py-2 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#A1A1AA]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kitchen Dispatch
            </span>
            <span className="text-[10px] font-mono text-[#71717A]">ONLINE</span>
          </div>

          {/* Admin User info & Logout */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">Administrator</p>
              <p className="text-[10px] text-[#71717A] truncate">admin@bontonbakery.in</p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#71717A] hover:text-red-400 hover:bg-[#27272A] transition-colors cursor-pointer"
              title="Sign Out of Admin Console"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
