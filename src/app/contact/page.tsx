"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createBrowser } from "@/lib/supabase-client";

const INQUIRY_TYPES = [
  "Academy & 4-Month Internship",
  "B2B Software & SaaS Engineering",
  "CAC & Corporate Compliance",
  "Media, Radio & Campus Syndication",
  "Recruiter & Talent Matching",
  "General Inquiries",
];

const LOCATIONS = [
  {
    city: "Lagos Hub",
    state: "Lagos State, Nigeria",
    focus: "Executive Operations, Corporate Client Engineering & Media Partnerships",
    contact: "admin@dglobalgrowthfield.com",
  },
  {
    city: "Abeokuta Hub",
    state: "Ogun State, Nigeria",
    focus: "Hybrid Training Labs, Youth Incubation & Broadcast Operations",
    contact: "support@dglobalgrowthfield.com",
  },
];

export default function ContactPageClient() {
  const supabase = createBrowser();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!fullName || !email || !message) {
      setStatus("error");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("contact_messages").insert({
        name: fullName,
        email,
        phone,
        inquiry_type: inquiryType,
        subject: subject || inquiryType,
        message,
      });

      if (error) {
        console.error(error);
        setStatus("error");
      } else {
        setStatus("success");
        setFullName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans antialiased">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-[#1A0B2E] via-[#3B0764] to-[#512D7C] text-white border-b-4 border-[#F2B42C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B42C]/20 border border-[#F2B42C]/40 text-[#F2B42C] text-xs font-semibold uppercase tracking-wider mb-4">
              Direct Access Channels • Lagos & Abeokuta
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Connect With Our Executive & Engineering Teams
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-lg leading-relaxed">
              Whether you are an enterprise partner scaling custom software, a prospective learner joining our 4-month practical incubation loop, or a recruiter seeking vetted engineering talent—we are ready to collaborate.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Quick Channels & Direct Regional Nodes (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Direct Channel Cards */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[#3B0764] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F2B42C]"></span>
                Direct Communication Desks
              </h2>

              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Executive & Institutional Partnerships</p>
                  <a href="mailto:admin@dglobalgrowthfield.com" className="text-sm sm:text-base font-bold text-[#512D7C] hover:underline block mt-0.5">
                    admin@dglobalgrowthfield.com
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Enterprise retainers, SaaS inquiries, and bilateral trade alliances.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Academy, LMS & Student Support</p>
                  <a href="mailto:support@dglobalgrowthfield.com" className="text-sm sm:text-base font-bold text-[#512D7C] hover:underline block mt-0.5">
                    support@dglobalgrowthfield.com
                  </a>
                  <p className="text-xs text-slate-500 mt-1">Cohorts, 4-month internships, certifications, and portal access.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Direct Voice & WhatsApp Desk</p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">+234 (0912) 492 3196</p>
                  <p className="text-xs text-slate-500 mt-1">Monday – Saturday: 9:00 AM – 6:00 PM (WAT)</p>
                </div>
              </div>
            </div>

            {/* Regional Hubs Box */}
            <div className="bg-[#1A0B2E] text-white p-6 sm:p-8 rounded-2xl border border-[#3B0764] shadow-sm">
              <h3 className="text-base font-bold text-[#F2B42C] mb-4 uppercase tracking-wider text-xs">
                Physical Innovation Hubs
              </h3>
              <div className="space-y-4">
                {LOCATIONS.map((loc, idx) => (
                  <div key={idx} className="border-l-2 border-[#F2B42C] pl-4 py-1">
                    <p className="font-bold text-sm text-white">{loc.city}</p>
                    <p className="text-xs text-slate-400">{loc.state}</p>
                    <p className="text-xs text-slate-300 mt-1 leading-normal">{loc.focus}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap gap-4 text-xs">
                <Link href="https://learning.dglobalgrowthfield.com" className="text-[#F2B42C] hover:underline">
                  LMS Portal ↗
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="https://live.dglobalgrowthfield.com" className="text-[#F2B42C] hover:underline">
                  Live Media Portal ↗
                </Link>
                <span className="text-slate-600">•</span>
                <Link href="https://seo.dglobalgrowthfield.com" className="text-[#F2B42C] hover:underline">
                  SEO Suite ↗
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Intake Terminal Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
              <div className="mb-8">
                <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Direct Intake Form</span>
                <h2 className="text-2xl font-bold text-[#3B0764] mt-1">Send a Message or Project Request</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Complete the parameters below. Your submission routes straight into our system queue for timely follow-up.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                
                {/* Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Scorefield Bello"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#512D7C] focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">
                      Corporate or Personal Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#512D7C] focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>

                {/* Phone Number & Inquiry Pillar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">
                      WhatsApp / Phone Contact
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 ..."
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#512D7C] focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">
                      Engagement Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#512D7C] focus:border-transparent transition-all text-sm"
                    >
                      {INQUIRY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">
                    Subject / Objective
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Briefly state your primary objective..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#512D7C] focus:border-transparent transition-all placeholder:text-slate-400 text-sm"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5 text-xs uppercase tracking-wide">
                    Detailed Message or Specification <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details regarding your inquiry, technical scope, cohort batch, or operational requirements..."
                    className="w-full rounded-xl border border-slate-300 p-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#512D7C] focus:border-transparent transition-all placeholder:text-slate-400 text-sm leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#3B0764] to-[#512D7C] text-white font-bold tracking-wide hover:opacity-95 transition-opacity disabled:opacity-50 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                >
                  {loading ? (
                    <span>Processing Submission...</span>
                  ) : (
                    <span>Transmit Message to Executive Desk →</span>
                  )}
                </button>

                {/* Feedback Alerts */}
                {status === "success" && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
                    <strong>Message Transmitted Successfully:</strong> Our operations desk has received your submission and will respond via email or WhatsApp promptly.
                  </div>
                )}

                {status === "error" && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
                    <strong>Transmission Error:</strong> Please verify your input parameters and ensure required fields are completed.
                  </div>
                )}
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Encrypted Client Submission</span>
                <span>Response Window: &lt; 24 Hours</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Global Bottom Banner */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 D-Global Growthfield Limited. All rights reserved. Registered under Nigerian Corporate Law.</p>
      </footer>
    </main>
  );
}