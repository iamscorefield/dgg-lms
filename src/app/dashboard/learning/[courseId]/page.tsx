import { notFound, redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";

type ModuleWithCounts = {
  id: string | number;
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

  // 1) Load user profile with independent package payment flags
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("prep_paid, business_paid")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // 2) Load course (including free flags)
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, course_type, is_free, price")
    .eq("id", id)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // 3) Check paid enrollment fallback
  const { data: paidEnrollment } = await supabase
    .from("enrollments")
    .select("id, payment_status")
    .eq("student_id", session.user.id)
    .eq("course_id", id)
    .eq("payment_status", "paid")
    .maybeSingle();

  const hasPaidEnrollment = !!paidEnrollment;

  // 4) Access rules & Strict Tier-Based Payment Gating
  const cType = (course.course_type || "").toLowerCase();
  const isPrecourse =
    cType === "precourse" || cType === "prep_course" || cType === "prep";
  const isBusiness = cType.includes("business");
  const isFreeCourse =
    course.is_free === true ||
    Number(course.price) === 0 ||
    cType.includes("free") ||
    cType.includes("resource");

  // Determine access based on free status or specific course tier flags
  let hasAccess = false;
  if (isFreeCourse) {
    hasAccess = true;
  } else if (isPrecourse) {
    hasAccess = profile.prep_paid === true || hasPaidEnrollment;
  } else if (isBusiness) {
    hasAccess = profile.business_paid === true || hasPaidEnrollment;
  } else {
    hasAccess = hasPaidEnrollment;
  }

  if (!hasAccess) {
    if (isBusiness) {
      redirect("/dashboard/business?error=payment_required");
    } else if (isPrecourse) {
      redirect("/dashboard/precourse");
    } else {
      redirect(`/dashboard/courses?error=payment_required`);
    }
  }

  // 5) Load modules
  const { data: modulesData, error: modulesError } = await supabase
    .from("course_modules")
    .select("id, title, summary, sort_order")
    .or(`course_id.eq.${id},course_id.eq.${courseId}`)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    console.error("Error loading modules:", modulesError);
  }

  // 6) Query lesson_slides and assessment_banks using module position index ("1", "2", etc.)
  const modules: ModuleWithCounts[] = await Promise.all(
    (modulesData || []).map(async (m: any, index: number) => {
      const moduleNumStr = String(index + 1);

      const [slidesRes, assessmentsRes] = await Promise.all([
        supabase
          .from("lesson_slides")
          .select("lesson_number")
          .eq("course_id", String(id))
          .eq("module_id", moduleNumStr),
        supabase
          .from("assessment_banks")
          .select("lesson_number")
          .eq("course_id", String(id))
          .eq("module_id", moduleNumStr),
      ]);

      // Count unique lessons by lesson_number
      const uniqueLessons = new Set((slidesRes.data || []).map((s: any) => s.lesson_number));
      const uniqueAssessments = new Set((assessmentsRes.data || []).map((a: any) => a.lesson_number));

      return {
        id: m.id,
        title: m.title,
        summary: m.summary,
        sort_order: m.sort_order,
        lessons_count: uniqueLessons.size > 0 ? uniqueLessons.size : 4,
        assessments_count: uniqueAssessments.size > 0 ? uniqueAssessments.size : 4,
      };
    })
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#512d7c] uppercase tracking-wide mb-1">
                Course Workspace
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