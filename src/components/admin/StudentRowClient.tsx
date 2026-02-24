"use client";

import { useState } from "react";
import { StudentStatusActions } from "./StudentStatusActions";

export type StudentRowClientProps = {
  student: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    department: string | null;
    bio: string | null;
    created_at: string | null;
    status: "active" | "disabled" | "under_review" | null;
    status_reason: string | null;
    last_login_at: string | null;
    paid_enrollment_count: number | null;
    progress_percent?: number | null;
  };
};

export function StudentRowClient({ student }: StudentRowClientProps) {
  const [open, setOpen] = useState(false);

  const joined = student.created_at
    ? new Date(student.created_at).toLocaleDateString()
    : "—";
  const lastLogin = student.last_login_at
    ? new Date(student.last_login_at).toLocaleString()
    : "—";

  const status = student.status || "active";
  const statusLabel = status === "active" ? "Active" : "Disabled";
  const statusColor =
    status === "active"
      ? "bg-green-50 text-green-700 border-green-100"
      : "bg-red-50 text-red-700 border-red-100";

  const enrollmentSummary =
    (student.paid_enrollment_count || 0) === 0
      ? "No paid courses yet"
      : `${student.paid_enrollment_count} paid course${
          student.paid_enrollment_count === 1 ? "" : "s"
        }`;

  const progressPercent = student.progress_percent ?? null;

  return (
    <>
      {/* table row */}
      <tr className="border-t last:border-b-0 hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {student.avatar_url ? (
              <img
                src={student.avatar_url}
                alt={student.full_name || "Student avatar"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#f2b42c] flex items-center justify-center text-xs font-semibold text-black">
                {student.full_name
                  ? student.full_name.charAt(0).toUpperCase()
                  : "S"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium">
                {student.full_name || "Unnamed student"}
              </span>
              {student.bio && (
                <span className="text-[11px] text-gray-500 line-clamp-1">
                  {student.bio}
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          {student.department || "—"}
        </td>
        <td className="px-4 py-3">
          {student.phone || "—"}
        </td>
        <td className="px-4 py-3">{joined}</td>
        <td className="px-4 py-3">{lastLogin}</td>
        <td className="px-4 py-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-700">
              {enrollmentSummary}
            </span>
            {progressPercent !== null && (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-20 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-[#512d7c]"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, progressPercent)
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-gray-600">
                  {Math.round(
                    Math.max(0, Math.min(100, progressPercent))
                  )}
                  %
                </span>
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusColor}`}
          >
            {statusLabel}
          </span>
          {student.status_reason && (
            <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
              {student.status_reason}
            </div>
          )}
        </td>
        <td className="px-4 py-3 text-right">
          <button
            type="button"
            className="text-xs font-semibold text-[#512d7c] hover:underline mr-3"
            onClick={() => setOpen(true)}
          >
            View
          </button>
          <StudentStatusActions
            studentId={student.id}
            status={student.status}
          />
        </td>
      </tr>

      {/* profile modal */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 relative">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ×
            </button>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={student.full_name || "Student avatar"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#f2b42c] flex items-center justify-center text-sm font-semibold text-black">
                    {student.full_name
                      ? student.full_name.charAt(0).toUpperCase()
                      : "S"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {student.full_name || "Unnamed student"}
                  </span>
                  {student.department && (
                    <span className="text-[11px] text-gray-500">
                      {student.department}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-700">
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {student.phone || "—"}
                </p>
                <p>
                  <span className="font-semibold">Joined:</span>{" "}
                  {joined}
                </p>
                <p>
                  <span className="font-semibold">Last login:</span>{" "}
                  {lastLogin}
                </p>
                <p>
                  <span className="font-semibold">
                    Enrollments / payment:
                  </span>{" "}
                  {enrollmentSummary}
                </p>
                {progressPercent !== null && (
                  <p>
                    <span className="font-semibold">Progress:</span>{" "}
                    {Math.round(
                      Math.max(0, Math.min(100, progressPercent))
                    )}
                    %
                  </p>
                )}
                {student.bio && (
                  <p>
                    <span className="font-semibold">Bio:</span>{" "}
                    {student.bio}
                  </p>
                )}
                {student.status_reason && (
                  <p>
                    <span className="font-semibold">
                      Admin note:
                    </span>{" "}
                    {student.status_reason}
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs font-semibold text-[#512d7c] hover:underline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
