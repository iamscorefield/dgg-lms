import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import AdminDashboardActionsClient from "./AdminDashboardActionsClient";

export default async function AdminDashboardServer() {
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

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch courses
  const { data: courses } = await supabase.from("courses").select("*");

  // Tutor applications (currently filtering approved – adjust when needed)
  const { data: applications } = await supabase
    .from("tutor_applications")
    .select("id, status, experience, user_id")
    .eq("status", "approved");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search courses or users..."
            className="w-full max-w-xl px-6 py-4 border border-gray-300 rounded-full text-black placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
          />
        </div>

        {/* Welcome & Stats */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#512d7c] mb-4">
            Admin Dashboard – Welcome, {profile?.full_name || "Admin"}!
          </h1>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Total Courses</p>
              <p className="text-3xl font-bold text-[#512d7c]">
                {courses?.length || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Active Students</p>
              <p className="text-3xl font-bold text-[#512d7c]">124</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Approved Tutors</p>
              <p className="text-3xl font-bold text-[#512d7c]">18</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow">
              <p className="text-gray-600">Pending Applications</p>
              <p className="text-3xl font-bold text-[#512d7c]">
                {applications?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Course Management */}
        <h2 className="text-3xl font-bold text-[#512d7c] mb-8">
          Manage Courses
        </h2>
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b flex justify-between">
            <AdminDashboardActionsClient
              courses={courses || []}
              applications={applications || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
