"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";

type Outcome = { id: number; text: string };
type Module = { id: number; title: string; summary: string };

export default function AdminNewCoursePage() {
  const router = useRouter();
  const supabase = createBrowser();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [courseType, setCourseType] = useState("");
  const [price, setPrice] = useState<string>("");
  const [isFree, setIsFree] = useState(false);
  const [durationWeeks, setDurationWeeks] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [outcomes, setOutcomes] = useState<Outcome[]>([{ id: 1, text: "" }]);
  const [modules, setModules] = useState<Module[]>([
    { id: 1, title: "", summary: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      const { data: courseInsert, error: courseError } = await supabase
        .from("courses")
        .insert({
          title,
          short_description: shortDescription,
          full_description: fullDescription,
          category,
          level,
          course_type: courseType,
          price: isFree ? 0 : Number(price || 0),
          is_free: isFree,
          duration_weeks: durationWeeks ? Number(durationWeeks) : null,
          status,
          is_featured: false,
          slug: slugBase,
        })
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
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, title: "", summary: "" },
    ]);
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
    <div className="flex min-h-screen bg-gray-50">
      {/* same sidebar + layout as Manage Courses */}
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#512d7c]">
              Create New Course
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Define course basics, learning outcomes, and syllabus.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 space-y-8 max-w-4xl"
        >
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* BASIC INFO */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Course title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  placeholder="e.g. Full-Stack Web Development with Next.js"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Short description
                </label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  rows={2}
                  placeholder="One or two lines that describe the course."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full description
                </label>
                <textarea
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  rows={4}
                  placeholder="Explain who this course is for, what will be covered, and any prerequisites."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    placeholder="e.g. Programming, Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all-levels">All levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Course type
                  </label>
                  <select
                    value={courseType}
                    onChange={(e) => setCourseType(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                  >
                    <option value="">Select type</option>
                    <option value="self-paced">Self-paced</option>
                    <option value="cohort-based">Cohort-based</option>
                    <option value="live">Live</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* PRICING & STATUS */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pricing & Status
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Is this course free?
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFree(true)}
                    className={`px-3 py-1.5 text-sm rounded-full border ${
                      isFree
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}
                  >
                    Yes, free
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFree(false)}
                    className={`px-3 py-1.5 text-sm rounded-full border ${
                      !isFree
                        ? "bg-purple-50 border-[#512d7c] text-[#512d7c]"
                        : "bg-white border-gray-300 text-gray-700"
                    }`}
                  >
                    No, paid
                  </button>
                </div>
              </div>

              {!isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (NGN)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    min="0"
                    step="1"
                    placeholder="e.g. 50000"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration (weeks)
                </label>
                <input
                  type="number"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                  min="0"
                  step="1"
                  placeholder="e.g. 8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "draft" | "published")
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </section>

          {/* LEARNING OUTCOMES */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Learning Outcomes
              </h2>
              <button
                type="button"
                onClick={handleAddOutcome}
                className="text-sm text-[#512d7c] hover:underline"
              >
                + Add outcome
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              List what students will be able to do or understand after
              completing this course.
            </p>
            <div className="space-y-3">
              {outcomes.map((outcome, index) => (
                <div key={outcome.id} className="flex gap-2 items-start">
                  <span className="mt-2 text-xs text-gray-500">
                    {index + 1}.
                  </span>
                  <textarea
                    value={outcome.text}
                    onChange={(e) =>
                      handleOutcomeChange(outcome.id, e.target.value)
                    }
                    className="flex-1 mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                    rows={2}
                    placeholder="e.g. Build and deploy a full-stack web application using Next.js and Supabase."
                  />
                </div>
              ))}
            </div>
          </section>

          {/* MODULES / SYLLABUS */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Course Modules / Syllabus
              </h2>
              <button
                type="button"
                onClick={handleAddModule}
                className="text-sm text-[#512d7c] hover:underline"
              >
                + Add module
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Outline the main sections or modules in this course.
            </p>
            <div className="space-y-4">
              {modules.map((module, index) => (
                <div
                  key={module.id}
                  className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border text-xs text-gray-600">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        Module {index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Module title
                      </label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) =>
                          handleModuleChange(module.id, "title", e.target.value)
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        placeholder="e.g. Introduction to Next.js"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
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
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        rows={2}
                        placeholder="Briefly describe what is covered in this module."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              You can always edit this course later from the admin panel.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/dashboard/admin/courses")}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-[#512d7c] text-white hover:bg-[#3f2160] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Create course"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
