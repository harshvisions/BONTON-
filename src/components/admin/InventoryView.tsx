"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  Search,
  Filter,
  Check
} from "lucide-react";
import { InventoryItem } from "@/types/admin";

interface InventoryViewProps {
  items: InventoryItem[];
  onAddItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const PRESET_IMAGE_OPTIONS = [
  {
    label: "Belgian Chocolate Truffle",
    url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Raspberry Frangipane Tart",
    url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Artisan Wild Sourdough",
    url: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "French Macaron Jewel Box",
    url: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80",
  },
];

export default function InventoryView({
  items,
  onAddItem,
  onDeleteItem,
  onToggleStatus,
}: InventoryViewProps) {
  // Form State
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<"cakes" | "pastries" | "breads" | "cupcakes" | "hampers">("cakes");
  const [basePrice, setBasePrice] = useState<string>("899");
  const [originalPrice, setOriginalPrice] = useState<string>("1099");
  const [stock, setStock] = useState<string>("20");
  const [isEggless, setIsEggless] = useState(true);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGE_OPTIONS[0].url);

  // Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Table filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Validation Rules
  const isNameValid = name.trim().length >= 3;
  const isTaglineValid = tagline.trim().length >= 5;
  const isBasePriceValid = Number(basePrice) > 0 && !isNaN(Number(basePrice));
  const isOriginalPriceValid =
    Number(originalPrice) >= Number(basePrice) && !isNaN(Number(originalPrice));
  const isStockValid = Number(stock) >= 0 && !isNaN(Number(stock));
  const isImageValid = imageUrl.trim().length > 10;

