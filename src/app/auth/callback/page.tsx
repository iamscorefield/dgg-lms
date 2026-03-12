"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createBrowser();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          toast.error("Authentication failed.");
          router.replace("/login");
          return;
        }

        let signupRole: "student" | "tutor" = "student";
        if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem("signup_role");
          if (stored === "tutor" || stored === "student") {
            signupRole = stored;
          }
        }

        if (signupRole === "tutor") {
          // create tutor application if not existing
          const { data: existingApps, error: fetchError } = await supabase
            .from("tutor_applications")
            .select("id")
            .eq("user_id", user.id)
            .limit(1);

          if (fetchError) {
            console.error(fetchError);
          }

          if (!existingApps || existingApps.length === 0) {
            const { error: appError } = await supabase
              .from("tutor_applications")
              .insert({
                user_id: user.id,
                experience: "",
                qualifications: "",
                motivation: "",
                status: "pending",
              });

            if (appError) {
              console.error(appError);
              toast.error("Tutor application failed: " + appError.message);
            } else {
              const { error: profileError } = await supabase
                .from("profiles")
                .update({ role: "pending_tutor" })
                .eq("id", user.id);

              if (profileError) {
                console.error(profileError);
                toast.error("Could not set tutor role: " + profileError.message);
              } else {
                toast.success(
                  "Tutor account created. We will review your application."
                );
              }
            }
          }
        }

        // clear the hint
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("signup_role");
        }

        router.replace("/dashboard");
      } catch (e) {
        console.error(e);
        toast.error("Something went wrong.");
        router.replace("/login");
      } finally {
        setProcessing(false);
      }
    }

    run();
  }, [router, supabase]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Finishing sign in...</p>
      </div>
    );
  }

  return null;
}
