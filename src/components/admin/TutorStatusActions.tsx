"use client";

import { useState } from "react";

type Props = {
  tutorId: string;
  status: "active" | "disabled" | "under_review" | null;
};

export function TutorStatusActions({ tutorId, status }: Props) {
  const currentStatus = status || "active";
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDisableClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmDisable = () => {
    const form = document.getElementById(
      `disable-form-tutor-${tutorId}`
    ) as HTMLFormElement | null;
    if (form) {
      form.submit();
    }
  };

  return (
    <>
      {/* Enable / Disable buttons */}
      <form
        id={`disable-form-tutor-${tutorId}`}
        action={`/dashboard/admin/tutors/${tutorId}/status`}
        method="post"
        className="inline-flex gap-1"
      >
        <input
          type="hidden"
          name="returnTo"
          value="/dashboard/admin/tutors"
        />
        {currentStatus === "disabled" && (
          <button
            type="submit"
            name="status"
            value="active"
            className="text-[11px] font-semibold text-green-700 hover:underline"
          >
            Enable
          </button>
        )}
        {currentStatus === "active" && (
          <>
            <button
              type="button"
              className="text-[11px] font-semibold text-red-600 hover:underline"
              onClick={handleDisableClick}
            >
              Disable
            </button>
            <input type="hidden" name="status" value="disabled" />
          </>
        )}
      </form>

      {/* Confirm modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full mx-4 p-6 relative">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ×
            </button>
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Disable tutor account?
            </h2>
            <p className="text-xs text-gray-700 mb-4">
              This tutor will lose access to their dashboard and course
              management until you enable them again from the admin panel.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-1 rounded-full text-[11px] font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50"
              >
                No, cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisable}
                className="px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-red-600 hover:bg-red-700"
              >
                Yes, disable
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
