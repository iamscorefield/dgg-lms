"use client";

import { useState } from "react";
import { StudentStatusActions } from "./StudentStatusActions";

export type StudentRowClientProps = {
  student: {
    id: string;
    full_name: string | null;
    email?: string | null; // Real email tracking parameter field mapped from database public schemas
    avatar_url: string | null;
    bio: string | null;
    created_at: string | null;
    status: "active" | "disabled" | "under_review" | null;
    status_reason: string | null;
    last_login_at: string | null;
    paid_enrollment_count: number | null;
    progress_percent?: number | null;
    membership_status: "free" | "premium" | null;
  };
};

export function StudentRowClient({ student }: StudentRowClientProps) {
  const [open, setOpen] = useState(false);
  const [localMembership, setLocalMembership] = useState<"free" | "premium">(
    student.membership_status === "premium" ? "premium" : "free"
  );

  const joined = student.created_at
    ? new Date(student.created_at).toLocaleDateString()
    : "—";
  const lastLogin = student.last_login_at
    ? new Date(student.last_login_at).toLocaleDateString()
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
      <tr className="border-t last:border-b-0 hover:bg-gray-50/80 transition-colors">
        {/* Student Identity Cell Block Container */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            {student.avatar_url ? (
              <img
                src={student.avatar_url}
                alt={student.full_name || "Student avatar"}
                className="h-9 w-9 rounded-full object-cover shadow-xs"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-[#f2b42c] flex items-center justify-center text-xs font-black text-black flex-shrink-0 shadow-xs">
                {student.full_name ? student.full_name.charAt(0).toUpperCase() : "S"}
              </div>
            )}
            <div className="flex flex-col min-w-[160px] max-w-[240px]">
              <span className="font-bold text-amber-600 truncate">
                {student.full_name || "Unnamed student"}
              </span>
              {/* 🔥 FIXED: Explicitly renders the real verified email value from the backfilled profiles table column */}
              <span className="text-[11px] text-slate-500 font-mono tracking-tight truncate mt-0.5">
                {student.email || "Verified via Google OAuth"}
              </span>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-amber-600">
          {joined}
        </td>
        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">
          {lastLogin}
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col gap-1 min-w-[130px]">
            <span className="text-xs text-slate-700 font-semibold">{enrollmentSummary}</span>
            {progressPercent !== null && (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-[#512d7c]"
                    style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-500">
                  {Math.round(Math.max(0, Math.min(100, progressPercent)))}%
                </span>
              </div>
            )}
          </div>
        </td>

        {/* Membership Status Form Trigger Selector */}
        <td className="px-6 py-4 whitespace-nowrap text-center">
          <StudentStatusActions
            studentId={student.id}
            status={student.status}
            membershipStatus={localMembership}
            onMembershipUpdated={(updatedTier) => setLocalMembership(updatedTier)}
            onlyRenderMembershipToggle={true}
          />
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${statusColor}`}>
            {statusLabel}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold">
          <button
            type="button"
            className="text-xs font-black uppercase tracking-wider text-[#512d7c] hover:underline mr-4 border-0 bg-transparent cursor-pointer"
            onClick={() => setOpen(true)}
          >
            View
          </button>
          
          <StudentStatusActions
            studentId={student.id}
            status={student.status}
            membershipStatus={localMembership}
            onMembershipUpdated={(updatedTier) => setLocalMembership(updatedTier)}
            onlyRenderMembershipToggle={false}
          />
        </td>
      </tr>

      {/* Profile Detail Informational Lightbox Overlay Element */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative text-left overflow-hidden border border-slate-100">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-5 text-3xl text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer font-light focus:outline-none"
            >
              ×
            </button>
            <div className="p-8">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="h-12 w-12 rounded-full bg-[#f2b42c] flex items-center justify-center text-sm font-black text-black flex-shrink-0 shadow-xs">
                  {student.full_name ? student.full_name.charAt(0).toUpperCase() : "S"}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-black text-base text-[#512d7c] truncate">
                    {student.full_name || "Unnamed student"}
                  </span>
                  <span className="text-xs text-slate-400 font-mono truncate mt-0.5">{student.email || "Verified user account"}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-5">
                <p className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100"><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Access Clearance Level:</span> <span className="uppercase font-black text-[#512d7c] bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100/60 text-[10px] tracking-wide">{localMembership}</span></p>
                <p className="flex justify-between items-center px-1"><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Calendar Onboarding:</span> <span className="font-bold text-slate-800">{joined}</span></p>
                <p className="flex justify-between items-center px-1"><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Last Session Audit:</span> <span className="font-bold text-slate-800">{lastLogin}</span></p>
                <p className="flex justify-between items-center px-1"><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Ecosystem Metrics:</span> <span className="font-bold text-slate-800">{enrollmentSummary}</span></p>
                {student.bio && <div className="pt-2 border-t border-slate-100 mt-2"><span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">Bio:</span><p className="text-slate-600 italic">{student.bio}</p></div>}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-xl border-0 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}