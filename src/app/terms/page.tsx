import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | D-Global Growthfield Limited",
  description:
    "Comprehensive terms governing D-Global Growthfield, DGG Academy LMS, Youth Nexus, Campus Media Streaming, and Enterprise Technology Retainers.",
};

const SECTIONS = [
  { id: "scope", title: "01. Ecosystem Scope & Authority" },
  { id: "accounts", title: "02. Account Roles & Portal Security" },
  { id: "tuition", title: "03. Tuition, Bundles & Refund Governance" },
  { id: "curriculum", title: "04. Curricular Progression & Certifications" },
  { id: "internship", title: "05. 4-Month Incubation & Client Code Ownership" },
  { id: "placement", title: "06. Talent Placement & 10% Retainer Commission" },
  { id: "b2b", title: "07. B2B Enterprise & White-Label LMS Hosting" },
  { id: "corporate", title: "08. CAC & Business Compliance Filings" },
  { id: "broadcast", title: "09. Broadcast Media, Campus Radio & Giveaways" },
  { id: "ip", title: "10. Intellectual Property & Brand Assets" },
  { id: "conduct", title: "11. Youth Nexus Community & Anti-Harassment" },
  { id: "privacy", title: "12. NDPR Compliance & Student Records" },
  { id: "liability", title: "13. Infrastructure Disclaimers & Uptime" },
  { id: "governing", title: "14. Governing Law & Dispute Resolution" },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans antialiased">
      {/* Top Brand Header */}
      <header className="bg-gradient-to-r from-[#1A0B2E] via-[#3B0764] to-[#512D7C] text-white border-b-4 border-[#F2B42C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B42C]/20 border border-[#F2B42C]/40 text-[#F2B42C] text-xs font-semibold uppercase tracking-wider mb-4">
            Official Legal Document • 2026 Edition
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Terms of Service & Ecosystem Rules
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-lg max-w-3xl leading-relaxed">
            Please read these terms carefully before accessing the D-Global Growthfield Limited platform, our proprietary LMS portals, physical training labs, broadcast media streams, or enterprise client pipelines.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <span>Last Updated: August 2026</span>
            <span>•</span>
            <span>Registration: RC - Federal Republic of Nigeria</span>
            <span>•</span>
            <span>Jurisdiction: Lagos & Ogun State</span>
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
              <p className="font-semibold text-slate-800">Support Desk</p>
              <p className="mt-1">admin@dglobalgrowthfield.com</p>
              <p>Lagos & Abeokuta Offices, Nigeria</p>
            </div>
          </aside>

          {/* Right Main Content Sections */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-sm space-y-12 text-sm sm:text-base leading-relaxed text-slate-700">
            
            {/* Section 1 */}
            <section id="scope" className="scroll-mt-10">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 01</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                01. Ecosystem Scope & Legal Authority
              </h2>
              <p className="mb-3">
                These Terms of Service (&ldquo;Terms&rdquo;) represent an enforceable corporate contract between you (&ldquo;User,&rdquo; &ldquo;Student,&rdquo; &ldquo;Intern,&rdquo; or &ldquo;Client&rdquo;) and <strong>D-Global Growthfield Limited</strong> (&ldquo;DGG,&rdquo; &ldquo;Company,&rdquo; &ldquo;we,&rdquo; or &ldquo;our&rdquo;), duly incorporated under the Companies and Allied Matters Act of Nigeria.
              </p>
              <p>
                These terms govern your digital and physical engagement across all DGG operational divisions:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Proprietary LMS Platform:</strong> <code>learning.dglobalgrowthfield.com</code> and sub-nodes.</li>
                <li><strong>Media & Cloud Broadcast Architecture:</strong> <code>live.dglobalgrowthfield.com</code> and campus audio syndication.</li>
                <li><strong>Internal Tooling:</strong> <code>seo.dglobalgrowthfield.com</code> and allied digital optimization apps.</li>
                <li><strong>Physical Innovation Labs:</strong> On-ground incubation facilities across Lagos and Abeokuta.</li>
                <li><strong>Enterprise B2B Engagements:</strong> Custom SaaS engineering, business compliance, and talent deployment retainers.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="accounts" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 02</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                02. Account Roles & Portal Security
              </h2>
              <p className="mb-3">
                DGG implements a strict triple-dashboard role-based security hierarchy (Admin, Tutor, Learner). Users are mandated to maintain absolute confidentiality of their authentication keys and tokens.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#3B0764] text-xs uppercase mb-1">Student Accounts</p>
                  <p className="text-xs text-slate-600">Strictly non-transferable. Multi-device simultaneous credential streaming or account proxying triggers automated system revocation.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="font-bold text-[#3B0764] text-xs uppercase mb-1">Tutor Dashboards</p>
                  <p className="text-xs text-slate-600">Access limited to assigned cohorts. Unauthorized extraction of student personal contact records or grading data is actionable under civil law.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="tuition" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 03</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                03. Tuition Bundles, Payments & Refund Policy
              </h2>
              <p className="mb-3">
                Enrollment into DGG Academy curricula (such as our foundational 8-course Prep Bundle or specialized full-stack engineering cohorts) constitutes an immediate commitment of infrastructure capacity, cloud servers, and mentor hours.
              </p>
              <div className="bg-amber-50 border-l-4 border-[#F2B42C] p-4 my-4 text-xs sm:text-sm text-amber-900 rounded-r-lg">
                <strong>Strict Non-Refundability Policy:</strong> All digital course fees, onboarding retainers, and workshop access passes are 100% non-refundable once portal login credentials have been issued or live classroom links transmitted.
              </div>
              <p className="text-xs text-slate-600">
                In cases of verified medical or national emergency, learners may apply in writing for a one-time cohort deferral to the subsequent tri-annual loop, subject to administrative approval.
              </p>
            </section>

            {/* Section 4 */}
            <section id="curriculum" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 04</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                04. Curricular Progression & Verifiable Credentials
              </h2>
              <p className="mb-3">
                Certification is an earned indicator of production competence, not a participation award. To graduate and receive a verifiable DGG digital transcript, candidates must:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Maintain a minimum of 80% attendance in scheduled cohort sessions.</li>
                <li>Score at least 75% across automated LMS milestone assessments and coding labs.</li>
                <li>Submit an approved, publicly deployed capstone codebase evaluated by senior engineers.</li>
              </ul>
              <p className="mt-3 text-xs text-slate-600">
                Transcripts and certificates are registered with unique cryptographic hash identifiers queryable on DGG verification platforms by third-party corporate employers.
              </p>
            </section>

            {/* Section 5 */}
            <section id="internship" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 05</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                05. 4-Month Incubation & Enterprise Code Ownership
              </h2>
              <p className="mb-3">
                Our flagship model operates as a 4-month loop: 3 months of rigorous foundational training followed by 1 month of live client project incubation.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li><strong>Non-Disclosure Agreement (NDA):</strong> Interns placed on live enterprise builds (such as enterprise systems, Agrobuoy marketplace apps, or streaming APIs) are strictly bound to protect client databases, business secrets, and backend architecture.</li>
                <li><strong>Intellectual Property of Work Product:</strong> All production code, mockups, server configurations, and database schemas developed during the 1-month live incubation phase are the exclusive intellectual property of D-Global Growthfield Limited and its contracting B2B clients.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="placement" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 06</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                06. Talent Placement & 10% Retainer Commission
              </h2>
              <p className="mb-3">
                Through our Youth Nexus network, DGG bridges vetted graduates directly to international recruiters, online business owners, and tech CEOs seeking remote engineering, UI/UX, and Virtual Assistant (VA) talent.
              </p>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-2 text-xs sm:text-sm text-purple-950">
                <p className="font-bold">The 10% Placement Framework:</p>
                <p>
                  When DGG directly facilitates, brokers, or matches an intern into a paid corporate placement or remote retainer, an ongoing <strong>10% placement management fee</strong> applies to the contract monthly gross remuneration for the agreed facilitation duration.
                </p>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                DGG provides continuous career mentorship, contract mediation, and performance benchmarking during active placement engagements.
              </p>
            </section>

            {/* Section 7 */}
            <section id="b2b" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 07</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                07. B2B Enterprise & White-Label LMS Hosting
              </h2>
              <p className="mb-3">
                For corporate clients licensing DGG&apos;s white-label LMS software or contracting bespoke SaaS development:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>Service Level Agreement (SLA):</strong> We target a 99.5% uptime on hosted LMS cloud infrastructure, excluding planned maintenance windows.</li>
                <li><strong>Data Segregation:</strong> Multi-tenant client environments maintain strict logical database separation to guarantee zero enterprise data leakage.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="corporate" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 08</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                08. CAC & Business Compliance Filings
              </h2>
              <p>
                Clients engaging DGG for Corporate Affairs Commission (CAC) incorporations, Tax Identification Number (TIN) activation, VAT compliance, or trademark protections agree that DGG acts solely as a professional documentation facilitator. All statutory approvals remain at the discretion of federal regulatory authorities.
              </p>
            </section>

            {/* Section 9 */}
            <section id="broadcast" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 09</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                09. Broadcast Media, Campus Radio & Giveaways
              </h2>
              <p className="mb-3">
                DGG operates proprietary cloud radio software and broadcasts weekly on commercial partner channels (including Sweet FM 107.1 Abeokuta and Top Radio 90.9 FM Lagos).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                <li><strong>On-Air Rewards:</strong> Giveaways including mobile internet data bundles, airtime, and LMS prep scholarships are promotional awards, non-convertible to cash.</li>
                <li><strong>Content Rights:</strong> Audio contributions, questions, or calls made during public live broadcasts may be recorded, syndicated, or distributed across DGG media channels without royalty obligations.</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="ip" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 10</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                10. Intellectual Property & Brand Assets
              </h2>
              <p>
                The DGG logo, proprietary course curriculum slides, video masterclasses, system architecture diagrams, and domain assets are the exclusive intellectual property of D-Global Growthfield Limited. Unauthorized screen recording, torrenting, resale, or decompiling of software is strictly actionable under the Nigerian Copyright Act.
              </p>
            </section>

            {/* Section 11 */}
            <section id="conduct" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 11</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                11. Youth Nexus Community & Anti-Harassment
              </h2>
              <p>
                Our digital community hubs (Telegram, Discord, LMS forums, and campus hubs) are safe spaces for professional growth. We maintain zero tolerance for hate speech, cyber-bullying, crypto scams, or unsolicited commercial messaging. Violations result in immediate banishment and revocation of talent verification status.
              </p>
            </section>

            {/* Section 12 */}
            <section id="privacy" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 12</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                12. NDPR Compliance & Student Records
              </h2>
              <p>
                In compliance with the Nigeria Data Protection Act (NDPA) and NDPR standards, DGG encrypts all learner personal identifiers, project submissions, and payment records. Student evaluation data is only shared with prospective employer partners upon express student authorization during active placement recruitment.
              </p>
            </section>

            {/* Section 13 */}
            <section id="liability" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 13</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                13. Infrastructure Disclaimers & Uptime
              </h2>
              <p>
                While our systems are engineered for low-data latency across Nigerian 3G/4G networks, DGG is not responsible for localized telecom carrier disruptions, regional electrical power outages, or hardware failures on the user&apos;s personal device.
              </p>
            </section>

            {/* Section 14 */}
            <section id="governing" className="scroll-mt-10 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">Pillar 14</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-1 mb-4">
                14. Governing Law & Dispute Resolution
              </h2>
              <p className="mb-3">
                These Terms are governed entirely by the laws of the Federal Republic of Nigeria. In the event of any operational or contract dispute:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
                <li>Parties shall first attempt amicable settlement via executive mediation within 30 days.</li>
                <li>Unresolved disputes shall be submitted to binding arbitration in Lagos State, Nigeria, under the Arbitration and Mediation Act.</li>
              </ol>
            </section>

            {/* Contact Support Footer */}
            <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1A0B2E] to-[#3B0764] text-white border border-[#F2B42C]/40">
              <h3 className="text-lg font-bold text-[#F2B42C] mb-2">
                Have Legal or Operational Inquiries?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Our operations team is available to assist enterprise partners, students, and institutional fellows regarding contract compliance.
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

          </div>
        </div>
      </div>

      {/* Global Bottom Banner */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 D-Global Growthfield Limited. All rights reserved. Operating across Lagos & Ogun State, Nigeria.</p>
      </footer>
    </main>
  );
}