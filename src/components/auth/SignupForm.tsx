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

  // New conversion-optimized student profile fields
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [educationLevel, setEducationLevel] = useState("");

  // Extra fields only for tutor
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [motivation, setMotivation] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Keep form role in sync with page toggle
  useEffect(() => {
    setRoleChoice(initialRole);
  }, [initialRole]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createBrowser();

    // 1) Create auth user with comprehensive user metadata targets
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: roleChoice === "student" ? "student" : "pending_tutor",
          // Pass student metadata explicitly to the user context
          ...(roleChoice === "student" && {
            whatsapp_number: whatsappNumber,
            institution_name: institutionName,
            discipline: discipline,
            education_level: educationLevel,
          }),
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

    // 2) If they chose tutor, create tutor_application + set profile.role = 'pending_tutor'
    if (roleChoice === "tutor") {
      const { error: appError } = await supabase
        .from("tutor_applications")
        .insert({
          user_id: userId,
          experience,
          qualifications,
          motivation,
          status: "pending", 
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
      // Optional: If your backend has a public.profiles triggers that automatically 
      // synchronizes auth metadata onto the table, update the specific student table extensions here:
      const { error: studentProfileError } = await supabase
        .from("profiles")
        .update({
          whatsapp_number: whatsappNumber,
          institution_name: institutionName,
          discipline: discipline,
          education_level: educationLevel,
        })
        .eq("id", userId);

      if (studentProfileError) {
        console.warn("Profile table sync failed, fallback to auth meta:", studentProfileError.message);
      }

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

      {/* Student Specific Fields Condition Matrix */}
      {roleChoice === "student" && (
        <div className="bg-purple-50/50 p-6 rounded-xl border border-purple-100 space-y-5 animate-fadeIn">
          
          {/* Trust-Building Dynamic Copy Text */}
          <div className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-purple-200 shadow-sm leading-relaxed">
            💡 <span className="font-bold text-[#512d7c]">Why we ask:</span> DGG Academy custom-tailors your learning pathway. Your educational background helps our administration map your profile to high-demand corporate workflows and pair you with the perfect tech ecosystem mentors.
          </div>

          {/* WhatsApp Field */}
          <div>
            <label className="block text-base font-bold text-[#512d7c] mb-1.5">
              WhatsApp Contact Number
            </label>
            <input
              type="tel"
              placeholder="e.g., +2348012345678"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              required
              className="w-full px-5 py-3.5 border border-gray-300 rounded-lg text-black text-base bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
            />
          </div>

          {/* Institution Field */}
          <div>
            <label className="block text-base font-bold text-[#512d7c] mb-1.5">
              Institution / University Name
            </label>
            <input
              type="text"
              placeholder="e.g., University of Lagos"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              required
              className="w-full px-5 py-3.5 border border-gray-300 rounded-lg text-black text-base bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
            />
          </div>

          {/* Discipline Field */}
          <div>
            <label className="block text-base font-bold text-[#512d7c] mb-1.5">
              Discipline / Course of Study
            </label>
            <input
              type="text"
              placeholder="e.g., Computer Science / Economics"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              required
              className="w-full px-5 py-3.5 border border-gray-300 rounded-lg text-black text-base bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
            />
          </div>

          {/* Level of Education Select Dropdown */}
          <div>
            <label className="block text-base font-bold text-[#512d7c] mb-1.5">
              Current Level of Education
            </label>
            <div className="relative">
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                required
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg text-black text-base bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#f2b42c]"
              >
                <option value="" disabled hidden>Select your current educational milestone</option>
                <option value="undergraduate">Undergraduate (Still in School)</option>
                <option value="postgraduate">Postgraduate Student</option>
                <option value="high_school">High School Graduate</option>
                <option value="university_graduate">University Graduate (B.Sc / HND / OND)</option>
                <option value="professional">Working Professional / Self-Taught</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                ▼
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Extra fields visible only when Tutor is selected */}
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