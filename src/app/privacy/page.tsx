import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DGG Academy",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#512d7c] mb-6">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-gray-700 mb-8">
          This Privacy Policy explains how DGG Academy collects, uses, and protects your personal information when you use our learning platform, services, and website.
        </p>

        <div className="space-y-8 text-sm sm:text-base text-gray-800">
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect information that you provide directly to us when you create an account, enroll in a course, contact support, or interact with our content. This may include your name, email address, phone number, profile details, and learning preferences.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to create and manage your account, deliver courses and learning content, process payments (where applicable), communicate with you about updates, and improve our platform and services.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              3. Cookies and Analytics
            </h2>
            <p>
              We may use cookies and similar technologies to remember your preferences, keep you signed in, and understand how learners use our platform so we can improve performance and experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              4. Data Sharing and Third Parties
            </h2>
            <p>
              We do not sell your personal data. We may share limited information with trusted service providers (such as payment processors, analytics tools, or email services) who help us operate the platform, under appropriate data protection safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              5. Data Security
            </h2>
            <p>
              We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, misuse, or alteration. However, no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              6. Your Rights and Choices
            </h2>
            <p>
              You may update your account details, request access to your data, or ask us to delete certain information, subject to legal and contractual obligations. You can also opt out of non‑essential marketing emails at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              7. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the “Last updated” date and, where appropriate, notify you through the platform or by email.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              8. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at{" "}
              <a href="mailto:support@dglobalgrowthfield.com" className="text-[#512d7c] underline">
                support@dglobalgrowthfield.com
              </a>.
            </p>
          </section>
        </div>

        <p className="mt-10 text-xs text-gray-500">
          Last updated: {new Date().getFullYear()}
        </p>
      </section>
    </main>
  );
}
