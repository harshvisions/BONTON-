"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  authModalMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  login: (name: string, email: string, phone: string) => void;
  logout: () => void;
  addSweetCredits: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("bonton_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // fallback
    }
  }, []);

  const openAuthModal = (mode: "signin" | "signup" = "signin") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (name: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      name: name || "Confectionery Connoisseur",
      email: email || "patron@bontonbakery.in",
      phone: phone || "+91 98765 43210",
      sweetCredits: 450,
      tier: "Gold",
    };
    setUser(newUser);
    localStorage.setItem("bonton_user", JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bonton_user");
  };

  const addSweetCredits = (amount: number) => {
    if (!user) return;
    const updated = { ...user, sweetCredits: user.sweetCredits + amount };
    setUser(updated);
    localStorage.setItem("bonton_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        addSweetCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
