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

  // 1) Find this student's enrollments (for one_on_one_assignments join)
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("id, student_id")
    .eq("student_id", session.user.id);

  if (enrollmentsError) {
    console.error(
      "Error loading enrollments for student resources:",
      enrollmentsError
    );
  }

  const enrollmentIds = (enrollments || []).map((e: any) => e.id);

  if (enrollmentIds.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar role="student" />
        <div className="flex-1 lg:ml-64 p-6 lg:p-10">
          <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
            Tutor Resources
          </h1>
          <p className="text-sm text-gray-700 mb-8 max-w-2xl">
            When an admin assigns you to a tutor, any resources they share will
            appear here.
          </p>
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

  // 2) Find one_on_one_assignments for these enrollments
  const { data: assignments, error: assignmentsError } = await supabase
    .from("one_on_one_assignments")
    .select("id, tutor_id, enrollment_id")
    .in("enrollment_id", enrollmentIds);

  if (assignmentsError) {
    console.error(
      "Error loading one-on-one assignments for student resources:",
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
        <div className="flex-1 lg:ml-64 p-6 lg:p-10">
          <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
            Tutor Resources
          </h1>
          <p className="text-sm text-gray-700 mb-8 max-w-2xl">
            When an admin assigns you to a tutor, any resources they share will
            appear here.
          </p>
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              You have enrollments, but no tutor has been assigned for
              one‑to‑one support yet. Once a tutor is assigned, their resources
              will show here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3) Load tutor_resources for these tutor_ids
  const { data: resources, error: resourcesError } = await supabase
    .from("tutor_resources")
    .select(
      `
      id,
      title,
      content,
      video_url,
      pdf_url,
      created_at,
      tutor_id,
      tutor:profiles!tutor_id(full_name)
    `
    )
    .in("tutor_id", tutorIds)
    .order("created_at", { ascending: false });

  if (resourcesError) {
    console.error(
      "Error loading tutor resources for student resources page:",
      resourcesError
    );
  }

  const hasResources = resources && resources.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 space-y-8">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#f2b42c] uppercase mb-1">
            One‑to‑one support
          </p>
          <h1 className="text-3xl font-bold text-[#512d7c] mb-2">
            Tutor Resources
          </h1>
          <p className="text-sm text-gray-700 max-w-2xl">
            When your tutor shares lesson notes, links or videos for your
            one‑to‑one sessions, they will appear here so you can review them
            anytime.
          </p>
        </div>

        {!hasResources ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-sm text-gray-700">
              You have at least one tutor assignment, but no teaching resources
              have been shared yet. Check back after your tutor uploads lesson
              notes or links.
            </p>
          </div>
        ) : (
          <section className="grid gap-5 md:grid-cols-2">
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
                    {r.tutor?.full_name && (
                      <span className="text-[11px] text-gray-500">
                        By {r.tutor.full_name}
                      </span>
                    )}
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
          </section>
        )}
      </div>
    </div>
  );
}
