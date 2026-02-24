import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function StudentProgressPage() {
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

  const totalCourses = enrollments?.length || 0;
  const completedCourses = 0; // placeholder for now
  const inProgressCourses = totalCourses; // placeholder

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Learning Progress
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          See an overview of your courses, completion status, and how far you’ve gone in your learning journey.
        </p>

        {/* Top stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-600 text-sm">Total Courses</p>
            <p className="text-3xl font-bold text-[#512d7c]">{totalCourses}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-[#512d7c]">
              {completedCourses}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-[#512d7c]">
              {inProgressCourses}
            </p>
          </div>
        </div>

        {/* Course progress list */}
        {(!enrollments || enrollments.length === 0) ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              You haven’t started any course yet. Enroll in a course to see your detailed progress here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-[#512d7c] mb-4">
              Course-wise Progress
            </h2>
            <div className="space-y-4">
              {enrollments.map((enrollment: any) => (
                <div key={enrollment.id}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-[#512d7c]">
                      {enrollment.courses.title}
                    </p>
                    <p className="text-xs text-gray-600">30% complete</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#f2b42c] h-2 rounded-full"
                      style={{ width: "30%" }} // placeholder
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
