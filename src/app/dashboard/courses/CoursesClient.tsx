"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";
import { X } from "lucide-react";

type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  full_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  price: number | null;
  is_free: boolean | null;
  status: string | null;
};

type Outcome = { id: number; text: string };
type ModuleItem = { id: number; title: string; summary: string | null };

function getIconSrc(category: string | null): string {
  const cat = (category || "").toLowerCase();
  if (cat.includes("digital")) return "/course-icons/digital-literacy.svg";
  if (cat.includes("ui") || cat.includes("ux")) return "/course-icons/ui-ux.svg";
  if (cat.includes("data")) return "/course-icons/data.svg";
  if (cat.includes("cyber")) return "/course-icons/cyber.svg";
  if (cat.includes("marketing")) return "/course-icons/marketing.svg";
  if (cat.includes("brand")) return "/course-icons/branding.svg";
  if (cat.includes("graphic")) return "/course-icons/graphics.svg";
  if (cat.includes("3d")) return "/course-icons/3d.svg";
  if (cat.includes("code") || cat.includes("program")) return "/course-icons/coding.svg";
  if (cat.includes("web")) return "/course-icons/web.svg";
  if (cat.includes("mobile") || cat.includes("app")) return "/course-icons/mobile.svg";
  if (cat.includes("social")) return "/course-icons/social.svg";
  if (cat.includes("ai") || cat.includes("machine")) return "/course-icons/ai.svg";
  if (cat.includes("project")) return "/course-icons/project.svg";
  if (cat.includes("money") || cat.includes("finance")) return "/course-icons/money.svg";
  if (cat.includes("cloud")) return "/course-icons/cloud.svg";
  if (cat.includes("business")) return "/course-icons/business.svg";
  return "/course-icons/default.svg";
}

export default function CoursesClient({
  initialCourses,
  searchParams,
}: {
  initialCourses: Course[];
  searchParams: { q: string; level: string; type: string; price: string };
}) {
  const router = useRouter();
  const supabase = createBrowser();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleOpenModal = async (course: Course) => {
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
      console.error("Error fetching catalog course details:", err);
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-8">
        {/* Hero / Intro */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#f2b42c] uppercase mb-1">
              DGG Academy Catalog
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#512d7c]">
              Explore available courses
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Discover practical courses designed to help you gain real skills. Filter by level, type, or investment range to find what fits you.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 w-full md:max-w-sm border border-purple-50">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              How to choose
            </p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>• Start with beginner level if you're new to tech.</li>
              <li>• Use price ranges to match your current budget.</li>
              <li>• Check course type: self‑paced vs live/cohort experience.</li>
            </ul>
          </div>
        </section>

        {/* Search + filters */}
        <section className="bg-white rounded-2xl shadow p-4 md:p-5 border border-gray-100">
          <form method="GET" className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Search courses
              </label>
              <div className="relative">
                <input
                  name="q"
                  defaultValue={searchParams.q}
                  type="text"
                  placeholder="Search by title, topic, or category..."
                  className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm pr-10 focus:border-[#512d7c] focus:ring-[#512d7c]"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                  ⌕
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:w-[420px]">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  name="level"
                  defaultValue={searchParams.level}
                  className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                >
                  <option value="">Any level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all-levels">All levels</option>
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  defaultValue={searchParams.type}
                  className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                >
                  <option value="">Any type</option>
                  <option value="self-paced">Self-paced</option>
                  <option value="cohort-based">Cohort-based</option>
                  <option value="live">Live</option>
                </select>
              </div>

              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price (₦)
                </label>
                <select
                  name="price"
                  defaultValue={searchParams.price}
                  className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                >
                  <option value="">Any range</option>
                  <option value="50-100">₦50k – ₦100k</option>
                  <option value="100-200">₦100k – ₦200k</option>
                  <option value="200-400">₦200k – ₦400k</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-full bg-[#512d7c] text-xs font-semibold text-white hover:bg-[#3f2160] cursor-pointer"
              >
                Apply filters
              </button>
              <a
                href="/dashboard/courses"
                className="px-3 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset
              </a>
            </div>
          </form>
        </section>

        {/* Results header */}
        <section className="flex items-center justify-between text-xs text-gray-600">
          <p>
            {hasCourses
              ? `Showing ${initialCourses.length} paid course${
                  initialCourses.length === 1 ? "" : "s"
                }`
              : "No courses found in this price range yet."}
          </p>
          <p className="hidden sm:block">
            All courses here are paid; free intros live in the pre‑course area.
          </p>
        </section>

        {/* Course cards */}
        <section>
          {!hasCourses ? (
            <div className="bg-white rounded-2xl shadow p-6 text-sm text-gray-700">
              Try a different price range, level, or keyword to see more courses.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {initialCourses.map((course: Course) => {
                const priceLabel =
                  course.price && Number(course.price) > 0
                    ? `₦${Number(course.price).toLocaleString()}`
                    : "Contact support";

                const iconSrc = getIconSrc(course.category);

                return (
                  <div
                    key={course.id}
                    onClick={() => handleOpenModal(course)}
                    className="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-[#f2b42c] transition-all cursor-pointer text-left"
                  >
                    <div>
                      <div className="mb-3 flex justify-center">
                        <img
                          src={iconSrc}
                          alt={course.category || "Course icon"}
                          className="h-12 w-12"
                        />
                      </div>

                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#512d7c]">
                          {course.category || "General"}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 capitalize">
                          {course.level || "All levels"}
                        </span>
                      </div>

                      <h2 className="text-sm font-semibold text-gray-900 group-hover:text-[#512d7c] line-clamp-2">
                        {course.title || "Untitled course"}
                      </h2>

                      <p className="mt-1 text-xs text-gray-600 line-clamp-3">
                        {course.short_description ||
                          "No description available yet. Click to see more details."}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        {priceLabel}
                      </span>
                      <span className="text-[11px] font-semibold text-[#f2b42c]">
                        View details →
                      </span>
                    </div>
                  </div>
                );
              })}
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
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#512d7c] mb-2">
                  {selectedCourse.category || "Catalog Course"} • {selectedCourse.level || "All levels"}
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
                <X size={16} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  About this course
                </h3>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {selectedCourse.full_description || selectedCourse.short_description || "Comprehensive professional training module."}
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
                            <span className="text-[#f2b42c] font-black">✓</span>
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
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#512d7c]">
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

            {/* Modal Footer with Enrollment / Learning Routing */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push(`/dashboard/courses/${selectedCourse.id}`);
                  closeModal();
                }}
                className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-[#512d7c] text-white hover:bg-[#3f2160] transition shadow-md cursor-pointer border-0"
              >
                View full details &amp; enroll →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}