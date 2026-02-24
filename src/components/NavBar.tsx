"use client";

export default function NavBar() {
  return (
    <header className="fixed top-9 sm:top-10 left-0 right-0 bg-white shadow-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-2 sm:py-3">
          {/* Logo left */}
          <a href="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="DGG Academy"
              className="h-9 w-auto sm:h-10"
            />
          </a>

          {/* Buttons right */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/login"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-[#512d7c] border-2 border-[#512d7c] rounded-full font-medium hover:bg-[#512d7c] hover:text-white transition"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-4 py-1.5 sm:px-5 sm:py-2.5 bg-[#f2b42c] text-xs sm:text-sm text-black font-bold rounded-full hover:bg-[#e0a51a] transition shadow-md"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
