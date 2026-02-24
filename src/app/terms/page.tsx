import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | DGG Academy",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#512d7c] mb-6">
          Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-gray-700 mb-8">
          These Terms of Service govern your use of the DGG Academy platform, courses, and related services. By creating an account or using our website, you agree to these terms.
        </p>

        <div className="space-y-8 text-sm sm:text-base text-gray-800">
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              1. Who We Are
            </h2>
            <p>
              DGG Academy is a hybrid learning platform that provides digital skills, career training, and tutoring through online and in‑person experiences.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              2. Using Our Platform
            </h2>
            <p>
              You agree to use the platform for lawful purposes only and to respect other learners, tutors, and staff. You are responsible for keeping your login details secure and for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              3. Accounts, Access and Payments
            </h2>
            <p>
              Some content and programs may be free, while others may require payment or enrollment. Where payments apply, you agree to provide accurate billing information and to comply with any course‑specific policies shared with you.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              4. Content and Intellectual Property
            </h2>
            <p>
              All course materials, videos, documents, and resources are owned by DGG Academy or our partners and are provided for your personal learning use only. You may not copy, resell, or publicly distribute our content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              5. Student and Tutor Conduct
            </h2>
            <p>
              We expect professional, respectful conduct in all classes, chats, and communities. Abusive language, harassment, or misuse of the platform may result in suspension or termination of your access.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              6. Disclaimers and Limitation of Liability
            </h2>
            <p>
              We aim to provide high‑quality learning experiences, but we do not guarantee any specific grades, job outcomes, or income results. To the maximum extent permitted by law, DGG Academy is not liable for indirect or consequential losses arising from use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              7. Changes to Services and Terms
            </h2>
            <p>
              We may update courses, features, or these Terms from time to time. When material changes are made, we will update the “Last updated” date and may notify you via email or in‑app notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-[#512d7c] mb-2">
              8. Contact and Support
            </h2>
            <p>
              For questions about these Terms or any issue with your account, please contact us at{" "}
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