  const isFormValid =
    isNameValid &&
    isTaglineValid &&
    isBasePriceValid &&
    isOriginalPriceValid &&
    isStockValid &&
    isImageValid;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setImageUrl(fakeUrl);
      setTouched((prev) => ({ ...prev, imageUrl: true }));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      tagline: true,
      basePrice: true,
      originalPrice: true,
      stock: true,
      imageUrl: true,
    });

    if (!isFormValid) return;

    const newItem: InventoryItem = {
      id: "prod-" + Date.now(),
      name: name.trim(),
      tagline: tagline.trim(),
      category,
      basePrice: Number(basePrice),
      originalPrice: Number(originalPrice),
      stock: Number(stock),
      isEggless,
      image: imageUrl,
      prepTime: "Ready in 2 Hours",
      status: Number(stock) === 0 ? "Sold Out" : Number(stock) < 5 ? "Low Stock" : "In Stock",
      sizes: [
        { label: "Standard", weight: "0.5 kg", priceMultiplier: 1 },
        { label: "Grand", weight: "1.0 kg", priceMultiplier: 1.85 },
      ],
    };

    onAddItem(newItem);
    setSuccessBanner(`"${name}" published to inventory.`);
    setTimeout(() => setSuccessBanner(null), 3500);

    // Reset
    setName("");
    setTagline("");
    setBasePrice("899");
    setOriginalPrice("1099");
    setStock("20");
    setTouched({});
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSKUs = items.length;
  const lowStockCount = items.filter((i) => i.stock < 5).length;
  const egglessCount = items.filter((i) => i.isEggless).length;
  const totalValuation = items.reduce((sum, i) => sum + i.basePrice * i.stock, 0);

  return (
    <div className="space-y-6">
      
      {/* Minimalist Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Total SKUs
          </p>
          <p className="text-2xl font-bold font-mono text-[#111827] mt-1">{totalSKUs}</p>
          <span className="text-[11px] text-[#10B981] font-medium block mt-0.5">
            ● Active catalog
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Low Stock Alerts
          </p>
          <p className="text-2xl font-bold font-mono text-[#EF4444] mt-1">{lowStockCount}</p>
          <span className="text-[11px] text-[#EF4444] font-medium block mt-0.5">
            Under 5 units
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Eggless Creations
          </p>
          <p className="text-2xl font-bold font-mono text-[#111827] mt-1">{egglessCount}</p>
          <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
            Certified vegetarian
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Inventory Value
          </p>
          <p className="text-2xl font-bold font-mono text-[#111827] mt-1">
            ₹{totalValuation.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
            Live valuation
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

      {/* Minimalist Item Creation Form */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4 mb-5">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">
              Add New Item
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Specify item details, pricing, and category with live UI validation
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#9CA3AF] bg-[#F9FAFB] px-2 py-1 rounded-md border border-[#E5E7EB]">
            Inventory Form
          </span>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">
              Item Image *
            </label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-9 border border-dashed border-[#D1D5DB] hover:border-[#111827] rounded-xl p-4 bg-[#FAFAFA] text-center relative cursor-pointer transition-colors group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] group-hover:text-black">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-[#111827]">
                      Upload file or drag and drop
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      PNG, JPG, WebP up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Thumbnail */}
              <div className="md:col-span-3 flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB] shrink-0">
                  {imageUrl ? (
                    <Image src={imageUrl} alt="" fill className="object-cover" sizes="64px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#9CA3AF]">
                      No Image
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-[#6B7280]">
                  <span className="font-medium text-[#111827] block">Preview</span>
                  <span>Active thumbnail</span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-[#6B7280] mr-1">Presets:</span>
              {PRESET_IMAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setImageUrl(opt.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    imageUrl === opt.url
                      ? "bg-[#111827] text-white border-[#111827]"
                      : "bg-[#F9FAFB] text-[#374151] border-[#E5E7EB] hover:bg-[#F3F4F6]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#374151]">
                  Item Name *
                </label>
                {touched.name && (
                  isNameValid ? (
                    <span className="text-[11px] text-[#10B981] flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#EF4444] font-medium">
                      Min 3 characters required
                    </span>
                  )
                )}
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                placeholder="e.g. Belgian Truffle Noir Cake"
                className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none transition-colors ${
                  touched.name
                    ? isNameValid
                      ? "border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                      : "border-[#EF4444] bg-red-50/20"
                    : "border-[#D1D5DB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none cursor-pointer"
              >
                <option value="cakes">Designer Cakes</option>
                <option value="pastries">Gourmet Pastries</option>
                <option value="breads">Artisan Breads</option>
                <option value="cupcakes">Cupcakes &amp; Jars</option>
                <option value="hampers">Celebration Hampers</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#374151]">
                Flavor Notes / Description *
              </label>
              {touched.tagline && !isTaglineValid && (
                <span className="text-[11px] text-[#EF4444] font-medium">
                  Please provide description
                </span>
              )}
            </div>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, tagline: true }))}
              placeholder="e.g. 54% Callebaut dark chocolate ganache, moist Dutch cocoa sponge"
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:outline-none transition-colors ${
                touched.tagline && !isTaglineValid
                  ? "border-[#EF4444] bg-red-50/20"
                  : "border-[#D1D5DB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
              }`}
            />
          </div>

          {/* Row 4: Base Price, Original Price, Stock, Dietary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#374151]">
                  Base Price (₹) *
                </label>
                {touched.basePrice && !isBasePriceValid && (
                  <span className="text-[10px] text-[#EF4444]">Must be &gt; 0</span>
                )}
              </div>
              <input
                type="number"
                min="1"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, basePrice: true }))}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#374151]">
                  Original Price (₹)
                </label>
                {touched.originalPrice && !isOriginalPriceValid && (
                  <span className="text-[10px] text-[#EF4444]">Must be ≥ Base</span>
                )}
              </div>
              <input
                type="number"
                min="1"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, originalPrice: true }))}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Stock (Units) *
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-3.5 py-2.5 text-xs font-mono font-medium text-[#111827] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Dietary
              </label>
              <button
                type="button"
                onClick={() => setIsEggless(!isEggless)}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isEggless
                    ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]"
                    : "bg-[#FAFAFA] text-[#374151] border-[#E5E7EB]"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isEggless ? "bg-[#16A34A]" : "bg-[#EF4444]"}`} />
                <span>{isEggless ? "100% Eggless" : "With Egg"}</span>
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F3F4F6]">
            <span className="text-xs text-[#6B7280]">
              {Number(originalPrice) > Number(basePrice) && (
                <span>
                  Calculated discount:{" "}
                  <strong className="text-[#111827] font-mono">
                    {Math.round(
                      ((Number(originalPrice) - Number(basePrice)) / Number(originalPrice)) * 100
                    )}% OFF
                  </strong>
                </span>
              )}
            </span>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white font-medium px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save &amp; Publish Item</span>
            </button>
          </div>
        </form>
      </div>

      {/* Minimalist Inventory Table */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[#111827]">
              Current Inventory
            </h3>
            <p className="text-xs text-[#6B7280]">
              {filteredItems.length} items registered in database
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="cakes">Cakes</option>
              <option value="pastries">Pastries</option>
              <option value="breads">Breads</option>
              <option value="cupcakes">Cupcakes</option>
              <option value="hampers">Hampers</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-medium uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Base Price</th>
                <th className="py-2.5 px-3">Stock</th>
                <th className="py-2.5 px-3">Dietary</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-[#F3F4F6] shrink-0 border border-[#E5E7EB]">
                        <Image src={item.image} alt="" fill className="object-cover" sizes="36px" />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-[#111827] truncate">{item.name}</p>
                        <p className="text-[11px] text-[#9CA3AF] truncate">{item.tagline}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 capitalize text-[#4B5563]">
                    {item.category}
                  </td>

                  <td className="py-3 px-3 font-mono font-medium text-[#111827]">
                    ₹{item.basePrice}
                  </td>

                  <td className="py-3 px-3 font-mono text-[#4B5563]">
                    {item.stock}
                  </td>

                  <td className="py-3 px-3">
                    <span className={`text-[11px] font-medium ${item.isEggless ? "text-[#16A34A]" : "text-[#6B7280]"}`}>
                      {item.isEggless ? "Eggless" : "Egg"}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md ${
                        item.stock === 0
                          ? "bg-red-50 text-red-700"
                          : item.stock < 5
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {item.stock === 0 ? "Sold Out" : item.stock < 5 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onToggleStatus(item.id)}
                        className="text-[11px] text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
                      >
                        Adjust
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
