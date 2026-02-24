import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  duration_weeks: number | null;
  price: number | null;
  is_free: boolean | null;
  status: string | null;
  is_prep: boolean | null;
};

export default async function PreCourseResourcesPage(
  props: {
    searchParams: Promise<{
      q?: string;
      level?: string;
      type?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const q = (searchParams.q || "").trim();
  const levelFilter = (searchParams.level || "").trim();
  const typeFilter = (searchParams.type || "").trim();

  let query = supabase
    .from("courses")
    .select(
      "id, title, short_description, category, level, course_type, duration_weeks, price, is_free, status, is_prep"
    )
    .eq("status", "published")
    .eq("is_free", true)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,short_description.ilike.%${q}%,category.ilike.%${q}%`
    );
  }

  if (levelFilter) {
    query = query.eq("level", levelFilter);
  }

  if (typeFilter) {
    query = query.eq("course_type", typeFilter);
  }

  const { data: courses, error } = await query;

  if (error) {
    console.error("Error loading pre-course free courses:", error);
  }

  const hasCourses = courses && courses.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-8">
        {/* Hero / intro */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#f2b42c] uppercase mb-1">
              Warm‑up first
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#512d7c]">
              Prep program courses
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              These free prep courses help you warm up before deeper programs.
              Browse their details and get a feel for your learning path.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 w-full md:max-w-sm border border-purple-50">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              How to use this section
            </p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>• Browse all free prep courses and see what you will learn.</li>
              <li>• Open each course page to read full details and outline.</li>
              <li>• When you are ready to enroll fully, use the DGG Academy page.</li>
            </ul>
          </div>
        </section>

        {/* Search & filters */}
        <section className="bg-white rounded-2xl shadow p-4 md:p-5 border border-gray-100">
          <form className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Search prep courses
              </label>
              <div className="relative">
                <input
                  name="q"
                  defaultValue={q}
                  type="text"
                  placeholder="Search by title, topic, or category..."
                  className="w-full rounded-full border border-gray-300 px-4 py-2.5 text-sm pr-10 focus:border-[#512d7c] focus:ring-[#512d7c]"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                  ⌕
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:w-[340px]">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  name="level"
                  defaultValue={levelFilter}
                  className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                >
                  <option value="">Any level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="all-levels">All levels</option>
                </select>
              </div>

              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  defaultValue={typeFilter}
                  className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                >
                  <option value="">Any type</option>
                  <option value="self-paced">Self-paced</option>
                  <option value="cohort-based">Cohort-based</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-full bg-[#512d7c] text-xs font-semibold text-white hover:bg-[#3f2160]"
              >
                Apply filters
              </button>
              <a
                href="/dashboard/precourse"
                className="px-3 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset
              </a>
            </div>
          </form>
        </section>

        {/* Stats / small header */}
        <section className="flex items-center justify-between text-xs text-gray-600">
          <p>
            {hasCourses
              ? `Showing ${courses!.length} free prep course${
                  courses!.length === 1 ? "" : "s"
                }`
              : "No free prep courses published yet."}
          </p>
          <p className="hidden sm:block">
            Free prep courses live here. Paid main programs are in the course
            catalog.
          </p>
        </section>

        {/* Cards */}
        <section>
          {!hasCourses ? (
            <div className="bg-white rounded-2xl shadow p-6 text-sm text-gray-700">
              Once admins publish free prep courses, they will appear here. You
              can also visit the prep intro page to understand how the journey
              works.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {courses!.map((course: Course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md hover:border-[#f2b42c] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#512d7c]">
                        {course.category || "Prep course"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        Free prep course
                      </span>
                    </div>

                    <h2 className="text-sm font-semibold text-[#512d7c] mb-1">
                      {course.title || "Untitled prep course"}
                    </h2>
                    <p className="text-xs text-gray-600 mb-1 capitalize">
                      {course.level || "All levels"} •{" "}
                      {course.course_type || "Self-paced"}
                    </p>
                    <p className="text-sm text-gray-700">
                      {course.short_description ||
                        "Prep course created to guide you before you move into main programs."}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <p className="text-[11px] text-gray-500">
                      Open the course page to see full overview and what you
                      will learn in this prep program.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/dashboard/precourse/${course.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm rounded-full bg-white border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50 transition"
                      >
                        View details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
