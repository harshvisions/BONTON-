"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Truck,
  Heart,
  ExternalLink,
  CheckCircle,
  CreditCard,
  MessageCircle
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4500);
  };

  const deliveryZones = [
    "Yamunapuram",
    "Bhoor Crossing",
    "Civil Lines",
    "DM Road",
    "Awas Vikas 1 & 2",
    "Circular Road",
    "Kala Aam Chauraha",
    "Delhi Road",
    "Khurja",
    "Sikandrabad Highway"
  ];

  return (
    <footer className="relative bg-[#341F1A] text-[#F7EEDB] border-t border-[#4D2E26] overflow-hidden">
      
      {/* Decorative Scallop Top Wave */}
      <div className="w-full overflow-hidden leading-none -mt-px pointer-events-none text-[#F7EEDB]">
        <svg
          className="relative block w-full h-4 sm:h-6 text-[#F7EEDB]"
          viewBox="0 0 1200 24"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,20 350,24 600,12 C850,0 1050,20 1200,0 L1200,0 L0,0 Z"></path>
        </svg>
      </div>

      {/* 1. Bakery Trust & Service Pillars Bar */}
      <div className="border-b border-[#4D2E26] bg-[#2E1A16]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#3D2721]/60 border border-[#4D2E26]">
              <div className="w-10 h-10 rounded-xl bg-[#F4C6D7]/15 text-[#F4C6D7] flex items-center justify-center shrink-0 border border-[#F4C6D7]/30">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                  45-Min Express Dispatch
                </h4>
                <p className="text-[11px] text-[#D8C7BC] mt-0.5 leading-relaxed">
                  Fast temperature-controlled van delivery across Yamunapuram &amp; Bhoor Crossing.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#3D2721]/60 border border-[#4D2E26]">
              <div className="w-10 h-10 rounded-xl bg-[#F4C6D7]/15 text-[#F4C6D7] flex items-center justify-center shrink-0 border border-[#F4C6D7]/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                  100% Dedicated Eggless
                </h4>
                <p className="text-[11px] text-[#D8C7BC] mt-0.5 leading-relaxed">
                  Pure vegetarian bakery kitchen using French butter &amp; Belgian Callebaut covertures.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#3D2721]/60 border border-[#4D2E26]">
              <div className="w-10 h-10 rounded-xl bg-[#F4C6D7]/15 text-[#F4C6D7] flex items-center justify-center shrink-0 border border-[#F4C6D7]/30">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                  Custom Piped Inscriptions
                </h4>
                <p className="text-[11px] text-[#D8C7BC] mt-0.5 leading-relaxed">
                  Personalized celebration messages hand-piped on chocolate plaques with candles.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#3D2721]/60 border border-[#4D2E26]">
              <div className="w-10 h-10 rounded-xl bg-[#F4C6D7]/15 text-[#F4C6D7] flex items-center justify-center shrink-0 border border-[#F4C6D7]/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                  Baked Hourly &middot; 7 AM to 11:30 PM
                </h4>
                <p className="text-[11px] text-[#D8C7BC] mt-0.5 leading-relaxed">
                  Pulled hot from deck ovens within 2 hours of dispatch. Midnight delivery available.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        
        {/* 2. Newsletter & Privilege Club Callout */}
        <div className="bg-gradient-to-r from-[#3D2721] via-[#482F28] to-[#3D2721] rounded-3xl p-6 sm:p-10 border border-[#5A3E36] mb-14 shadow-2xl relative overflow-hidden">
          {/* Subtle blush ambient glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#F4C6D7]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="max-w-xl text-center lg:text-left space-y-2">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#F4C6D7] bg-[#F4C6D7]/15 px-3 py-1 rounded-full border border-[#F4C6D7]/30">
                The Bon Ton Privilege Circle
              </span>
              <h3
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                className="text-2xl sm:text-3xl font-extrabold text-[#F7EEDB]"
              >
                Receive Secret Pâtisserie Inventions &amp; Invitations
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7BC] leading-relaxed">
                Join over 25,000 Bulandshahr food lovers. Enjoy secret dessert tastings, seasonal hamper access, and flat 20% off your maiden order with code <span className="font-mono font-bold text-[#F4C6D7]">BONTON20</span>.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md">
              {subscribed ? (
                <div className="bg-[#15803D]/20 border border-[#15803D] text-[#86EFAC] text-xs font-semibold px-4 py-3 rounded-2xl text-center">
                  🎉 Welcome to the Privilege Circle! Code BONTON20 is active for your cart.
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3857C]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-[#2E1A16] border border-[#5A3E36] rounded-xl pl-10 pr-3 py-3 text-xs text-[#F7EEDB] placeholder-[#A3857C] focus:outline-none focus:ring-2 focus:ring-[#F4C6D7] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#F4C6D7] hover:bg-[#EEB3C7] text-[#5A3E36] font-extrabold px-6 py-3 rounded-xl text-xs transition-all shrink-0 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
                  >
                    Join Circle
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 3. Main 5-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#4D2E26]">
          
          {/* Col 1: Brand Heritage & Google Maps (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col">
              <span
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                className="text-2xl sm:text-3xl font-extrabold tracking-[0.18em] text-[#F7EEDB]"
              >
                BON TON
              </span>
              <span className="text-[10px] tracking-[0.3em] text-[#F4C6D7] uppercase font-bold pl-1">
                Bakery &middot; Bulandshahr
              </span>
            </div>

            <p className="text-xs text-[#D8C7BC] leading-relaxed">
              Bulandshahr&apos;s premier artisanal cake studio and bakery. Crafting celebration cakes, pure vegetarian pastries, rustic sourdough breads, and luxury gifting trunks using Belgian chocolate and French butter.
            </p>

            {/* Direct Google Maps Location Pin Card */}
            <div className="p-3.5 rounded-2xl bg-[#2E1A16] border border-[#4D2E26] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MapPin className="w-4 h-4 text-[#F4C6D7] shrink-0" />
                <span>Bhoor Crossing &amp; Yamunapuram</span>
              </div>
              <p className="text-[11px] text-[#A3857C]">
                Bulandshahr, Uttar Pradesh &middot; 203001
              </p>
              <a
                href="https://maps.app.goo.gl/tdEQ7ZgoeaFJuCru7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#F4C6D7] hover:underline pt-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="space-y-1 text-xs text-[#D8C7BC]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F4C6D7]" />
                <span>Order Desk: +91 (05732) 250100</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Hotline: +91 98970 23456</span>
              </div>
            </div>
          </div>

          {/* Col 2: Signature Cakes (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#F4C6D7] uppercase tracking-wider mb-4">
              Signature Cakes
            </h4>
            <ul className="space-y-2 text-xs text-[#D8C7BC]">
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Belgian Truffle Noir</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Wild Berry Mascarpone</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Lotus Biscoff Cheesecake</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Vintage Red Velvet</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Parisian Pistachio Opera</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Ferrero Hazelnut Gateau</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Burnt Basque Slices</a></li>
            </ul>
          </div>

          {/* Col 3: Pâtisserie & Breads (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#F4C6D7] uppercase tracking-wider mb-4">
              Pâtisserie &amp; Breads
            </h4>
            <ul className="space-y-2 text-xs text-[#D8C7BC]">
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">48-Hr Wild Sourdough</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">French Butter Croissants</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Parisian Macaron Chests</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Raspberry Frangipane Tart</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Savory Herb Focaccia</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Artisan Spiced Tea Cakes</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Celebration Hampers</a></li>
            </ul>
          </div>

          {/* Col 4: Patron Services (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#F4C6D7] uppercase tracking-wider mb-4">
              Patron Services
            </h4>
            <ul className="space-y-2 text-xs text-[#D8C7BC]">
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Midnight Surprise Delivery</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Custom Tiered Wedding Cakes</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Corporate Gifting Suites</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Party Catering &amp; Favors</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">100% Eggless Purity Seal</a></li>
              <li><a href="/admin" className="hover:text-[#F4C6D7] transition-colors">Admin Atelier Console</a></li>
              <li><a href="#menu-grid" className="hover:text-[#F4C6D7] transition-colors">Track Live Dispatch</a></li>
            </ul>
          </div>

          {/* Col 5: Baking Hours & Safety (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-[#F4C6D7] uppercase tracking-wider mb-4">
              Baking Timings
            </h4>
            <div className="space-y-2 text-xs text-[#D8C7BC]">
              <p><strong className="text-white">Daily Baking:</strong> 7:00 AM – 11:30 PM</p>
              <p><strong className="text-white">Express Dispatch:</strong> 45 Mins in Bulandshahr</p>
              <p><strong className="text-white">Midnight Slot:</strong> 11:00 PM – 12:00 AM</p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#15803D]/25 text-[#86EFAC] border border-[#15803D]/50 text-[10px] font-bold">
                  ● FSSAI Certified Luxury Kitchen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bulandshahr Delivery Localities Pill Strip */}
        <div className="py-6 border-b border-[#4D2E26] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#F4C6D7] font-bold shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#F4C6D7]" />
            <span>Express Delivery Zones in Bulandshahr:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {deliveryZones.map((zone) => (
              <span
                key={zone}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[#2E1A16] text-[#D8C7BC] border border-[#4D2E26] hover:border-[#F4C6D7] hover:text-[#F4C6D7] transition-colors cursor-pointer"
              >
                {zone}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Bottom Copyright, Payment Badges & Legal Links */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#A3857C]">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p>© 2026 Bon Ton Bakery Bulandshahr. All rights reserved.</p>
            <span className="hidden sm:inline text-[#5A3E36]">&middot;</span>
            <span className="text-[11px] text-[#D8C7BC]">
              FSSAI Lic. No. 12724018000451
            </span>
          </div>

          {/* Secure Payment Badges */}
          <div className="flex items-center gap-2 text-[10px] text-[#D8C7BC] bg-[#2E1A16] px-3 py-1.5 rounded-xl border border-[#4D2E26]">
            <CreditCard className="w-3.5 h-3.5 text-[#F4C6D7]" />
            <span>Secure Payments: UPI &middot; Cards &middot; NetBanking &middot; COD</span>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-3 text-[11px] text-[#A3857C]">
            <span className="hover:text-[#F4C6D7] cursor-pointer">Privacy Policy</span>
            <span>&middot;</span>
            <span className="hover:text-[#F4C6D7] cursor-pointer">Terms of Pâtisserie</span>
            <span>&middot;</span>
            <span className="hover:text-[#F4C6D7] cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
