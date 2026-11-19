"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";

type Outcome = { id: number; text: string };
type Module = { id: number; title: string; summary: string };

const MAIN_SEVEN_MODULES_TEMPLATE: Module[] = [
  { id: 1, title: "", summary: "" },
  { id: 2, title: "", summary: "" },
  { id: 3, title: "", summary: "" },
  { id: 4, title: "", summary: "" },
  { id: 5, title: "", summary: "" },
  { id: 6, title: "", summary: "" },
  { id: 7, title: "", summary: "" },
];

function getMainModuleTierBadge(moduleIndexZeroBased: number): {
  label: string;
  classes: string;
} {
  if (moduleIndexZeroBased < 2) {
    return {
      label: "Basic (Modules 1–2)",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }
  if (moduleIndexZeroBased < 4) {
    return {
      label: "Standard (Modules 1–4)",
      classes: "bg-amber-50 text-amber-800 border-amber-200",
    };
  }
  return {
    label: "Advance Only (Modules 5–7)",
    classes: "bg-purple-50 text-[#512d7c] border-purple-200",
  };
}

export default function AdminNewCoursePage() {
  const router = useRouter();
  const supabase = createBrowser();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [courseType, setCourseType] = useState("main");

  // Single price kept for backward compatibility; 3-tier prices used for "main" paid courses
  const [price, setPrice] = useState<string>("");
  const [basicPrice, setBasicPrice] = useState<string>("");
  const [standardPrice, setStandardPrice] = useState<string>("");
  const [advancePrice, setAdvancePrice] = useState<string>("");

  const [isFree, setIsFree] = useState(false);
  const [durationWeeks, setDurationWeeks] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [outcomes, setOutcomes] = useState<Outcome[]>([{ id: 1, text: "" }]);
  const [modules, setModules] = useState<Module[]>([
    { id: 1, title: "", summary: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMainPaid = !isFree && courseType === "main";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const slugBase =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || `course-${Date.now()}`;

      const finalCourseType = isFree ? "free" : courseType;

      const parsedBasic = Number(basicPrice || price || 0);
      const parsedStandard = Number(standardPrice || 0);
      const parsedAdvance = Number(advancePrice || 0);

      const finalPrice = isMainPaid ? parsedBasic : 0;

      const coursePayload: Record<string, unknown> = {
        title,
        short_description: shortDescription,
        full_description: fullDescription,
        category,
        level,
        course_type: finalCourseType,
        price: finalPrice,
        is_free: isFree,
        duration_weeks: durationWeeks ? Number(durationWeeks) : null,
        status,
        is_featured: false,
        slug: slugBase,
      };

      if (isMainPaid) {
        coursePayload.basic_price = parsedBasic;
        coursePayload.standard_price = parsedStandard;
        coursePayload.advance_price = parsedAdvance;
      }

      const { data: courseInsert, error: courseError } = await supabase
        .from("courses")
        .insert(coursePayload)
        .select("id")
        .single();

      if (courseError || !courseInsert) {
        console.error("Course insert error:", courseError);
        throw new Error(courseError?.message || "Failed to create course");
      }

      const courseId = courseInsert.id;

      const cleanedOutcomes = outcomes
        .map((o, index) => ({
          course_id: courseId,
          text: o.text.trim(),
          sort_order: index + 1,
        }))
        .filter((o) => o.text.length > 0);

      if (cleanedOutcomes.length > 0) {
        const { error: outcomesError } = await supabase
          .from("course_outcomes")
          .insert(cleanedOutcomes);

        if (outcomesError) {
          console.error(outcomesError);
          throw new Error("Failed to save outcomes");
        }
      }

      const cleanedModules = modules
        .map((m, index) => ({
          course_id: courseId,
          title: m.title.trim(),
          summary: m.summary.trim() || null,
          sort_order: index + 1,
        }))
        .filter((m) => m.title.length > 0);

      if (cleanedModules.length > 0) {
        const { error: modulesError } = await supabase
          .from("course_modules")
          .insert(cleanedModules);

        if (modulesError) {
          console.error(modulesError);
          throw new Error("Failed to save modules");
        }
      }

      router.push("/dashboard/admin/courses");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  function handleAddOutcome() {
    setOutcomes((prev) => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, text: "" },
    ]);
  }

  function handleOutcomeChange(id: number, value: string) {
    setOutcomes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, text: value } : o))
    );
  }

  function handleAddModule() {
    setModules((prev) => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        title: "",
        summary: "",
      },
    ]);
  }

  function handleSeedSevenModules() {
    setModules(MAIN_SEVEN_MODULES_TEMPLATE.map((m, idx) => ({ ...m, id: idx + 1 })));
  }

  function handleModuleChange(
    id: number,
    field: "title" | "summary",
    value: string
  ) {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#512d7c] tracking-tight">
              Create New Course
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Define course basics, learning outcomes, tier assignment, and syllabus.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 space-y-8 max-w-4xl text-left"
        >
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-700">
              {error}
            </div>
          )}

          {/* BASIC INFO */}
          <section>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
              Basic Information
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Course title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  placeholder="e.g. Data Analytics & Business Intelligence"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Short description
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  rows={2}
                  placeholder="One or two lines that describe the course."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Full description
                </label>
                <textarea
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  rows={4}
                  placeholder="Explain who this course is for, what will be covered, and any prerequisites."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="e.g. Data, Programming"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all-levels">All levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Course type (Tier)
                  </label>
                  <select
                    value={isFree ? "free" : courseType}
                    disabled={isFree}
                    onChange={(e) => setCourseType(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c] disabled:bg-slate-100 disabled:text-slate-500"
                    required
                  >
                    <option value="">Select tier type</option>
                    <option value="free">Free (Onboarding Library)</option>
                    <option value="prep">Prep (Foundational)</option>
                    <option value="business">Business</option>
                    <option value="main">Main (Advance)</option>
                  </select>
                  {isFree && (
                    <span className="text-[10px] font-bold text-emerald-600 mt-1 block">
                      ℹ️ Free courses automatically route to Free Resources.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* PRICING & STATUS */}
          <section>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
              Pricing &amp; Status
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Is this course free?
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFree(true);
                      setCourseType("free");
                    }}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border transition cursor-pointer ${
                      isFree
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-2xs"
                        : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Yes, free
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFree(false);
                      if (courseType === "free") setCourseType("main");
                    }}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border transition cursor-pointer ${
                      !isFree
                        ? "bg-purple-50 border-[#512d7c] text-[#512d7c] shadow-2xs"
                        : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    No, paid
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Duration (weeks)
                </label>
                <input
                  type="number"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  min="0"
                  step="1"
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "draft" | "published")
                  }
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* 3-TIER PRICING ONLY FOR MAIN PAID COURSES */}
            {isMainPaid && (
              <div className="mt-5 rounded-2xl border border-purple-200/80 bg-purple-50/40 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <p className="text-xs font-black uppercase tracking-wider text-[#512d7c]">
                    Main Course Tier Pricing (NGN)
                  </p>
                  <span className="text-[11px] font-medium text-slate-600">
                    Basic = Modules 1–2 • Standard = Modules 1–4 • Advance = All 7 Modules
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      Basic Price (NGN)
                    </label>
                    <input
                      type="number"
                      value={basicPrice || price}
                      onChange={(e) => {
                        setBasicPrice(e.target.value);
                        setPrice(e.target.value);
                      }}
                      className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                      min="0"
                      step="1"
                      placeholder="e.g. 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      Standard Price (NGN)
                    </label>
                    <input
                      type="number"
                      value={standardPrice}
                      onChange={(e) => setStandardPrice(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                      min="0"
                      step="1"
                      placeholder="e.g. 95000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                      Advance Price (NGN)
                    </label>
                    <input
                      type="number"
                      value={advancePrice}
                      onChange={(e) => setAdvancePrice(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                      min="0"
                      step="1"
                      placeholder="e.g. 175000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Informational notice for Prep & Business fixed bundles */}
            {!isFree && (courseType === "prep" || courseType === "business") && (
              <div className="mt-4 p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-[#512d7c] font-medium">
                💡 This is a fixed bundle tier ({courseType === "prep" ? "₦75k Prep" : "₦100k Business"}). Individual course pricing is not required.
              </div>
            )}
          </section>

          {/* LEARNING OUTCOMES */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Learning Outcomes
              </h2>
              <button
                type="button"
                onClick={handleAddOutcome}
                className="text-xs font-black uppercase tracking-wider text-[#512d7c] hover:underline cursor-pointer"
              >
                + Add outcome
              </button>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-3">
              List what students will be able to do or understand after completing this course.
            </p>
            <div className="space-y-3">
              {outcomes.map((outcome, index) => (
                <div key={outcome.id} className="flex gap-2 items-start">
                  <span className="mt-3 text-xs font-bold text-slate-400">
                    {index + 1}.
                  </span>
                  <textarea
                    value={outcome.text}
                    onChange={(e) =>
                      handleOutcomeChange(outcome.id, e.target.value)
                    }
                    className="flex-1 mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    rows={2}
                    placeholder="e.g. Clean, analyze, and visualize business datasets with confidence."
                  />
                </div>
              ))}
            </div>
          </section>

          {/* MODULES / SYLLABUS */}
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Course Modules / Syllabus
              </h2>
              <div className="flex items-center gap-4">
                {isMainPaid && (
                  <button
                    type="button"
                    onClick={handleSeedSevenModules}
                    className="text-xs font-black uppercase tracking-wider text-amber-700 hover:underline cursor-pointer"
                  >
                    + Use 7-Module Template
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="text-xs font-black uppercase tracking-wider text-[#512d7c] hover:underline cursor-pointer"
                >
                  + Add module
                </button>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-3">
              {isMainPaid
                ? "For Main courses, Modules 1–2 unlock on Basic, Modules 1–4 on Standard, and Modules 1–7 on Advance."
                : "Outline the main sections or modules in this course."}
            </p>
            <div className="space-y-4">
              {modules.map((module, index) => {
                const tierBadge = isMainPaid
                  ? getMainModuleTierBadge(index)
                  : null;

                return (
                  <div
                    key={module.id}
                    className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700">
                          {index + 1}
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                          Module {index + 1}
                        </span>
                      </div>

                      {tierBadge && (
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tierBadge.classes}`}
                        >
                          {tierBadge.label}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                          Module title
                        </label>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) =>
                            handleModuleChange(module.id, "title", e.target.value)
                          }
                          className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                          placeholder={`e.g. Module ${index + 1} topic`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                          Summary (optional)
                        </label>
                        <textarea
                          value={module.summary}
                          onChange={(e) =>
                            handleModuleChange(
                              module.id,
                              "summary",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                          rows={2}
                          placeholder="Briefly describe what is covered in this module."
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400">
              You can always edit this course later from the admin panel.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/admin/courses")}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-[#512d7c] text-white hover:bg-[#3f2160] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
              >
                {saving ? "Creating Course..." : "Create Course"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}