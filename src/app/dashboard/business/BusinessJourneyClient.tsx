"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";

type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  full_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  duration_weeks: number | null;
  price: number | null;
  is_free: boolean | null;
  status: string | null;
};

type Outcome = { id: number; text: string };
type ModuleItem = { id: number; title: string; summary: string | null };

export default function BusinessJourneyClient({
  initialCourses,
  searchParams,
}: {
  initialCourses: Course[];
  searchParams: { q: string; level: string; type: string };
}) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [hasBusinessAccess, setHasBusinessAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const supabase = createBrowser();

  // Live database verification for business tier access
  useEffect(() => {
    async function verifyBusinessAccess() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("business_paid")
          .eq("id", user.id)
          .single();

        setHasBusinessAccess(profile?.business_paid === true);
      } catch (err) {
        console.error("Error verifying business payment status:", err);
        setHasBusinessAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    }
    verifyBusinessAccess();
  }, [supabase]);

  const handleOpenWorkspace = async (course: Course) => {
    setSelectedCourse(course);
    setLoadingDetails(true);
    try {
      const [{ data: outcomesData }, { data: modulesData }] = await Promise.all([
        supabase
          .from("course_outcomes")
          .select("id, text")
          .eq("course_id", course.id)
          .order("sort_order", { ascending: true }),
        supabase
          .from("course_modules")
          .select("id, title, summary")
          .eq("course_id", course.id)
          .order("sort_order", { ascending: true }),
      ]);

      setOutcomes(outcomesData || []);
      setModules(modulesData || []);
    } catch (err) {
      console.error("Error fetching business course details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setOutcomes([]);
    setModules([]);
  };

  const hasCourses = initialCourses.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-8">
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-black tracking-widest text-amber-700 uppercase mb-1">
              Enterprise Tier: Business Workspace
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-[#512d7c] tracking-tight">
              Business Startup Journey
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
              Access your active corporate registration blueprints, legal documentation modules, and venture scaling frameworks.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xs p-4 w-full md:max-w-sm border border-purple-50">
            <p className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">
              💼 Workspace Navigation
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li>• Review active business setup modules.</li>
              <li>• Download legal registration templates.</li>
              <li>• Execute compliance milestones sequentially.</li>
            </ul>
          </div>
        </section>

        {/* PAYMENT STATUS NOTIFICATION BANNER PLACED ABOVE SEARCH & FILTERS */}
        {!checkingAccess && !hasBusinessAccess && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <p className="text-xs font-black uppercase text-amber-800 tracking-wider">
                🔒 Business Startup Package Locked (₦100,000 One-Time Fee)
              </p>
              <p className="text-xs text-amber-900 mt-0.5">
                Your profile has not yet unlocked this enterprise tier. You can browse course outlines, but module viewer access requires activation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/business/intro")}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition shadow-xs cursor-pointer border-0 shrink-0"
            >
              Pay to Unlock Access →
            </button>
          </div>
        )}

        {/* Search & filters */}
        <section className="bg-white rounded-2xl shadow-xs p-4 md:p-5 border border-slate-100">
          <form method="GET" className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Search business modules
              </label>
              <div className="relative">
                <input
                  name="q"
                  defaultValue={searchParams.q}
                  type="text"
                  placeholder="Search by title, topic, or category..."
                  className="w-full rounded-full border border-slate-300 px-4 py-2.5 text-sm pr-10 focus:border-[#512d7c] focus:ring-[#512d7c]"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-xs">
                  ⌕
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-full bg-[#512d7c] text-xs font-black uppercase tracking-widest text-white hover:bg-[#3f2160] transition cursor-pointer"
              >
                Apply filters
              </button>
              <a
                href="/dashboard/business"
                className="px-3 py-2.5 rounded-full border border-slate-300 text-xs font-black uppercase tracking-widest text-slate-700 bg-white hover:bg-slate-50 transition"
              >
                Reset
              </a>
            </div>
          </form>
        </section>

        {/* Stats header */}
        <section className="flex items-center justify-between text-xs font-bold text-slate-500">
          <p>
            {hasCourses
              ? `Showing ${initialCourses.length} business module${
                  initialCourses.length === 1 ? "" : "s"
                }`
              : "No business modules published yet."}
          </p>
          <p className="hidden sm:block">
            Business startup curriculum tracks are displayed here.
          </p>
        </section>

        {/* Cards */}
        <section>
          {!hasCourses ? (
            <div className="bg-white rounded-2xl shadow-xs p-8 text-center text-sm font-medium text-slate-600 border border-slate-100">
              No business modules are currently synced to this workspace. Ensure your admin has published business courses.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {initialCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-md hover:border-amber-500 transition-all text-left"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-amber-800">
                        Business Track
                      </span>
                      <span className="inline-flex items-center rounded-md bg-purple-50 border border-purple-200 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#512d7c]">
                        Active Node
                      </span>
                    </div>

                    <h2 className="text-base font-black text-[#512d7c] tracking-tight mb-1.5">
                      {course.title || "Untitled Business Module"}
                    </h2>
                    <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                      {course.level || "All levels"} • {course.course_type || "Business"}
                    </p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      {course.short_description ||
                        "Corporate enterprise module designed for legal registration and scaling."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Duration: {course.duration_weeks ? `${course.duration_weeks} Weeks` : "Flexible"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenWorkspace(course)}
                      className="inline-flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition shadow-xs cursor-pointer border-0"
                    >
                      View Course Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* INTERACTIVE COURSE DETAIL MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-left border border-slate-100">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-amber-800 mb-2">
                  Business Track • {selectedCourse.level || "All levels"}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#512d7c] tracking-tight">
                  {selectedCourse.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold shadow-xs transition cursor-pointer flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  About this business course
                </h3>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {selectedCourse.full_description || selectedCourse.short_description || "Comprehensive enterprise setup module."}
                </p>
              </div>

              {loadingDetails ? (
                <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
                  Loading syllabus &amp; learning outcomes...
                </div>
              ) : (
                <>
                  {outcomes.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                        What you will learn ({outcomes.length} outcomes)
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-2.5 text-xs font-semibold text-slate-700">
                        {outcomes.map((o) => (
                          <li key={o.id} className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-amber-600 font-black">✓</span>
                            <span>{o.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {modules.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                        Course Syllabus ({modules.length} modules)
                      </h3>
                      <div className="space-y-3">
                        {modules.map((m, idx) => (
                          <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                              Module {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                            {m.summary && (
                              <p className="text-xs font-medium text-slate-600 mt-1">{m.summary}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer with Strict Payment Gating & Hard-Disabled Button */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>

              {checkingAccess ? (
                <span className="text-xs font-bold text-slate-400 animate-pulse">Verifying access status...</span>
              ) : hasBusinessAccess ? (
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/dashboard/learning/${selectedCourse.id}`);
                    closeModal();
                  }}
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition shadow-md cursor-pointer border-0"
                >
                  Start business course →
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled
                    className="px-4 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-red-50 text-red-600 border border-red-200 cursor-not-allowed flex items-center gap-1.5 opacity-90"
                  >
                    <span>🔒 Locked</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/dashboard/business/intro");
                    }}
                    className="px-5 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-[#512d7c] text-white hover:bg-[#3f2160] transition shadow-xs cursor-pointer border-0"
                  >
                    Pay to Unlock Access →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}