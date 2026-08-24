import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | D-Global Growthfield Limited",
  description:
    "Data privacy and protection framework governing D-Global Growthfield Limited, DGG Academy, Youth Nexus, and our talent deployment pipelines under NDPA & NDPR regulations.",
};

const SECTIONS = [
  { id: "overview", title: "01. Governance & Regulatory Framework" },
  { id: "collection", title: "02. Categories of Information Collected" },
  { id: "usage", title: "03. Purpose & Legal Basis of Processing" },
  { id: "lms-tracking", title: "04. LMS Analytics, Assessments & Code Repos" },
  { id: "recruitment", title: "05. Employer Disclosure & Placement Matching" },
  { id: "broadcast", title: "06. Broadcast Media & Radio Giveaways" },
  { id: "b2b-data", title: "07. Enterprise Clients & CAC Document Handling" },
  { id: "security", title: "08. Cryptographic Security & Data Storage" },
  { id: "retention", title: "09. Data Retention & Transcript Archives" },
  { id: "rights", title: "10. User Rights Under Nigeria Data Protection Act" },
  { id: "cookies", title: "11. Cookie Directives & Tracking Technologies" },
  { id: "contact", title: "12. Data Protection Officer (DPO) Contact" },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans antialiased">
      {/* Top Brand Header */}
      <header className="bg-gradient-to-r from-[#1A0B2E] via-[#3B0764] to-[#512D7C] text-white border-b-4 border-[#F2B42C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B42C]/20 border border-[#F2B42C]/40 text-[#F2B42C] text-xs font-semibold uppercase tracking-wider mb-4">
            Official Privacy Directive • 2026 Edition
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Privacy & Data Governance Policy
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-lg max-w-3xl leading-relaxed">
            How D-Global Growthfield Limited collects, safeguards, encrypts, and processes personal and telemetry data across our LMS portals, broadcast platforms, campus nodes, and corporate service suites.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <span>Last Updated: August 2026</span>
            <span>•</span>
            <span>Compliance: Nigeria Data Protection Act (NDPA) / NDPR</span>
            <span>•</span>
            <span>Data Controller: D-Global Growthfield Limited</span>
          </div>
        </div>
      </header>

      {/* Main Dual-Column Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Sticky Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Table of Contents
            </h3>
            <nav className="space-y-1 text-xs">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block py-2 px-3 rounded-lg text-slate-600 hover:text-[#512D7C] hover:bg-slate-50 transition-colors font-medium"
                >
                  {sec.title}
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-500">
              <p className="font-semibold text-slate-800">Privacy & Compliance Desk</p>
              <p className="mt-1">admin@dglobalgrowthfield.com</p>
              <p>Lagos & Abeokuta Regional Hubs, Nigeria</p>
            </div>
          </aside>

          {/* Right Main Content Sections */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-sm space-y-12 text-sm sm:text-base leading-relaxed text-slate-700">
            
            {/* Section 1 */}
            <section id="overview" className="scroll-mt-10">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 01</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                01. Governance & Regulatory Framework
              </h2>
              <p className="mb-3">
                <strong>D-Global Growthfield Limited</strong> (&ldquo;DGG,&rdquo; &ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) prioritizes the fundamental right to privacy for every learner, corporate client, intern, and community member.
              </p>
              <p>
                This Privacy Policy delineates our protocols for collecting, processing, storing, and safeguarding your information in full compliance with the <strong>Nigeria Data Protection Act (NDPA 2023)</strong> and the Nigeria Data Protection Regulation (NDPR). This policy covers all digital touchpoints including <code>learning.dglobalgrowthfield.com</code>, <code>live.dglobalgrowthfield.com</code>, <code>seo.dglobalgrowthfield.com</code>, and our physical facilities in Lagos and Abeokuta.
              </p>
            </section>

            {/* Section 2 */}
            <section id="collection" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 02</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                02. Categories of Information Collected
              </h2>
              <p className="mb-4">
                Depending on how you engage with the DGG ecosystem, we process the following categories of data:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#3B0764] uppercase mb-1">Direct Identity Data</p>
                  <p className="text-slate-600">Full legal names, email addresses, phone numbers, state of residence, portfolio GitHub URLs, and government ID numbers (where required for CAC or talent verification).</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#3B0764] uppercase mb-1">Academic & Technical Telemetry</p>
                  <p className="text-slate-600">LMS lesson progress, quiz scores, automated assessment logs, codebase submissions, attendance records, and tutor milestone grading.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#3B0764] uppercase mb-1">Transaction & Billing Data</p>
                  <p className="text-slate-600">Payment timestamps, currency amounts, payment gateway reference tokens (Paystack/Flutterwave/Monnify), and invoicing billing addresses.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#3B0764] uppercase mb-1">Broadcast & Community Data</p>
                  <p className="text-slate-600">Radio call-in phone logs, giveaway beneficiary mobile lines, campus radio chat handles, and Telegram/Discord community IDs.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="usage" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 03</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                03. Purpose & Legal Basis of Processing
              </h2>
              <p className="mb-3">
                We process your personal information exclusively under legitimate legal grounds recognized by data protection statutes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li><strong>Contractual Execution:</strong> Provisioning LMS portal access, allocating cohort tutors, and administering the 4-month practical incubation curriculum.</li>
                <li><strong>Legitimate Interests:</strong> Hardening software infrastructure against malicious brute-force attempts, optimizing low-bandwidth performance, and tracking learner completion benchmarks.</li>
                <li><strong>Legal & Regulatory Compliance:</strong> Filing statutory Corporate Affairs Commission (CAC) incorporations, generating tax invoices, and satisfying accounting audits.</li>
                <li><strong>Explicit Consent:</strong> Broadcasting promotional learner spotlights, distributing airtime/data rewards, and sharing portfolios with corporate hiring partners.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="lms-tracking" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 04</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                04. LMS Analytics, Assessments & Code Repositories
              </h2>
              <p className="mb-3">
                Our proprietary learning management system tracks student activity to guarantee program rigor and deliver actionable insights:
              </p>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-xs sm:text-sm text-purple-950">
                <p className="font-bold">Evaluation Logs & Milestone Rubrics:</p>
                <p>
                  We store assessment records, capstone project repositories, and peer code reviews to generate cryptographically verifiable digital transcripts. These transcripts remain accessible via unique identifier queries on our public verification endpoints.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="recruitment" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 05</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                05. Employer Disclosure & Placement Matching
              </h2>
              <p className="mb-3">
                During the talent placement phase of our 4-month loop, DGG acts as a curated bridge connecting graduates to vetted tech executives, startups, and international freelance channels:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>We only transmit technical portfolios, project builds, and verified skill scores to hiring partners with prior student consent.</li>
                <li>We do not sell candidate contact lists to third-party marketing brokers.</li>
                <li>Hiring companies engaging via our 10% placement model are contractually mandated to use student records solely for recruitment evaluations.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="broadcast" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 06</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                06. Broadcast Media & Radio Giveaways
              </h2>
              <p className="mb-3">
                DGG broadcasts live interactive programs across regional radio channels (Top Radio 90.9 FM Lagos, Sweet FM 107.1 Abeokuta) and our digital campus streaming network:
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                Phone numbers submitted during on-air call-ins or SMS quiz entries are used strictly to disburse mobile internet data bundles, airtime credits, or LMS scholarship tokens. These contact details are not repurposed for unsolicited external campaigns.
              </p>
            </section>

            {/* Section 7 */}
            <section id="b2b-data" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 07</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                07. Enterprise Clients & CAC Document Handling
              </h2>
              <p className="mb-3">
                For commercial clients contracting DGG for Corporate Affairs Commission (CAC) filings, TIN setups, or custom enterprise software development:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Government identity numbers, director resolutions, and signature cards are transmitted solely via encrypted pipelines to statutory portals.</li>
                <li>Enterprise source code, API keys, and database credentials provided for system development remain strictly isolated within zero-knowledge workspaces.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="security" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 08</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                08. Cryptographic Security & Data Storage
              </h2>
              <p className="mb-3">
                We maintain high-standard security architectures across our server infrastructure:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#3B0764] mb-1">Encryption Standards</p>
                  <p className="text-slate-600">All data in transit is protected using TLS 1.3 encryption. Sensitive user authentication keys and passwords are encrypted at rest with industry-standard bcrypt hashing.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#3B0764] mb-1">Role-Based Access Control</p>
                  <p className="text-slate-600">Database rows are partitioned logically with role-based access rules, ensuring tutors, students, and administrators only access permissible data slices.</p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section id="retention" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 09</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                09. Data Retention & Transcript Archives
              </h2>
              <p className="text-xs sm:text-sm">
                Student academic performance logs and certificate hashes are retained permanently in cold storage to facilitate third-party credential verification by prospective employers throughout the learner&apos;s career. Marketing contact logs and unverified accounts are purged after 24 months of total inactivity.
              </p>
            </section>

            {/* Section 10 */}
            <section id="rights" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 10</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                10. User Rights Under Nigeria Data Protection Act
              </h2>
              <p className="mb-3">
                Under the NDPA 2023 and NDPR, you possess fundamental rights regarding your data:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Right to Access:</strong> Request a full digital export of all personal data held in our systems.</li>
                <li><strong>Right to Rectification:</strong> Update or correct inaccurate profile details or portfolio records.</li>
                <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> Request total account deletion, subject to statutory accounting and legal retention prerequisites.</li>
                <li><strong>Right to Object:</strong> Opt out of marketing notifications and weekly ecosystem newsletters at any time.</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section id="cookies" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 11</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                11. Cookie Directives & Tracking Technologies
              </h2>
              <p className="text-xs sm:text-sm">
                We employ lightweight session tokens and essential functional cookies to keep you signed into the LMS, preserve your active code playground state, and record bandwidth performance across 3G/4G connections. We do not deploy cross-site tracking pixels or sell ad-retargeting profiles.
              </p>
            </section>

            {/* Section 12 */}
            <section id="contact" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Directive 12</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                12. Data Protection Officer (DPO) Contact
              </h2>
              <p className="mb-4 text-xs sm:text-sm">
                To exercise any of your statutory data rights, report a data concern, or request record modification, contact our dedicated compliance desk:
              </p>
              
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1A0B2E] to-[#3B0764] text-white border border-[#F2B42C]/40">
                <h3 className="text-lg font-bold text-[#F2B42C] mb-2">
                  Data Protection & Privacy Desk
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">
                  D-Global Growthfield Limited • Compliance Department
                </p>
                <div className="flex flex-wrap gap-y-3 gap-x-6 text-xs font-semibold">
                  <a href="mailto:admin@dglobalgrowthfield.com" className="hover:text-[#F2B42C] transition-colors">
                    admin@dglobalgrowthfield.com
                  </a>
                  <span>•</span>
                  <span>+234 912 492 3196</span>
                  <span>•</span>
                  <Link href="https://learning.dglobalgrowthfield.com" className="hover:text-[#F2B42C] transition-colors">
                    learning.dglobalgrowthfield.com
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Global Bottom Banner */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 D-Global Growthfield Limited. All rights reserved. Registered under Nigerian Corporate Law.</p>
      </footer>
    </main>
  );
}