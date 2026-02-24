import { notFound, redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";

type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  full_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  duration_weeks: number | null;
  is_free: boolean | null;
  status: string | null;
};

type Outcome = {
  id: number;
  text: string | null;
  sort_order: number | null;
};

export default async function PreCourseDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await props.params;

  const id = Number(idParam);
  if (Number.isNaN(id)) {
    notFound();
  }

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      "id, title, short_description, full_description, category, level, course_type, duration_weeks, is_free, status"
    )
    .eq("id", id)
    .maybeSingle();

  if (courseError) {
    console.error("Error loading precourse detail:", courseError);
    notFound();
  }

  if (!course) {
    console.error("No course found for id:", id);
    notFound();
  }

  const { data: outcomes, error: outcomesError } = await supabase
    .from("course_outcomes")
    .select("id, text, sort_order")
    .eq("course_id", id)
    .order("sort_order", { ascending: true });

  if (outcomesError) {
    console.error("Error loading precourse outcomes:", outcomesError);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb / back link */}
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <a
              href="/dashboard/precourse"
              className="inline-flex items-center gap-1 text-xs text-[#512d7c] hover:underline"
            >
              ← Back to prep courses
            </a>
            <span className="hidden sm:inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              Free prep course
            </span>
          </div>

          {/* Header card */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
            <p className="text-[11px] font-semibold tracking-wide text-[#f2b42c] uppercase mb-1">
              Prep course
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#512d7c] mb-2">
              {course.title || "Untitled prep course"}
            </h1>
            <p className="text-xs text-gray-600 mb-2 capitalize">
              {course.category || "General"} • {course.level || "All levels"} •{" "}
              {course.course_type || "Self-paced"}
              {course.duration_weeks
                ? ` • Approx. ${course.duration_weeks} week${
                    course.duration_weeks === 1 ? "" : "s"
                  }`
                : null}
            </p>
            <p className="text-sm text-gray-700">
              {course.short_description ||
                "This prep course helps you warm up before joining the main DGG programs."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {/* Later, you can point this to a free learning view if you build one */}
              <a
                href="/dashboard/prep/intro"
                className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm rounded-full bg-[#f2b42c] text-black font-semibold hover:bg-[#e0a51a] transition"
              >
                Start prep course
              </a>
              <a
                href="/dashboard/precourse"
                className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm rounded-full border border-gray-300 bg-white text-gray-800 font-semibold hover:bg-gray-50 transition"
              >
                Back to all prep courses
              </a>
            </div>
          </section>

          {/* About + Outcomes */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 space-y-6">
            {/* About */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-3">
                About this prep course
              </h2>
              <div className="text-sm text-gray-700 space-y-3">
                {course.full_description ? (
                  course.full_description
                    .split("\n")
                    .filter((p: string) => p.trim().length > 0)
                    .map((p: string, idx: number) => <p key={idx}>{p}</p>)
                ) : (
                  <p>
                    The full description for this prep course is coming soon.
                    For now, use the overview above to understand what you will
                    learn.
                  </p>
                )}
              </div>
            </div>

            {/* Outcomes: what you will learn */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-900">
                  What you will learn
                </h2>
                <span className="text-[11px] text-gray-500">
                  {(outcomes || []).length} outcome
                  {(outcomes || []).length === 1 ? "" : "s"}
                </span>
              </div>
              {outcomes && outcomes.length > 0 ? (
                <ul className="space-y-2">
                  {outcomes.map((o: Outcome, index: number) => (
                    <li key={o.id} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#512d7c]" />
                      <p className="text-sm text-gray-700">
                        {o.text || `Outcome ${index + 1}`}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">
                  The instructor has not added learning outcomes for this prep
                  course yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
