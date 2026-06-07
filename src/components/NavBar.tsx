"use client";

import { useState, useEffect, useRef } from "react";

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
  const [activeMenu, setActiveMenu] = useState(null); // 'main' or 'prep'
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/signup?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    /* 🔥 PRESERVED: Retained your exact custom top header layout alignment settings (top-9 sm:top-10) */
    <header className="fixed top-9 sm:top-10 left-0 right-0 bg-white shadow-md z-40 border-b border-slate-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-2 sm:py-3 gap-4" ref={menuRef}>
          
          {/* Logo Left */}
          <div className="flex items-center flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="DGG Academy"
                className="h-9 w-auto sm:h-10 object-contain"
              />
            </a>
          </div>

          {/* 🚀 CENTER CONSOLE: DUAL DROPDOWNS + ADVANCED SEARCH ROUTING MODULE */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl xl:max-w-3xl gap-5">
            
            {/* Dropdown 1: Explore Main Course Tracks */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === "main" ? null : "main")}
                className={`inline-flex items-center gap-1.5 text-sm font-bold border-0 bg-transparent cursor-pointer transition-colors ${
                  activeMenu === "main" ? "text-[#512d7c]" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Explore Main
                <svg className={`w-3.5 h-3.5 transform transition-transform ${activeMenu === "main" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeMenu === "main" && (
                <div className="absolute left-0 mt-3 w-72 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 animate-fade-in">
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

            {/* Dropdown 2: Explore Prep Framework Modules */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === "prep" ? null : "prep")}
                className={`inline-flex items-center gap-1.5 text-sm font-bold border-0 bg-transparent cursor-pointer transition-colors ${
                  activeMenu === "prep" ? "text-[#512d7c]" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Explore Prep
                <svg className={`w-3.5 h-3.5 transform transition-transform ${activeMenu === "prep" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeMenu === "prep" && (
                <div className="absolute left-0 mt-3 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 max-h-[380px] overflow-y-auto custom-scrollbar animate-fade-in">
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

            {/* Micro Input Search Utility Frame */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full pl-5 pr-14 py-2 bg-white text-sm text-slate-800 placeholder-slate-400 font-medium border border-slate-300 rounded-full focus:outline-none focus:border-[#512d7c] focus:ring-1 focus:ring-[#512d7c] transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 p-1.5 bg-[#512d7c] hover:bg-[#3b215c] text-white rounded-full transition-colors border-0 flex items-center justify-center cursor-pointer"
                aria-label="Execute search parameters"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

          </div>

          {/* Buttons Right */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a
              href="/login"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-[#512d7c] border-2 border-[#512d7c] rounded-full font-medium hover:bg-[#512d7c] hover:text-white transition-all text-center decoration-none"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-4 py-1.5 sm:px-5 sm:py-2.5 bg-[#f2b42c] text-xs sm:text-sm text-black font-bold rounded-full hover:bg-[#e0a51a] transition-all shadow-md text-center decoration-none"
            >
              Get Started
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}