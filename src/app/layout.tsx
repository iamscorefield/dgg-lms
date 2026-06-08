import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "./LayoutShell";
import LmsPopup from "@/components/LmsPopup"; // 🔥 Added global tracking import path node

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DGG Academy",
  description: "Hybrid Learning Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 🔥 FIXED: Added suppressHydrationWarning attributes to eliminate console layout warnings completely
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
        
        {/* 🚀 GLOBAL PORTAL TRIGGER LAYER: Activated for free/unpaid users on your localhost */}
        <LmsPopup isFreeUser={true} />
      </body>
    </html>
  );
}