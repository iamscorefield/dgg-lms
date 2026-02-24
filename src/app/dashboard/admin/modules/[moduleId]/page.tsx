"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { createBrowser } from "@/lib/supabase-client";

type Lesson = {
  id: string;
  title: string;
  full_description: string | null;
  video_url: string | null;
  pdf_url: string | null;
  sort_order: number;
};

type Assessment = {
  id: string;
  title: string;
  full_description: string | null;
  assessment_type: string;
  total_points: number | null;
  pdf_url: string | null;
  sort_order: number;
};

type ModuleInfo = {
  id: string;
  title: string;
  course_id: string;
};

export default function AdminModulePage() {
  const supabase = createBrowser();
  const router = useRouter();
  const { moduleId } = useParams() as { moduleId: string };

  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New lesson form
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDescription, setNewLessonDescription] = useState("");
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState("");
  const [newLessonPdfUrl, setNewLessonPdfUrl] = useState("");

  // New assessment form
  const [newAssessmentTitle, setNewAssessmentTitle] = useState("");
  const [newAssessmentDescription, setNewAssessmentDescription] = useState("");
  const [newAssessmentType, setNewAssessmentType] = useState("assignment");
  const [newAssessmentPoints, setNewAssessmentPoints] = useState<string>("");
  const [newAssessmentPdfUrl, setNewAssessmentPdfUrl] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // 1) Load module info (title, course id)
        const { data: moduleData, error: moduleError } = await supabase
          .from("course_modules")
          .select("id, title, course_id")
          .eq("id", moduleId)
          .single();

        if (moduleError || !moduleData) {
          console.error("Module load error:", moduleError);
          throw new Error("Could not load module");
        }

        setModuleInfo(moduleData as ModuleInfo);

        // 2) Load lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("module_lessons")
          .select("*")
          .eq("module_id", moduleId)
          .order("sort_order", { ascending: true });

        if (lessonsError) {
          console.error("Lessons load error:", lessonsError);
          throw new Error("Could not load lessons");
        }

        setLessons((lessonsData || []) as Lesson[]);

        // 3) Load assessments
        const { data: assessmentsData, error: assessmentsError } =
          await supabase
            .from("module_assessments")
            .select("*")
            .eq("module_id", moduleId)
            .order("sort_order", { ascending: true });

        if (assessmentsError) {
          console.error("Assessments load error:", assessmentsError);
          throw new Error("Could not load assessments");
        }

        setAssessments((assessmentsData || []) as Assessment[]);
      } catch (err: any) {
        setError(err.message || "Something went wrong loading module");
      } finally {
        setLoading(false);
      }
    }

    if (moduleId) {
      loadData();
    }
  }, [moduleId, supabase]);

  async function handleAddLesson(e: React.FormEvent) {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const sortOrder = lessons.length
        ? lessons[lessons.length - 1].sort_order + 1
        : 1;

      const { data, error: insertError } = await supabase
        .from("module_lessons")
        .insert({
          module_id: moduleId,
          title: newLessonTitle.trim(),
          full_description: newLessonDescription.trim() || null,
          video_url: newLessonVideoUrl.trim() || null,
          pdf_url: newLessonPdfUrl.trim() || null,
          sort_order: sortOrder,
        })
        .select("*")
        .single();

      if (insertError || !data) {
        console.error("Add lesson error:", insertError);
        throw new Error(insertError?.message || "Failed to add lesson");
      }

      setLessons((prev) => [...prev, data as Lesson]);
      setNewLessonTitle("");
      setNewLessonDescription("");
      setNewLessonVideoUrl("");
      setNewLessonPdfUrl("");
    } catch (err: any) {
      setError(err.message || "Something went wrong saving lesson");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddAssessment(e: React.FormEvent) {
    e.preventDefault();
    if (!newAssessmentTitle.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const sortOrder = assessments.length
        ? assessments[assessments.length - 1].sort_order + 1
        : 1;

      const { data, error: insertError } = await supabase
        .from("module_assessments")
        .insert({
          module_id: moduleId,
          title: newAssessmentTitle.trim(),
          full_description: newAssessmentDescription.trim() || null,
          assessment_type: newAssessmentType,
          total_points: newAssessmentPoints ? Number(newAssessmentPoints) : null,
          pdf_url: newAssessmentPdfUrl.trim() || null,
          sort_order: sortOrder,
        })
        .select("*")
        .single();

      if (insertError || !data) {
        console.error("Add assessment error:", insertError);
        throw new Error(insertError?.message || "Failed to add assessment");
      }

      setAssessments((prev) => [...prev, data as Assessment]);
      setNewAssessmentTitle("");
      setNewAssessmentDescription("");
      setNewAssessmentType("assignment");
      setNewAssessmentPoints("");
      setNewAssessmentPdfUrl("");
    } catch (err: any) {
      setError(err.message || "Something went wrong saving assessment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#512d7c]">
              {moduleInfo
                ? `Manage Module: ${moduleInfo.title}`
                : "Manage Module"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Add and edit lessons and assessments for this module.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-8 max-w-5xl">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-gray-500">Loading module...</p>
          ) : (
            <>
              {/* LESSONS */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Lessons
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Create lessons with full descriptions, video links, and PDF
                  resources.
                </p>

                {/* Existing lessons */}
                <div className="space-y-3 mb-4">
                  {lessons.length === 0 && (
                    <p className="text-xs text-gray-400">
                      No lessons yet. Add your first lesson below.
                    </p>
                  )}
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border text-xs text-gray-600">
                            {index + 1}
                          </span>
                          <h3 className="text-sm font-medium text-gray-800">
                            {lesson.title}
                          </h3>
                        </div>
                      </div>
                      {lesson.video_url && (
                        <p className="text-xs text-gray-500">
                          Video: {lesson.video_url}
                        </p>
                      )}
                      {lesson.pdf_url && (
                        <p className="text-xs text-gray-500">
                          PDF: {lesson.pdf_url}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add lesson form */}
                <form
                  onSubmit={handleAddLesson}
                  className="space-y-3 border-t border-gray-100 pt-4"
                >
                  <h3 className="text-sm font-semibold text-gray-800">
                    Add new lesson
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700">
                        Lesson title
                      </label>
                      <input
                        type="text"
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        placeholder="e.g. Introduction to Next.js Routing"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700">
                        Full description
                      </label>
                      <textarea
                        value={newLessonDescription}
                        onChange={(e) =>
                          setNewLessonDescription(e.target.value)
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        rows={3}
                        placeholder="Explain what this lesson covers."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Video URL
                      </label>
                      <input
                        type="url"
                        value={newLessonVideoUrl}
                        onChange={(e) => setNewLessonVideoUrl(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        PDF URL
                      </label>
                      <input
                        type="url"
                        value={newLessonPdfUrl}
                        onChange={(e) => setNewLessonPdfUrl(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        placeholder="https://.../file.pdf"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-2 inline-flex items-center px-4 py-2 text-sm rounded-lg bg-[#512d7c] text-white hover:bg-[#3f2160] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Add lesson"}
                  </button>
                </form>
              </section>

              {/* ASSESSMENTS */}
              <section className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Assessments
                  </h2>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Add quizzes, assignments, or projects linked to this module.
                </p>

                {/* Existing assessments */}
                <div className="space-y-3 mb-4">
                  {assessments.length === 0 && (
                    <p className="text-xs text-gray-400">
                      No assessments yet. Add your first assessment below.
                    </p>
                  )}
                  {assessments.map((assessment, index) => (
                    <div
                      key={assessment.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border text-xs text-gray-600">
                            {index + 1}
                          </span>
                          <h3 className="text-sm font-medium text-gray-800">
                            {assessment.title}
                          </h3>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-[#512d7c] border border-purple-100">
                          {assessment.assessment_type}
                        </span>
                      </div>
                      {assessment.total_points !== null && (
                        <p className="text-xs text-gray-500">
                          Points: {assessment.total_points}
                        </p>
                      )}
                      {assessment.pdf_url && (
                        <p className="text-xs text-gray-500">
                          PDF: {assessment.pdf_url}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add assessment form */}
                <form
                  onSubmit={handleAddAssessment}
                  className="space-y-3 border-t border-gray-100 pt-4"
                >
                  <h3 className="text-sm font-semibold text-gray-800">
                    Add new assessment
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700">
                        Assessment title
                      </label>
                      <input
                        type="text"
                        value={newAssessmentTitle}
                        onChange={(e) =>
                          setNewAssessmentTitle(e.target.value)
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        placeholder="e.g. Next.js Routing Quiz"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-700">
                        Full description
                      </label>
                      <textarea
                        value={newAssessmentDescription}
                        onChange={(e) =>
                          setNewAssessmentDescription(e.target.value)
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        rows={3}
                        placeholder="Explain what this assessment covers and instructions."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Assessment type
                      </label>
                      <select
                        value={newAssessmentType}
                        onChange={(e) =>
                          setNewAssessmentType(e.target.value)
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                      >
                        <option value="assignment">Assignment</option>
                        <option value="quiz">Quiz</option>
                        <option value="project">Project</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Total points
                      </label>
                      <input
                        type="number"
                        value={newAssessmentPoints}
                        onChange={(e) =>
                          setNewAssessmentPoints(e.target.value)
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        min="0"
                        placeholder="e.g. 100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        PDF URL
                      </label>
                      <input
                        type="url"
                        value={newAssessmentPdfUrl}
                        onChange={(e) =>
                          setNewAssessmentPdfUrl(e.target.value)
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#512d7c] focus:ring-[#512d7c]"
                        placeholder="https://.../file.pdf"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-2 inline-flex items-center px-4 py-2 text-sm rounded-lg bg-[#512d7c] text-white hover:bg-[#3f2160] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Add assessment"}
                  </button>
                </form>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
