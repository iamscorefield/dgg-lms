import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { StudentRowClientProps, StudentRowClient } from "@/components/admin/StudentRowClient";

// 🔥 FIXED: Force Next.js to kill its server cache and pull fresh data straight from Supabase on every page refresh!
export const dynamic = "force-dynamic";

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

  const { data: allProfiles, error: studentsError } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      email,
      avatar_url,
      bio,
      created_at,
      status,
      status_reason,
      last_login_at,
      paid_enrollment_count,
      membership_status,
      role
    `
    )
    .order("created_at", { ascending: false });

  if (studentsError) {
    console.error("Error loading students:", studentsError);
  }

  const students = (allProfiles || []).filter(
    (profile) => profile.role !== "admin" && profile.role !== "tutor"
  );

  const hasStudents = students && students.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 w-full overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#512d7c] tracking-tight">
              Manage Students
            </h1>
            <p className="text-xs sm:text-sm font-medium text-gray-600 mt-1">
              View and manage all registered student profile tiers on DGG Academy.
            </p>
          </div>
        </div>

        {!hasStudents ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-xs text-center max-w-md mx-auto">
            <p className="text-sm text-gray-700">
              No students found yet. Students will appear here after they sign up.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="w-full overflow-x-auto clear-both block whitespace-nowrap custom-scrollbar">
              
              <table className="w-full min-w-[850px] border-collapse text-left text-sm table-auto">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[#512d7c] font-black uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      Student Details
                    </th>
                    <th className="px-6 py-4 text-left">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left">
                      Last login
                    </th>
                    <th className="px-6 py-4 text-left">
                      Enrollments / progress
                    </th>
                    <th className="px-6 py-4 text-center">
                      Membership Status
                    </th>
                    <th className="px-6 py-4 text-left">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {students.map((s: any) => (
                    <StudentRowClient
                      key={s.id}
                      student={s as StudentRow}
                    />
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}