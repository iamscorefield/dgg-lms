"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";
import { createBrowser } from "@/lib/supabase-client";

export default function LoginPage() {
  const supabase = createBrowser();
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  
  // Interactive View Layout State Control
  const [isForgotView, setIsForgotView] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [sendingReset, setSendingReset] = useState(false);

  const handleScrollToForm = () => {
    if (isForgotView) setIsForgotView(false);
    
    setTimeout(() => {
      const el = document.getElementById("login-form");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleOAuthLogin = async () => {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: redirectTo ? { redirectTo } : undefined,
    });
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setSendingReset(true);
    setResetStatus(null);

    const redirectTo = `${window.location.origin}/auth/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo,
    });

    setSendingReset(true);

    if (error) {
      setResetStatus({ type: "error", msg: error.message });
    } else {
      setResetStatus({
        type: "success",
        msg: "🔒 Direct reset sequence dispatched! Please check your email inbox link to update security tokens.",
      });
      setResetEmail("");
    }
  };

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        
        // 🌟 MFA ASSURANCE CHECK INTEGRATION
        const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (mfaData && mfaData.nextLevel === "aal2" && mfaData.currentLevel !== "aal2") {
          router.replace("/verify-mfa");
          return;
        }

        router.replace("/dashboard");
      } else {
        setCheckingSession(false);
      }
    }
    checkUser();
  }, [router, supabase]);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      {/* Left - Image (desktop only) */}
      <div className="relative w-full lg:w-1/2 hidden lg:flex items-center justify-center bg-[#f5f5f5]">
        <Image
          src="/images/login.jpg"
          alt="Welcome back"
          width={650}
          height={1000}
          className="h-auto w-auto max-h-[160vh] object-contain m-4 rounded-3xl"
          priority
        />
      </div>

      {/* Right - Form Content Arena */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 sm:px-8 py-12 lg:py-24">
        <div className="max-w-md w-full space-y-8 animate-in fade-in duration-300">
          
          {/* Icon + switch link + title header */}
          <div className="text-center space-y-4 mt-6 lg:mt-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2b42c] text-[#512d7c] font-bold">
                {isForgotView ? "🔒" : "🔑"}
              </span>
              <span className="text-sm text-gray-600">
                New here?{" "}
                <a href="/signup" className="text-[#512d7c] font-semibold hover:underline">
                  Switch to sign up
                </a>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#512d7c] mb-4 tracking-tight">
              {isForgotView ? "Recover Account Access" : "Log in to access your dashboard"}
            </h2>
          </div>

          {!isForgotView ? (
            <>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleOAuthLogin}
                  className="w-full py-3 sm:py-4 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition border-solid cursor-pointer bg-white"
                >
                  <span className="text-xl font-black text-red-600 font-mono">G</span>
                  <span className="font-medium text-black text-xs sm:text-sm">Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="w-full py-3 sm:py-4 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition border-solid cursor-pointer bg-white"
                >
                  <span className="text-lg">✉️</span>
                  <span className="font-medium text-black text-xs sm:text-sm">Log in with email</span>
                </button>
              </div>

              <div className="text-center text-slate-400 font-bold font-mono text-xs my-4 uppercase tracking-wider">or</div>

              <div id="login-form" className="space-y-4">
                <LoginForm />
                
                <div className="text-right px-1">
                  <button
                    type="button"
                    onClick={() => setIsForgotView(true)}
                    className="text-xs font-bold text-[#512d7c] hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Forgot your account password?
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 shadow-2xs space-y-4 text-left animate-in zoom-in-95 duration-200">
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Provide your matriculated digital email credential ledger identity below. Our security node will automatically map an active credential authorization cipher to verify your access channels.
              </p>

              {resetStatus && (
                <div className={`p-4 rounded-2xl text-xs font-medium border leading-normal ${
                  resetStatus.type === "success" 
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}>
                  {resetStatus.msg}
                </div>
              )}

              <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-mono pl-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#512d7c] text-black"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={sendingReset}
                    className="flex-1 py-3 bg-[#512d7c] hover:bg-[#3d215d] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition border-0 cursor-pointer shadow-3xs"
                  >
                    {sendingReset ? "Transmitting..." : "Send Reset Link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsForgotView(false); setResetStatus(null); }}
                    className="py-3 px-4 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition border border-solid border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <p className="text-center text-black mt-6 text-sm">
            New here?{" "}
            <a href="/signup" className="text-[#f2b42c] font-bold hover:underline">
              Get started
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}