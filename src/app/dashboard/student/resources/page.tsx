import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function StudentResourcesPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const studentId = session.user.id;

  // 1) Get this student's enrollments
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("id, student_id")
    .eq("student_id", studentId);

  if (enrollmentsError) {
    console.error(
      "Student resources: error loading enrollments:",
      enrollmentsError
    );
  }

  const enrollmentIds = (enrollments || []).map((e: any) => e.id);

  if (enrollmentIds.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-6">
          <header>
            <p className="text-xs font-semibold tracking-wide text-[#f2b42c] uppercase mb-1">
              One‑to‑one support
            </p>
            <h1 className="text-3xl font-bold text-[#512d7c] mb-2">
              Tutor Resources
            </h1>
            <p className="text-sm text-gray-700 max-w-2xl">
              When an admin assigns you to a tutor, any resources they share
              will appear here.
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              You don’t have any one‑to‑one tutor assignments yet. Once you’re
              assigned to a tutor, their teaching resources will show here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2) Get assignments for these enrollments
  const { data: assignments, error: assignmentsError } = await supabase
    .from("one_on_one_assignments")
    .select("id, tutor_id, enrollment_id, notes, assigned_at")
    .in("enrollment_id", enrollmentIds);

  if (assignmentsError) {
    console.error(
      "Student resources: error loading one_on_one_assignments:",
      assignmentsError
    );
  }

  const tutorIds = Array.from(
    new Set((assignments || []).map((a: any) => a.tutor_id).filter(Boolean))
  ) as string[];

  if (tutorIds.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-6">
          <header>
            <p className="text-xs font-semibold tracking-wide text-[#f2b42c] uppercase mb-1">
              One‑to‑one support
            </p>
            <h1 className="text-3xl font-bold text-[#512d7c] mb-2">
              Tutor Resources
            </h1>
            <p className="text-sm text-gray-700 max-w-2xl">
              When an admin assigns you to a tutor, any resources they share
              will appear here.
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow p-6 space-y-2">
            <p className="text-sm text-gray-700">
              You have course enrollments, but no tutor has been linked for
              one‑to‑one support yet.
            </p>
            <p className="text-xs text-gray-500">
              Once an admin creates a 1‑to‑1 assignment, your tutor’s learning
              resources will be available on this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3) Load tutor resources for these tutor_ids
  const { data: resources, error: resourcesError } = await supabase
    .from("tutor_resources")
    .select("id, title, content, video_url, pdf_url, created_at, tutor_id")
    .in("tutor_id", tutorIds);

  if (resourcesError) {
    console.error(
      "Student resources: error loading tutor_resources:",
      resourcesError
    );
  }

  const hasResources = resources && resources.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold tracking-wide text-[#f2b42c] uppercase mb-1">
            One‑to‑one support
          </p>
          <h1 className="text-3xl font-bold text-[#512d7c] mb-2">
            Tutor Resources
          </h1>
          <p className="text-sm text-gray-700 max-w-2xl">
            Access learning resources shared by the tutor(s) assigned to you for
            one‑to‑one sessions.
          </p>
        </header>

        {/* Assignment summary */}
        <section className="bg-white rounded-2xl shadow p-5 border border-gray-100">
          <p className="text-sm font-semibold text-[#512d7c] mb-1">
            You are assigned to {tutorIds.length} tutor
            {tutorIds.length > 1 ? "s" : ""}.
          </p>
          <p className="text-xs text-gray-600 mb-3">
            Your admin has created one‑to‑one assignments linking you with these
            tutor IDs:
          </p>
          <div className="flex flex-wrap gap-1 text-[11px]">
            {tutorIds.map((id) => (
              <span
                key={id}
                className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[#512d7c]"
              >
                Tutor: {id}
              </span>
            ))}
          </div>
        </section>

        {/* Resources list */}
        {!hasResources ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700 mb-1">
              Your tutor assignment is active, but no teaching resources have
              been shared yet.
            </p>
            <p className="text-xs text-gray-500">
              Ask your tutor to create a resource from their dashboard so it
              appears here.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#512d7c]">
                Access learning resources from your assigned tutor
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {resources!.map((r: any) => (
                <a
                  key={r.id}
                  href={`/dashboard/student/resources/${r.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between hover:shadow-md hover:border-[#f2b42c] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#512d7c]">
                        Tutor resource
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Tutor ID: {r.tutor_id}
                      </span>
                    </div>

                    <h2 className="text-sm font-semibold text-[#512d7c] mb-1">
                      {r.title || "Untitled resource"}
                    </h2>
                    {r.content && (
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {r.content}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                    <span>
                      Created on {new Date(r.created_at).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#f2b42c] font-semibold">
                      View details
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
