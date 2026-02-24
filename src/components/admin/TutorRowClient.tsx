"use client";

import { useState } from "react";
import { TutorStatusActions } from "./TutorStatusActions";

export type TutorRowClientProps = {
  tutor: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    department: string | null;
    bio: string | null;
    expertise: string | null;
    created_at: string | null;
    status: "active" | "disabled" | "under_review" | null;
    status_reason: string | null;
    last_login_at: string | null;
  };
};

export function TutorRowClient({ tutor }: TutorRowClientProps) {
  const [open, setOpen] = useState(false);

  const joined = tutor.created_at
    ? new Date(tutor.created_at).toLocaleDateString()
    : "—";
  const lastLogin = tutor.last_login_at
    ? new Date(tutor.last_login_at).toLocaleString()
    : "—";

  const status = tutor.status || "active";
  const statusLabel = status === "active" ? "Active" : "Disabled";
  const statusColor =
    status === "active"
      ? "bg-green-50 text-green-700 border-green-100"
      : "bg-red-50 text-red-700 border-red-100";

  return (
    <>
      {/* table row */}
      <tr className="border-t last:border-b-0 hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {tutor.avatar_url ? (
              <img
                src={tutor.avatar_url}
                alt={tutor.full_name || "Tutor avatar"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#f2b42c] flex items-center justify-center text-xs font-semibold text-black">
                {tutor.full_name
                  ? tutor.full_name.charAt(0).toUpperCase()
                  : "T"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium">
                {tutor.full_name || "Unnamed tutor"}
              </span>
              {tutor.bio && (
                <span className="text-[11px] text-gray-500 line-clamp-1">
                  {tutor.bio}
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          {tutor.expertise || "Not set"}
        </td>
        <td className="px-4 py-3">
          {tutor.department || "—"}
        </td>
        <td className="px-4 py-3">
          {tutor.phone || "—"}
        </td>
        <td className="px-4 py-3">{joined}</td>
        <td className="px-4 py-3">{lastLogin}</td>
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusColor}`}
          >
            {statusLabel}
          </span>
          {tutor.status_reason && (
            <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">
              {tutor.status_reason}
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
          <TutorStatusActions tutorId={tutor.id} status={tutor.status} />
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
                {tutor.avatar_url ? (
                  <img
                    src={tutor.avatar_url}
                    alt={tutor.full_name || "Tutor avatar"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#f2b42c] flex items-center justify-center text-sm font-semibold text-black">
                    {tutor.full_name
                      ? tutor.full_name.charAt(0).toUpperCase()
                      : "T"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {tutor.full_name || "Unnamed tutor"}
                  </span>
                  {tutor.department && (
                    <span className="text-[11px] text-gray-500">
                      {tutor.department}
                    </span>
                  )}
                  {tutor.expertise && (
                    <span className="text-[11px] text-gray-500">
                      Expertise: {tutor.expertise}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-700">
                <p>
                  <span className="font-semibold">Phone:</span>{" "}
                  {tutor.phone || "—"}
                </p>
                <p>
                  <span className="font-semibold">Joined:</span>{" "}
                  {joined}
                </p>
                <p>
                  <span className="font-semibold">Last login:</span>{" "}
                  {lastLogin}
                </p>
                {tutor.bio && (
                  <p>
                    <span className="font-semibold">Bio:</span>{" "}
                    {tutor.bio}
                  </p>
                )}
                {tutor.status_reason && (
                  <p>
                    <span className="font-semibold">
                      Admin note:
                    </span>{" "}
                    {tutor.status_reason}
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
