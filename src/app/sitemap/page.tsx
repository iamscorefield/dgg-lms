import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Platform Sitemap & Ecosystem Directory | DGG Academy",
  description:
    "Comprehensive architectural sitemap of DGG Academy, LMS course tracks, 4-month internship engine, enterprise services, and campus streaming nodes.",
};

interface MapItem {
  title: string;
  description: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

interface MapCategory {
  category: string;
  tagline: string;
  accent: string;
  items: MapItem[];
}

const SITEMAP_DATA: MapCategory[] = [
  {
    category: "LMS Learning & Academy Tracks",
    tagline: "Foundational digital literacy, advanced engineering, and live cohort nodes.",
    accent: "border-[#512D7C]",
    items: [
      {
        title: "Foundational 8-Course Prep Program",
        description: "The ₦75,000 foundational prep track with live tutor pair sessions.",
        href: "/programs/prep-track",
        badge: "8 Modules",
      },
      {
        title: "Full-Stack Software Engineering",
        description: "Modern JavaScript, TypeScript, Next.js, Node.js, and SQL backend systems.",
        href: "/programs/fullstack-engineering",
        badge: "Advanced",
      },
      {
        title: "Product UI/UX & System Architecture",
        description: "Figma interface mechanics, user flow engineering, and design systems.",
        href: "/programs/ui-ux-design",
      },
      {
        title: "Executive Virtual Assistant (VA) Track",
        description: "Administrative workflow management, CRM automations, and executive remote support.",
        href: "/programs/virtual-assistant",
        badge: "High Demand",
      },
      {
        title: "Learner Portal & Dashboard",
        description: "Authenticated workspace for module streaming, quizzes, and live tutor calls.",
        href: "/dashboard/student",
      },
      {
        title: "Tutor & Mentor Hub",
        description: "Instructional rubrics, student assignment evaluation, and cohort performance logs.",
        href: "/dashboard/tutor",
      },
    ],
  },
  {
    category: "4-Month Internship Engine & Incubation",
    tagline: "Tri-annual loops transforming students into market-ready builders.",
    accent: "border-[#F2B42C]",
    items: [
      {
        title: "Internship Engine Overview",
        description: "3 months practical tech training + 1 month live incubation cycle.",
        href: "/internship",
        badge: "3 Batches / Year",
      },
      {
        title: "Live Incubation Project Room",
        description: "Hands-on client software execution, API integration, and code audits.",
        href: "/internship/incubation-lab",
      },
      {
        title: "Youth Nexus Career Network",
        description: "Global marketplace bridging graduates to Upwork, tech CEOs, and remote founders.",
        href: "/youth-nexus",
      },
      {
        title: "10% Placement Commission Portal",
        description: "Talent matching facilitation agreements for enterprise recruiters and interns.",
        href: "/talent-placement",
      },
      {
        title: "Public Credential & Transcript Verification",
        description: "Cryptographic hash verification endpoint for employer background checks.",
        href: "/verify-certificate",
        badge: "Instant Verify",
      },
    ],
  },
  {
    category: "Enterprise Tech & B2B Solutions",
    tagline: "Custom software architectures, compliance, and corporate upskilling.",
    accent: "border-[#512D7C]",
    items: [
      {
        title: "Custom SaaS & Enterprise Architecture",
        description: "End-to-end full stack web platforms, database schema engineering, and API pipelines.",
        href: "https://dglobalgrowthfield.com/services/tech",
        isExternal: true,
      },
      {
        title: "CAC & Corporate Compliance Services",
        description: "Business registrations, TIN onboarding, VAT processing, and trademark filings.",
        href: "https://dglobalgrowthfield.com/services/compliance",
        isExternal: true,
      },
      {
        title: "Dedicated SEO Optimization Suite",
        description: "Proprietary internal search performance tools and keyword tracking.",
        href: "https://seo.dglobalgrowthfield.com",
        badge: "Utility Suite",
        isExternal: true,
      },
      {
        title: "Corporate Staff Upskilling & Custom LMS",
        description: "White-label corporate learning instances and enterprise syllabus tracking.",
        href: "/enterprise/upskilling",
      },
    ],
  },
  {
    category: "Broadcast Media & Campus Streaming",
    tagline: "Zero-CAC educational broadcasts and digital campus syndication.",
    accent: "border-[#F2B42C]",
    items: [
      {
        title: "Live Cloud Radio Streaming Engine",
        description: "Ultra-low-latency live web audio broadcasting infrastructure.",
        href: "https://live.dglobalgrowthfield.com",
        badge: "Live Audio",
        isExternal: true,
      },
      {
        title: "Commercial Radio Outreach Programs",
        description: "Weekly broadcasts across Sweet FM 107.1 (Abeokuta) and Top Radio 90.9 FM (Lagos).",
        href: "/media/radio-outreach",
      },
      {
        title: "Campus Digital Radio Network",
        description: "Interactive audio syndication for tertiary campuses and student unions.",
        href: "/media/campus-radio",
      },
      {
        title: "On-Air Giveaways & Data Bundle Hub",
        description: "Airtime, mobile data, and scholarship token disbursement registry.",
        href: "/media/giveaways",
      },
    ],
  },
  {
    category: "Institutional & Legal Governance",
    tagline: "Corporate structure, policies, physical hub directions, and compliance.",
    accent: "border-[#512D7C]",
    items: [
      {
        title: "Executive Contact & Intake Desk",
        description: "Direct routing to Lagos and Abeokuta administrative and engineering teams.",
        href: "/contact",
      },
      {
        title: "Terms of Service & Ecosystem Rules",
        description: "14-pillar legal framework governing academies, client NDAs, and placement fees.",
        href: "/terms",
      },
      {
        title: "Privacy & NDPA Data Governance",
        description: "Compliance directives protecting student records, transcripts, and telemetry.",
        href: "/privacy",
      },
      {
        title: "Lagos & Abeokuta Regional Hubs",
        description: "Physical lab locations, computer engineering suites, and visiting hours.",
        href: "/contact#locations",
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans antialiased">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-[#1A0B2E] via-[#3B0764] to-[#512D7C] text-white border-b-4 border-[#F2B42C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2B42C]/20 border border-[#F2B42C]/40 text-[#F2B42C] text-xs font-semibold uppercase tracking-wider mb-4">
              Structural Platform Index • System Map
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              D-Global Ecosystem Directory
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-lg leading-relaxed">
              Explore the complete architecture of D-Global Growthfield Limited. Access learning pathways, enterprise engineering portals, live campus audio streams, and talent deployment pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="space-y-12">
          {SITEMAP_DATA.map((section, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border-l-4 ${section.accent} border-t border-r border-b border-slate-200/80 p-6 sm:p-8 shadow-sm`}
            >
              {/* Category Header */}
              <div className="mb-6">
                <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">
                  Domain Segment 0{idx + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#3B0764] mt-0.5">
                  {section.category}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {section.tagline}
                </p>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, itemIdx) => {
                  const isExternal = item.isExternal || item.href.startsWith("http");
                  const content = (
                    <div className="h-full p-4 rounded-xl bg-slate-50 hover:bg-[#512D7C]/5 border border-slate-100 hover:border-[#512D7C]/20 transition-all duration-200 flex flex-col justify-between group">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-bold text-sm text-slate-800 group-hover:text-[#512D7C] transition-colors flex items-center gap-1.5">
                            {item.title}
                            {isExternal && (
                              <span className="text-[10px] text-slate-400 group-hover:text-[#512D7C]">↗</span>
                            )}
                          </h3>
                          {item.badge && (
                            <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F2B42C]/20 border border-[#F2B42C]/40 text-[#92400E]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-[#512D7C] font-semibold">
                        <span className="group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                          Navigate Resource →
                        </span>
                        <code className="text-[10px] font-mono text-slate-400 font-normal">
                          {item.href.replace("https://", "")}
                        </code>
                      </div>
                    </div>
                  );

                  return isExternal ? (
                    <a
                      key={itemIdx}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block h-full"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link key={itemIdx} href={item.href} className="block h-full">
                      {content}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Global Hub Footer Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#1A0B2E] text-white border border-[#3B0764] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#F2B42C] uppercase tracking-wider">
              Centralized Infrastructure
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Need Direct Custom Engineering or Incubation Access?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Connect with our operational hubs across Lagos and Abeokuta to initiate corporate software retainers, enroll cohort talent, or license educational infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/contact"
              className="py-3 px-5 rounded-xl bg-[#F2B42C] text-slate-900 font-bold text-xs hover:bg-[#f3bc42] transition-colors"
            >
              Contact Executive Desk
            </Link>
            <Link
              href="/programs/prep-track"
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors"
            >
              Explore Prep Track
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 D-Global Growthfield Limited. All rights reserved. Operating across Lagos & Ogun State, Nigeria.</p>
      </footer>
    </main>
  );
}