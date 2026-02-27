"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SignupForm from "@/components/auth/SignupForm";
import { createBrowser } from "@/lib/supabase-client";

export default function SignupPage() {
  const supabase = createBrowser();
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  const handleScrollToForm = () => {
    const el = document.getElementById("signup-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleOAuthSignup = async () => {
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
          src="/images/signup.jpg"
          alt="Sign up as Student"
          width={650}
          height={1000}
          className="h-auto w-auto max-h-[500vh] object-contain m-4 rounded-3xl"
          priority
        />
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 sm:px-8 py-12 lg:py-24">
        <div className="max-w-md w-full space-y-8">
          {/* Icon + switch link + title */}
          <div className="text-center space-y-4 mt-6 lg:mt-10">
            <div className="flex itemscenter justify-center gap-3 mb-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f2b42c] text-[#512d7c] font-bold">
                ✨
              </span>
              <span className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#512d7c] font-semibold hover:underline"
                >
                  Switch to login
                </a>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#512d7c] mb-4">
              Sign up as a Student/Tutor to Get Started
            </h2>
          </div>

          {/* Social / Email options */}
          <div className="space-y-4">
            {/* Google only */}
            <button
              type="button"
              onClick={handleOAuthSignup}
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
                Continue with email
              </span>
            </button>
          </div>

          <div className="text-center text-black my-4">or</div>

          {/* Email form section */}
          <div id="signup-form">
            <SignupForm />
          </div>

          <p className="text-center text-black mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#f2b42c] font-bold hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
