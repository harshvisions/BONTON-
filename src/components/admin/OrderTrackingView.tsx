"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  Eye,
  Copy,
  Receipt,
  Phone,
  MapPin,
  X
} from "lucide-react";
import { OrderTransaction, FulfillmentStatus } from "@/types/admin";

interface OrderTrackingViewProps {
  orders: OrderTransaction[];
  onUpdateStatus: (orderId: string, newStatus: FulfillmentStatus) => void;
}

const STATUS_CONFIG: Record<
  FulfillmentStatus,
  { label: string; dot: string; badge: string }
> = {
  "Baking in Oven": {
    label: "Baking",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  "Ready for Dispatch": {
    label: "Ready",
    dot: "bg-purple-500",
    badge: "bg-purple-50 text-purple-700",
  },
  "Out for Chilled Delivery": {
    label: "In Transit",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700",
  },
  Delivered: {
    label: "Delivered",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
  },
  Cancelled: {
    label: "Cancelled",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700",
  },
};

export default function OrderTrackingView({
  orders,
  onUpdateStatus,
}: OrderTrackingViewProps) {
  const [activeTab, setActiveTab] = useState<"all" | "kitchen" | "transit" | "delivered">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderTransaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "kitchen" && order.fulfillmentStatus !== "Baking in Oven") {
      return false;
    }
    if (
      activeTab === "transit" &&
      order.fulfillmentStatus !== "Ready for Dispatch" &&
      order.fulfillmentStatus !== "Out for Chilled Delivery"
    ) {
      return false;
    }
    if (activeTab === "delivered" && order.fulfillmentStatus !== "Delivered") {
      return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(q);
      const matchesName = order.customer.name.toLowerCase().includes(q);
      const matchesPhone = order.customer.phone.includes(q);
      if (!matchesId && !matchesName && !matchesPhone) return false;
    }

    return true;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const bakingCount = orders.filter((o) => o.fulfillmentStatus === "Baking in Oven").length;
  const transitCount = orders.filter((o) => o.fulfillmentStatus === "Out for Chilled Delivery").length;
  const deliveredCount = orders.filter((o) => o.fulfillmentStatus === "Delivered").length;

  return (
    <div className="space-y-6">
      
      {/* Minimalist Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Total Orders
          </p>
          <p className="text-2xl font-bold font-mono text-[#111827] mt-1">{orders.length}</p>
          <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
            ₹{totalRevenue.toLocaleString("en-IN")} total volume
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Baking
          </p>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{bakingCount}</p>
          <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
            In kitchen queue
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            In Transit
          </p>
          <p className="text-2xl font-bold font-mono text-blue-600 mt-1">{transitCount}</p>
          <span className="text-[11px] text-[#6B7280] font-medium block mt-0.5">
            Fleet delivery
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-xs">
          <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
            Fulfilled
          </p>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{deliveredCount}</p>
          <span className="text-[11px] text-[#10B981] font-medium block mt-0.5">
            Delivered successfully
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">
              Order Ledger
            </h2>
            <p className="text-xs text-[#6B7280]">
              Recent transactions and live fulfillment tracking
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or name..."
              className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#F3F4F6] pb-3">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            { id: "kitchen", label: "Baking", count: bakingCount },
            { id: "transit", label: "Transit", count: transitCount },
            { id: "delivered", label: "Delivered", count: deliveredCount },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#111827] text-white"
                    : "bg-[#FAFAFA] text-[#4B5563] hover:bg-[#F3F4F6]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${isActive ? "bg-[#27272A] text-white" : "bg-[#E5E7EB] text-[#4B5563]"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] font-medium uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Patron</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {filteredOrders.map((order) => {
                const statusMeta = STATUS_CONFIG[order.fulfillmentStatus];
                return (
                  <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                    
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 font-mono font-medium text-[#111827]">
                        <span>#{order.id}</span>
                        <button
                          onClick={() => handleCopy(order.id)}
                          className="text-[#9CA3AF] hover:text-black cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#6B7280] block mt-0.5">{order.createdAt}</span>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-medium text-[#111827]">{order.customer.name}</p>
                      <p className="text-[11px] text-[#6B7280]">{order.customer.phone}</p>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[11px] text-[#111827] truncate">
                              {item.quantity}x {item.name} ({item.weight})
                            </span>
                            {item.customMessage && (
                              <span className="text-[10px] text-[#6B7280] italic truncate">
                                &ldquo;{item.customMessage}&rdquo;
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-[#111827]">
                      ₹{order.total}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${statusMeta.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                          {statusMeta.label}
                        </span>

                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) =>
                            onUpdateStatus(order.id, e.target.value as FulfillmentStatus)
                          }
                          className="bg-white border border-[#E5E7EB] rounded-md px-1.5 py-0.5 text-[10px] text-[#374151] focus:outline-none cursor-pointer"
                        >
                          <option value="Baking in Oven">Baking</option>
                          <option value="Ready for Dispatch">Ready</option>
                          <option value="Out for Chilled Delivery">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[11px] text-[#374151] hover:text-[#111827] border border-[#E5E7EB] hover:bg-[#F3F4F6] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Minimalist Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] z-10 animate-modal-in space-y-4">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
              <div>
                <p className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider">
                  Order Details
                </p>
                <h3 className="text-base font-semibold text-[#111827]">
                  #{selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-[#374151]">
              <p className="font-medium text-[#111827]">{selectedOrder.customer.name}</p>
              <p className="flex items-center gap-1.5 text-[#6B7280]">
                <Phone className="w-3.5 h-3.5" />
                {selectedOrder.customer.phone}
              </p>
              <p className="flex items-center gap-1.5 text-[#6B7280]">
                <MapPin className="w-3.5 h-3.5" />
                {selectedOrder.customer.address}
              </p>
            </div>

            <div className="border-t border-[#F3F4F6] pt-3 space-y-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#6B7280]">
                Items
              </p>
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span>
                    {item.quantity}x {item.name} ({item.weight})
                  </span>
                  <span className="font-mono text-[#111827]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#F3F4F6] pt-3 flex justify-between font-mono font-semibold text-sm text-[#111827]">
              <span>Total Paid</span>
              <span>₹{selectedOrder.total}</span>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full bg-[#111827] hover:bg-black text-white text-xs font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
