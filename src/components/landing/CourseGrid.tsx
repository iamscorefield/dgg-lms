'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type TrackKey = 'ALL' | 'FREE' | 'PREP' | 'BUSINESS' | 'ADVANCE_SKILLS';

export interface CourseModuleItem {
  module_number?: number;
  title: string;
  summary?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  track: 'FREE' | 'PREP' | 'BUSINESS' | 'ADVANCE_SKILLS';
  level?: string;
  short_description: string;
  full_description?: string;
  learning_outcomes?: string[];
  modules?: CourseModuleItem[];
  featured_order?: number;
  basic_price?: number | null;
  standard_price?: number | null;
  advance_price?: number | null;
}

const TRACK_TABS: { key: TrackKey; label: string }[] = [
  { key: 'ALL', label: 'ALL' },
  { key: 'FREE', label: 'FREE COURSES' },
  { key: 'PREP', label: 'PREP TRACK' },
  { key: 'BUSINESS', label: 'BUSINESS' },
  { key: 'ADVANCE_SKILLS', label: 'ADVANCE SKILLS' },
];

const REAL_CATALOG_FALLBACK: CourseItem[] = [
  // FREE COURSES (2 featured in ALL)
  {
    id: 'free-workspace-tools',
    title: 'Everyday Workspace Productivity Tools: Complete Guide to Microsoft Office & Google Apps',
    track: 'FREE',
    level: 'Beginner • Free',
    short_description:
      'Learn practical document creation, spreadsheets, and cloud collaboration using Microsoft Office and Google Workspace tools for everyday work and business.',
    full_description:
      'Built for beginners in Nigeria who want practical digital office skills without getting overwhelmed, covering documents, spreadsheets, presentations, and cloud sharing.',
    learning_outcomes: [
      'Understand desktop, web, and cloud productivity tools.',
      'Create and format clean documents in Google Docs and Microsoft Word.',
      'Build simple spreadsheets in Google Sheets and Microsoft Excel.',
      'Organize and share files safely on cloud drives.',
    ],
    modules: [
      {
        module_number: 1,
        title: 'Documents & Everyday Writing (Docs & Word)',
        summary: 'Write, format, align, and export clean documents for daily work.',
      },
      {
        module_number: 2,
        title: 'Spreadsheets & Simple Tracking (Sheets & Excel)',
        summary: 'Work with rows, columns, basic formulas, and simple trackers.',
      },
      {
        module_number: 3,
        title: 'Cloud Storage, Presentations & Smart Sharing',
        summary: 'Organize Drive folders, set permissions, and collaborate smoothly.',
      },
    ],
    featured_order: 1,
  },
  {
    id: 'free-computer-basics',
    title: 'Computer Basics for Beginners: Understanding Hardware, Software & Everyday Operations',
    track: 'FREE',
    level: 'Beginner • Free',
    short_description:
      'Build confidence with computer parts, operating systems, file management, and daily device habits—made simple for first-time learners.',
    full_description:
      'Breaks down computing in plain language: hardware components, operating systems, folder organization, and calm everyday troubleshooting.',
    learning_outcomes: [
      'Identify core computer hardware components and their roles.',
      'Distinguish hardware, operating systems, and applications.',
      'Manage files, folders, and backups cleanly.',
      'Troubleshoot common everyday device hiccups.',
    ],
    modules: [
      {
        module_number: 1,
        title: 'Hardware & How a Computer Works',
        summary: 'Explore core computer parts, ports, displays, and everyday setups.',
      },
      {
        module_number: 2,
        title: 'Operating Systems & File Management Mastery',
        summary: 'Navigate system menus, organize folders, and protect your files.',
      },
      {
        module_number: 3,
        title: 'Daily Operations & Basic Troubleshooting',
        summary: 'Build calm daily habits and solve common device issues.',
      },
    ],
    featured_order: 2,
  },

  // PREP TRACK (2 featured in ALL)
  {
    id: 'prep-computer-foundations',
    title: 'Complete Digital & Computer Foundations: Basics, Keyboard Mastery, Browsers & Office',
    track: 'PREP',
    level: 'Beginner • Prep',
    short_description:
      'Build all-round computer, keyboard, browser, file, and office productivity basics in one clear foundation made for Nigerian learners.',
    full_description:
      'Essential starting point for the Prep package combining device basics, keyboard mastery, file/cloud organization, smart browsing & safety, and documents/spreadsheets.',
    learning_outcomes: [
      'Master keyboard positioning, accuracy, and everyday shortcuts.',
      'Navigate operating systems, files, folders, and cloud backups.',
      'Use browser features, privacy settings, and online safety habits.',
      'Create and export clean documents and spreadsheets.',
    ],
    modules: [
      {
        module_number: 1,
        title: 'Computer Hardware, OS & Everyday Controls',
        summary: 'Understand device components, OS controls, and core settings.',
      },
      {
        module_number: 2,
        title: 'Keyboard Mastery & Speed Habits',
        summary: 'Build typing accuracy, home-row habits, and fast shortcuts.',
      },
      {
        module_number: 3,
        title: 'Files, Folders & Cloud Organization',
        summary: 'Keep files structured, backed up, and easy to retrieve.',
      },
      {
        module_number: 4,
        title: 'Smart Browsing, Settings & Online Safety',
        summary: 'Manage tabs, bookmarks, privacy settings, and safe browsing.',
      },
      {
        module_number: 5,
        title: 'Everyday Documents & Spreadsheets',
        summary: 'Create clean documents, basic tables, and PDF exports.',
      },
    ],
    featured_order: 3,
  },
  {
    id: 'prep-career-and-study',
    title: 'Smart Online Learning & Navigating Digital Career Paths in Nigeria',
    track: 'PREP',
    level: 'Beginner • Prep',
    short_description:
      'Master practical online study routines for Nigerian conditions and explore realistic digital and tech career lanes without hype.',
    full_description:
      'Combines realistic study systems for data and power conditions with clear guidance on digital and tech career tracks in Nigeria.',
    learning_outcomes: [
      'Build study routines suited to Nigerian data and power realities.',
      'Plan weekly learning targets and keep structured notes.',
      'Compare realistic digital and tech roles without hype.',
      'Choose a practical first skill lane based on strengths and resources.',
    ],
    modules: [
      {
        module_number: 1,
        title: 'Studying Smart on Nigerian Data & Power',
        summary: 'Manage data usage, power gaps, and steady study routines.',
      },
      {
        module_number: 2,
        title: 'Study Schedules, Notes & Feedback',
        summary: 'Plan weekly milestones, take clean notes, and act on feedback.',
      },
      {
        module_number: 3,
        title: 'Understanding Digital & Tech Roles',
        summary: 'Compare support, operations, design, data, and web/no-code paths.',
      },
      {
        module_number: 4,
        title: 'Choosing Your First Realistic Lane',
        summary: 'Match your time, device, budget, and strengths to a starting track.',
      },
      {
        module_number: 5,
        title: 'Building Momentum & Next Steps',
        summary: 'Turn consistent practice into readiness for next-level courses.',
      },
    ],
    featured_order: 4,
  },

  // BUSINESS (2 featured in ALL)
  {
    id: 'biz-cac-firs-registration',
    title: 'Get To Know Legal Registration of Business in Nigeria (CAC, FIRS)',
    track: 'BUSINESS',
    level: 'Business Track',
    short_description:
      'Master Nigerian business registration categories—Business Names/Enterprises, LTDs, PLCs, and Incorporated Trustees—plus CAC-FIRS TIN integration.',
    full_description:
      'Designed for Nigerian entrepreneurs, founders, small business owners, and individuals looking to master these skills as a profession to render them as services to clients.',
    learning_outcomes: [
      'Differentiate Business Names, LTDs, PLCs, and Incorporated Trustees.',
      'Navigate CAC name reservation and pre-incorporation steps.',
      'Understand transitioning from a Business Name to an LTD.',
      'Set up TIN and initial tax obligations via CAC-FIRS workflows.',
    ],
    modules: [
      {
        module_number: 1,
        title: 'Introduction to Nigerian Regulatory Landscape',
        summary: 'Explore CAC, FIRS, and core business entity categories.',
      },
      {
        module_number: 2,
        title: 'Business Name (BN) & Enterprise Mastery',
        summary: 'Understand sole proprietorships, partnerships, and BN-to-LTD transitions.',
      },
      {
        module_number: 3,
        title: 'Limited Liability (LTD) & Public Companies (PLC)',
        summary: 'Review share capital, shareholders, and corporate structures.',
      },
      {
        module_number: 4,
        title: 'Incorporated Trustees & Special Entities',
        summary: 'Learn NGO, association, and trustee registration essentials.',
      },
      {
        module_number: 5,
        title: 'FIRS Tax Integration & Initial Compliance',
        summary: 'Handle TIN setup, CIT basics, and VAT registration fundamentals.',
      },
    ],
    featured_order: 5,
  },
  {
    id: 'biz-advanced-entity-setup',
    title: 'Advanced Business Registration & Corporate Entity Setup Sprints',
    track: 'BUSINESS',
    level: 'Business Track',
    short_description:
      'Cover feasibility studies, Business Model Canvas (BMC), MEMART drafting, trademark/IP protection, and legal agreements for growing ventures.',
    full_description:
      'Helps founders structure their venture for credibility and scale through feasibility validation, BMC design, MEMART clauses, IP/trademarks, and core agreements.',
    learning_outcomes: [
      'Conduct market validation, feasibility checks, and BMC mapping.',
      'Compare liability and tax considerations across entity structures.',
      'Understand MEMART structure and corporate governance basics.',
      'Protect brand assets with trademark searches and legal agreements.',
    ],
    modules: [
      {
        module_number: 1,
        title: 'Feasibility & Business Model Canvas (BMC)',
        summary: 'Validate demand, assess risks, and build a clear BMC.',
      },
      {
        module_number: 2,
        title: 'Sole Proprietorship vs. Limited Liability Strategy',
        summary: 'Compare personal vs. corporate liability and funding readiness.',
      },
      {
        module_number: 3,
        title: 'MEMART & Corporate Governance Drafting',
        summary: 'Understand MEMART clauses, objects, and governance rules.',
      },
      {
        module_number: 4,
        title: 'Trademark & Intellectual Property (IP) Protection',
        summary: 'Run trademark checks and protect brand assets in Nigeria.',
      },
      {
        module_number: 5,
        title: 'Shareholder Agreements & Legal Document Vault',
        summary: 'Organize founder agreements, NDAs, and core business contracts.',
      },
    ],
    featured_order: 6,
  },

  // ADVANCE SKILLS / MAIN COURSE (2 featured in ALL — 7-module tiered structure)
  {
    id: 'adv-full-stack-systems',
    title: 'Full-Stack Web & Cloud Systems Engineering',
    track: 'ADVANCE_SKILLS',
    level: 'Advance Skills • 7 Modules',
    short_description:
      'Architect, build, and deploy modern web applications, relational databases, and APIs with production-grade workflows.',
    full_description:
      'Hands-on engineering track focused on building reliable web platforms, database schemas, authentication, and real-world deployment pipelines across 7 structured modules.',
    learning_outcomes: [
      'Design relational schemas and APIs for real applications.',
      'Build responsive interfaces with clean state and data flow.',
      'Implement authentication, validation, and error handling.',
      'Deploy and monitor production web applications.',
    ],
    modules: [
      {
        module_number: 1,
        title: 'Modern Web Architecture & TypeScript Foundations',
        summary: 'Structure scalable frontend and backend codebases.',
      },
      {
        module_number: 2,
        title: 'Responsive UI Systems & Component Engineering',
        summary: 'Build clean, accessible interfaces with Tailwind CSS and React.',
      },
      {
        module_number: 3,
        title: 'Relational Databases & Schema Modeling',
        summary: 'Design tables, relationships, and queries cleanly.',
      },
      {
        module_number: 4,
        title: 'Server Actions, REST APIs & Data Validation',
        summary: 'Expose reliable endpoints and validate inputs safely.',
      },
      {
        module_number: 5,
        title: 'Authentication, Role Gating & Security',
        summary: 'Protect routes, sessions, and database records.',
      },
      {
        module_number: 6,
        title: 'Payments, Webhooks & Third-Party Integrations',
        summary: 'Integrate external APIs and asynchronous webhook events.',
      },
      {
        module_number: 7,
        title: 'Production Deployment, Performance & Capstone',
        summary: 'Ship, monitor, and defend a full production platform.',
      },
    ],
    featured_order: 7,
  },
  {
    id: 'adv-data-automation-ops',
    title: 'Applied Data Analytics, Reporting & Workflow Automation',
    track: 'ADVANCE_SKILLS',
    level: 'Advance Skills • 7 Modules',
    short_description:
      'Turn raw operational data into clear dashboards, automated workflows, and actionable decision reports for modern organizations.',
    full_description:
      'Practical 7-module skills track for turning spreadsheets, databases, and operational logs into structured metrics and automated reporting systems.',
    learning_outcomes: [
      'Clean, structure, and audit raw operational datasets.',
      'Build clear KPI trackers and decision summaries.',
      'Automate repetitive reporting and data pipelines.',
      'Present insights clearly to stakeholders and leadership.',
    ],
    modules: [
      {
        module_number: 1,
        title: 'Data Literacy & Spreadsheet Audit Foundations',
        summary: 'Standardize messy records into reliable structured tables.',
      },
      {
        module_number: 2,
        title: 'Formulas, Lookups & Operational Data Cleaning',
        summary: 'Master lookup functions, validation rules, and error checks.',
      },
      {
        module_number: 3,
        title: 'SQL Querying & Relational Data Extraction',
        summary: 'Query, filter, and join multi-table business datasets.',
      },
      {
        module_number: 4,
        title: 'KPI Frameworks & Interactive Dashboards',
        summary: 'Track key metrics and build clear visual summaries.',
      },
      {
        module_number: 5,
        title: 'Automated Reporting & Workflow Pipelines',
        summary: 'Reduce manual repetitive steps with repeatable workflows.',
      },
      {
        module_number: 6,
        title: 'Executive Storytelling & Decision Memos',
        summary: 'Translate analytical findings into clear business recommendations.',
      },
      {
        module_number: 7,
        title: 'Capstone End-to-End Business Intelligence Project',
        summary: 'Deliver a complete operational analytics dashboard and report.',
      },
    ],
    featured_order: 8,
  },
];

