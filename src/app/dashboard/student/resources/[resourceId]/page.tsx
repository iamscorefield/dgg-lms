import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import ResourceMediaModal from "@/components/ResourceMediaModal";
import ResourceItemModal from "@/components/ResourceItemModal";

type ItemRow = {
  id: string;
  item_type: string;
  title: string;
  file_url: string | null;
};

type ModuleRow = {
  id: string;
  title: string | null;
  summary: string | null;
  sort_order: number | null;
  items: ItemRow[];
};

export default async function StudentResourceDetailPage(
  props: { params: Promise<{ resourceId: string }> }
) {
  const { resourceId } = await props.params;

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 1) Check that this student has an assignment to the tutor who owns this resource
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", session.user.id);

  if (enrollmentsError) {
    console.error(
      "Error loading enrollments for student resource detail:",
      enrollmentsError
    );
  }

  const enrollmentIds = (enrollments || []).map((e: any) => e.id);
  if (enrollmentIds.length === 0) {
    redirect("/dashboard/student/resources");
  }

  const { data: assignments, error: assignmentsError } = await supabase
    .from("one_on_one_assignments")
    .select("tutor_id, enrollment_id")
    .in("enrollment_id", enrollmentIds);

  if (assignmentsError) {
    console.error(
      "Error loading assignments for student resource detail:",
      assignmentsError
    );
  }

  const tutorIds = Array.from(
    new Set((assignments || []).map((a: any) => a.tutor_id).filter(Boolean))
  ) as string[];

  if (tutorIds.length === 0) {
    redirect("/dashboard/student/resources");
  }

  // 2) Load the resource, ensuring its tutor_id is in this student's assigned tutor list
  const { data: resource, error: resourceError } = await supabase
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
    .eq("id", resourceId)
    .in("tutor_id", tutorIds)
    .maybeSingle();

  if (resourceError || !resource) {
    console.error(
      "Resource not accessible for this student:",
      resourceError
    );
    redirect("/dashboard/student/resources");
  }

  const tutorName =
    Array.isArray(resource.tutor) && resource.tutor.length > 0
      ? resource.tutor[0].full_name
      : null;

  // 3) Load modules and items for this resource
  const { data: modulesData, error: modulesError } = await supabase
    .from("tutor_resource_modules")
    .select(
      `
      id,
      title,
      summary,
      sort_order,
      tutor_resource_items (
        id,
        item_type,
        title,
        file_url,
        sort_order
      )
    `
    )
    .eq("resource_id", resourceId)
    .order("sort_order", { ascending: true });

  if (modulesError) {
    console.error(
      "Error loading tutor resource modules (student):",
      modulesError
    );
  }

  const modules: ModuleRow[] = (modulesData || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    summary: m.summary,
    sort_order: m.sort_order,
    items:
      (m.tutor_resource_items || [])
        .sort(
          (a: any, b: any) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0)
        )
        .map((it: any) => ({
          id: it.id,
          item_type: it.item_type,
          title: it.title,
          file_url: it.file_url,
        })) ?? [],
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <div className="flex flex-wrap items-center gap-1">
              <a
                href="/dashboard/student/resources"
                className="text-[#512d7c] hover:underline"
              >
                Tutor resources
              </a>
              <span>/</span>
              <span>{resource.title || "Resource"}</span>
            </div>
            {tutorName && (
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#512d7c]">
                {tutorName}
              </span>
            )}
          </div>

          {/* Header */}
          <header className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <p className="text-xs font-semibold text-[#f2b42c] uppercase tracking-wide mb-1">
              Tutor Resource
            </p>
            <h1 className="text-2xl font-bold text-[#512d7c] mb-1">
              {resource.title || "Untitled resource"}
            </h1>
            <p className="text-[11px] text-gray-500">
              Shared on {new Date(resource.created_at).toLocaleDateString()}
            </p>
          </header>

          {/* Overview + main media modal */}
          <section className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
            {resource.content ? (
              <div className="text-sm text-gray-800 whitespace-pre-line">
                {resource.content}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Your tutor has not added a description for this resource yet.
              </p>
            )}

            <ResourceMediaModal
              videoUrl={resource.video_url}
              pdfUrl={resource.pdf_url}
            />
          </section>

          {/* Modules + items (each item opens its own modal) */}
          <section className="space-y-4">
            {modules.length === 0 ? (
              <div className="bg-white rounded-2xl_shadow p-6 border border-gray-100">
                <p className="text-sm text-gray-700">
                  This resource does not have any modules yet. Check back later
                  after your tutor adds more structure.
                </p>
              </div>
            ) : (
              modules.map((m, index) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl shadow p-5 border border-gray-100 space-y-4"
                >
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">
                      Module {m.sort_order ?? index + 1}
                    </p>
                    <h2 className="text-sm font-semibold text-[#512d7c]">
                      {m.title || `Module ${index + 1}`}
                    </h2>
                    {m.summary && (
                      <p className="text-xs text-gray-600 mt-1">
                        {m.summary}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {m.items.length === 0 ? (
                      <p className="text-[11px] text-gray-500">
                        No items yet in this module.
                      </p>
                    ) : (
                      <ResourceItemModal items={m.items} />
                    )}
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
