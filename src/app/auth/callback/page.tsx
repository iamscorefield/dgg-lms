"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const supabase = createBrowser();
  const router = useRouter();

  useEffect(() => {
    async function finishLogin() {
      // Just check if a user exists; Supabase has already tried to set the session.
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.replace("/dashboard");
      } else {
        // If no user, send back to login
        router.replace("/login");
      }
    }

    finishLogin();
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-sm text-gray-600">
          Completing sign-in, please wait...
        </p>
      </div>
    </div>
  );
}
