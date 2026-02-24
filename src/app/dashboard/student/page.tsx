import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", session.user.id)
    .single();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, courses(*)")
    .eq("student_id", session.user.id)
    .eq("payment_status", "paid");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search your courses..."
            className="w-full max-w-xl px-6 py-4 border border-gray-300 rounded-full text-black placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
          />
        </div>

        {/* Welcome & Stats */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#512d7c] mb-4">
            Welcome back, {profile?.full_name || "Student"}!
          </h1>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Enrolled Courses</p>
              <p className="text-3xl font-bold text-[#512d7c]">
                {enrollments?.length || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-[#512d7c]">0</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Certificates</p>
              <p className="text-3xl font-bold text-[#512d7c]">0</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-[#512d7c]">
                {enrollments?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Prep Resources Kit – moved up */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#512d7c] mb-4">
            Are you a Newbie? Let's help your navigation...
          </h2>
          <div className="bg-white p-8 rounded-2xl shadow">
            <p className="text-lg text-gray-800">
              Explore our Prep Courses, designed to help "The Newbie"
              navigate learning paths efficiently before getting
              started, this includes digital literacy, digital monetization and many more — Access Prep Courses NOW!
            </p>
            <a
              href="/dashboard/prep/intro"
              className="inline-block mt-6 px-8 py-4 bg-[#f2b42c] text-black font-bold rounded-full hover:bg-[#e0a51a]"
            >
              Enroll for Prep Courses
            </a>
          </div>
        </div>

        {/* Enrolled Courses */}
        <h2 className="text-3xl font-bold text-[#512d7c] mb-8">
          Your Enrolled Courses
        </h2>
        {enrollments?.length === 0 ? (
          <p className="text-lg text-gray-700">
            No courses yet —{" "}
            <a
              href="/dashboard/courses"
              className="text-[#f2b42c] font-bold hover:underline"
            >
              browse and enroll
            </a>
            !
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {enrollments?.map((enrollment: any) => (
              <div
                key={enrollment.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-2xl font-bold text-[#512d7c] mb-4">
                  {enrollment.courses.title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {enrollment.courses?.type
                    ? enrollment.courses.type.replace("_", " ")
                    : ""}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#f2b42c] h-3 rounded-full"
                      style={{ width: "30%" }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">30% complete</p>
                </div>
                <a
                  href={`/dashboard/learning/${enrollment.courses.id}`}
                  className="block w-full py-3 text-center bg-[#512d7c] text-white font-bold rounded-lg hover:bg-[#3f2361]"
                >
                  Start learning
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
