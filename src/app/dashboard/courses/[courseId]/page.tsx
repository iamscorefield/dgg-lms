import { notFound, redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";
import { EnrollButton } from "@/components/EnrollButton";

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
  duration_weeks: number | null;
  status: string | null;
};

type Outcome = {
  id: number;
  text: string | null;
  sort_order: number | null;
};

type Module = {
  id: number;
  title: string | null;
  summary: string | null;
  sort_order: number | null;
};

export default async function CourseDetailPage(
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

  // Load course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(
      "id, title, short_description, full_description, category, level, course_type, price, is_free, duration_weeks, status"
    )
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (courseError || !course) {
    console.error("Error loading course detail:", courseError);
    notFound();
  }

  // Load outcomes
  const { data: outcomes } = await supabase
    .from("course_outcomes")
    .select("id, text, sort_order")
    .eq("course_id", id)
    .order("sort_order", { ascending: true });

  // Load modules
  const { data: modules } = await supabase
    .from("course_modules")
    .select("id, title, summary, sort_order")
    .eq("course_id", id)
    .order("sort_order", { ascending: true });

  // Check if this student is already enrolled (paid)
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, payment_status")
    .eq("student_id", session.user.id)
    .eq("course_id", id)
    .eq("payment_status", "paid")
    .maybeSingle();

  const isEnrolled = !!enrollment;

  const priceLabel = course.is_free
    ? "Free"
    : course.price && Number(course.price) > 0
    ? `₦${Number(course.price).toLocaleString()}`
    : "Contact support";

  const levelLabel = course.level || "All levels";
  const typeLabel = course.course_type || "Self-paced";

  const durationLabel = course.duration_weeks
    ? `${course.duration_weeks} week${course.duration_weeks === 1 ? "" : "s"}`
    : "Flexible duration";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="text-xs text-gray-500 mb-1">
            <a
              href="/dashboard/courses"
              className="hover:underline text-[#512d7c]"
            >
              Courses
            </a>{" "}
            / <span>{course.title || "Course detail"}</span>
          </div>

          {/* Header card */}
          <section className="bg-white rounded-2xl shadow p-5 md:p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#512d7c]">
                    {course.category || "General"}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-700 capitalize">
                    {levelLabel}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-700 capitalize">
                    {typeLabel}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-700">
                    {durationLabel}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-[#512d7c] mb-2">
                  {course.title || "Untitled course"}
                </h1>

                <p className="text-sm text-gray-700 max-w-2xl">
                  {course.short_description ||
                    "This course has been published but does not yet have a short description."}
                </p>
              </div>

              <div className="w-full md:w-auto md:text-right">
                <p className="text-xs text-gray-500 mb-1">Investment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {priceLabel}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 mb-3">
                  One-time payment for full course access.
                </p>

                {/* If enrolled: show Start learning, else: Enroll */}
                {isEnrolled ? (
                  <a
                    href={`/dashboard/learning/${course.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#512d7c] px-6 py-2 text-xs font-semibold text-white hover:bg-[#3f215f] transition"
                  >
                    Start learning
                  </a>
                ) : (
                  <EnrollButton
                    courseId={course.id}
                    isFree={course.is_free}
                  />
                )}
              </div>
            </div>
          </section>

          {/* Layout: description + sidebar */}
          <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            {/* Left: Description, outcomes, modules */}
            <div className="space-y-6">
              {/* Full description */}
              <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  About this course
                </h2>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {course.full_description ||
                    "The instructor has not added a full description yet. You can still review the learning outcomes and modules below to understand what is covered."}
                </p>
              </div>

              {/* Outcomes */}
              <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900">
                    What you will learn
                  </h2>
                  <span className="text-[11px] text-gray-500">
                    {(outcomes || []).length} learning outcome
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
                    The instructor has not added learning outcomes yet.
                  </p>
                )}
              </div>

              {/* Modules */}
              <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Course outline
                  </h2>
                  <span className="text-[11px] text-gray-500">
                    {(modules || []).length} module
                    {(modules || []).length === 1 ? "" : "s"}
                  </span>
                </div>
                {modules && modules.length > 0 ? (
                  <ol className="space-y-3">
                    {modules.map((m: Module, index: number) => (
                      <li
                        key={m.id}
                        className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border text-[11px] text-gray-600">
                              {index + 1}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {m.title || `Module ${index + 1}`}
                            </span>
                          </div>
                        </div>
                        {m.summary && (
                          <p className="text-xs text-gray-600">
                            {m.summary}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-xs text-gray-500">
                    The module breakdown for this course is coming soon.
                  </p>
                )}
              </div>
            </div>

            {/* Right: side info */}
            <aside className="space-y-4">
              <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Course summary
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li>
                    • Level:{" "}
                    <span className="capitalize">{levelLabel}</span>
                  </li>
                  <li>• Type: {typeLabel}</li>
                  <li>• Duration: {durationLabel}</li>
                  <li>• Access: Lifetime access to this course content.</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Is this course for you?
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  If you are unsure if this course is a good fit, talk with
                  your tutor or support before enrolling.
                </p>
                <a
                  href="/dashboard/precourse"
                  className="inline-flex items-center justify-center px-4 py-2 text-[11px] rounded-full border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  Try free pre‑course lessons first
                </a>
              </div>
            </aside>
          </section>
        </div>
      </div>
    </div>
  );
}
