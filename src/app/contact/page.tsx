"use client";

import { FormEvent, useState } from "react";
import { createBrowser } from "@/lib/supabase-client";

export default function ContactPageClient() {
  const supabase = createBrowser();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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
        subject,
        message,
      });

      if (error) {
        console.error(error);
        setStatus("error");
      } else {
        setStatus("success");
        setFullName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#512d7c] mb-4">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-gray-700 mb-8">
          Have a question about our programs, batches, or partnership opportunities? Reach out and our team will get back to you as soon as possible.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact details */}
          <div className="space-y-5 text-sm sm:text-base text-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-[#512d7c] mb-1">
                Email
              </h2>
              <p>
                General enquiries:{" "}
                <a
                  href="mailto:support@dglobalgrowthfield.com"
                  className="text-[#512d7c] underline"
                >
                  support@dglobalgrowthfield.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#512d7c] mb-1">
                Phone / WhatsApp
              </h2>
              <p>+234 (0912) 492 3196</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#512d7c] mb-1">
                Location
              </h2>
              <p>Abeokuta, Nigeria (Hybrid: Online + In‑Person Sessions)</p>
              <p>Lagos, Nigeria (Hybrid: Online + In‑Person Sessions)</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#512d7c] mb-1">
                Support Hours
              </h2>
              <p>Monday – Saturday, 9:00 AM – 6:00 PM (WAT)</p>
            </div>
          </div>

          {/* Contact form hooked to Supabase */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-4">
              Send us a message
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#512d7c] focus:border-[#512d7c]"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#512d7c] focus:border-[#512d7c]"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#512d7c] focus:border-[#512d7c]"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#512d7c] focus:border-[#512d7c]"
                  placeholder="Tell us more about what you need..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#512d7c] text-white text-sm sm:text-base font-semibold py-2.5 rounded-full hover:bg-[#3b215c] transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {status === "success" && (
                <p className="text-xs text-green-600 mt-2">
                  Thank you! Your message has been received.
                </p>
              )}
              {status === "error" && (
                <p className="text-xs text-red-600 mt-2">
                  Something went wrong. Please check your details and try again.
                </p>
              )}
            </form>

            <p className="mt-3 text-xs text-gray-500">
              Messages are securely stored in our system so the team can follow up with you.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
