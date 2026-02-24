"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-client";

type Course = {
  id: string | number;
  title: string | null;
  short_description: string | null;
  category: string | null;
  level: string | null;
  course_type: string | null;
  price: number | null;
  is_free: boolean | null;
  is_featured: boolean | null;
  status: string | null;
  created_at: string | null;
};

type Props = {
  initialCourses: Course[];
};

export default function CoursesTable({ initialCourses }: Props) {
  const router = useRouter();
  const supabase = createBrowser();

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleteTitle, setDeleteTitle] = useState<string>("");
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openDeleteConfirm(course: Course) {
    setDeleteId(course.id);
    setDeleteTitle(course.title || "Untitled course");
    setDeleteReason("");
    setError(null);
  }

  function closeDeleteConfirm() {
    setDeleteId(null);
    setDeleteTitle("");
    setDeleteReason("");
    setError(null);
  }

  async function handleConfirmDelete() {
    if (!deleteId) return;
    if (!deleteReason.trim()) {
      setError("Please enter a short reason before deleting.");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("courses")
        .delete()
        .eq("id", deleteId);

      if (deleteError) {
        console.error(deleteError);
        throw new Error("Failed to delete course");
      }

      setCourses((prev) => prev.filter((c) => c.id !== deleteId));

      closeDeleteConfirm();

      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong while deleting");
    } finally {
      setIsDeleting(false);
    }
  }

  const hasCourses = courses && courses.length > 0;

  return (
    <>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                Title
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                Category
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                Level
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                Type
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                Price
              </th>
              <th className="px-4 py-3 text-left font-semibold text-[#512d7c]">
                Status
              </th>
              <th className="px-4 py-3 text-right font-semibold text-[#512d7c]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!hasCourses ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-sm text-gray-600"
                >
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-t last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {course.title || "Untitled course"}
                      </span>
                      {course.short_description && (
                        <span className="text-xs text-gray-500 line-clamp-1">
                          {course.short_description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {course.category || "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {course.level || "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {course.course_type || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {course.is_free
                      ? "Free"
                      : course.price && Number(course.price) > 0
                      ? `₦${Number(course.price).toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        course.status === "published"
                          ? "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700"
                          : "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700"
                      }
                    >
                      {course.status || "draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`/dashboard/admin/courses/${course.id}/edit`}
                      className="text-xs font-semibold text-[#512d7c] hover:underline mr-3"
                    >
                      Edit
                    </a>
                    <button
                      type="button"
                      onClick={() => openDeleteConfirm(course)}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm delete overlay */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure you want to delete this course?
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              <span className="font-medium">Course:</span> {deleteTitle}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              This action cannot be undone. Please type a brief reason for
              deleting, so you remember why it was removed.
            </p>

            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Reason for deleting (e.g. duplicate course, outdated content, wrong setup)..."
            />

            {error && (
              <div className="mt-2 text-xs text-red-600">{error}</div>
            )}

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 text-xs rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60"
              >
                No, keep it
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Yes, delete it"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPending && (
        <div className="mt-2 text-xs text-gray-500">
          Refreshing courses...
        </div>
      )}
    </>
  );
}
