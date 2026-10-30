"use client";

import React, { useState } from "react";
import { X, Phone, Mail, Lock, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [authMethod, setAuthMethod] = useState<"otp" | "password">("otp");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync mode with context
  React.useEffect(() => {
    setMode(authModalMode);
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      login(
        name || "Confectionery Connoisseur",
        email || "patron@bontonbakery.in",
        phone || "+91 98111 22334"
      );
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    login("Lady Genevieve", "genevieve@bontonbakery.in", "+91 99999 88888");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FFFDF9] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#EBDDC6] z-10 animate-modal-in">
        
        {/* Top Decorative Header */}
        <div className="bg-[#3D2721] text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-[#F4C6D7]/20 blur-xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close auth modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-[#F4C6D7] text-xs font-bold uppercase tracking-widest mb-1">
            <span>Patron Atelier</span>
          </div>

          <h2
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            className="text-2xl font-bold text-[#F7EEDB]"
          >
            {mode === "signin" ? "Welcome Back to Bon Ton Bakery" : "Join Our Patisserie Circle"}
          </h2>
          <p className="text-xs text-[#E2D2BC] mt-1">
            {mode === "signin"
              ? "Access your saved confections, loyalty Sweet Credits & express reordering in Bulandshahr."
              : "Earn 450 Sweet Credits (₹450 value) on your very first order."}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#EBDDC6] bg-[#F7EEDB]">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              mode === "signin"
                ? "border-[#5A3E36] text-[#5A3E36] bg-[#FFFDF9]"
                : "border-transparent text-[#7D5A50] hover:text-[#5A3E36]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              mode === "signup"
                ? "border-[#5A3E36] text-[#5A3E36] bg-[#FFFDF9]"
                : "border-transparent text-[#7D5A50] hover:text-[#5A3E36]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-[#5A3E36] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Singhal"
                className="w-full bg-[#F7EEDB] border border-[#EBDDC6] rounded-xl px-3 py-2.5 text-xs text-[#5A3E36] placeholder-[#94766E] focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#5A3E36] mb-1">
              Mobile Number / Email
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E6D64]" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98970 00000"
                className="w-full bg-[#F7EEDB] border border-[#EBDDC6] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#5A3E36] placeholder-[#94766E] focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-[#5A3E36] mb-1">
                Email for Invoices &amp; Offers
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E6D64]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@bontonbakery.in"
                  className="w-full bg-[#F7EEDB] border border-[#EBDDC6] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#5A3E36] placeholder-[#94766E] focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
                />
              </div>
            </div>
          )}

          {/* Auth Method Selector */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#5A3E36]">Authentication:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod("otp")}
                  className={`text-[11px] font-semibold cursor-pointer ${
                    authMethod === "otp" ? "text-[#D86C93] underline" : "text-[#7D5A50]"
                  }`}
                >
                  Instant SMS OTP
                </button>
                <span className="text-[#EBDDC6]">&middot;</span>
                <button
                  type="button"
                  onClick={() => setAuthMethod("password")}
                  className={`text-[11px] font-semibold cursor-pointer ${
                    authMethod === "password" ? "text-[#D86C93] underline" : "text-[#7D5A50]"
                  }`}
                >
                  Password
                </button>
              </div>
            </div>

            {authMethod === "otp" ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="flex-1 bg-[#F7EEDB] border border-[#EBDDC6] rounded-xl px-3 py-2 text-xs text-[#5A3E36] placeholder-[#94766E] font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(true);
                      setOtpCode("7890");
                    }}
                    className="bg-[#FDF2F6] text-[#5A3E36] border border-[#F4C6D7] px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#F4C6D7] transition-colors cursor-pointer"
                  >
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
                {otpSent && (
                  <p className="text-[11px] text-[#15803D] flex items-center gap-1 font-medium">
                    <Check className="w-3 h-3" />
                    Demo OTP &ldquo;7890&rdquo; auto-filled for you!
                  </p>
                )}
              </div>
            ) : (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E6D64]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F7EEDB] border border-[#EBDDC6] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#5A3E36] placeholder-[#94766E] focus:outline-none focus:ring-1 focus:ring-[#F4C6D7]"
                />
              </div>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#5A3E36] hover:bg-[#3D2721] text-[#F4C6D7] font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-95"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === "signin" ? "Sign In to Studio" : "Claim 450 Sweet Credits & Join"}</span>
                <ArrowRight className="w-4 h-4 text-[#F4C6D7]" />
              </>
            )}
          </button>

          {/* 1-Click VIP Patron Demo Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full bg-gradient-to-r from-[#FDF2F6] to-[#F4C6D7] hover:from-[#F4C6D7] hover:to-[#EEB3C7] text-[#5A3E36] font-bold py-2.5 px-3 rounded-xl text-xs border border-[#F4C6D7] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <span>⚡ 1-Click Demo Login as VIP Patron</span>
            </button>
          </div>

          {/* Terms info */}
          <p className="text-[10px] text-center text-[#7D5A50] pt-1">
            By continuing, you agree to Bon Ton Bakery&apos;s Terms of Service &amp; Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}
