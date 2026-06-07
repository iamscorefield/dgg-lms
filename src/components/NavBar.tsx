"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

const mainCoursesList = [
  { name: "Full-Stack Software Engineering", path: "/signup?track=software" },
  { name: "Advanced Data Analytics (SQL, Power BI)", path: "/signup?track=data" },
  { name: "UI/UX Product Design Systems", path: "/signup?track=design" },
  { name: "Digital Marketing & Brand Growth", path: "/signup?track=marketing" }
];

const prepCoursesList = [
  { name: "01. Computer & Internet Basics", path: "/signup?prep=01" },
  { name: "02. Getting Ready for Online Learning", path: "/signup?prep=02" },
  { name: "03. Introduction to Modern Techie Journey", path: "/signup?prep=03" },
  { name: "04. Introduction to No-Code Tools", path: "/signup?prep=04" },
  { name: "05. Cybersecurity Fundamentals", path: "/signup?prep=05" },
  { name: "06. Introduction to AI & Prompting", path: "/signup?prep=06" },
  { name: "07. Business Legal Registration (CAC)", path: "/signup?prep=07" },
  { name: "08. Digital Monetization & Upwork", path: "/signup?prep=08" }
];

export default function NavBar() {
  const [activeMenu, setActiveMenu] = useState<"main" | "prep" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/signup?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="fixed top-9 sm:top-10 left-0 right-0 bg-white shadow-md z-40 border-b border-slate-200/40 font-sans">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-10">
        
        {/* SINGLE ROW NAV SYSTEM FOR ABSOLUTE RESPONSIVENESS */}
        <div className="flex items-center justify-between py-2 sm:py-3 gap-1 sm:gap-4" ref={menuRef}>
          
          {/* 1. LEFT SEGMENT: BRAND LOGO */}
          <div className="flex items-center flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="DGG Academy"
                className="h-7 w-auto xs:h-8 sm:h-10 object-contain"
              />
            </a>
          </div>

          {/* 2. MIDDLE SEGMENT: CENTRAL HUB CONSOLE (Main, Prep + Search Icon) */}
          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-5 flex-1 px-1">
            
            {/* Explore Main Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === "main" ? null : "main")}
                className={`inline-flex items-center gap-0.5 xs:gap-1 text-[11px] xs:text-xs sm:text-sm font-black border-0 bg-transparent cursor-pointer transition-colors ${
                  activeMenu === "main" ? "text-[#512d7c]" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Explore Main
                <svg className={`w-2.5 h-2.5 transform transition-transform ${activeMenu === "main" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeMenu === "main" && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-60 sm:w-72 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 animate-fade-in z-50">
                  {mainCoursesList.map((course, idx) => (
                    <a
                      key={idx}
                      href={course.path}
                      className="block text-xs font-bold text-slate-700 hover:text-[#512d7c] hover:bg-purple-50/50 px-4 py-3 rounded-xl transition-all text-left decoration-none"
                    >
                      {course.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Explore Prep Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === "prep" ? null : "prep")}
                className={`inline-flex items-center gap-0.5 xs:gap-1 text-[11px] xs:text-xs sm:text-sm font-black border-0 bg-transparent cursor-pointer transition-colors ${
                  activeMenu === "prep" ? "text-[#512d7c]" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Explore Prep
                <svg className={`w-2.5 h-2.5 transform transition-transform ${activeMenu === "prep" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeMenu === "prep" && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 sm:w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 max-h-[260px] sm:max-h-[380px] overflow-y-auto custom-scrollbar animate-fade-in z-50">
                  <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block px-4 pt-2 pb-1">Foundational Sequence</span>
                  {prepCoursesList.map((course, idx) => (
                    <a
                      key={idx}
                      href={course.path}
                      className="block text-xs font-bold text-slate-700 hover:text-amber-600 hover:bg-amber-50/30 px-4 py-2.5 rounded-xl transition-all text-left decoration-none"
                    >
                      {course.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP INTEGRATED SEARCH INPUT FIELD */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 relative items-center ml-2 max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full pl-4 pr-12 py-1.5 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 font-medium border border-slate-200 rounded-full focus:outline-none focus:bg-white focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 p-1 bg-[#512d7c] hover:bg-[#3b215c] text-white rounded-full border-0 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* UNIVERSAL SEARCH ICON TOGGLE BUTTON (Visible on all smaller displays) */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-1.5 text-slate-500 hover:text-[#512d7c] bg-slate-50 hover:bg-purple-50 rounded-full border-0 cursor-pointer transition-colors"
              aria-label="Toggle input panel"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

          </div>

          {/* 3. RIGHT SEGMENT: STACKED BUTTON MODULE (Responsive & Shrunk) */}
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2 items-center flex-shrink-0">
            <a
              href="/login"
              className="w-[72px] xs:w-20 sm:w-auto px-1.5 py-0.5 sm:px-4 sm:py-2 text-[9px] xs:text-[10px] sm:text-xs text-center font-black text-[#512d7c] border border-[#512d7c] sm:border-2 rounded-md sm:rounded-full hover:bg-[#512d7c] hover:text-white transition-all decoration-none"
            >
              Login
            </a>
            <a
              href="/signup"
              className="w-[72px] xs:w-20 sm:w-auto px-1.5 py-0.5 sm:px-4 sm:py-2.5 text-[9px] xs:text-[10px] sm:text-xs text-center font-black text-black bg-[#f2b42c] rounded-md sm:rounded-full hover:bg-[#e0a51a] transition-all shadow-xs decoration-none"
            >
              Sign Up
            </a>
          </div>

        </div>

        {/* EXPANDABLE FLOATING ACCORDION SEARCH INPUT OVERLAY */}
        {mobileSearchOpen && (
          <div className="pb-3 pt-1 border-t border-slate-100 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog tracks..."
                className="w-full pl-4 pr-12 py-1.5 bg-slate-50 text-xs text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#512d7c]"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1 bg-[#512d7c] text-white rounded-lg border-0 flex items-center justify-center"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        )}

      </div>
    </header>
  );
}