function normalizeTrack(rawTrack?: string, rawCategory?: string): CourseItem['track'] {
  const value = `${rawTrack || ''} ${rawCategory || ''}`.toUpperCase();
  if (value.includes('FREE')) return 'FREE';
  if (value.includes('PREP')) return 'PREP';
  if (value.includes('BIZ') || value.includes('BUSINESS')) return 'BUSINESS';
  return 'ADVANCE_SKILLS';
}

function getTrackLabel(track: CourseItem['track']): string {
  switch (track) {
    case 'FREE':
      return 'FREE COURSES';
    case 'PREP':
      return 'PREP TRACK';
    case 'BUSINESS':
      return 'BUSINESS';
    case 'ADVANCE_SKILLS':
      return 'ADVANCE SKILLS';
  }
}

function getEnrollmentConfig(track: CourseItem['track']): {
  badge: string;
  notice: string;
  buttonText: string;
  href: string;
} {
  switch (track) {
    case 'FREE':
      return {
        badge: 'FREE ACCESS',
        notice: 'This course is part of our free learning resources on DGG Academy.',
        buttonText: 'SIGN UP TO LEARN FOR FREE →',
        href: '/signup?track=free',
      };
    case 'PREP':
      return {
        badge: 'ONE-TIME PACKAGE PAYMENT',
        notice:
          'Sign up and with a one-time payment you get access to all courses under this Prep track/package.',
        buttonText: 'SIGN UP FOR PREP PACKAGE →',
        href: '/signup?track=prep',
      };
    case 'BUSINESS':
      return {
        badge: 'ONE-TIME PACKAGE PAYMENT',
        notice:
          'Sign up and with a one-time payment you get access to all courses under this Business track/package.',
        buttonText: 'SIGN UP FOR BUSINESS PACKAGE →',
        href: '/signup?track=business',
      };
    case 'ADVANCE_SKILLS':
      return {
        badge: 'TIERED MASTER COURSE',
        notice:
          'Choose Basic (Modules 1–2), Standard (Modules 1–4), or Advance (All 7 Modules) when you sign up.',
        buttonText: 'SIGN UP TO ENROLL →',
        href: '/signup?track=advance-skills',
      };
  }
}

