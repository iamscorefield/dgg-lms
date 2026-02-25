"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-client";
import Sidebar from "@/components/Sidebar";

type Lesson = {
  id: number;
  title: string | null;
  full_description: string | null;
  video_url: string | null;
  pdf_url: string | null;
  sort_order: number | null;
};

type Assessment = {
  id: number;
  title: string | null;
  full_description: string | null;
  assessment_type: string | null;
  total_points: number | null;
  pdf_url: string | null;
  sort_order: number | null;
};

type ModuleInfo = {
  id: number;
  title: string | null;
  course_id: number;
};

type Progress = {
  id: string;
  current_lesson_index: number;
  current_assessment_index: number;
  lessons_completed: boolean;
  assessments_completed: boolean;
};

type MediaItem =
  | ({
      kind: "lesson";
      video_url: string | null;
      pdf_url: string | null;
    } & Lesson)
  | ({
      kind: "assessment";
      video_url?: string | null;
      pdf_url: string | null;
    } & Assessment);

// ---------- URL HELPERS (YOUTUBE + GOOGLE DRIVE) ----------

// YouTube: convert watch/short link to embed URL
function toYouTubeEmbed(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");

    let videoId: string | null = null;

    if (host === "youtube.com" || host === "m.youtube.com") {
      // formats like /watch?v=ID or /embed/ID
      if (u.pathname === "/watch") {
        videoId = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/embed/")) {
        videoId = u.pathname.split("/embed/")[1] || null;
      }
    } else if (host === "youtu.be") {
      // short link
      videoId = u.pathname.slice(1) || null;
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

// Google Drive: convert file link to /preview or gview
function toGoogleDrivePreview(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");

    // Typical Drive link: https://drive.google.com/file/d/FILE_ID/view?...
    if (host === "drive.google.com") {
      const parts = u.pathname.split("/");
      const fileIndex = parts.findIndex((p) => p === "d");
      if (fileIndex !== -1 && parts[fileIndex + 1]) {
        const fileId = parts[fileIndex + 1];
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    // Fallback: use Google Docs viewer with embedded=true
    const encoded = encodeURIComponent(url);
    return `https://docs.google.com/gview?url=${encoded}&embedded=true`;
  } catch {
    return null;
  }
}

export default function LearningModulePage() {
  const supabase = createBrowser();
  const router = useRouter();
  const { courseId, moduleId } = useParams() as {
    courseId: string;
    moduleId: string;
  };

  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"lesson" | "assessment">("lesson");

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // 1) user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("You must be signed in to view this course.");
        }
        setUserId(user.id);

        // 2) module info
        const { data: moduleData, error: moduleError } = await supabase
          .from("course_modules")
          .select("id, title, course_id")
          .eq("id", moduleId) // moduleId is a UUID string
          .single();
        if (moduleError || !moduleData) {
          throw new Error("Module not found.");
        }
        setModuleInfo(moduleData as ModuleInfo);

        // 3) lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("module_lessons")
          .select("*")
          .eq("module_id", Number(moduleId))
          .order("sort_order", { ascending: true });
        if (lessonsError) {
          throw new Error("Could not load lessons.");
        }
        setLessons((lessonsData || []) as Lesson[]);

        // 4) assessments
        const { data: assessmentsData, error: assessmentsError } =
          await supabase
            .from("module_assessments")
            .select("*")
            .eq("module_id", Number(moduleId))
            .order("sort_order", { ascending: true });
        if (assessmentsError) {
          throw new Error("Could not load assessments.");
        }
        setAssessments((assessmentsData || []) as Assessment[]);

        // 5) progress
        const { data: progressData, error: progressError } = await supabase
          .from("user_module_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("module_id", Number(moduleId))
          .maybeSingle();

        if (progressError && progressError.code !== "PGRST116") {
          throw new Error("Could not load progress.");
        }

        if (!progressData) {
          const { data: newProgress, error: createError } = await supabase
            .from("user_module_progress")
            .insert({
              user_id: user.id,
              module_id: Number(moduleId),
              current_lesson_index: 0,
              current_assessment_index: 0,
              lessons_completed: false,
              assessments_completed: false,
            })
            .select("*")
            .single();
          if (createError || !newProgress) {
            throw new Error("Could not initialize progress.");
          }
          setProgress(newProgress as Progress);
        } else {
          setProgress(progressData as Progress);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading module.");
      } finally {
        setLoading(false);
      }
    }

    if (moduleId) {
      loadData();
    }
  }, [moduleId, supabase]);

  const currentLesson = useMemo(() => {
    if (!lessons.length) return null;
    const index = progress?.current_lesson_index ?? 0;
    return lessons[Math.min(index, lessons.length - 1)];
  }, [lessons, progress]);

  const currentAssessment = useMemo(() => {
    if (!assessments.length) return null;
    const index = progress?.current_assessment_index ?? 0;
    return assessments[Math.min(index, assessments.length - 1)];
  }, [assessments, progress]);

  async function updateProgress(update: Partial<Progress>) {
    if (!progress || !userId) return;
    setSaving(true);
    setError(null);
    try {
      const { data, error: updError } = await supabase
        .from("user_module_progress")
        .update({
          ...update,
          updated_at: new Date().toISOString(),
        })
        .eq("id", progress.id)
        .select("*")
        .single();
      if (updError || !data) {
        throw new Error(updError?.message || "Could not update progress.");
      }
      setProgress(data as Progress);
    } catch (err: any) {
      setError(err.message || "Error updating progress.");
    } finally {
      setSaving(false);
    }
  }

  async function handleNextLesson() {
    if (!progress) return;
    const nextIndex = progress.current_lesson_index + 1;
    if (nextIndex >= lessons.length) {
      await updateProgress({
        current_lesson_index: lessons.length - 1,
        lessons_completed: true,
      });
      if (assessments.length > 0) {
        setActiveTab("assessment");
      }
    } else {
      await updateProgress({ current_lesson_index: nextIndex });
    }
  }

  async function handleNextAssessment() {
    if (!progress) return;
    const nextIndex = progress.current_assessment_index + 1;
    if (nextIndex >= assessments.length) {
      await updateProgress({
        current_assessment_index: assessments.length - 1,
        assessments_completed: true,
      });
      if (progress.lessons_completed || !lessons.length) {
        router.push(`/dashboard/learning/${courseId}`);
      }
    } else {
      await updateProgress({ current_assessment_index: nextIndex });
    }
  }

  function openModalForLesson(lesson: Lesson) {
    setSelectedItem({ kind: "lesson", ...lesson });
    setShowModal(true);
  }

  function openModalForAssessment(assessment: Assessment) {
    setSelectedItem({ kind: "assessment", ...assessment });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setSelectedItem(null);
  }

  // Modal: now handles YouTube + Drive specially
  function renderModal() {
    if (!showModal || !selectedItem) return null;

    const rawVideoUrl =
      selectedItem.kind === "lesson" ? selectedItem.video_url || "" : "";
    const rawPdfUrl = selectedItem.pdf_url || "";

    const youtubeEmbed = rawVideoUrl ? toYouTubeEmbed(rawVideoUrl) : null;
    const hasYoutube = !!youtubeEmbed;

    const hasRawVideoFile =
      !!rawVideoUrl &&
      !hasYoutube &&
      (rawVideoUrl.endsWith(".mp4") ||
        rawVideoUrl.endsWith(".webm") ||
        rawVideoUrl.endsWith(".ogg"));

    const pdfEmbed = rawPdfUrl ? toGoogleDrivePreview(rawPdfUrl) : null;
    const hasPdf = !!pdfEmbed;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-purple-600 font-semibold truncate">
                {selectedItem.kind === "lesson" ? "Lesson" : "Assessment"}
              </p>
              <h2 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                {selectedItem.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeModal}
              className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          {selectedItem.full_description && (
            <div className="px-4 pt-3 pb-2 border-b border-gray-100">
              <p className="text-xs text-gray-600">
                {selectedItem.full_description}
              </p>
            </div>
          )}

          {/* Content area */}
          <div className="flex-1 p-3 sm:p-4 overflow-auto space-y-3">
            {/* YouTube or direct video */}
            {hasYoutube && (
              <div className="w-full rounded-xl overflow-hidden bg-black aspect-video">
                <iframe
                  key={youtubeEmbed || "yt"}
                  src={youtubeEmbed || undefined}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title="Lesson video"
                />
              </div>
            )}

            {!hasYoutube && hasRawVideoFile && (
              <div className="w-full rounded-xl overflow-hidden bg-black aspect-video">
                <video
                  key={rawVideoUrl}
                  src={rawVideoUrl}
                  controls
                  className="w-full h-full"
                />
              </div>
            )}

            {/* PDF – Google Drive or normal PDF */}
            {hasPdf && (
              <div className="w-full h-[480px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <iframe
                  key={pdfEmbed || "pdf"}
                  src={pdfEmbed || undefined}
                  className="w-full h-full"
                  title="Lesson PDF"
                />
              </div>
            )}

            {!hasYoutube && !hasRawVideoFile && !hasPdf && (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 text-xs text-gray-400">
                No video or PDF attached to this item.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-6 lg:p-10">
          <p className="text-sm text-gray-500">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-6 lg:p-10">
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#512d7c]">
              {moduleInfo ? moduleInfo.title : "Module"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Open video and PDF inside this page and move to next items easily.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/learning/${courseId}`)}
            className="px-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to course
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* MAIN COLUMN */}
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-2">
              <button
                type="button"
                onClick={() => setActiveTab("lesson")}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "lesson"
                    ? "border-[#512d7c] text-[#512d7c]"
                    : "border-transparent text-gray-500"
                }`}
              >
                Lesson
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("assessment")}
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "assessment"
                    ? "border-[#512d7c] text-[#512d7c]"
                    : "border-transparent text-gray-500"
                }`}
              >
                Assessment
              </button>
            </div>

            {/* Current item section */}
            {activeTab === "lesson" ? (
              currentLesson ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                      Lesson {progress ? progress.current_lesson_index + 1 : 1}{" "}
                      of {lessons.length}: {currentLesson.title}
                    </h2>
                    {currentLesson.full_description && (
                      <p className="mt-1 text-xs text-gray-600">
                        {currentLesson.full_description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openModalForLesson(currentLesson)}
                    className="shrink-0 px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#512d7c] text-white hover:bg-[#3f2160] w-full sm:w-auto text-center"
                  >
                    Open lesson
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No lessons in this module.</p>
              )
            ) : currentAssessment ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                    Assessment{" "}
                    {progress ? progress.current_assessment_index + 1 : 1} of{" "}
                    {assessments.length}: {currentAssessment.title}
                  </h2>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-purple-600">
                    {currentAssessment.assessment_type}
                  </p>
                  {currentAssessment.full_description && (
                    <p className="mt-1 text-xs text-gray-600">
                      {currentAssessment.full_description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openModalForAssessment(currentAssessment)}
                  className="shrink-0 px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#512d7c] text-white hover:bg-[#3f2160] w-full sm:w-auto text-center"
                >
                  Open assessment
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No assessments in this module.</p>
            )}

            {/* Next buttons */}
            <div className="flex justify-end pt-4">
              {activeTab === "lesson" && lessons.length > 0 && (
                <button
                  type="button"
                  onClick={handleNextLesson}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-[#512d7c] text-white hover:bg-[#3f2160] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {progress && progress.current_lesson_index + 1 >= lessons.length
                    ? "Mark lessons done"
                    : "Next lesson"}
                </button>
              )}

              {activeTab === "assessment" && assessments.length > 0 && (
                <button
                  type="button"
                  onClick={handleNextAssessment}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 text-sm rounded-lg bg-[#512d7c] text-white hover:bg-[#3f2160] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {progress &&
                  progress.current_assessment_index + 1 >= assessments.length
                    ? "Finish module"
                    : "Next assessment"}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Lessons list */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">
                Lessons in this module
              </h2>
              {lessons.length === 0 && (
                <p className="text-xs text-gray-400">No lessons yet.</p>
              )}
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isCurrent =
                    activeTab === "lesson" &&
                    progress?.current_lesson_index === index;
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => {
                        setActiveTab("lesson");
                        openModalForLesson(lesson);
                        if (
                          progress &&
                          progress.current_lesson_index !== index
                        ) {
                          updateProgress({ current_lesson_index: index });
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs ${
                        isCurrent
                          ? "border-[#512d7c] bg-purple-50 text-[#512d7c]"
                          : "border-gray-200 bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {index + 1}. {lesson.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assessments list */}
            <div className="bg-white rounded-2xl shadow p-4">
              <h2 className="text-sm font-semibold text-gray-800 mb-2">
                Assessments
              </h2>
              {assessments.length === 0 && (
                <p className="text-xs text-gray-400">No assessments yet.</p>
              )}
              <div className="space-y-2">
                {assessments.map((assessment, index) => {
                  const isCurrent =
                    activeTab === "assessment" &&
                    progress?.current_assessment_index === index;
                  return (
                    <button
                      key={assessment.id}
                      type="button"
                      onClick={() => {
                        setActiveTab("assessment");
                        openModalForAssessment(assessment);
                        if (
                          progress &&
                          progress.current_assessment_index !== index
                        ) {
                          updateProgress({ current_assessment_index: index });
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs ${
                        isCurrent
                          ? "border-[#512d7c] bg-purple-50 text-[#512d7c]"
                          : "border-gray-200 bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {index + 1}. {assessment.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-gray-500">
                          {assessment.assessment_type || "assessment"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl shadow p-4 text-xs text-gray-600">
              <p>
                Lessons:{" "}
                {lessons.length === 0
                  ? "none"
                  : `${(progress?.current_lesson_index ?? 0) + 1} of ${
                      lessons.length
                    }`}
              </p>
              <p>
                Assessments:{" "}
                {assessments.length === 0
                  ? "none"
                  : `${(progress?.current_assessment_index ?? 0) + 1} of ${
                      assessments.length
                    }`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {renderModal()}
    </div>
  );
}
