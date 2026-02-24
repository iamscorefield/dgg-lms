import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CoursesTable from "./CoursesTable";

export default async function AdminCoursesPage() {
  const supabase = await createServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      "id, title, short_description, category, level, course_type, price, is_free, is_featured, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading courses:", error);
  }

  const hasCourses = courses && courses.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        {/* Header + New Course button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#512d7c]">
              Manage Courses
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage all courses available in DGG Academy.
            </p>
          </div>
          <a
            href="/dashboard/admin/courses/new"
            className="inline-flex items-center justify-center rounded-full bg-[#f2b42c] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#e0a51a]"
          >
            + New Course
          </a>
        </div>

        {/* List */}
        {!hasCourses ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              No courses found yet. Click “New Course” to create the first one.
            </p>
          </div>
        ) : (
          <CoursesTable initialCourses={courses || []} />
        )}
      </div>
    </div>
  );
}
