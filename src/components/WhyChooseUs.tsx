"use client";

import React from "react";
import { ShieldCheck, Truck, Clock, Award } from "lucide-react";

export default function WhyChooseUs() {
  const highlights = [
    {
      icon: Clock,
      title: "Fresh Baked Hourly",
      desc: "Never refrigerated in cold rooms. Every sponge is pulled from deck ovens within 2 hours of express dispatch in Bulandshahr.",
    },
    {
      icon: Award,
      title: "54% Callebaut & French Butter",
      desc: "Pure Belgian covertures, Charentes-Poitou butter, and organic vanilla beans. Zero compound or palm oil.",
    },
    {
      icon: ShieldCheck,
      title: "100% Dedicated Eggless Kitchen",
      desc: "Separate certified bakery ateliers for pure vegetarian confections ensuring absolute culinary purity and peace of mind.",
    },
    {
      icon: Truck,
      title: "Midnight Chilled Transit",
      desc: "Temperature-insulated custom delivery boxes guaranteed to arrive chilled, intact, and picture-perfect in 45 minutes.",
    },
  ];

  return (
    <section className="bg-[#F7EEDB] py-16 border-t border-b border-[#EBDDC6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest bg-[#FDF2F6] text-[#D86C93] px-3.5 py-1 rounded-full border border-[#F4C6D7] mb-2 shadow-2xs">
            <span>The Bon Ton Standard</span>
          </div>
          <h2
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="text-2xl sm:text-4xl font-bold text-[#5A3E36]"
          >
            Culinary Craft Without Compromise
          </h2>
          <p className="text-xs sm:text-sm text-[#7D5A50] mt-2">
            Styled with European finesse, crafted for unforgettable Bulandshahr celebrations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFDF9] rounded-2xl p-6 border border-[#EBDDC6] hover:border-[#F4C6D7] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center group"
              >
                <div className="w-13 h-13 rounded-2xl bg-[#FDF2F6] border border-[#F4C6D7] text-[#D86C93] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#5A3E36] group-hover:text-[#F4C6D7] group-hover:border-[#5A3E36] transition-all shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  className="text-base font-bold text-[#5A3E36] mb-2"
                >
                  {item.title}
                </h3>
                <p className="text-xs text-[#7D5A50] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
