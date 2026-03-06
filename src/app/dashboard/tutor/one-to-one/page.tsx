import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function TutorOneToOnePage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Load one-to-one assignments for this tutor (simple, no joins)
  const { data: assignments, error } = await supabase
    .from("one_on_one_assignments")
    .select("id, enrollment_id, tutor_id, notes, assigned_at")
    .eq("tutor_id", session.user.id);

  if (error) {
    console.error("Error loading tutor one-to-one assignments:", error);
  }

  const hasAssignments = assignments && assignments.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          1‑to‑1 Sessions
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          See students who have been assigned to you for one‑to‑one support.
        </p>

        {!hasAssignments ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700 mb-2">
              You don’t have any one‑to‑one assignments yet.
            </p>
            <p className="text-xs text-gray-500">
              Once an admin assigns students to you, those assignments will show
              here.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Enrollment ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Tutor ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-[#512d7c]">
                    Assigned
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments!.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-t last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{item.enrollment_id}</td>
                    <td className="px-4 py-3">{item.tutor_id}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {item.notes || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-[11px] text-gray-500">
                      {item.assigned_at
                        ? new Date(item.assigned_at).toLocaleDateString()
                        : "—"}
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
