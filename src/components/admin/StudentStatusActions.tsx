"use client";

import { useState, useEffect } from "react";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

type Props = {
  studentId: string;
  status: "active" | "disabled" | "under_review" | null;
  membershipStatus: "free" | "premium" | null;
  onMembershipUpdated?: (updatedTier: "free" | "premium") => void; // 🔥 ADDED: State handler callback
  onlyRenderMembershipToggle?: boolean;
};

export function StudentStatusActions({ 
  studentId, 
  status, 
  membershipStatus,
  onMembershipUpdated,
  onlyRenderMembershipToggle = false 
}: Props) {
  const currentStatus = status || "active";
  const [currentMembership, setCurrentMembership] = useState(membershipStatus || "free");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Synchronize internal state with parent variables to maintain display properties
  useEffect(() => {
    setCurrentMembership(membershipStatus || "free");
  }, [membershipStatus]);

  const handleDisableClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmDisable = () => {
    const form = document.getElementById(`disable-form-${studentId}`) as HTMLFormElement | null;
    if (form) form.submit();
  };

  const handleDropdownSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as "free" | "premium";
    setIsUpdating(true);
    
    // Optimistically push state updates to the browser layout to block jumping errors
    setCurrentMembership(selectedValue);
    if (onMembershipUpdated) onMembershipUpdated(selectedValue);
    
    try {
      const supabase = createBrowser();
      
      const { error } = await supabase
        .from("profiles")
        .update({ membership_status: selectedValue })
        .eq("id", studentId);

      if (error) throw error;
      toast.success(`Student access successfully configured to ${selectedValue.toUpperCase()} tier.`);
    } catch (err: any) {
      console.error("Database connection failure framework metrics:", err);
      toast.error("Could not overwrite database values. Reverting status row.");
      
      // Revert states locally if remote update execution fails
      const fallbackValue = currentMembership === "premium" ? "premium" : "free";
      setCurrentMembership(fallbackValue);
      if (onMembershipUpdated) onMembershipUpdated(fallbackValue);
    } finally {
      setIsUpdating(false);
    }
  };

  if (onlyRenderMembershipToggle) {
    return (
      <div className="inline-block relative text-left">
        <select
          name="membership_status"
          value={currentMembership}
          disabled={isUpdating}
          onChange={handleDropdownSelectChange}
          className={`px-3 py-1.5 font-black uppercase text-[10px] tracking-widest rounded-lg border focus:outline-none cursor-pointer transition-all appearance-none pr-7 ${
            isUpdating ? "opacity-60 cursor-not-allowed" : ""
          } ${
            currentMembership === "premium"
              ? "bg-purple-100 text-[#512d7c] border-purple-300 font-extrabold shadow-inner"
              : "bg-slate-100 text-slate-600 border-slate-300 font-extrabold"
          }`}
        >
          <option value="free">🆓 Free Tier</option>
          <option value="premium">💎 Premium</option>
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-500">
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        id={`disable-form-${studentId}`}
        action={`/dashboard/admin/students/${studentId}/status`}
        method="post"
        className="inline-flex gap-1"
      >
        <input type="hidden" name="returnTo" value="/dashboard/admin/students" />
        <input type="hidden" name="membership_status" value={currentMembership} />

        {currentStatus === "disabled" && (
          <button
            type="submit"
            name="status"
            value="active"
            className="text-xs font-black uppercase tracking-wider text-green-700 hover:underline border-0 bg-transparent cursor-pointer"
          >
            Enable
          </button>
        )}
        {currentStatus === "active" && (
          <button
            type="button"
            className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 border-0 bg-transparent cursor-pointer"
            onClick={handleDisableClick}
          >
            Disable
          </button>
        )}
        {currentStatus === "active" && (
          <input type="hidden" name="status" value="disabled" />
        )}
      </form>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 relative text-left border border-slate-100">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg border-0 bg-transparent cursor-pointer focus:outline-none"
            >
              ×
            </button>
            <h2 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
              Disable student account?
            </h2>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              This student will lose access to their dashboard and courses until you enable them again from the admin panel.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-700 border border-gray-200 hover:bg-gray-50 bg-white cursor-pointer transition-colors"
              >
                No, cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisable}
                className="px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 border-0 cursor-pointer transition-colors"
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