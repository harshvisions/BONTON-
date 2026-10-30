"use client";

import React from "react";
import Image from "next/image";
import { Star, Quote, CheckCircle2 } from "lucide-react";

const REVIEWS = [
  {
    name: "Dr. Ananya Singhal",
    location: "Yamunapuram, Bulandshahr",
    review:
      "Ordered the Belgian Truffle Noir Cake for our 10th anniversary. It arrived right on time in a temperature-controlled presentation box. The chocolate ganache was extraordinarily smooth — hands down the finest bakery in Bulandshahr!",
    productName: "Belgian Truffle Noir Cake",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    date: "2 days ago",
  },
  {
    name: "Rohan Agrawal",
    location: "Civil Lines, Bulandshahr",
    review:
      "The Wild Berry Mascarpone cake was the talk of my daughter's birthday! Airy sponge, bursting with fresh berries and just the right sweetness. Bon Ton Bakery has truly raised the bar in town.",
    productName: "Wild Berry Mascarpone Naked Cake",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    date: "Yesterday",
  },
  {
    name: "Meera Mittal",
    location: "Bhoor Crossing, Bulandshahr",
    review:
      "As someone strictly vegetarian, finding 100% pure eggless cakes that don't taste dense was impossible until Bon Ton Bakery. Their Lotus Biscoff baked cheesecake is pure magic. Simply sublime!",
    productName: "Lotus Biscoff Baked Cheesecake",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    date: "4 days ago",
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-[#FFFDF9] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest bg-[#FDF2F6] text-[#D86C93] px-3.5 py-1 rounded-full border border-[#F4C6D7] mb-2 shadow-2xs">
            Celebrated Moments
          </div>
          <h2
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="text-2xl sm:text-4xl font-bold text-[#5A3E36]"
          >
            Loved by Connoisseurs
          </h2>
          <p className="text-xs sm:text-sm text-[#7D5A50] mt-2">
            Over 25,000 milestones made sweeter across Bulandshahr
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#F7EEDB] rounded-3xl p-6 border border-[#EBDDC6] hover:border-[#F4C6D7] flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#F4C6D7]/60 group-hover:text-[#F4C6D7] transition-colors" />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#DF688E] text-[#DF688E]"
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#5A3E36] leading-relaxed italic mb-4">
                  &ldquo;{rev.review}&rdquo;
                </p>

                <div className="inline-block bg-[#FDF2F6] text-[#5A3E36] text-[10px] font-semibold px-2.5 py-1 rounded-md mb-4 border border-[#F4C6D7]">
                  Ordered: {rev.productName}
                </div>
              </div>

              {/* Patron Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#EBDDC6]">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#F4C6D7] shrink-0">
                  <Image src={rev.avatar} alt={rev.name} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-xs font-bold text-[#5A3E36]">{rev.name}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  </div>
                  <p className="text-[10px] text-[#7D5A50]">{rev.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
