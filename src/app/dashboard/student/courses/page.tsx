import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function StudentCoursesPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("student_id", session.user.id)
    .eq("payment_status", "paid");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          My Courses
        </h1>
        <p className="text-sm text-gray-700 mb-8">
          All the courses you’re currently enrolled in, with quick access to continue learning.
        </p>

        {(!enrollments || enrollments.length === 0) ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              You’re not enrolled in any course yet. Visit{" "}
              <a
                href="/dashboard/courses"
                className="text-[#f2b42c] font-semibold hover:underline"
              >
                Browse Courses
              </a>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {enrollments.map((enrollment: any) => (
              <div
                key={enrollment.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
              >
                <h2 className="text-xl font-bold text-[#512d7c] mb-2">
                  {enrollment.courses.title}
                </h2>
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {enrollment.courses.description}
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  {enrollment.courses.type?.replace("_", " ")} •{" "}
                  {enrollment.courses.level || "All levels"}
                </p>

                <div className="mb-4">
                  <p className="text-xs text-gray-600">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#f2b42c] h-2 rounded-full"
                      style={{ width: "30%" }} // placeholder
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">30% complete</p>
                </div>

                <button className="mt-auto w-full py-2.5 bg-[#512d7c] text-white text-sm font-semibold rounded-lg hover:bg-[#3f2361]">
                  Continue Course
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
