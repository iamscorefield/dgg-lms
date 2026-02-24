import { notFound, redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";

type ModuleWithCounts = {
  id: number;
  title: string | null;
  summary: string | null;
  sort_order: number | null;
  lessons_count: number;
  assessments_count: number;
};

export default async function LearningPage(
  props: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await props.params;

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const id = Number(courseId);
  if (Number.isNaN(id)) {
    notFound();
  }

  // Check paid enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, payment_status")
    .eq("student_id", session.user.id)
    .eq("course_id", id)
    .eq("payment_status", "paid")
    .maybeSingle();

  if (!enrollment) {
    redirect(`/dashboard/student/courses/${id}`);
  }

  // Load course
  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", id)
    .single();

  if (!course) {
    notFound();
  }

  // Load modules + counts only (no video/pdf here)
  const { data: modulesData, error: modulesError } = await supabase
    .from("course_modules")
    .select(
      `
      id,
      title,
      summary,
      sort_order,
      module_lessons ( id ),
      module_assessments ( id )
    `
    )
    .eq("course_id", id)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    console.error("Error loading modules:", modulesError);
  }

  const modules: ModuleWithCounts[] = (modulesData || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    summary: m.summary,
    sort_order: m.sort_order,
    lessons_count: (m.module_lessons || []).length,
    assessments_count: (m.module_assessments || []).length,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#512d7c] uppercase tracking-wide mb-1">
                Course
              </p>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                {course.title}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Select a module to open its lessons and assessments in the
                learning viewer.
              </p>
            </div>
            <a
              href="/dashboard/student"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to your dashboard
            </a>
          </div>

          {/* Modules list only (no video/pdf links here) */}
          <div className="grid gap-4 md:grid-cols-2">
            {modules.length === 0 ? (
              <p className="text-xs text-gray-500">
                Modules for this course are coming soon.
              </p>
            ) : (
              modules.map((m, index) => (
                <a
                  key={m.id}
                  href={`/dashboard/learning/${course.id}/${m.id}`}
                  className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 border border-purple-100 text-[11px] font-semibold text-[#512d7c]">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-sm font-semibold text-gray-900">
                        {m.title || `Module ${index + 1}`}
                      </h2>
                      {m.summary && (
                        <p className="mt-1 text-[11px] text-gray-600">
                          {m.summary}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
                        <span>
                          {m.lessons_count} lesson
                          {m.lessons_count === 1 ? "" : "s"}
                        </span>
                        <span>
                          {m.assessments_count} assessment
                          {m.assessments_count === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#512d7c]">
                      Go to module
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
