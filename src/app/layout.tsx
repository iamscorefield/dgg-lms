import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "./LayoutShell";

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
    <html lang="en" className={inter.className}>
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
