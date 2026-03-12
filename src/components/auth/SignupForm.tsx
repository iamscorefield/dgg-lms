"use client";

import { useState, useEffect } from "react";
import { createBrowser } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { RoleChoice } from "@/app/(auth)/signup/page";

interface SignupFormProps {
  initialRole?: RoleChoice;
}

export default function SignupForm({ initialRole = "student" }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [roleChoice, setRoleChoice] = useState<RoleChoice>(initialRole);

  // extra fields only for tutor
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [motivation, setMotivation] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // keep form role in sync with page toggle
  useEffect(() => {
    setRoleChoice(initialRole);
  }, [initialRole]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createBrowser();

    // 1) create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: roleChoice === "student" ? "student" : "pending_tutor",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    });

    if (authError || !authData.user) {
      toast.error(authError?.message || "Signup failed");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    // 2) if they chose tutor, create tutor_application + set profile.role = 'pending_tutor'
    if (roleChoice === "tutor") {
      const { error: appError } = await supabase
        .from("tutor_applications")
        .insert({
          user_id: userId,
          experience,
          qualifications,
          motivation,
          status: "pending", // ensure this column exists
        });

      if (appError) {
        toast.error("Application failed: " + appError.message);
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "pending_tutor" })
        .eq("id", userId);

      if (profileError) {
        toast.error("Could not update role: " + profileError.message);
        setLoading(false);
        return;
      }

      toast.success("Tutor application submitted! Check your email to confirm.");
    } else {
      toast.success("Check your email to confirm signup!");
    }

    router.push("/login");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      {/* Full name */}
      <div>
        <label className="block text-lg font-bold text-[#512d7c] mb-2">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-black text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c] focus:border-[#f2b42c]"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-lg font-bold text-[#512d7c] mb-2">
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-black text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c] focus:border-[#f2b42c]"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-lg font-bold text-[#512d7c] mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Create a password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-5 py-4 border border-gray-300 rounded-lg text-black text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c] focus:border-[#f2b42c]"
        />
      </div>

      {/* extra fields visible only when Tutor is selected */}
      {roleChoice === "tutor" && (
        <>
          <div>
            <label className="block text-lg font-bold text-[#512d7c] mb-2">
              Teaching Experience
            </label>
            <textarea
              placeholder="Describe your teaching experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              required
              rows={3}
              className="w-full px-5 py-4 border border-gray-300 rounded-lg text-black text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c] focus:border-[#f2b42c]"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-[#512d7c] mb-2">
              Qualifications
            </label>
            <textarea
              placeholder="List your qualifications/certifications"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              required
              rows={3}
              className="w-full px-5 py-4 border border-gray-300 rounded-lg text-black text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c] focus:border-[#f2b42c]"
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-[#512d7c] mb-2">
              Why do you want to teach at DGG Academy?
            </label>
            <textarea
              placeholder="Tell us your motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              required
              rows={3}
              className="w-full px-5 py-4 border border-gray-300 rounded-lg text-black text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f2b42c] focus:border-[#f2b42c]"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-[#f2b42c] text-black text-xl font-bold rounded-full shadow-lg hover:bg-[#e0a51a] transition"
      >
        {loading
          ? "Creating Account..."
          : roleChoice === "student"
          ? "Sign Up as Student"
          : "Sign Up as Tutor"}
      </button>
    </form>
  );
}
