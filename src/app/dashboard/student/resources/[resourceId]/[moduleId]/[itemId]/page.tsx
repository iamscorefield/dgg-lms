import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

type ItemRow = {
  id: string;
  item_type: string;
  title: string;
  content: string | null;
  file_url: string | null;
  created_at: string;
  module: {
    id: string;
    title: string | null;
    resource_id: string;
    resource: {
      id: string;
      title: string | null;
      tutor_id: string;
      tutor: {
        full_name: string | null;
      } | null;
    } | null;
  } | null;
};

export default async function StudentResourceItemPage(
  props: { params: Promise<{ resourceId: string; moduleId: string; itemId: string }> }
) {
  const { resourceId, moduleId, itemId } = await props.params;

  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  // 1) Get student's enrollments
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("student_id", session.user.id);

  if (enrollmentsError) {
    console.error("Error loading enrollments for student item view:", enrollmentsError);
  }

  const enrollmentIds = (enrollments || []).map((e: any) => e.id);
  if (enrollmentIds.length === 0) {
    redirect("/dashboard/student/resources");
  }

  // 2) Get assignments for these enrollments
  const { data: assignments, error: assignmentsError } = await supabase
    .from("one_on_one_assignments")
    .select("tutor_id, enrollment_id")
    .in("enrollment_id", enrollmentIds);

  if (assignmentsError) {
    console.error("Error loading assignments for student item view:", assignmentsError);
  }

  const allowedTutorIds = Array.from(
    new Set((assignments || []).map((a: any) => a.tutor_id).filter(Boolean))
  ) as string[];

  if (allowedTutorIds.length === 0) {
    redirect("/dashboard/student/resources");
  }

  // 3) Load the item with nested module + resource + tutor, and verify access
  const { data: itemData, error } = await supabase
    .from("tutor_resource_items")
    .select(
      `
      id,
      item_type,
      title,
      content,
      file_url,
      created_at,
      module:tutor_resource_modules (
        id,
        title,
        resource_id,
        resource:tutor_resources (
          id,
          title,
          tutor_id,
          tutor:profiles!tutor_id(full_name)
        )
      )
    `
    )
    .eq("id", itemId)
    .maybeSingle();

  if (error || !itemData) {
    console.error("Error loading tutor resource item (student):", error);
    redirect("/dashboard/student/resources");
  }

  const moduleData = itemData.module as any | null;
  const resourceData = moduleData?.resource as any | null;

  // Check route match and tutor assignment
  if (
    !resourceData ||
    resourceData.id !== resourceId ||
    moduleData.id !== moduleId ||
    !allowedTutorIds.includes(resourceData.tutor_id)
  ) {
    redirect("/dashboard/student/resources");
  }

  const item: ItemRow = {
    id: itemData.id,
    item_type: itemData.item_type,
    title: itemData.title,
    content: itemData.content,
    file_url: itemData.file_url,
    created_at: itemData.created_at,
    module: moduleData
      ? {
          id: moduleData.id,
          title: moduleData.title,
          resource_id: resourceData.id,
          resource: {
            id: resourceData.id,
            title: resourceData.title,
            tutor_id: resourceData.tutor_id,
            tutor: resourceData.tutor ?? null,
          },
        }
      : null,
  };

  const tutorName = item.module?.resource?.tutor?.full_name || "Your tutor";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
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
              <a
                href={`/dashboard/student/resources/${item.module?.resource?.id}`}
                className="text-[#512d7c] hover:underline"
              >
                {item.module?.resource?.title || "Resource"}
              </a>
              <span>/</span>
              <span>{item.module?.title || "Module"}</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#512d7c]">
              {item.item_type}
            </span>
          </div>

          {/* Header */}
          <header className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h1 className="text-xl font-bold text-[#512d7c] mb-1">
              {item.title}
            </h1>
            <p className="text-[11px] text-gray-500">
              From {tutorName} • Part of{" "}
              <span className="font-semibold">
                {item.module?.resource?.title || "Resource"}
              </span>
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Shared on {new Date(item.created_at).toLocaleDateString()}
            </p>
          </header>

          {/* Content */}
          <section className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-4">
            {item.content ? (
              <div className="text-sm text-gray-800 whitespace-pre-line">
                {item.content}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Your tutor did not add written notes for this item. Check the
                attached link below if available.
              </p>
            )}

            {item.file_url && (
              <div className="pt-2 border-t border-dashed border-gray-200">
                <p className="text-[11px] text-gray-500 mb-1">
                  Attachment from your tutor:
                </p>
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#f2b42c] hover:underline break-all"
                >
                  Open attachment →
                </a>
              </div>
            )}
          </section>

          {/* Back link */}
          <div className="flex justify-between items-center text-[11px]">
            <a
              href={`/dashboard/student/resources/${item.module?.resource?.id}`}
              className="inline-flex items-center gap-1 text-[#512d7c] hover:underline"
            >
              ← Back to modules & items
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
