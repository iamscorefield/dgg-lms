"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

export default function VerifyMfaPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createBrowser();
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) return toast.error("Please provide the complete 6-digit key sequence.");
    setLoading(true);

    try {
      // 1. Query Supabase factor tables linked to the logged-in user session
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      // Extract the Time-based One-time Password (TOTP) factor entry row
      const totpFactor = factors.totp?.[0];
      if (!totpFactor) {
        throw new Error("No active Google Authenticator configuration discovered for this account module profile.");
      }

      // 2. Transmit challenge check parameters securely to Supabase auth core servers
      const { error: challengeError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: totpFactor.id,
        code: code.trim(),
      });

      if (challengeError) throw challengeError;

      toast.success("Security authorization clearance level 2 verified active!");
      router.replace("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid validation keys code string.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <form 
        onSubmit={handleVerify} 
        className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full space-y-6 text-left"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 text-[#512d7c] rounded-xl text-xl">🛡️</span>
            <h2 className="text-xl font-black text-[#512d7c] uppercase tracking-tight">Security Check Required</h2>
          </div>
          <p className="text-xs text-gray-400 font-medium leading-relaxed pl-1">
            Input the 6-digit token verification key string currently showing inside your Google Authenticator mobile application to unlock this account profile session container securely.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-mono pl-1">
            Authenticator Token Key
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-2xl font-mono font-black tracking-[0.5em] border border-gray-200 bg-slate-50/50 rounded-2xl p-3.5 outline-none focus:border-[#512d7c] focus:bg-white text-black transition-all"
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="w-full py-3.5 bg-[#512d7c] hover:bg-purple-900 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition border-0 cursor-pointer"
        >
          {loading ? "Verifying Token Matrix Clearance..." : "Confirm Security Access Clearance"}
        </button>
      </form>
    </div>
  );
}