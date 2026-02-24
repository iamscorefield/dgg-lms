// src/app/dashboard/admin/AdminDashboardActionsClient.tsx
"use client";

type Course = {
  id: string;
  title: string;
  type: string;
  price: number;
};

type Application = {
  id: string;
  status: string;
  experience: string | null;
  user_id: string;
};

type Props = {
  courses: Course[];
  applications: Application[];
};

async function callApi(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    alert((data as any).error || "Operation failed");
    return;
  }

  window.location.reload();
}

export default function AdminDashboardActionsClient({
  courses,
  applications,
}: Props) {
  return (
    <div className="space-y-12">
      {/* Courses section */}
      <div className="bg-white rounded-2xl shadow">
        <div className="flex flex-col gap-4 p-6 border-b md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-[#512d7c]">
            Manage Courses
          </h2>
          <button
            className="self-start rounded-full bg-[#f2b42c] px-6 py-3 text-sm font-bold text-black hover:bg-[#e0a51a]"
            onClick={() => {
              // change this route if your "add course" page is different
              window.location.href = "/dashboard/admin/courses/new";
            }}
          >
            Add New Course
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-t text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{course.title}</td>
                  <td className="px-4 py-3">
                    {course.type?.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3">
                    ₦{Number(course.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="text-sm font-medium text-[#512d7c] hover:underline"
                        onClick={() =>
                          (window.location.href = `/dashboard/admin/courses/${course.id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm font-medium text-red-600 hover:underline"
                        onClick={() =>
                          callApi("/api/admin/courses/delete", {
                            courseId: course.id,
                          })
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {courses.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No courses yet. Click “Add New Course” to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tutor applications section (last) */}
      <div className="bg-white rounded-2xl shadow">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-2xl font-semibold text-[#512d7c]">
            Pending Tutor Applications
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-t text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                  Experience
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {app.user_id}
                  </td>
                  <td className="px-4 py-3">
                    {app.status}
                  </td>
                  <td className="px-4 py-3">
                    {app.experience || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="text-sm font-medium text-green-600 hover:underline"
                        onClick={() =>
                          callApi("/api/admin/tutors/approve", {
                            applicationId: app.id,
                            userId: app.user_id,
                          })
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="text-sm font-medium text-red-600 hover:underline"
                        onClick={() =>
                          callApi("/api/admin/tutors/reject", {
                            applicationId: app.id,
                            userId: app.user_id,
                          })
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {applications.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No pending tutor applications.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
