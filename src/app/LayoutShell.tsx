"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TopHeader from "@/components/TopHeader";
import { Toaster } from "react-hot-toast";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes where header/nav/footer should be hidden
  const hideChrome =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/tutor");

  return (
    <body className="bg-white min-h-screen flex flex-col">
      {!hideChrome && (
        <>
          {/* Top header bar */}
          <TopHeader />

          {/* Main navbar below top header */}
          <NavBar />
        </>
      )}

      {/* Push page content below fixed header + navbar on site pages */}
      <main className={hideChrome ? "flex-grow" : "flex-grow pt-8 sm:pt-10"}>
        {children}
      </main>

      {!hideChrome && <Footer />}

      <Toaster position="top-center" />
      <script src="https://js.paystack.co/v2/inline.js" async></script>
    </body>
  );
}
