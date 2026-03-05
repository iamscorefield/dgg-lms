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
  // For now we just create a "dummy" enrollment without a specific course if none exists.
  // Adjust this if you need course-specific assignments.

  // Try to find an existing enrollment (any) for this student.
  const { data: existingEnrollments } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", studentId)
    .limit(1);

  let enrollmentId: string;

  if (existingEnrollments && existingEnrollments.length > 0) {
    enrollmentId = existingEnrollments[0].id;
  } else {
    // Create a simple enrollment row just to attach the assignment.
    const { data: inserted, error: insertError } = await supabase
      .from("enrollments")
      .insert({
        student_id: studentId,
        // course_id: null, // optional, depending on your schema; remove if NOT NULL
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

  // Load all students (role = student)
  const { data: students, error: studentsError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "student")
    .order("full_name", { ascending: true });

  if (studentsError) {
    console.error("Error loading students for assignments:", studentsError);
  }

  // Load tutors (role = tutor)
  const { data: tutors, error: tutorsError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "tutor")
    .order("full_name", { ascending: true });

  if (tutorsError) {
    console.error("Error loading tutors for assignments:", tutorsError);
  }

  // Load existing assignments joined back to student + tutor
  const { data: assignments, error: assignmentsError } = await supabase
    .from("one_on_one_assignments")
    .select(
      `
      id,
      enrollment_id,
      tutor_id,
      assigned_at,
      notes,
      tutor:profiles!tutor_id(full_name),
      enrollment:enrollments(
        id,
        student:profiles!student_id(full_name)
      )
    `
    )
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
          Assign tutors directly to students for one‑to‑one support, and review
          existing assignments.
        </p>

        {/* Assignment form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-bold text-[#512d7c] mb-4">
            New Assignment
          </h2>
          <form action={createAssignment} className="grid gap-4 md:grid-cols-3">
            {/* Student select */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Student
              </label>
              <select
                name="student_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
                defaultValue=""
              >
                <option value="" disabled>
                  {students && students.length > 0
                    ? "Select student"
                    : "No students found"}
                </option>
                {(students || []).map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {(s.full_name || "Student") +
                      (s.email ? ` (${s.email})` : "")}
                  </option>
                ))}
              </select>
            </div>

            {/* Tutor select */}
            <div className="md:col-span-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tutor
              </label>
              <select
                name="tutor_id"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
                defaultValue=""
              >
                <option value="" disabled>
                  {tutors && tutors.length > 0
                    ? "Select tutor"
                    : "No tutors found"}
                </option>
                {(tutors || []).map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {(t.full_name || "Tutor") +
                      (t.email ? ` (${t.email})` : "")}
                  </option>
                ))}
              </select>
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
                    Student
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                    Tutor
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
                    <td className="px-4 py-3">
                      {item.enrollment?.student?.full_name || "Student"}
                    </td>
                    <td className="px-4 py-3">
                      {item.tutor?.full_name || "Tutor"}
                    </td>
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
