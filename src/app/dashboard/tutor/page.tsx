import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function TutorDashboard() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "tutor") {
    redirect("/dashboard");
  }

  // Fetch assigned students (example - adjust to your table)
  const { data: assignedStudents } = await supabase
    .from("one_on_one_assignments")
    .select("*, enrollments(*, profiles!student_id(full_name), courses(title))")
    .eq("tutor_id", session.user.id);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search your assigned students..."
            className="w-full max-w-xl px-6 py-4 border border-gray-300 rounded-full text-black placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
          />
        </div>

        {/* Welcome & Stats */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#512d7c] mb-4">
            Welcome back, {profile?.full_name || "Tutor"}!
          </h1>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Assigned Students</p>
              <p className="text-3xl font-bold text-[#512d7c]">
                {assignedStudents?.length || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Pending Grades</p>
              <p className="text-3xl font-bold text-[#512d7c]">3</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-[#512d7c]">5</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Courses Taught</p>
              <p className="text-3xl font-bold text-[#512d7c]">2</p>
            </div>
          </div>
        </div>

        {/* Assigned Students */}
        <h2 className="text-3xl font-bold text-[#512d7c] mb-8">
          Your Assigned Students
        </h2>
        {assignedStudents?.length === 0 ? (
          <p className="text-lg text-gray-700">
            No students assigned yet — check back soon!
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {assignedStudents?.map((assignment: any) => (
              <div
                key={assignment.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-bold text-[#512d7c] mb-2">
                  {assignment.enrollments.profiles.full_name}
                </h3>
                <p className="text-gray-700 mb-4">
                  {assignment.enrollments.courses.title}
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  One‑on‑One Sessions
                </p>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 bg-[#512d7c] text-white font-bold rounded-lg hover:bg-[#3f2361]">
                    View Progress
                  </button>
                  <button className="flex-1 py-3 bg-[#f2b42c] text-black font-bold rounded-lg hover:bg-[#e0a51a]">
                    Schedule Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Assignments */}
        <h2 className="text-3xl font-bold text-[#512d7c] mt-16 mb-8">
          Upload New Assignment
        </h2>
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-lg text-gray-800 mb-6">
            Create assignments for your assigned students.
          </p>
          <button className="px-8 py-4 bg-[#512d7c] text-white font-bold rounded-full hover:bg-[#3f2361]">
            Create Assignment
          </button>
        </div>

        {/* Session Calendar Stub */}
        <h2 className="text-3xl font-bold text-[#512d7c] mt-16 mb-8">
          Upcoming Sessions
        </h2>
        <div className="bg-white p-8 rounded-2xl shadow">
          <p className="text-lg text-gray-800">
            Your session calendar will appear here — schedule with students.
          </p>
        </div>
      </div>
    </div>
  );
}
