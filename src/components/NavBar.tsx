"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

interface NavCourseLink {
  name: string;
  path: string;
  isAction?: boolean;
}

// Fallback lists aligned with your updated catalog & quick actions
const fallbackFreeCoursesList: NavCourseLink[] = [
  {
    name: "Everyday Workspace Productivity Tools: Complete Guide to Microsoft Office & Google Apps",
    path: "/signup?track=free",
  },
  {
    name: "Computer Basics for Beginners: Understanding Hardware, Software & Everyday Operations",
    path: "/signup?track=free",
  },
  {
    name: "Mastering the Internet & Web Browsers: Unlocking Browser Features, Privacy, Settings, Safety & Online Navigation",
    path: "/signup?track=free",
  },
  {
    name: "Introduction to AI, Smart Online Research & Digital Opportunities",
    path: "/signup?track=free",
  },
  { name: "Explore All Free Resources", path: "/signup?track=free", isAction: true },
];

const fallbackPrepCoursesList: NavCourseLink[] = [
  {
    name: "Complete Digital & Computer Foundations: Basics, Keyboard Mastery, Browsers & Office",
    path: "/signup?track=prep",
  },
  {
    name: "Smart Online Learning & Navigating Digital Career Paths in Nigeria",
    path: "/signup?track=prep",
  },
  {
    name: "Digital Mindset, Discipline, Communication & Goal Setting",
    path: "/signup?track=prep",
  },
  {
    name: "Portfolio Building, Starting From Zero, Interviews & Online Opportunities",
    path: "/signup?track=prep",
  },
  { name: "Start your Prep Journey", path: "/signup?track=prep", isAction: true },
];

const fallbackBusinessCoursesList: NavCourseLink[] = [
  {
    name: "Get To Know Legal Registration of Business in Nigeria (CAC, FIRS)",
    path: "/signup?track=business",
  },
  {
    name: "Advanced Business Registration & Corporate Entity Setup Sprints",
    path: "/signup?track=business",
  },
  {
    name: "Annual Returns, Compliance & Regulatory Filings",
    path: "/signup?track=business",
  },
  {
    name: "Business Operations, Planning, Pitch Deck & Scale Frameworks",
    path: "/signup?track=business",
  },
  { name: "Explore Business Startup Hub", path: "/signup?track=business", isAction: true },
];

const fallbackMainCoursesList: NavCourseLink[] = [
  { name: "Full-Stack Web & Cloud Systems Engineering", path: "/signup?track=advance-skills" },
  { name: "Applied Data Analytics, Reporting & Workflow Automation", path: "/signup?track=advance-skills" },
  { name: "Digital Marketing & SEO", path: "/signup?track=advance-skills" },
  { name: "Admin Virtual Assistant", path: "/signup?track=advance-skills" },
  { name: "Project Management Professional", path: "/signup?track=advance-skills" },
  { name: "UI/UX Design Masterclass", path: "/signup?track=advance-skills" },
  { name: "And many more specialized tracks...", path: "/signup?track=advance-skills", isAction: true },
];

const resourcesList = [
  { name: "LMS Guide", path: "/resources/lms-guide" },
  { name: "Seminar/Webinar", path: "/resources/seminar-webinar" },
  { name: "Radio Program", path: "/resources/radio-program" },
  { name: "FAQs", path: "/resources/faq" },
  { name: "Certificate Verification", path: "/resources/certificate-verification" },
];

function classifyCourseTrack(raw: string): "free" | "prep" | "business" | "main" {
  const normalized = raw.toUpperCase();
  if (normalized.includes("FREE")) return "free";
  if (normalized.includes("PREP")) return "prep";
  if (normalized.includes("BIZ") || normalized.includes("BUSINESS")) return "business";
  return "main";
}

function buildSignupUrl(trackSlug: string, courseTitle: string): string {
  return `/signup?track=${encodeURIComponent(trackSlug)}&course=${encodeURIComponent(courseTitle)}`;
}

