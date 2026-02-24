import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase-server";
import Sidebar from "@/components/Sidebar";

type Course = {
  id: number;
  title: string | null;
  short_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  price: number | null;
  is_free: boolean | null;
  status: string | null;
};

function getIconSrc(category: string | null): string {
  const cat = (category || "").toLowerCase();

  // map category text to one of your 18 icons
  if (cat.includes("digital")) return "/course-icons/digital-literacy.svg";
  if (cat.includes("ui") || cat.includes("ux")) return "/course-icons/ui-ux.svg";
  if (cat.includes("data")) return "/course-icons/data.svg";
  if (cat.includes("cyber")) return "/course-icons/cyber.svg";
  if (cat.includes("marketing")) return "/course-icons/marketing.svg";
  if (cat.includes("brand")) return "/course-icons/branding.svg";
  if (cat.includes("graphic")) return "/course-icons/graphics.svg";
  if (cat.includes("3d")) return "/course-icons/3d.svg";
  if (cat.includes("code") || cat.includes("program")) return "/course-icons/coding.svg";
  if (cat.includes("web")) return "/course-icons/web.svg";
  if (cat.includes("mobile") || cat.includes("app")) return "/course-icons/mobile.svg";
  if (cat.includes("social")) return "/course-icons/social.svg";
  if (cat.includes("ai") || cat.includes("machine")) return "/course-icons/ai.svg";
  if (cat.includes("project")) return "/course-icons/project.svg";
  if (cat.includes("money") || cat.includes("finance")) return "/course-icons/money.svg";
  if (cat.includes("cloud")) return "/course-icons/cloud.svg";
  if (cat.includes("business")) return "/course-icons/business.svg";

  // fallback
  return "/course-icons/default.svg";
}

export default async function StudentCoursesPage(
  props: {
    searchParams?: Promise<{
      q?: string;
      level?: string;
      type?: string;
      price?: string;
    }>;
  }
) {
  const searchParams = (await props.searchParams) || {};

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
  const priceFilter = (searchParams.price || "").trim();

  let query = supabase
    .from("courses")
    .select(
      "id, title, short_description, category, level, course_type, price, is_free, status"
    )
    .eq("status", "published")
    .eq("is_free", false) // exclude free from available courses
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

  // price ranges in NGN
  if (priceFilter === "50-100") {
    query = query.gte("price", 50000).lte("price", 100000);
  } else if (priceFilter === "100-200") {
    query = query.gte("price", 100000).lte("price", 200000);
  } else if (priceFilter === "200-400") {
    query = query.gte("price", 200000).lte("price", 400000);
  }

  const { data: courses, error } = await query;

  if (error) {
    console.error("Error loading student courses:", error);
  }

  const hasCourses = courses && courses.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-8">
        {/* Hero / Intro */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#f2b42c] uppercase mb-1">
              DGG Academy Catalog
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-[#512d7c]">
              Explore available courses
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Discover practical courses designed to help you gain real
              skills. Filter by level, type, or investment range to find
              what fits you.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 w-full md:max-w-sm border border-purple-50">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              How to choose
            </p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li>• Start with beginner level if you&apos;re new to tech.</li>
              <li>• Use price ranges to match your current budget.</li>
              <li>• Check course type: self‑paced vs live/cohort experience.</li>
            </ul>
          </div>
        </section>

        {/* Search + filters */}
        <section className="bg-white rounded-2xl shadow p-4 md:p-5 border border-gray-100">
          <form className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Search courses
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

            <div className="flex flex-wrap gap-3 md:w-[420px]">
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

              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Price (₦)
                </label>
                <select
                  name="price"
                  defaultValue={priceFilter}
                  className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs bg-white focus:border-[#512d7c] focus:ring-[#512d7c]"
                >
                  <option value="">Any range</option>
                  <option value="50-100">₦50k – ₦100k</option>
                  <option value="100-200">₦100k – ₦200k</option>
                  <option value="200-400">₦200k – ₦400k</option>
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
                href="/dashboard/courses"
                className="px-3 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50"
              >
                Reset
              </a>
            </div>
          </form>
        </section>

        {/* Results header */}
        <section className="flex items-center justify-between text-xs text-gray-600">
          <p>
            {hasCourses
              ? `Showing ${courses!.length} paid course${
                  courses!.length === 1 ? "" : "s"
                }`
              : "No courses found in this price range yet."}
          </p>
          <p className="hidden sm:block">
            All courses here are paid; free intros live in the pre‑course area.
          </p>
        </section>

        {/* Course cards */}
        <section>
          {!hasCourses ? (
            <div className="bg-white rounded-2xl shadow p-6 text-sm text-gray-700">
              Try a different price range, level, or keyword to see more
              courses.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses!.map((course: Course) => {
                const priceLabel =
                  course.price && Number(course.price) > 0
                    ? `₦${Number(course.price).toLocaleString()}`
                    : "Contact support";

                const iconSrc = getIconSrc(course.category);

                return (
                  <a
                    key={course.id}
                    href={`/dashboard/courses/${course.id}`}
                    className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-[#f2b42c] transition-all"
                  >
                    {/* icon */}
                    <div className="mb-3 flex justify-center">
                      <img
                        src={iconSrc}
                        alt={course.category || "Course icon"}
                        className="h-12 w-12"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#512d7c]">
                        {course.category || "General"}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-700 capitalize">
                        {course.level || "All levels"}
                      </span>
                    </div>

                    <h2 className="text-sm font-semibold text-gray-900 group-hover:text-[#512d7c] line-clamp-2">
                      {course.title || "Untitled course"}
                    </h2>

                    <p className="mt-1 text-xs text-gray-600 line-clamp-3">
                      {course.short_description ||
                        "No description available yet. Click to see more details."}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        {priceLabel}
                      </span>
                      <span className="text-[11px] font-semibold text-[#f2b42c]">
                        View details →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
