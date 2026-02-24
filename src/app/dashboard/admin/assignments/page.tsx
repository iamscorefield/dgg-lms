import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function AdminAssignmentsPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: assignments } = await supabase
    .from("one_on_one_assignments")
    .select("*, profiles!tutor_id(full_name), enrollments(*, profiles!student_id(full_name), courses(title))")
    .limit(100);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Assign Tutors &amp; 1‑to‑1
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          View existing one‑to‑one mappings and (later) assign tutors to students for focused support.
        </p>

        {/* Placeholder Assignment Form (UI only) */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-[#512d7c] mb-4">
            New Assignment (coming soon)
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Student ID or email"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500"
            />
            <input
              type="text"
              placeholder="Tutor ID or email"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500"
            />
            <input
              type="text"
              placeholder="Course ID (optional)"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500"
            />
          </div>
          <button className="mt-4 px-5 py-2.5 rounded-full bg-gray-100 text-xs sm:text-sm font-semibold text-gray-600 cursor-not-allowed">
            Save assignment (wire later)
          </button>
        </div>

        {/* Existing assignments */}
        {(!assignments || assignments.length === 0) ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              No one‑to‑one assignments yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Tutor
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Course
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-[#512d7c]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-t last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {item.enrollments?.profiles?.full_name || "Student"}
                    </td>
                    <td className="px-4 py-3">
                      {item.profiles?.full_name || "Tutor"}
                    </td>
                    <td className="px-4 py-3">
                      {item.enrollments?.courses?.title || "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs font-semibold text-red-600 hover:underline">
                        Remove (later)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
