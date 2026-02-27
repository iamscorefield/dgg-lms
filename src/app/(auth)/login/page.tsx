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

  const handleScrollToForm = () => {
    const el = document.getElementById("login-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
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

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
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

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 sm:px-8 py-12 lg:py-24">
        <div className="max-w-md w-full space-y-8">
          {/* Icon + switch link + title */}
          <div className="text-center space-y-4 mt-6 lg:mt-12">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2b42c] text-[#512d7c] font-bold">
                🔑
              </span>
              <span className="text-sm text-gray-600">
                New here?{" "}
                <a
                  href="/signup"
                  className="text-[#512d7c] font-semibold hover:underline"
                >
                  Switch to sign up
                </a>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#512d7c] mb-4">
              Log in to access your dashboard
            </h2>
          </div>

          {/* Social / Email options */}
          <div className="space-y-4">
            {/* Google only */}
            <button
              type="button"
              onClick={handleOAuthLogin}
              className="w-full py-3 sm:py-4 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition"
            >
              <span className="text-2xl font-bold text-red-600">G</span>
              <span className="font-medium text-black">
                Continue with Google
              </span>
            </button>

            {/* Scroll to email form */}
            <button
              type="button"
              onClick={handleScrollToForm}
              className="w-full py-3 sm:py-4 border border-gray-300 rounded-full flex items-center justify-center gap-3 hover:bg-gray-50 transition"
            >
              <span className="text-2xl">✉️</span>
              <span className="font-medium text-black">
                Log in with email
              </span>
            </button>
          </div>

          <div className="text-center text-black my-4">or</div>

          {/* Email form section */}
          <div id="login-form">
            <LoginForm />
          </div>

          <p className="text-center text-black mt-6">
            New here?{" "}
            <a
              href="/signup"
              className="text-[#f2b42c] font-bold hover:underline"
            >
              Get started
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
