"use client";

import { useState } from "react";
import { createBrowser } from "@/lib/supabase-client";

type Role = "student" | "tutor" | "admin";

export default function Sidebar({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const supabase = createBrowser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#512d7c] text-white rounded-lg"
      >
        Menu
      </button>

      {/* Fixed Logout button at top-right of dashboard */}
      <button
        onClick={handleLogout}
        className="fixed top-4 right-4 z-40 px-4 py-2 bg-[#f2b42c] text-black text-sm font-bold rounded-full shadow-md hover:bg-[#e0a51a] transition"
      >
        Logout
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-30 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Make inner content scrollable */}
        <div className="h-full flex flex-col">
          {/* Logo (fixed at top of sidebar) */}
          <div className="p-6 flex items-center gap-3 shrink-0">
            <img
              src="/images/logo.png"
              alt="DGG Academy"
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-[#512d7c]">
              DGG Academy
            </span>
          </div>

          {/* Scrollable nav area */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <nav className="space-y-3 text-sm font-medium">
              {role === "student" && (
                <>
                  <a
                    href="/dashboard/student"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    My Dashboard
                  </a>
                  <a
                    href="/dashboard/prep/intro"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Welcome Prep Intro
                  </a>
                  <a
                    href="/dashboard/precourse"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Start Prep Journey
                  </a>
                  <a
                    href="/dashboard/student/courses"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    My Courses
                  </a>
                  <a
                    href="/dashboard/courses"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Browse Courses
                  </a>
                  <a
                    href="/dashboard/student/progress"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Progress
                  </a>
                  <a
                    href="/dashboard/certificates"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Certificates &amp; Badges
                  </a>
                  <a
                    href="/dashboard/faq"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    FAQs
                  </a>
                  <a
                    href="/dashboard/student/profile"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Profile
                  </a>
                </>
              )}

              {role === "tutor" && (
                <>
                  <a
                    href="/dashboard/tutor"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Tutor Dashboard
                  </a>
                  <a
                    href="/dashboard/tutor/classes"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    My Classes
                  </a>
                  <a
                    href="/dashboard/tutor/students"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Assigned Students
                  </a>
                  <a
                    href="/dashboard/tutor/one-to-one"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    1‑to‑1 Sessions
                  </a>
                  <a
                    href="/dashboard/tutor/resources"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Teaching Resources
                  </a>
                  <a
                    href="/dashboard/tutor/profile"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Profile
                  </a>
                </>
              )}

              {role === "admin" && (
                <>
                  <a
                    href="/dashboard/admin"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Admin Overview
                  </a>
                  <a
                    href="/dashboard/admin/courses"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Manage Courses
                  </a>
                  <a
                    href="/dashboard/admin/students"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Manage Students
                  </a>
                  <a
                    href="/dashboard/admin/tutors"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Manage Tutors
                  </a>
                  <a
                    href="/dashboard/admin/assignments"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Assign Tutors &amp; 1‑to‑1
                  </a>
                  <a
                    href="/dashboard/admin/payments"
                    className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
                  >
                    Payments &amp; Enrollments
                  </a>
                </>
              )}

              {/* Common link */}
              <a
                href="/"
                className="block py-2.5 px-4 text-[#512d7c] hover:bg-[#f2b42c]/10 rounded-lg transition"
              >
                Back to Home
              </a>
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
