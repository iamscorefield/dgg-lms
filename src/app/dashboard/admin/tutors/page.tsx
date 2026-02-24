import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { TutorRowClient, TutorRowClientProps } from "@/components/admin/TutorRowClient";

type TutorRow = TutorRowClientProps["tutor"];

export default async function AdminTutorsPage() {
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

  const { data: tutors, error: tutorsError } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      avatar_url,
      phone,
      department,
      bio,
      expertise,
      created_at,
      status,
      status_reason,
      last_login_at
    `
    )
    .eq("role", "tutor")
    .order("created_at", { ascending: false });

  if (tutorsError) {
    console.error("Error loading tutors:", tutorsError);
  }

  const hasTutors = tutors && tutors.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#512d7c]">Manage Tutors</h1>
            <p className="text-sm text-gray-600 mt-1">
              View all tutors, their expertise, and account status.
            </p>
          </div>
        </div>

        {!hasTutors ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              No tutors found yet. Approve tutor applications to see them here.
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
                    Expertise
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
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-[#512d7c]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {tutors!.map((t: any) => (
                  <TutorRowClient key={t.id} tutor={t as TutorRow} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