export default function NavBar() {
  const [activeMenu, setActiveMenu] = useState<"courses" | "resources" | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<
    "free" | "prep" | "business" | "main" | null
  >("free");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [freeCoursesList, setFreeCoursesList] = useState<NavCourseLink[]>(fallbackFreeCoursesList);
  const [prepCoursesList, setPrepCoursesList] = useState<NavCourseLink[]>(fallbackPrepCoursesList);
  const [businessCoursesList, setBusinessCoursesList] = useState<NavCourseLink[]>(
    fallbackBusinessCoursesList
  );
  const [mainCoursesList, setMainCoursesList] = useState<NavCourseLink[]>(fallbackMainCoursesList);

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

  useEffect(() => {
    let isMounted = true;

    async function fetchRealCourses() {
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .order("created_at", { ascending: true });

        if (error || !data || data.length === 0 || !isMounted) return;

        const grouped: Record<"free" | "prep" | "business" | "main", NavCourseLink[]> = {
          free: [],
          prep: [],
          business: [],
          main: [],
        };

        for (const row of data as Record<string, unknown>[]) {
          const title = String(row.title ?? "").trim();
          if (!title) continue;

          const rawTrack = String(
            row.track ?? row.course_type ?? row.tier ?? row.category ?? ""
          );
          const bucket = classifyCourseTrack(rawTrack);

          const trackParam =
            bucket === "free"
              ? "free"
              : bucket === "prep"
              ? "prep"
              : bucket === "business"
              ? "business"
              : "advance-skills";

          grouped[bucket].push({
            name: title,
            path: buildSignupUrl(trackParam, title),
          });
        }

        if (grouped.free.length > 0) {
          setFreeCoursesList([
            ...grouped.free,
            { name: "Explore All Free Resources", path: "/signup?track=free", isAction: true },
          ]);
        }

        if (grouped.prep.length > 0) {
          setPrepCoursesList([
            ...grouped.prep,
            { name: "Start your Prep Journey", path: "/signup?track=prep", isAction: true },
          ]);
        }

        if (grouped.business.length > 0) {
          setBusinessCoursesList([
            ...grouped.business,
            {
              name: "Explore Business Startup Hub",
              path: "/signup?track=business",
              isAction: true,
            },
          ]);
        }

        if (grouped.main.length > 0) {
          setMainCoursesList([
            ...grouped.main,
            {
              name: "And many more specialized tracks...",
              path: "/signup?track=advance-skills",
              isAction: true,
            },
          ]);
        }
      } catch {
        // Keep fallback lists cleanly if network or table query fails
      }
    }

    fetchRealCourses();
    return () => {
      isMounted = false;
    };
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
        {/* SINGLE ROW NAV SYSTEM */}
        <div
          className="flex items-center justify-between py-2 sm:py-3 gap-1 sm:gap-4 relative"
          ref={menuRef}
        >
          {/* 1. LEFT SEGMENT: BRAND LOGO */}
          <div className="flex items-center flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="DGG Academy"
                className="h-6 xs:h-7 sm:h-10 object-contain"
              />
            </a>
          </div>

          {/* 2. MIDDLE SEGMENT: CENTRAL HUB CONSOLE */}
          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-6 flex-1 px-1">
            {/* Courses Dropdown with Expandable Accordion Categories */}
            <div className="relative static sm:relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === "courses" ? null : "courses")}
                className={`inline-flex items-center gap-0.5 xs:gap-1 text-[11px] xs:text-xs sm:text-sm font-black border-0 bg-transparent cursor-pointer transition-colors ${
                  activeMenu === "courses"
                    ? "text-[#512d7c]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Courses
                <svg
                  className={`w-2.5 h-2.5 transform transition-transform ${
                    activeMenu === "courses" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeMenu === "courses" && (
                <div className="absolute left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 mt-3 w-auto sm:w-[480px] bg-white border border-slate-200 shadow-2xl rounded-2xl p-3 max-h-[420px] overflow-y-auto custom-scrollbar animate-fade-in z-50">
                  <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block px-3 pt-1 pb-2">
                    Select Curriculum Track
                  </span>

                  <div className="space-y-2">
                    {/* 1. FREE COURSES ACCORDION */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCategory(expandedCategory === "free" ? null : "free")
                        }
                        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-black text-[#512d7c] bg-transparent border-0 cursor-pointer hover:bg-purple-50/50"
                      >
                        <span>FREE COURSES</span>
                        <span>{expandedCategory === "free" ? "−" : "+"}</span>
                      </button>
                      {expandedCategory === "free" && (
                        <div className="px-4 pb-3 space-y-1.5 border-t border-slate-100 bg-white pt-2">
                          {freeCoursesList.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.path}
                              onClick={() => setActiveMenu(null)}
                              className={`block text-xs font-bold py-1 transition-all decoration-none ${
                                item.isAction
                                  ? "text-[#512d7c] font-black mt-1.5 pt-1.5 border-t border-slate-100"
                                  : "text-slate-600 hover:text-[#512d7c]"
                              }`}
                            >
                              {item.isAction ? item.name : `• ${item.name}`}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 2. PREP COURSES ACCORDION */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCategory(expandedCategory === "prep" ? null : "prep")
                        }
                        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-black text-[#512d7c] bg-transparent border-0 cursor-pointer hover:bg-purple-50/50"
                      >
                        <span>PREP COURSES</span>
                        <span>{expandedCategory === "prep" ? "−" : "+"}</span>
                      </button>
                      {expandedCategory === "prep" && (
                        <div className="px-4 pb-3 space-y-1.5 border-t border-slate-100 bg-white pt-2">
                          {prepCoursesList.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.path}
                              onClick={() => setActiveMenu(null)}
                              className={`block text-xs font-bold py-1 transition-all decoration-none ${
                                item.isAction
                                  ? "text-[#512d7c] font-black mt-1.5 pt-1.5 border-t border-slate-100"
                                  : "text-slate-600 hover:text-[#512d7c]"
                              }`}
                            >
                              {item.isAction ? item.name : `• ${item.name}`}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. BUSINESS COURSES ACCORDION */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCategory(expandedCategory === "business" ? null : "business")
                        }
                        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-black text-amber-700 bg-transparent border-0 cursor-pointer hover:bg-amber-50/50"
                      >
                        <span>BUSINESS COURSES</span>
                        <span>{expandedCategory === "business" ? "−" : "+"}</span>
                      </button>
                      {expandedCategory === "business" && (
                        <div className="px-4 pb-3 space-y-1.5 border-t border-slate-100 bg-white pt-2">
                          {businessCoursesList.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.path}
                              onClick={() => setActiveMenu(null)}
                              className={`block text-xs font-bold py-1 transition-all decoration-none ${
                                item.isAction
                                  ? "text-amber-700 font-black mt-1.5 pt-1.5 border-t border-slate-100"
                                  : "text-slate-600 hover:text-amber-800"
                              }`}
                            >
                              {item.isAction ? item.name : `• ${item.name}`}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 4. MAIN / ADVANCE COURSES ACCORDION */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCategory(expandedCategory === "main" ? null : "main")
                        }
                        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-black text-[#512d7c] bg-transparent border-0 cursor-pointer hover:bg-purple-50/50"
                      >
                        <span>MAIN / ADVANCE COURSE</span>
                        <span>{expandedCategory === "main" ? "−" : "+"}</span>
                      </button>
                      {expandedCategory === "main" && (
                        <div className="px-4 pb-3 space-y-1.5 border-t border-slate-100 bg-white pt-2 max-h-48 overflow-y-auto">
                          {mainCoursesList.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.path}
                              onClick={() => setActiveMenu(null)}
                              className={`block text-xs font-bold py-1 transition-all decoration-none ${
                                item.isAction
                                  ? "text-amber-600 font-black mt-2 pt-2 border-t border-slate-100"
                                  : "text-slate-600 hover:text-[#512d7c]"
                              }`}
                            >
                              {item.isAction ? item.name : `• ${item.name}`}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative static sm:relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === "resources" ? null : "resources")}
                className={`inline-flex items-center gap-0.5 xs:gap-1 text-[11px] xs:text-xs sm:text-sm font-black border-0 bg-transparent cursor-pointer transition-colors ${
                  activeMenu === "resources"
                    ? "text-[#512d7c]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Resources
                <svg
                  className={`w-2.5 h-2.5 transform transition-transform ${
                    activeMenu === "resources" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeMenu === "resources" && (
                <div className="absolute left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 mt-3 w-auto sm:w-56 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 animate-fade-in z-50">
                  <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block px-4 pt-2 pb-1">
                    Knowledge Base
                  </span>
                  {resourcesList.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.path}
                      className="block text-xs font-bold text-slate-700 hover:text-[#512d7c] hover:bg-purple-50/50 px-4 py-2.5 rounded-xl transition-all text-left decoration-none"
                    >
                      {resource.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* DESKTOP SEARCH INPUT */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 relative items-center ml-2 max-w-xs"
            >
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
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* MOBILE SEARCH TOGGLE */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-1.5 text-slate-500 hover:text-[#512d7c] bg-slate-50 hover:bg-purple-50 rounded-full border-0 cursor-pointer transition-colors"
              aria-label="Toggle input panel"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* 3. RIGHT SEGMENT: LOGIN & SIGN UP */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <a
              href="/login"
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs text-center font-black text-[#512d7c] border border-[#512d7c] sm:border-2 rounded-md sm:rounded-full hover:bg-[#512d7c] hover:text-white transition-all decoration-none"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-2.5 py-1.5 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs text-center font-black text-black bg-[#f2b42c] rounded-md sm:rounded-full hover:bg-[#e0a51a] transition-all shadow-xs decoration-none"
            >
              Sign Up
            </a>
          </div>
        </div>

        {/* MOBILE SEARCH OVERLAY */}
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
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}