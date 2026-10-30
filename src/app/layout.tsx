import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bon Ton Bakery | Bulandshahr's Premier Cake Studio & Artisan Bakery",
  description:
    "Welcome to Bon Ton Bakery, Bulandshahr's trusted destination for handcrafted designer cakes, 100% eggless pastries, artisan breads, and celebration hampers. Freshly baked in Yamunapuram & Bhoor with express delivery.",
  keywords: [
    "Bon Ton Bakery",
    "Bon Ton Bakery Bulandshahr",
    "bakery in Bulandshahr",
    "designer cakes Bulandshahr",
    "eggless cakes Bhoor",
    "Yamunapuram cake shop",
    "birthday cake delivery Bulandshahr",
    "celebration hampers",
  ],
  openGraph: {
    title: "Bon Ton Bakery | Bulandshahr's Premier Cake Studio & Artisan Bakery",
    description:
      "Handcrafted designer cakes, French pastries, fresh breads, and celebration hampers baked fresh daily in Bulandshahr.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F7EEDB] text-[#5A3E36] antialiased selection:bg-[#F4C6D7] selection:text-[#5A3E36]">
        <AuthProvider>
          <CartProvider>
            {children}
            <CartDrawer />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
