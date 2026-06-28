"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, BookOpen, CreditCard, Terminal, MessageSquare, ArrowUpRight } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQ[];
}

export default function FAQPage() {
  const faqCategories: FAQCategory[] = [
    {
      title: "Admission & Pricing",
      icon: <CreditCard size={18} />,
      items: [
        {
          question: "How much is the enrollment fee for the foundational Prep Program?",
          answer: "The onboarding fee for the DGG foundational prep course is ₦75,000. This is an all-inclusive, one-time structural token utility fee that grants permanent ecosystem clearance without any future renewal rates."
        },
        {
          question: "Are there any hidden recurring theme or plugin subscription costs?",
          answer: "None at all. Our entire learning ecosystem and custom student tools are engineered with custom-coded architecture. We stripped away commercial premium plugins and bloated subscription frameworks so that students and partners bypass hidden platform utility expenses."
        },
        {
          question: "What payment structures are accepted for enrollment clearing?",
          answer: "All onboarding profiles clear securely through our direct Paystack infrastructure channel. The platform safely accepts automated local bank transfers, corporate debit cards, and secure digital payment tokens."
        },
        {
          question: "Can I pay for the enrollment fee using a corporate split installment model?",
          answer: "Currently, our system processes the onboarding token as a flat single-transaction billing footprint via Paystack to clear server allocation hooks instantly. For special organizational or institutional group sponsorships, please contact the administrative desk directly."
        },
        {
          question: "Is there a refund policy if I accidentally authorize a double transaction?",
          answer: "Yes. If a network lag triggers a dual authorization on Paystack, our accounting system flag blocks the secondary charge. Once verified by our financial desk, refunds for duplicates are processed back to the originating bank socket within 3 to 5 business days."
        },
        {
          question: "Does the ₦75,000 fee include access to the advanced track specializations?",
          answer: "The ₦75,000 onboarding fee covers absolute lifetime access into the 10-course foundation Prep Program. Graduating through the prep track unlocks the gateway credentials necessary to transition smoothly into advanced closed pods or specializations."
        },
        {
          question: "Will I ever be billed for software documentation tools or sandbox usage?",
          answer: "Never. All integrated testing environments, compiler nodes, and practical learning sandboxes deployed inside the DGG platform dashboard are entirely free and covered under your entry token clearance."
        },
        {
          question: "Do you offer any discounted access pricing for public secondary schools or university hubs?",
          answer: "Yes, DGG coordinates custom partnership layouts with verified educational institutions. Campus campus clubs or student association leadership blocks can request subsidized structural deployments via our outreach support desk."
        },
        {
          question: "Can international students pay using alternate foreign currency cards?",
          answer: "Yes, our Paystack gateway pipeline is configured to automatically accept international cards. The infrastructure handles the local currency translation metrics securely at active international transaction exchange rates."
        },
        {
          question: "Is my payment data secure when inputting payment fields on this platform?",
          answer: "Absolutely. DGG Academy never captures or logs your card records. All payment interactions are fully sandboxed and offloaded directly onto Paystack's bank-grade, PCI-DSS compliant secure verification layers."
        }
      ]
    },
    {
      title: "Syllabus & Mechanics",
      icon: <BookOpen size={18} />,
      items: [
        {
          question: "What is the internal structural layout of each foundation course?",
          answer: "Each foundational course is built as a rigid learning matrix containing 5 immersive modules. Each individual module houses exactly 4 deep-dive lessons, translating into 20 master lessons per track course."
        },
        {
          question: "How does the gate-locked curriculum pathway enforce mastery?",
          answer: "You cannot skip ahead or skim modules. Every lesson features an attached 1-to-1 practical knowledge assessment lab. The next sequential lesson remains strictly database-locked until you score 80% or higher on your current practical assignment."
        },
        {
          question: "What happens after I complete my foundational prep modules?",
          answer: "Upon passing all sequential gate reviews, your account graduates with elite developer clearance. Your performance scoreboard maps directly into specialized advanced tracks, such as Full Stack Development, UI/UX Design, or B2B sales pods."
        },
        {
          question: "Are the practical assignments evaluated automatically or manually reviewed?",
          answer: "The platform runs a dual-review pipeline. Your baseline logic compilations and sandbox tasks are processed instantly by automated code triggers, while high-tier portfolio design briefs undergo manual audit validation by cohort technical mentors."
        },
        {
          question: "Can I retake a practical knowledge assessment if my score drops below 80%?",
          answer: "Yes, you can retake an assessment laboratory multiple times. The database gate requires an active passing condition of 80%+ to unlock the next block, so retakes are highly encouraged to refine structural execution errors."
        },
        {
          question: "How many hours of weekly platform engagement are required for the Prep track?",
          answer: "Since the LMS runs on an asynchronous framework, you set your own velocity metrics. However, for maximum retention and to sync cleanly with cohort live reviews, we recommend a target commitment of 10 to 15 hours per week."
        },
        {
          question: "Are there group collaboration assignments inside the foundational tracks?",
          answer: "Yes. While individual milestone gates remain strictly isolated for metric tracking, seasons include group sprint labs where students are combined into mini development blocks to tackle real-world case scenarios collaboratively."
        },
        {
          question: "What tracking topics are included inside the initial 10-course prep index?",
          answer: "The curriculum bridges absolute beginners into tech using topics ranging from basic internet skills, no-code prototyping, UI/UX principles, AI prompting workflows, down to legal corporate business setups in Nigeria."
        },
        {
          question: "Can I switch my advanced track selection midway through the learning matrix?",
          answer: "The foundational prep program is identical for all profiles. This unshakeable baseline allows you to evaluate your strength parameters across all tracks before locking in your permanent choice at graduation."
        },
        {
          question: "Will I build live production assets during the Prep syllabus track?",
          answer: "Yes. Every course block moves straight from abstract theories into real-world output. You will build actual responsive layouts, document automation flows, and real digital footprints that save directly into your workspace portfolio."
        }
      ]
    },
    {
      title: "Systems & Support",
      icon: <Terminal size={18} />,
      items: [
        {
          question: "Why do I need to supply extra profile tracking fields during sign-up?",
          answer: "Fields like WhatsApp contact link, institution name, major discipline, and current educational level help administration custom-tailor your roadmap. It ensures we pair your user profile with the best tech mentors and target high-demand industry workflows."
        },
        {
          question: "How is my registration profile synchronization handled on the database backend?",
          answer: "Your sign-up data maps dynamically using Supabase security schemas. When you register, your authentication metadata triggers a profile insertion hook that updates your user row data with nullable safety controls."
        },
        {
          question: "What should I do if a layout view throws a caching or build error?",
          answer: "If components don't render smoothly after a platform update, run 'npm update' in your local project terminal workspace. Next, clear your web browser cookies or perform a hard hardware cache flush to sync your local state to the active deployment framework."
        },
        {
          question: "How securely is my personal user information protected on the platform?",
          answer: "All profile metrics, personal parameters, and academic rows are housed safely inside our sandboxed Supabase relational architecture. We enforce strict Row-Level Security (RLS) policies, meaning your data vectors remain accessible only to you and specialized platform system administrators."
        },
        {
          question: "What should I do if my browser logs me out mid-session during an assessment task?",
          answer: "This happens if your JSON Web Token (JWT) tracking session cycles through an expiration fallback window. To prevent code loss, your workspace code editor automatically maintains a local localStorage caching hook that recovers your typed arrays once you log back in."
        },
        {
          question: "Why does the media player panel load slowly on slow network lines?",
          answer: "Our interface video assets use dynamic streaming bitrate targets. If your connection speed drops, the framework throttles resolution metrics automatically to prevent constant buffering and maintain video playback flow."
        },
        {
          question: "Can I log into my student dashboard layout from multiple devices at once?",
          answer: "To prevent profile security compromises, active student sessions enforce device session limitation controls. Authenticating on a secondary hardware line triggers a security token refresh that invalidates your older session."
        },
        {
          question: "How do I request a formal database update if my email parameter shifts?",
          answer: "Because user email strings act as primary unique identifiers inside our Supabase auth rows, you cannot change them manually. You must open a formal account ticket via the support escalation desk to verify your identity and authorize a secure record update."
        },
        {
          question: "Which web browser engines are fully optimized to handle the DGG platform dashboards?",
          answer: "The interface components are thoroughly performance-audited across V8 engine pipelines. We strongly recommend using the latest stable revisions of Google Chrome, Brave, Microsoft Edge, or Apple Safari for unthrottled rendering speeds."
        },
        {
          question: "How do I report an interactive interface bug or system vulnerability?",
          answer: "If you detect a responsive breakdown, structural design error, or database lag vector, capture a layout screenshot and email it straight to our technical core desk via the Contact Live Helpdesk pipeline."
        }
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState<number>(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* HEADER SECTION */}
        <div className="text-center sm:text-left max-w-3xl mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-xs font-black text-[#512d7c] uppercase tracking-widest rounded-full mb-3">
            ❓ CENTRAL REPOSITORY HUB
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A0033] tracking-tight leading-tight">
            Frequently Asked Questions Matrix
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            Clear up structural doubts instantly. Filter through our technical navigation catalog below to resolve inquiries about onboarding fees, course architectures, gate-locking mechanics, and profile metadata protections.
          </p>
        </div>

        {/* INTERACTIVE CATEGORY TABS BANNER */}
        <div className="flex flex-col sm:flex-row bg-slate-50 border border-slate-200 rounded-2xl p-2 mb-8 gap-1 shadow-3xs">
          {faqCategories.map((category, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveTab(idx);
                  setOpenIndex(null);
                }}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 focus:outline-none ${
                  isSelected 
                    ? "bg-[#512d7c] text-white shadow-sm font-black" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {category.icon}
                {category.title}
              </button>
            );
          })}
        </div>

        {/* ACCORDION EXECUTOR STREAM VIEW */}
        <section className="space-y-4 mb-16 text-left">
          {faqCategories[activeTab].items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-2xl overflow-hidden transition-all bg-slate-50/40 hover:bg-white ${
                  isOpen ? "border-[#512d7c] bg-white shadow-sm ring-2 ring-[#512d7c]/5" : "border-slate-200/80"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left font-black text-sm sm:text-base text-slate-800 bg-transparent border-0 focus:outline-none cursor-pointer"
                >
                  <span className="flex items-start gap-3">
                    <HelpCircle size={18} className={`mt-0.5 flex-shrink-0 ${isOpen ? "text-[#512d7c]" : "text-slate-400"}`} />
                    {item.question}
                  </span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180 text-[#512d7c]" : ""}`} />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 pl-12 text-xs sm:text-sm text-slate-500 leading-relaxed bg-white border-t border-slate-100 animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* UNRESOLVED TROUBLESHOOTING CALL OUT PANEL */}
        <section className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 text-left shadow-3xs">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Unresolved Technical or Onboarding Questions?</h3>
            <p className="text-xs sm:text-sm font-medium text-slate-400 leading-relaxed">
              If your database queries aren't clearing or you need specialized answers regarding corporate sponsorship layout partnerships, skip the queues and reach out to our active helpdesk immediately.
            </p>
          </div>
          <a 
            href="/contact" 
            className="w-full sm:w-auto px-5 py-3.5 bg-[#512d7c] hover:bg-[#3f2261] text-white font-black text-xs uppercase tracking-widest text-center rounded-xl shadow-sm inline-flex items-center justify-center gap-2 transition flex-shrink-0 decoration-none"
          >
            <MessageSquare size={14} /> Open Support Portal <ArrowUpRight size={12} />
          </a>
        </section>

      </div>
    </div>
  );
}