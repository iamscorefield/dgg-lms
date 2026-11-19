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
  is_locked: boolean;
  required_tier_label: string | null;
};

type MainTier = "basic" | "standard" | "advance";

function resolveUnlockedModulesCount(
  rawTier: unknown,
  rawUnlockedCount: unknown,
  totalModulesCount: number
): { tier: MainTier; unlockedCount: number } {
  const tierStr = String(rawTier || "").toLowerCase().trim();
  const tier: MainTier =
    tierStr === "advance" || tierStr === "standard" || tierStr === "basic"
      ? tierStr
      : "basic";

  const numericOverride = Number(rawUnlockedCount);
  if (!Number.isNaN(numericOverride) && numericOverride > 0) {
    return { tier, unlockedCount: numericOverride };
  }

  if (tier === "advance") {
    return { tier, unlockedCount: Math.max(7, totalModulesCount) };
  }
  if (tier === "standard") {
    return { tier, unlockedCount: 4 };
  }
  return { tier: "basic", unlockedCount: 2 };
}

function getRequiredTierLabelForModuleIndex(moduleNumberOneBased: number): string {
  if (moduleNumberOneBased <= 2) return "Basic Tier";
  if (moduleNumberOneBased <= 4) return "Standard Tier";
  return "Advance Tier";
}

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

  // 3) Check paid enrollment (including optional tier columns)
  let paidEnrollment: Record<string, any> | null = null;

  const tieredEnrollRes = await supabase
    .from("enrollments")
    .select("id, payment_status, access_tier, unlocked_modules")
    .eq("student_id", session.user.id)
    .eq("course_id", id)
    .eq("payment_status", "paid")
    .maybeSingle();

  if (tieredEnrollRes.error) {
    const basicEnrollRes = await supabase
      .from("enrollments")
      .select("id, payment_status")
      .eq("student_id", session.user.id)
      .eq("course_id", id)
      .eq("payment_status", "paid")
      .maybeSingle();
    paidEnrollment = basicEnrollRes.data;
  } else {
    paidEnrollment = tieredEnrollRes.data;
  }

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

  const isMainTieredCourse = !isFreeCourse && !isPrecourse && !isBusiness;

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

  const rawModulesList = modulesData || [];
  const { tier: activeMainTier, unlockedCount } = isMainTieredCourse
    ? resolveUnlockedModulesCount(
        paidEnrollment?.access_tier,
        paidEnrollment?.unlocked_modules,
        rawModulesList.length
      )
    : { tier: "advance" as MainTier, unlockedCount: rawModulesList.length };

  // 6) Query lesson_slides and assessment_banks using module position index ("1", "2", etc.)
  const modules: ModuleWithCounts[] = await Promise.all(
    rawModulesList.map(async (m: any, index: number) => {
      const moduleNumOneBased = index + 1;
      const moduleNumStr = String(moduleNumOneBased);

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

      const uniqueLessons = new Set(
        (slidesRes.data || []).map((s: any) => s.lesson_number)
      );
      const uniqueAssessments = new Set(
        (assessmentsRes.data || []).map((a: any) => a.lesson_number)
      );

      const isLocked = isMainTieredCourse && moduleNumOneBased > unlockedCount;

      return {
        id: m.id,
        title: m.title,
        summary: m.summary,
        sort_order: m.sort_order,
        lessons_count: uniqueLessons.size > 0 ? uniqueLessons.size : 4,
        assessments_count: uniqueAssessments.size > 0 ? uniqueAssessments.size : 4,
        is_locked: isLocked,
        required_tier_label: isLocked
          ? getRequiredTierLabelForModuleIndex(moduleNumOneBased)
          : null,
      };
    })
  );

  const nextUpgradeTier: MainTier =
    activeMainTier === "basic" ? "standard" : "advance";

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
                Select an unlocked module to open its lessons and assessments in
                the learning viewer.
              </p>
            </div>
            <a
              href="/dashboard/student"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to your dashboard
            </a>
          </div>

          {isMainTieredCourse && (
            <div className="mb-6 rounded-2xl border border-purple-200/80 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
              <div className="text-xs text-slate-700">
                <span className="font-black uppercase tracking-wider text-[#512d7c]">
                  Current Tier: {activeMainTier.toUpperCase()}
                </span>{" "}
                • Unlocked{" "}
                <strong>
                  {Math.min(unlockedCount, modules.length || unlockedCount)} of{" "}
                  {modules.length || 7}
                </strong>{" "}
                modules.
              </div>
              {activeMainTier !== "advance" && (
                <a
                  href={`/dashboard/courses/${course.id}?upgrade=true&tier=${nextUpgradeTier}`}
                  className="inline-flex items-center justify-center rounded-full bg-[#f2b42c] hover:bg-[#e0a51a] text-black font-black text-[11px] uppercase tracking-wider px-4 py-2 transition"
                >
                  Upgrade Tier →
                </a>
              )}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {modules.length === 0 ? (
              <p className="text-xs text-gray-500">
                Modules for this course are coming soon.
              </p>
            ) : (
              modules.map((m, index) => {
                const modulePosition = index + 1;
                const targetTierForLockedModule: MainTier =
                  modulePosition <= 4 ? "standard" : "advance";

                if (m.is_locked) {
                  return (
                    <div
                      key={m.id}
                      className="block rounded-2xl border border-slate-200 bg-slate-100/80 p-4 opacity-80"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-500">
                          {modulePosition}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h2 className="text-sm font-semibold text-slate-700">
                              {m.title || `Module ${modulePosition}`}
                            </h2>
                            <span className="rounded-full bg-purple-100 text-[#512d7c] text-[10px] font-black uppercase px-2.5 py-0.5">
                              {m.required_tier_label || "Upgrade"}
                            </span>
                          </div>
                          {m.summary && (
                            <p className="mt-1 text-[11px] text-slate-500">
                              {m.summary}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
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
                        <a
                          href={`/dashboard/courses/${course.id}?upgrade=true&tier=${targetTierForLockedModule}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#512d7c] hover:underline"
                        >
                          Locked • Upgrade to unlock →
                        </a>
                      </div>
                    </div>
                  );
                }

                return (
                  <a
                    key={m.id}
                    href={`/dashboard/learning/${course.id}/${m.id}`}
                    className="block rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 border border-purple-100 text-[11px] font-semibold text-[#512d7c]">
                        {modulePosition}
                      </span>
                      <div className="flex-1">
                        <h2 className="text-sm font-semibold text-gray-900">
                          {m.title || `Module ${modulePosition}`}
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
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}