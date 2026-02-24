import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { StudentRowClientProps, StudentRowClient } from "@/components/admin/StudentRowClient";

type StudentRow = StudentRowClientProps["student"];

export default async function AdminStudentsPage() {
  const supabase = await createServer();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Error getting session:", sessionError);
  }

  if (!session) {
    redirect("/login");
  }

  const { data: currentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.error("Error loading current profile:", profileError);
  }

  if (currentProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: students, error: studentsError } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      avatar_url,
      phone,
      department,
      bio,
      created_at,
      status,
      status_reason,
      last_login_at,
      paid_enrollment_count
    `
    )
    .eq("role", "student")
    .order("created_at", { ascending: false });

  if (studentsError) {
    console.error("Error loading students:", studentsError);
  }

  const hasStudents = students && students.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#512d7c]">
              Manage Students
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all registered students on DGG Academy.
            </p>
          </div>
        </div>

        {!hasStudents ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              No students found yet. Students will appear here after they sign
              up.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Last login
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Enrollments / progress
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-[#512d7c]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students!.map((s: any) => (
                  <StudentRowClient
                    key={s.id}
                    student={s as StudentRow}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
