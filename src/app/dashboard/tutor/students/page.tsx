import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function TutorAssignedStudentsPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Same query you used in main tutor dashboard
  const { data: assignedStudents } = await supabase
    .from("one_on_one_assignments")
    .select("*, enrollments(*, profiles!student_id(full_name), courses(title))")
    .eq("tutor_id", session.user.id);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Assigned Students
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          All students assigned to you for one-on-one or small group support.
        </p>

        {(!assignedStudents || assignedStudents.length === 0) ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              No students assigned yet. New students will appear here once admin
              links them to you.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {assignedStudents.map((assignment: any) => (
              <div
                key={assignment.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
              >
                <h2 className="text-xl font-bold text-[#512d7c] mb-1">
                  {assignment.enrollments.profiles.full_name}
                </h2>
                <p className="text-sm text-gray-700 mb-2">
                  {assignment.enrollments.courses.title}
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  One-on-one support
                </p>

                <div className="mt-auto flex gap-3">
                  <button className="flex-1 py-2.5 bg-[#512d7c] text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#3f2361]">
                    View Progress
                  </button>
                  <button className="flex-1 py-2.5 bg-[#f2b42c] text-black text-xs sm:text-sm font-semibold rounded-lg hover:bg-[#e0a51a]">
                    Schedule Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
