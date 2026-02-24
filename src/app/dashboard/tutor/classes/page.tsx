import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function TutorClassesPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // Courses where this tutor is the instructor (adjust column name if needed)
  const { data: classes } = await supabase
    .from("courses")
    .select("*")
    .eq("tutor_id", session.user.id);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="tutor" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          My Classes
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          All the courses you’re currently teaching. From here you can open a class
          to manage content and students.
        </p>

        {(!classes || classes.length === 0) ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              You’re not assigned to any class yet.
              Ask the admin to assign you as a tutor for a course.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {classes.map((course: any) => (
              <div
                key={course.id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
              >
                <h2 className="text-xl font-bold text-[#512d7c] mb-2">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {course.description}
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  {course.type?.replace("_", " ")} •{" "}
                  {course.level || "All levels"}
                </p>

                <button
                  className="mt-auto w-full py-2.5 bg-[#512d7c] text-white text-sm font-semibold rounded-lg hover:bg-[#3f2361]"
                  onClick={() =>
                    (window.location.href = `/dashboard/tutor/classes/${course.id}`)
                  }
                >
                  Open Class
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
