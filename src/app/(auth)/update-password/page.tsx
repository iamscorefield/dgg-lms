"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBrowser } from "@/lib/supabase-client";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function UpdatePasswordPage() {
  const supabase = createBrowser();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setStatus({ type: "error", msg: "Security standard fault: Password must be at least 6 characters long." });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", msg: "Validation fault: Passwords do not match." });
      return;
    }

    setUpdating(true);
    setStatus(null);

    // Update user auth metadata password row field directly
    const { error } = await supabase.auth.updateUser({
      password: password.trim(),
    });

    setUpdating(false);

    if (error) {
      setStatus({ type: "error", msg: error.message });
    } else {
      setStatus({
        type: "success",
        msg: "🔒 Password tokens successfully updated! Redirecting to your learning workspace dashboard hub...",
      });
      
      // Clear inputs and auto boot them into the platform area safely
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* Left Design Vector Cover (Desktop view only) */}
      <div className="relative w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-[#f5f5f5]">
        <Image
          src="/images/login.jpg"
          alt="Secure account"
          width={650}
          height={1000}
          className="h-auto w-auto max-h-[160vh] object-contain m-4 rounded-3xl"
          priority
        />
      </div>

      {/* Right Interaction Card Form Node */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 sm:px-8 py-12 lg:py-24 text-left">
        <div className="max-w-md w-full space-y-8 animate-in fade-in duration-300">
          
          <div className="space-y-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2b42c]/10 text-[#f2b42c] font-bold">
              <Lock size={18} className="text-[#512d7c]" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#512d7c] tracking-tight">
              Establish New Password
            </h2>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              Input your updated credentials. This will instantly refresh your security signature token matrices globally across all active sessions.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 shadow-2xs space-y-4">
            {status && (
              <div className={`p-4 rounded-2xl text-xs font-medium border leading-normal flex items-start gap-2 ${
                status.type === "success" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}>
                {status.type === "success" && <CheckCircle size={14} className="mt-0.5 shrink-0" />}
                <span>{status.msg}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Field 1: New Password */}
              <div className="space-y-1 relative">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-mono pl-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] text-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#512d7c] bg-transparent border-0 cursor-pointer p-0.5"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Field 2: Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-mono pl-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#512d7c] text-black"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3.5 bg-[#512d7c] hover:bg-[#3d215d] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition border-0 cursor-pointer shadow-3xs mt-2"
              >
                {updating ? "Saving New Password..." : "Update Protection Keys"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}