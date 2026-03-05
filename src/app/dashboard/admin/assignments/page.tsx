import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

async function createAssignment(formData: FormData) {
  "use server";

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
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const studentId = String(formData.get("student_id") || "").trim();
  const tutorId = String(formData.get("tutor_id") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!studentId || !tutorId) {
    return;
  }

  // Find or create an enrollment row for this student.
  const { data: existingEnrollments } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", studentId)
    .limit(1);

  let enrollmentId: string;

  if (existingEnrollments && existingEnrollments.length > 0) {
    enrollmentId = existingEnrollments[0].id;
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from("enrollments")
      .insert({
        student_id: studentId,
        // If course_id is NOT NULL in your schema, set a default course_id here.
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.error("Error creating enrollment for assignment:", insertError);
      return;
    }

    enrollmentId = inserted.id;
  }

  await supabase.from("one_on_one_assignments").insert({
    enrollment_id: enrollmentId,
    tutor_id: tutorId,
    notes: notes || null,
    assigned_at: new Date().toISOString(),
  });

  redirect("/dashboard/admin/assignments");
}

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
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Load existing assignments, but keep it simple in case of RLS limits.
  const { data: assignments, error: assignmentsError } = await supabase
    .from("one_on_one_assignments")
    .select("id, enrollment_id, tutor_id, assigned_at, notes")
    .order("assigned_at", { ascending: false })
    .limit(100);

  if (assignmentsError) {
    console.error("Error loading assignments list:", assignmentsError);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Assign Tutors &amp; 1‑to‑1
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          Paste the student and tutor IDs from Supabase to create one‑to‑one
          assignments manually.
        </p>

        {/* Assignment form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-bold text-[#512d7c] mb-4">
            New Assignment (manual IDs)
          </h2>
          <form action={createAssignment} className="grid gap-4 md:grid-cols-3">
            {/* Student ID input */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Student ID (from profiles.id)
              </label>
              <input
                name="student_id"
                type="text"
                placeholder="Paste student UUID here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
              />
            </div>

            {/* Tutor ID input */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tutor ID (from profiles.id)
              </label>
              <input
                name="tutor_id"
                type="text"
                placeholder="Paste tutor UUID here"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <input
                name="notes"
                type="text"
                placeholder="e.g. Focus on HTML basics for 4 weeks"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
              />
            </div>

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#512d7c] text-xs sm:text-sm font-semibold text-white hover:bg-[#3f2361]"
              >
                Save assignment
              </button>
            </div>
          </form>

          <p className="mt-4 text-[11px] text-gray-500">
            Tip: In Supabase, open the <strong>profiles</strong> table and copy
            the <strong>id</strong> for the student and tutor you want to link.
          </p>
        </div>

        {/* Existing assignments */}
        {(!assignments || assignments.length === 0) ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              No one‑to‑one assignments yet.
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
                    Student ID
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
                {assignments.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-t last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{item.enrollment_id}</td>
                    <td className="px-4 py-3">{/* student_id is on enrollment */}</td>
                    <td className="px-4 py-3">{item.tutor_id}</td>
                    <td className="px-4 py-3">
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
