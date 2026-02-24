import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function AdminPaymentsPage() {
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

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, created_at, payment_status, metadata, courses(title, price), profiles!student_id(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Payments &amp; Enrollments
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          Monitor enrollments, payment status, and training type for each student.
        </p>

        {(!enrollments || enrollments.length === 0) ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              No enrollments recorded yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-[#512d7c]">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-[#512d7c]">
                    Student
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-[#512d7c]">
                    Course
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-[#512d7c]">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-[#512d7c]">
                    Amount
                  </th>
                  <th className="px-3 py-3 text-left font-semibold text-[#512d7c]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment: any) => {
                  const trainingType =
                    enrollment.metadata?.training_type || "—";
                  const price = enrollment.courses?.price || 0;
                  return (
                    <tr
                      key={enrollment.id}
                      className="border-t last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-3 py-3">
                        {enrollment.created_at
                          ? new Date(
                              enrollment.created_at
                            ).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-3 py-3">
                        {enrollment.profiles?.full_name ||
                          enrollment.profiles?.email ||
                          "Student"}
                      </td>
                      <td className="px-3 py-3">
                        {enrollment.courses?.title || "—"}
                      </td>
                      <td className="px-3 py-3">
                        {trainingType.replace("_", " ")}
                      </td>
                      <td className="px-3 py-3">
                        {price > 0
                          ? `₦${price.toLocaleString()}`
                          : "Free"}
                      </td>
                      <td className="px-3 py-3 capitalize">
                        {enrollment.payment_status || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
