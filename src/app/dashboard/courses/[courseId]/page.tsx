import { notFound, redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";
import { EnrollButton, MainTierKey } from "@/components/EnrollButton";

type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  full_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  price: number | null;
  basic_price?: number | null;
  standard_price?: number | null;
  advance_price?: number | null;
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

function normalizeTierParam(raw?: string): MainTierKey | null {
  const val = (raw || "").toLowerCase().trim();
  if (val === "basic" || val === "standard" || val === "advance") {
    return val;
  }
  return null;
}

function getTierRank(tier: MainTierKey | null): number {
  if (tier === "basic") return 1;
  if (tier === "standard") return 2;
  if (tier === "advance") return 3;
  return 0;
}

export default async function CourseDetailPage(props: {
  params: Promise<{ courseId: string }>;
  searchParams?: Promise<{ tier?: string; upgrade?: string }>;
}) {
  const { courseId } = await props.params;
  const resolvedSearchParams = (await props.searchParams) || {};

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

  // Load course (including optional 3-tier prices for Main courses)
  let course: Course | null = null;
  let courseError: any = null;

  const fullCourseRes = await supabase
    .from("courses")
    .select(
      "id, title, short_description, full_description, category, level, course_type, price, basic_price, standard_price, advance_price, is_free, duration_weeks, status"
    )
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (fullCourseRes.error || !fullCourseRes.data) {
    const baseCourseRes = await supabase
      .from("courses")
      .select(
        "id, title, short_description, full_description, category, level, course_type, price, is_free, duration_weeks, status"
      )
      .eq("id", id)
      .eq("status", "published")
      .single();
    course = baseCourseRes.data as Course | null;
    courseError = baseCourseRes.error;
  } else {
    course = fullCourseRes.data as Course;
  }

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

  // Check if this student is already enrolled (paid) and read their current tier
  let enrollment: Record<string, any> | null = null;
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
    enrollment = basicEnrollRes.data;
  } else {
    enrollment = tieredEnrollRes.data;
  }

  const isEnrolled = !!enrollment;
  const currentEnrolledTier: MainTierKey | null = isEnrolled
    ? normalizeTierParam(enrollment?.access_tier) || "basic"
    : null;

  const isMainPaidCourse =
    !course.is_free &&
    String(course.course_type || "").toLowerCase() === "main";

  const basicAmount = Number(course.basic_price ?? course.price ?? 0);
  const standardAmount = Number(course.standard_price ?? 0);
  const advanceAmount = Number(course.advance_price ?? 0);

  // Always show tier options on paid Main courses
  const hasTieredPricing = isMainPaidCourse;

  const requestedTier = normalizeTierParam(resolvedSearchParams.tier);

  // Pick default active tier (if upgrading from Basic, default to Standard; if upgrading from Standard, default to Advance)
  let activeTier: MainTierKey = requestedTier || "basic";
  if (isEnrolled && currentEnrolledTier) {
    if (
      !requestedTier ||
      getTierRank(requestedTier) <= getTierRank(currentEnrolledTier)
    ) {
      activeTier =
        currentEnrolledTier === "basic" ? "standard" : "advance";
    }
  }

  const activeTierAmount =
    activeTier === "basic"
      ? basicAmount
      : activeTier === "standard"
      ? standardAmount
      : advanceAmount;

  const canUpgradeCurrentEnrollment =
    isEnrolled &&
    hasTieredPricing &&
    currentEnrolledTier !== "advance";

  const priceLabel = course.is_free
    ? "Free"
    : hasTieredPricing
    ? activeTierAmount > 0
      ? `₦${activeTierAmount.toLocaleString()}`
      : basicAmount > 0
      ? `From ₦${basicAmount.toLocaleString()}`
      : "Contact support"
    : course.price && Number(course.price) > 0
    ? `₦${Number(course.price).toLocaleString()}`
    : "Contact support";

  const levelLabel = course.level || "All levels";
  const typeLabel = course.course_type || "Self-paced";

  const durationLabel = course.duration_weeks
    ? `${course.duration_weeks} week${course.duration_weeks === 1 ? "" : "s"}`
    : "Flexible duration";

  const totalModulesCount = (modules || []).length || 7;

  const tierCards: {
    key: MainTierKey;
    name: string;
    price: number;
    modulesLabel: string;
    description: string;
  }[] = [
    {
      key: "basic",
      name: "Basic Tier",
      price: basicAmount,
      modulesLabel: `Unlocks Modules 1 – ${Math.min(2, totalModulesCount)}`,
      description: "Core foundational lessons & starter assessments.",
    },
    {
      key: "standard",
      name: "Standard Tier",
      price: standardAmount,
      modulesLabel: `Unlocks Modules 1 – ${Math.min(4, totalModulesCount)}`,
      description: "Includes Basic + intermediate applied modules & labs.",
    },
    {
      key: "advance",
      name: "Advance Tier",
      price: advanceAmount,
      modulesLabel: `Unlocks All ${totalModulesCount} Modules (1 – ${totalModulesCount})`,
      description: "Full mastery access including capstone & all assessments.",
    },
  ];

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
                <p className="text-xs text-gray-500 mb-1">
                  {hasTieredPricing
                    ? `${activeTier.toUpperCase()} Tier Investment`
                    : "Investment"}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {priceLabel}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 mb-3">
                  {hasTieredPricing
                    ? activeTier === "basic"
                      ? "Unlocks Modules 1–2."
                      : activeTier === "standard"
                      ? "Unlocks Modules 1–4."
                      : `Unlocks all ${totalModulesCount} modules.`
                    : "One-time payment for full course access."}
                </p>

                {isEnrolled && !canUpgradeCurrentEnrollment ? (
                  <a
                    href={`/dashboard/learning/${course.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#512d7c] px-6 py-2 text-xs font-semibold text-white hover:bg-[#3f215f] transition"
                  >
                    Start learning
                  </a>
                ) : isEnrolled && canUpgradeCurrentEnrollment ? (
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2">
                    <EnrollButton
                      courseId={course.id}
                      isFree={false}
                      selectedTier={activeTier}
                      tierPrice={activeTierAmount}
                      isUpgrade={true}
                    />
                    <a
                      href={`/dashboard/learning/${course.id}`}
                      className="text-[11px] font-semibold text-[#512d7c] hover:underline"
                    >
                      Continue current ({currentEnrolledTier?.toUpperCase()}) modules →
                    </a>
                  </div>
                ) : (
                  <EnrollButton
                    courseId={course.id}
                    isFree={course.is_free}
                    selectedTier={hasTieredPricing ? activeTier : null}
                    tierPrice={hasTieredPricing ? activeTierAmount : course.price}
                  />
                )}
              </div>
            </div>

            {/* TIER SELECTOR CARDS FOR MAIN PAID COURSES */}
            {hasTieredPricing && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#512d7c]">
                    {isEnrolled
                      ? `Current Tier: ${currentEnrolledTier?.toUpperCase()} — Select a Higher Tier to Upgrade`
                      : "Step 1: Select Your Access Tier Before Checkout"}
                  </h2>
                  <span className="text-[11px] text-gray-500">
                    Click a tier below to update your checkout price &amp; unlocked modules
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tierCards.map((tier) => {
                    const isCurrentPlan =
                      isEnrolled && currentEnrolledTier === tier.key;
                    const isLowerThanCurrent =
                      isEnrolled &&
                      getTierRank(tier.key) <= getTierRank(currentEnrolledTier);
                    const isSelected = activeTier === tier.key && !isLowerThanCurrent;
                    const isUnavailable = tier.price <= 0;

                    return (
                      <div
                        key={tier.key}
                        className={`rounded-2xl border p-4 flex flex-col justify-between transition ${
                          isSelected
                            ? "border-[#512d7c] bg-purple-50/40 ring-1 ring-[#512d7c]"
                            : isLowerThanCurrent
                            ? "border-gray-200 bg-gray-50 opacity-75"
                            : "border-gray-200 bg-white hover:border-[#512d7c]/50"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-extrabold uppercase tracking-wider text-[#512d7c]">
                              {tier.name}
                            </span>
                            {isCurrentPlan ? (
                              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold uppercase">
                                Current Plan
                              </span>
                            ) : isSelected ? (
                              <span className="rounded-full bg-[#f2b42c] text-black px-2 py-0.5 text-[10px] font-bold uppercase">
                                Selected
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-2 text-xl font-extrabold text-gray-900">
                            {tier.price > 0
                              ? `₦${tier.price.toLocaleString()}`
                              : "Price pending"}
                          </p>

                          <p className="mt-1.5 inline-block rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                            {tier.modulesLabel}
                          </p>

                          <p className="mt-2 text-xs text-gray-600">
                            {tier.description}
                          </p>
                        </div>

                        <div className="mt-4">
                          {isCurrentPlan ? (
                            <a
                              href={`/dashboard/learning/${course.id}`}
                              className="block w-full text-center rounded-xl border border-emerald-300 bg-emerald-50 py-2 text-[11px] font-bold text-emerald-800"
                            >
                              Active Plan • Go to Modules
                            </a>
                          ) : isLowerThanCurrent ? (
                            <span className="block w-full text-center rounded-xl border border-gray-200 bg-gray-100 py-2 text-[11px] font-semibold text-gray-500">
                              Included in Your Plan
                            </span>
                          ) : isUnavailable ? (
                            <span className="block w-full text-center rounded-xl border border-gray-200 bg-gray-100 py-2 text-[11px] font-semibold text-gray-400">
                              Price not set yet
                            </span>
                          ) : isSelected ? (
                            <EnrollButton
                              courseId={course.id}
                              isFree={false}
                              selectedTier={tier.key}
                              tierPrice={tier.price}
                              isUpgrade={isEnrolled}
                              label={
                                isEnrolled
                                  ? `Pay ₦${tier.price.toLocaleString()} to Upgrade →`
                                  : `Pay ₦${tier.price.toLocaleString()} (${tier.name.replace(" Tier", "")}) →`
                              }
                            />
                          ) : (
                            <a
                              href={`/dashboard/courses/${course.id}?tier=${tier.key}${
                                isEnrolled ? "&upgrade=true" : ""
                              }`}
                              className="block w-full text-center rounded-xl border border-[#512d7c] bg-white hover:bg-[#512d7c] text-[#512d7c] hover:text-white py-2 text-[11px] font-bold transition"
                            >
                              Select {tier.name.replace(" Tier", "")}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
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
                    {modules.map((m: Module, index: number) => {
                      const tierTag = hasTieredPricing
                        ? index < 2
                          ? "Basic • Standard • Advance"
                          : index < 4
                          ? "Standard • Advance"
                          : "Advance Only"
                        : null;

                      return (
                        <li
                          key={m.id}
                          className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white border text-[11px] text-gray-600">
                                {index + 1}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {m.title || `Module ${index + 1}`}
                              </span>
                            </div>
                            {tierTag && (
                              <span className="rounded-full bg-purple-50 border border-purple-200 px-2 py-0.5 text-[10px] font-semibold text-[#512d7c]">
                                {tierTag}
                              </span>
                            )}
                          </div>
                          {m.summary && (
                            <p className="text-xs text-gray-600">
                              {m.summary}
                            </p>
                          )}
                        </li>
                      );
                    })}
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
                  <li>• Access: Lifetime access to your unlocked tier.</li>
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