function getMainModuleTierLabel(moduleIdxZeroBased: number): {
  label: string;
  classes: string;
} {
  if (moduleIdxZeroBased < 2) {
    return {
      label: 'Basic • Standard • Advance',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }
  if (moduleIdxZeroBased < 4) {
    return {
      label: 'Standard • Advance',
      classes: 'bg-amber-50 text-amber-800 border-amber-200',
    };
  }
  return {
    label: 'Advance Only',
    classes: 'bg-purple-50 text-[#512d7c] border-purple-200',
  };
}

export default function CourseGrid() {
  const [activeTab, setActiveTab] = useState<TrackKey>('ALL');
  const [courses, setCourses] = useState<CourseItem[]>(REAL_CATALOG_FALLBACK);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCoursesFromSupabase() {
      if (!supabase) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: true });

        if (error || !data || data.length === 0) {
          if (isMounted) {
            setCourses(REAL_CATALOG_FALLBACK);
            setLoading(false);
          }
          return;
        }

        const mapped: CourseItem[] = data.map((row: Record<string, unknown>, idx: number) => {
          const normalizedTrack = normalizeTrack(
            String(row.track ?? row.course_type ?? row.tier ?? ''),
            String(row.category ?? '')
          );

          const parsedOutcomes = Array.isArray(row.learning_outcomes)
            ? (row.learning_outcomes as string[])
            : [];

          const parsedModules = Array.isArray(row.modules)
            ? (row.modules as CourseModuleItem[])
            : [];

          return {
            id: String(row.id ?? `course-${idx}`),
            title: String(row.title ?? 'Untitled Course'),
            track: normalizedTrack,
            level: row.level ? String(row.level) : getTrackLabel(normalizedTrack),
            short_description: String(
              row.short_description ?? row.description ?? 'Structured practical course on DGG Academy.'
            ),
            full_description: row.full_description
              ? String(row.full_description)
              : String(row.short_description ?? row.description ?? ''),
            learning_outcomes: parsedOutcomes,
            modules: parsedModules,
            featured_order: typeof row.featured_order === 'number' ? row.featured_order : idx + 1,
            basic_price:
              row.basic_price != null
                ? Number(row.basic_price)
                : row.price != null
                ? Number(row.price)
                : null,
            standard_price: row.standard_price != null ? Number(row.standard_price) : null,
            advance_price: row.advance_price != null ? Number(row.advance_price) : null,
          };
        });

        if (isMounted) {
          setCourses(mapped);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setCourses(REAL_CATALOG_FALLBACK);
          setLoading(false);
        }
      }
    }

    loadCoursesFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCourses = useMemo(() => {
    if (activeTab === 'ALL') {
      const roles: CourseItem['track'][] = ['FREE', 'PREP', 'BUSINESS', 'ADVANCE_SKILLS'];
      const picked: CourseItem[] = [];
      for (const role of roles) {
        const matching = courses.filter((c) => c.track === role).slice(0, 2);
        picked.push(...matching);
      }
      return picked.length > 0 ? picked : REAL_CATALOG_FALLBACK.slice(0, 8);
    }

    return courses.filter((c) => c.track === activeTab);
  }, [activeTab, courses]);

  const selectedEnrollment = selectedCourse ? getEnrollmentConfig(selectedCourse.track) : null;
  const isSelectedMainCourse = selectedCourse?.track === 'ADVANCE_SKILLS';

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-[#512d7c]/10 px-4 py-1 text-xs font-semibold tracking-wider uppercase text-[#512d7c]">
            EDUCATIONAL ECOSYSTEM
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-[#3b1d63] uppercase">
            EXPLORE OUR AVAILABLE COURSES
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Real curriculum tracks across Free Courses, Prep Track, Business, and Advance Skills—built
            for practical execution and steady growth.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 bg-slate-100/90 p-1.5 rounded-full w-fit mx-auto border border-slate-200/70">
          {TRACK_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
                  isActive
                    ? 'bg-[#512d7c] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#512d7c]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-60 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse p-6"
              />
            ))}
          </div>
        ) : visibleCourses.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
            <p className="text-base font-semibold text-[#512d7c]">
              No courses published under {getTrackLabel(activeTab as CourseItem['track'])} yet.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Switch tabs or add courses in your Admin portal to display them here.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleCourses.map((course) => (
              <article
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-[#512d7c]/40 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-md bg-[#512d7c]/10 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase text-[#512d7c]">
                      {getTrackLabel(course.track)}
                    </span>
                    {course.level && (
                      <span className="text-xs font-medium text-slate-500">{course.level}</span>
                    )}
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold leading-snug text-[#2f1652] uppercase">
                    {course.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600 line-clamp-3">
                    {course.short_description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCourse(course)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 hover:bg-[#512d7c] hover:text-white hover:border-[#512d7c] text-[#2f1652] font-bold text-xs tracking-wider uppercase py-3 px-4 transition cursor-pointer"
                  >
                    VIEW CURRICULUM DETAILS →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {selectedCourse && selectedEnrollment && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[1px]"
            onClick={() => setSelectedCourse(null)}
          >
            <div
              className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#512d7c] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      {getTrackLabel(selectedCourse.track)}
                    </span>
                    {selectedCourse.level && (
                      <span className="rounded-md bg-[#f2b42c]/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#512d7c]">
                        {selectedCourse.level}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 text-xl sm:text-2xl font-extrabold text-[#2f1652]">
                    {selectedCourse.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  aria-label="Close modal"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#512d7c]">
                    ABOUT THIS COURSE
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {selectedCourse.full_description || selectedCourse.short_description}
                  </p>
                </div>

                {selectedCourse.learning_outcomes && selectedCourse.learning_outcomes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#512d7c]">
                      WHAT YOU WILL LEARN
                    </h4>
                    <ul className="mt-2.5 space-y-2">
                      {selectedCourse.learning_outcomes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <span className="mt-0.5 font-bold text-[#f2b42c]">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 3 TIER OPTIONS RIGHT BELOW OUTCOMES FOR ADVANCE SKILLS (MAIN) COURSES */}
                {isSelectedMainCourse && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#512d7c]">
                        CHOOSE YOUR ENROLLMENT TIER
                      </h4>
                      <span className="text-xs font-medium text-slate-500">
                        Unlock more modules anytime as you progress
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {[
                        {
                          key: 'basic',
                          name: 'Basic',
                          price: selectedCourse.basic_price,
                          modulesLabel: 'Unlocks Modules 1–2',
                          summary: 'Foundational concepts and starter hands-on exercises.',
                          featured: false,
                        },
                        {
                          key: 'standard',
                          name: 'Standard',
                          price: selectedCourse.standard_price,
                          modulesLabel: 'Unlocks Modules 1–4',
                          summary: 'Includes Basic + intermediate workflows and practical labs.',
                          featured: true,
                        },
                        {
                          key: 'advance',
                          name: 'Advance',
                          price: selectedCourse.advance_price,
                          modulesLabel: 'Unlocks All 7 Modules (1–7)',
                          summary: 'Complete mastery access including capstone project.',
                          featured: false,
                        },
                      ].map((tier) => (
                        <div
                          key={tier.key}
                          className={`rounded-xl border p-4 flex flex-col justify-between ${
                            tier.featured
                              ? 'border-[#512d7c] bg-[#512d7c]/[0.04] shadow-sm'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-[#512d7c]">
                                {tier.name}
                              </span>
                              {tier.featured && (
                                <span className="rounded bg-[#f2b42c] px-2 py-0.5 text-[9px] font-extrabold uppercase text-black">
                                  Popular
                                </span>
                              )}
                            </div>

                            {tier.price && tier.price > 0 ? (
                              <p className="mt-2 text-lg font-extrabold text-slate-900">
                                ₦{tier.price.toLocaleString()}
                              </p>
                            ) : (
                              <p className="mt-2 text-xs font-bold text-slate-500">
                                Tiered Enrollment
                              </p>
                            )}

                            <p className="mt-2 inline-block rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                              {tier.modulesLabel}
                            </p>

                            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                              {tier.summary}
                            </p>
                          </div>

                          <Link
                            href={`/signup?track=advance-skills&tier=${tier.key}&course=${encodeURIComponent(
                              selectedCourse.title
                            )}`}
                            onClick={() => setSelectedCourse(null)}
                            className={`mt-4 inline-flex items-center justify-center rounded-lg px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider transition ${
                              tier.featured
                                ? 'bg-[#512d7c] hover:bg-[#3f2162] text-white'
                                : 'bg-[#f2b42c] hover:bg-[#e0a51a] text-black'
                            }`}
                          >
                            Sign Up ({tier.name}) →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#512d7c]">
                      COURSE SYLLABUS ({selectedCourse.modules.length} MODULES)
                    </h4>
                    <div className="mt-2.5 space-y-2">
                      {selectedCourse.modules.map((mod, idx) => {
                        const moduleTierBadge = isSelectedMainCourse
                          ? getMainModuleTierLabel(idx)
                          : null;

                        return (
                          <div
                            key={idx}
                            className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-[#512d7c]">
                                MODULE {mod.module_number ?? idx + 1}
                              </p>
                              {moduleTierBadge && (
                                <span
                                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${moduleTierBadge.classes}`}
                                >
                                  {moduleTierBadge.label}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm font-bold text-slate-900">{mod.title}</p>
                            {mod.summary && (
                              <p className="mt-1 text-xs text-slate-600">{mod.summary}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-[#512d7c]/20 bg-[#512d7c]/[0.04] p-4">
                  <span className="inline-block rounded bg-[#f2b42c]/25 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#512d7c]">
                    {selectedEnrollment.badge}
                  </span>
                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {selectedEnrollment.notice}
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  CLOSE
                </button>

                <Link
                  href={selectedEnrollment.href}
                  onClick={() => setSelectedCourse(null)}
                  className="inline-flex items-center justify-center rounded-xl bg-[#512d7c] hover:bg-[#3f2162] text-white font-bold text-xs tracking-wider uppercase px-5 py-3 shadow-sm transition"
                >
                  {selectedEnrollment.buttonText}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}