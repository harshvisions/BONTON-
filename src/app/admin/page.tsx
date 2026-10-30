"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  ExternalLink,
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import InventoryView from "@/components/admin/InventoryView";
import DiscountEngineView from "@/components/admin/DiscountEngineView";
import OrderTrackingView from "@/components/admin/OrderTrackingView";

import initialProducts from "@/data/products.json";
import initialDiscounts from "@/data/discounts.json";
import initialOrders from "@/data/orders.json";

import {
  AdminView,
  InventoryItem,
  DiscountRule,
  OrderTransaction,
  FulfillmentStatus,
} from "@/types/admin";

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Login Form State
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dashboard Navigation State
  const [currentView, setCurrentView] = useState<AdminView>("inventory");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Entities State
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(
    (initialProducts as any[]).map((p) => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      category: p.category,
      basePrice: p.price,
      originalPrice: p.originalPrice,
      stock: 18,
      isEggless: p.isEggless,
      image: p.image,
      prepTime: p.prepTime,
      sizes: p.sizes,
      status: "In Stock",
    }))
  );

  const [discounts, setDiscounts] = useState<DiscountRule[]>(
    initialDiscounts as DiscountRule[]
  );

  const [orders, setOrders] = useState<OrderTransaction[]>(
    initialOrders as OrderTransaction[]
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check existing session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bonton_admin_authenticated");
      if (stored === "true") {
        setIsAuthenticated(true);
      }
    } catch {
      // fallback
    } finally {
      setIsAuthChecking(false);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Login submission
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const cleanId = adminId.trim().toLowerCase();
      const cleanPass = adminPassword.trim();

      // Accept standard admin ID and password
      const isValidUser =
        cleanId === "admin" ||
        cleanId === "admin@bontonbakery.in" ||
        cleanId === "chef";
      const isValidPass =
        cleanPass === "Admin@12345" ||
        cleanPass === "admin123" ||
        cleanPass === "admin";

      if (isValidUser && isValidPass) {
        setIsAuthenticated(true);
        localStorage.setItem("bonton_admin_authenticated", "true");
        setAdminId("");
        setAdminPassword("");
      } else {
        setLoginError("Invalid Administrator ID or password. Use demo credentials below.");
      }
    }, 400);
  };

  const handleDemoFill = () => {
    setAdminId("admin");
    setAdminPassword("Admin@12345");
    setLoginError(null);
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("bonton_admin_authenticated");
  };

  // Inventory Handlers
  const handleAddItem = (newItem: InventoryItem) => {
    setInventoryItems((prev) => [newItem, ...prev]);
    showToast(`"${newItem.name}" added to inventory.`);
  };

  const handleDeleteItem = (id: string) => {
    setInventoryItems((prev) => prev.filter((item) => item.id !== id));
    showToast("Item deleted from catalog.");
  };

  const handleToggleItemStatus = (id: string) => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === "In Stock"
              ? "Low Stock"
              : item.status === "Low Stock"
              ? "Sold Out"
              : "In Stock";
          const nextStock =
            nextStatus === "In Stock" ? 20 : nextStatus === "Low Stock" ? 3 : 0;
          return { ...item, status: nextStatus, stock: nextStock };
        }
        return item;
      })
    );
    showToast("Stock level updated.");
  };

  // Discount Handlers
  const handleAddDiscount = (newDiscount: DiscountRule) => {
    setDiscounts((prev) => [newDiscount, ...prev]);
    showToast(`Rule "${newDiscount.code}" created.`);
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
    showToast("Discount rule removed.");
  };

  const handleToggleDiscountStatus = (id: string) => {
    setDiscounts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, status: d.status === "Active" ? "Inactive" : "Active" };
        }
        return d;
      })
    );
    showToast("Rule status toggled.");
  };

  // Order Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: FulfillmentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o))
    );
    showToast(`Order #${orderId} set to "${newStatus}".`);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // Minimalist Admin Login Gate (ID & Password)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7EEDB] text-[#5A3E36] flex flex-col justify-between p-6">
        <div className="w-full max-w-md mx-auto pt-6 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#7D5A50] hover:text-[#5A3E36] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>

          <span className="text-[11px] font-mono uppercase tracking-wider text-[#7D5A50] bg-[#EBDDC6]/60 px-2.5 py-1 rounded-full">
            SECURE ATELIER GATE
          </span>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="bg-[#FFFDF9] rounded-2xl p-8 border border-[#EBDDC6] shadow-md space-y-6 animate-modal-in">
            
            {/* Centered Large BON TON BAKERY Header */}
            <div className="space-y-2 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-[#5A3E36] text-[#F7EEDB] flex items-center justify-center font-bold text-2xl mb-1 shadow-sm">
                B
              </div>
              <h1
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                className="text-3xl sm:text-4xl font-extrabold tracking-[0.16em] text-[#5A3E36] uppercase"
              >
                BON TON BAKERY
              </h1>
              <p className="text-xs font-semibold tracking-wider uppercase text-[#7D5A50]">
                Central Atelier Dashboard Gate &middot; Bulandshahr
              </p>
            </div>

            {/* Error Alert */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-medium">
                {loginError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A3E36] mb-1.5">
                  Administrator ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E6D64]" />
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full bg-[#FFFDF9] border border-[#E2D2BC] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#5A3E36] placeholder-[#A18A83] focus:outline-none focus:border-[#5A3E36] focus:ring-1 focus:ring-[#5A3E36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A3E36] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E6D64]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FFFDF9] border border-[#E2D2BC] rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#5A3E36] placeholder-[#A18A83] focus:outline-none focus:border-[#5A3E36] focus:ring-1 focus:ring-[#5A3E36]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E6D64] hover:text-[#5A3E36]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#5A3E36] hover:bg-[#3D2721] text-[#F7EEDB] font-bold py-3 px-4 rounded-xl text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>{isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Quick Demo Fill */}
            <div className="pt-2 border-t border-[#EBDDC6]">
              <button
                type="button"
                onClick={handleDemoFill}
                className="w-full text-center text-[11px] text-[#7D5A50] hover:text-[#5A3E36] font-medium transition-colors cursor-pointer"
              >
                ⚡ Auto-Fill Demo Access (<span className="font-mono font-semibold">admin</span> / <span className="font-mono font-semibold">Admin@12345</span>)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-md mx-auto text-center text-[11px] text-[#7D5A50] font-medium">
          Bon Ton Bakery Bulandshahr &middot; Operations &amp; Catalog Management Portal
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated Minimalist Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7EEDB] text-[#5A3E36] flex flex-col font-sans">
      
      {/* Fixed Minimalist Sidebar */}
      <AdminSidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        inventoryCount={inventoryItems.length}
        activeDiscountsCount={discounts.filter((d) => d.status === "Active").length}
        activeOrdersCount={orders.length}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={handleAdminLogout}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        
        {/* Top Header with Centered Large BON TON BAKERY */}
        <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EBDDC6] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 text-[#5A3E36] hover:text-[#3D2721] transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#7D5A50]">
                <span>Console</span>
                <span>/</span>
                <span className="font-semibold text-[#5A3E36] capitalize">
                  {currentView === "inventory"
                    ? "Inventory Management"
                    : currentView === "discounts"
                    ? "Discount Engine"
                    : "Order Fulfillment"}
                </span>
              </div>
            </div>
          </div>

          {/* Centered Large BON TON BAKERY Brand */}
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <h1
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="text-xl sm:text-2xl lg:text-3xl font-black tracking-[0.16em] text-[#5A3E36] uppercase"
            >
              BON TON BAKERY
            </h1>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#7D5A50] font-semibold hidden sm:inline">
              Operations &amp; Catalog Management Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[#5A3E36] hover:text-[#3D2721] font-semibold flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg border border-[#EBDDC6] bg-[#F7EEDB]"
            >
              <span>Live Store</span>
              <ExternalLink className="w-3 h-3 text-[#7D5A50]" />
            </Link>

            <button
              onClick={handleAdminLogout}
              className="text-xs text-[#7D5A50] hover:text-red-600 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Dynamic Main View */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {/* Centered Large Dashboard Masthead Banner */}
          <div className="text-center mb-8 pb-6 border-b border-[#EBDDC6] bg-[#FFFDF9] rounded-2xl p-6 sm:p-8 shadow-xs border border-[#EBDDC6]">
            <span className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-[#7D5A50] bg-[#F7EEDB] px-3.5 py-1 rounded-full border border-[#EBDDC6] mb-3">
              Bulandshahr Flagship Atelier &middot; Admin Portal
            </span>
            <h1
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[0.18em] text-[#5A3E36] uppercase"
            >
              BON TON BAKERY
            </h1>
            <p className="text-xs sm:text-sm text-[#7D5A50] tracking-[0.2em] uppercase font-semibold mt-2">
              Real-Time Inventory &bull; Discount Rule Engine &bull; Order Tracking System
            </p>
          </div>

          {currentView === "inventory" && (
            <InventoryView
              items={inventoryItems}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onToggleStatus={handleToggleItemStatus}
            />
          )}

          {currentView === "discounts" && (
            <DiscountEngineView
              discounts={discounts}
              inventoryItems={inventoryItems}
              onAddDiscount={handleAddDiscount}
              onDeleteDiscount={handleDeleteDiscount}
              onToggleDiscountStatus={handleToggleDiscountStatus}
            />
          )}

          {currentView === "orders" && (
            <OrderTrackingView
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}
        </main>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#5A3E36] text-[#F7EEDB] border border-[#F4C6D7]/40 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl animate-modal-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
