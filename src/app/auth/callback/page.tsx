"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const supabase = createBrowser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (!code) {
        setError("Missing auth code in URL.");
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        setError(error.message || "Could not complete login.");
        return;
      }

      // Logged in successfully, go to dashboard
      router.replace("/dashboard");
    }

    handleCallback();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-sm text-gray-600">
          {error ? error : "Completing sign-in, please wait..."}
        </p>
      </div>
    </div>
  );
}
