"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown, Clock, ShieldCheck, Tag } from "lucide-react";

export default function AnnouncementBar({
  onOpenPincode,
}: {
  onOpenPincode?: () => void;
}) {
  const [selectedCity, setSelectedCity] = useState("Bulandshahr (Yamunapuram & Bhoor - 45 Min Express)");

  return (
    <div className="bg-[#3D2721] text-[#F7EEDB] text-xs font-medium border-b border-[#5A3E36] relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Location & Delivery Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPincode}
            className="flex items-center gap-1.5 text-[#F4C6D7] hover:text-white transition-colors cursor-pointer group"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F4C6D7] group-hover:scale-110 transition-transform" />
            <span className="font-semibold underline decoration-dotted underline-offset-4 text-[#F7EEDB] group-hover:text-white">
              {selectedCity}
            </span>
            <ChevronDown className="w-3 h-3 text-[#F4C6D7]" />
          </button>
          <span className="hidden sm:inline text-[#7D5A50]">•</span>
          <span className="hidden sm:flex items-center gap-1.5 text-[#E5D5C2]">
            <Clock className="w-3.5 h-3.5 text-[#F4C6D7]" />
            Order before 8 PM for Same Day Delivery
          </span>
        </div>

        {/* Center: Offer Ticker */}
        <div className="flex items-center gap-2 text-center">
          <Tag className="w-3.5 h-3.5 text-[#F4C6D7]" />
          <span className="text-[#F7EEDB]">
            Bon Ton Special: Flat 20% OFF with code{" "}
            <span className="bg-[#F4C6D7] text-[#5A3E36] font-mono font-extrabold px-2 py-0.5 rounded-full shadow-xs border border-[#F4C6D7]/40 tracking-wider">
              BONTON20
            </span>
          </span>
        </div>

        {/* Right: Eggless & Purity Assurance */}
        <div className="hidden lg:flex items-center gap-3 text-[#E5D5C2]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#15803D] inline-block"></span>
            100% Eggless Kitchen Certified
          </span>
          <span className="text-[#7D5A50]">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F4C6D7]" />
            Belgian Callebaut Cocoa
          </span>
        </div>
      </div>
    </div>
  );
}
