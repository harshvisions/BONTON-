"use client";

import React, { useState } from "react";
import {
  Tag,
  Percent,
  Coins,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight
} from "lucide-react";
import { DiscountRule, InventoryItem } from "@/types/admin";

interface DiscountEngineViewProps {
  discounts: DiscountRule[];
  inventoryItems: InventoryItem[];
  onAddDiscount: (rule: DiscountRule) => void;
  onDeleteDiscount: (id: string) => void;
  onToggleDiscountStatus: (id: string) => void;
}

export default function DiscountEngineView({
  discounts,
  inventoryItems,
  onAddDiscount,
  onDeleteDiscount,
  onToggleDiscountStatus,
}: DiscountEngineViewProps) {
  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState<string>("20");
  const [targetScope, setTargetScope] = useState<"item" | "category" | "storewide">("item");
  const [targetName, setTargetName] = useState<string>(
    inventoryItems[0]?.name || "Belgian Truffle Noir Cake"
  );
  const [minOrder, setMinOrder] = useState<string>("799");
  const [maxDiscount, setMaxDiscount] = useState<string>("500");
  const [validUntil, setValidUntil] = useState<string>("2026-12-31");

  // Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Field validation rules
  const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
  const isCodeValid = cleanCode.length >= 4;
  const numValue = Number(discountValue);
  const isValueValid =
    discountType === "percentage"
      ? numValue > 0 && numValue <= 90
      : numValue > 0 && numValue <= 5000;
  const isMinOrderValid = Number(minOrder) >= 0 && !isNaN(Number(minOrder));
  const isMaxDiscountValid = Number(maxDiscount) > 0 && !isNaN(Number(maxDiscount));
  const isTargetValid = targetName.trim().length > 0;

  const isFormValid =
    isCodeValid && isValueValid && isMinOrderValid && isMaxDiscountValid && isTargetValid;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      code: true,
      discountValue: true,
      minOrder: true,
      maxDiscount: true,
    });

    if (!isFormValid) return;

    const newRule: DiscountRule = {
      id: "disc-" + Date.now(),
      code: cleanCode,
      type: discountType,
      value: numValue,
      targetScope,
      targetName,
      minOrder: Number(minOrder),
      maxDiscount: Number(maxDiscount),
      status: "Active",
      usageCount: 0,
      validUntil: validUntil || "2026-12-31",
    };

    onAddDiscount(newRule);
    setSuccessBanner(`Discount rule "${cleanCode}" activated.`);
    setTimeout(() => setSuccessBanner(null), 3500);

    setCode("");
    setDiscountValue(discountType === "percentage" ? "15" : "200");
    setTouched({});
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard?.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Live Simulator calculation
  const benchmarkCart = 1200;
  const simSavings =
    discountType === "percentage"
      ? Math.min(Math.round((benchmarkCart * numValue) / 100), Number(maxDiscount) || 500)
      : Math.min(numValue, benchmarkCart);
  const simPayable = Math.max(0, benchmarkCart - simSavings);

  const activeCount = discounts.filter((d) => d.status === "Active").length;
  const totalRedemptions = discounts.reduce((acc, d) => acc + d.usageCount, 0);

  return (
    <div className="space-y-6">
      
      {/* Minimalist Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Active Rules
          </p>
          <p className="text-2xl font-bold font-mono text-[#111827] mt-1">{activeCount}</p>
          <span className="text-[11px] text-[#10B981] font-medium block mt-0.5">
            ● Live at checkout
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Redemptions
          </p>
          <p className="text-2xl font-bold font-mono text-[#111827] mt-1">{totalRedemptions}</p>
          <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
            Orders discounted
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Top Performing
          </p>
          <p className="text-base font-bold font-mono text-[#111827] mt-1 truncate">
            BONTON20
          </p>
          <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
            142 uses (20% OFF)
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Avg Cart Savings
          </p>
          <p className="text-2xl font-bold font-mono text-[#111827] mt-1">₹248</p>
          <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
            Per coupon order
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs animate-modal-in">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Minimalist Discount Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">
              Create Discount Rule
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Apply percentage or flat discounts to specific items or categories
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#9CA3AF] bg-[#F9FAFB] px-2 py-1 rounded-md border border-[#E5E7EB]">
            Discount Engine
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Row 1: Code & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#374151]">
                  Promo Code Identifier *
                </label>
                {touched.code && (
                  isCodeValid ? (
                    <span className="text-[11px] text-[#10B981] font-medium">Valid</span>
                  ) : (
                    <span className="text-[11px] text-[#EF4444] font-medium">
                      Min 4 alphanumeric characters
                    </span>
                  )
                )}
              </div>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onBlur={() => setTouched((p) => ({ ...p, code: true }))}
                placeholder="e.g. FESTIVE25, DIWALI100"
                className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-[#111827] uppercase focus:outline-none transition-colors ${
                  touched.code
                    ? isCodeValid
                      ? "border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                      : "border-[#EF4444] bg-red-50/20"
                    : "border-[#D1D5DB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
                }`}
              />
            </div>

            {/* Type Switcher */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Discount Mechanism *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDiscountType("percentage");
                    setDiscountValue("20");
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    discountType === "percentage"
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-[#FAFAFA] text-[#374151] border-[#E5E7EB] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Percentage (%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDiscountType("flat");
                    setDiscountValue("200");
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    discountType === "flat"
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-[#FAFAFA] text-[#374151] border-[#E5E7EB] hover:bg-[#F3F4F6]"
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Flat Amount (₹)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Value, Scope, Target */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#374151]">
                  Discount Value ({discountType === "percentage" ? "%" : "₹"}) *
                </label>
                {touched.discountValue && !isValueValid && (
                  <span className="text-[10px] text-[#EF4444]">
                    {discountType === "percentage" ? "1-90%" : "> 0"}
                  </span>
                )}
              </div>
              <input
                type="number"
                min="1"
                max={discountType === "percentage" ? 90 : 5000}
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, discountValue: true }))}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Target Scope *
              </label>
              <select
                value={targetScope}
                onChange={(e) => {
                  const scope = e.target.value as any;
                  setTargetScope(scope);
                  if (scope === "item") {
                    setTargetName(inventoryItems[0]?.name || "Belgian Truffle Noir Cake");
                  } else if (scope === "category") {
                    setTargetName("Designer Cakes");
                  } else {
                    setTargetName("Storewide (All Creations)");
                  }
                }}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none cursor-pointer"
              >
                <option value="item">Specific Confection Item</option>
                <option value="category">Entire Category</option>
                <option value="storewide">Storewide</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Target Name *
              </label>
              {targetScope === "item" ? (
                <select
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none cursor-pointer"
                >
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name} (₹{item.basePrice})
                    </option>
                  ))}
                </select>
              ) : targetScope === "category" ? (
                <select
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none cursor-pointer"
                >
                  <option value="Designer Cakes">Designer Cakes</option>
                  <option value="Gourmet Pastries">Gourmet Pastries</option>
                  <option value="Artisan Breads">Artisan Breads</option>
                  <option value="Cupcakes & Jars">Cupcakes &amp; Jars</option>
                  <option value="Luxury Hampers">Luxury Hampers</option>
                </select>
              ) : (
                <input
                  type="text"
                  readOnly
                  value="Storewide"
                  className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-xs text-[#6B7280]"
                />
              )}
            </div>
          </div>

          {/* Row 3: Min Order, Max Cap, Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Min Order Spend (₹)
              </label>
              <input
                type="number"
                min="0"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Max Discount Cap (₹)
              </label>
              <input
                type="number"
                min="1"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none"
              />
            </div>
          </div>

          {/* Minimalist Simulation Box */}
          <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-[#6B7280]">
              Cart simulation on &ldquo;{targetName}&rdquo; (₹{benchmarkCart}):
            </span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-[#10B981]">-₹{simSavings}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
              <span className="font-bold text-[#111827]">₹{simPayable}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2 border-t border-[#F3F4F6]">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white font-medium px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Activate Discount</span>
            </button>
          </div>
        </form>
      </div>

      {/* Minimalist Active Discounts Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">
            Active Discounts
          </h3>
          <p className="text-xs text-[#6B7280]">
            {discounts.length} promotion rules configured
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-medium uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Discount</th>
                <th className="py-2.5 px-3">Scope</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Min Spend</th>
                <th className="py-2.5 px-3">Usage</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {discounts.map((disc) => (
                <tr key={disc.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3 px-3">
                    <div className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#111827] bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7]">
                      <span>{disc.code}</span>
                      <button
                        onClick={() => handleCopy(disc.code)}
                        className="hover:text-black cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-[#71717A]" />
                      </button>
                    </div>
                    {copiedCode === disc.code && (
                      <span className="text-[10px] text-[#10B981] font-medium block mt-0.5">
                        Copied
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-mono font-medium text-[#111827]">
                    {disc.type === "percentage" ? `${disc.value}%` : `₹${disc.value}`}
                  </td>

                  <td className="py-3 px-3 capitalize text-[#4B5563]">
                    {disc.targetScope}
                  </td>

                  <td className="py-3 px-3 text-[#111827] max-w-xs truncate font-medium">
                    {disc.targetName}
                  </td>

                  <td className="py-3 px-3 font-mono text-[#4B5563]">
                    ₹{disc.minOrder}
                  </td>

                  <td className="py-3 px-3 font-mono text-[#111827]">
                    {disc.usageCount}
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => onToggleDiscountStatus(disc.id)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                        disc.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {disc.status}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onDeleteDiscount(disc.id)}
                      className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
