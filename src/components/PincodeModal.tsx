"use client";

import React, { useState } from "react";
import { X, MapPin, Clock } from "lucide-react";

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (cityText: string) => void;
}

const PRESET_ZONES = [
  { city: "Yamunapuram & Bhoor Crossing", pincode: "203001", eta: "45-Min Express", status: "Active" },
  { city: "Civil Lines & DM Road", pincode: "203001", eta: "45-Min Express", status: "Active" },
  { city: "Awas Vikas 1 & 2 / Circular Rd", pincode: "203001", eta: "60-Min Express", status: "Active" },
  { city: "Kala Aam & Delhi Road Outskirts", pincode: "203001", eta: "Same Day Evening", status: "Active" },
  { city: "Khurja & Sikandrabad Highway", pincode: "203131", eta: "Pre-order 2h", status: "Active" },
];

export default function PincodeModal({ isOpen, onClose, onSelectCity }: PincodeModalProps) {
  const [inputPin, setInputPin] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin.length !== 6) {
      setFeedback("Please enter a valid 6-digit postal code.");
      return;
    }
    onSelectCity(`Bulandshahr (${inputPin} Express)`);
    onClose();
  };

  const handleSelectPreset = (zone: typeof PRESET_ZONES[0]) => {
    onSelectCity(`${zone.city} (${zone.eta})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-[#FFFDF9] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EBDDC6] z-10 animate-modal-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F7EEDB] text-[#5A3E36] flex items-center justify-center hover:bg-[#EBDDC6] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-[#FDF2F6] text-[#D86C93] px-3 py-1 rounded-full border border-[#F4C6D7] mb-2 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#D86C93]" />
          <span>Delivery Atelier Dispatch</span>
        </div>

        <h3
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          className="text-xl font-bold text-[#5A3E36]"
        >
          Check Express Delivery Zone
        </h3>
        <p className="text-xs text-[#7D5A50] mt-1 mb-4">
          We deliver freshly baked cakes in temperature-insulated packaging across Bulandshahr &amp; surrounding areas.
        </p>

        <form onSubmit={handleCheck} className="space-y-3 mb-5">
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={inputPin}
              onChange={(e) => {
                setInputPin(e.target.value.replace(/\D/g, ""));
                setFeedback(null);
              }}
              placeholder="Enter 6-digit Pincode (e.g. 203001)"
              className="flex-1 bg-[#F7EEDB] border border-[#EBDDC6] rounded-xl px-3 py-2.5 text-xs text-[#5A3E36] font-mono focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
            />
            <button
              type="submit"
              className="bg-[#5A3E36] hover:bg-[#3D2721] text-[#F4C6D7] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Check
            </button>
          </div>
          {feedback && <p className="text-[11px] text-red-600 font-medium">{feedback}</p>}
        </form>

        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#8E6D64] uppercase tracking-wider">
            Popular Bulandshahr Delivery Zones:
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {PRESET_ZONES.map((zone) => (
              <button
                key={zone.pincode}
                onClick={() => handleSelectPreset(zone)}
                className="w-full text-left p-2.5 rounded-xl border border-[#EBDDC6] hover:border-[#F4C6D7] bg-[#FFFDF9] hover:bg-[#FDF2F6] transition-all flex items-center justify-between text-xs cursor-pointer group"
              >
                <div>
                  <div className="font-bold text-[#5A3E36] group-hover:text-[#3D2721]">
                    {zone.city}
                  </div>
                  <div className="text-[10px] text-[#8E6D64]">Pincode: {zone.pincode}</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#15803D]">
                  <Clock className="w-3 h-3 text-[#15803D]" />
                  <span>{zone.eta}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
