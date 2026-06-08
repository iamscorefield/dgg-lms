"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  department: string;
  what_you_learn?: string[];
  duration?: string;
  prices: {
    self_paced: number;
    batch: number;
    one_on_one: number;
  };
}

export default function CourseGrid() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedType, setSelectedType] = useState<
    "self_paced" | "batch" | "one_on_one" | null
  >(null);

  useEffect(() => {
    async function fetchCourses() {
      const supabase = createBrowser();
      const { data } = await supabase
        .from("courses")
        .select("*")
        .order("title");
      setCourses(data || []);
    }
    fetchCourses();
  }, []);

  const handleEnroll = async (
    course: Course,
    type: "self_paced" | "batch" | "one_on_one"
  ) => {
    const supabase = createBrowser();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Login first to enroll");
      return;
    }

    const price = course.prices[type];

    if (price === 0) {
      await supabase.from("enrollments").insert({
        student_id: session.user.id,
        course_id: course.id,
        payment_status: "paid",
        metadata: { training_type: type },
      });
      toast.success(`Enrolled in ${type.replace("_", " ")} version!`);
      setSelectedCourse(null);
      setSelectedType(null);
      return;
    }

    if (typeof window === "undefined" || !(window as any).PaystackPop) {
      toast.error("Payment gateway terminal is initializing. Please try again in a moment.");
      return;
    }

    const handler = (window as any).PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: session.user.email,
      amount: price * 100,
      currency: "NGN",
      reference: new Date().getTime().toString(),
      metadata: {
        user_id: session.user.id,
        course_id: course.id,
        training_type: type,
      },
      callback: () => {
        toast.success(
          `Payment successful! ${type.replace("_", " ")} access unlocked.`
        );
        setSelectedCourse(null);
        setSelectedType(null);
      },
      onClose: () => toast.error("Payment cancelled"),
    });
    handler.openIframe();
  };

  const filteredCourses = courses.filter((course) => {
    if (activeTab === "All") return true;
    return (course.department || "").toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <section id="courses" className="pt-4 pb-24 bg-slate-50 relative overflow-hidden mt-0 border-t-0 font-sans">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* Modern Background Accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#512d7c]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#f2b42c]/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Header Title Typography Component */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#512d7c]/5 text-[#512d7c] border border-[#512d7c]/10 mb-4">
            Educational Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#512d7c] tracking-tight leading-none mb-4 uppercase">
            Explore Our Available Courses
          </h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            Select an advanced production track backed by live sandboxes, custom dataset portfolios, and multi-tier structural instruction frameworks.
          </p>
        </div>

        {/* Tab Filter Links Bar */}
        <div className="flex justify-center gap-1.5 mb-12 sm:mb-16 max-w-sm sm:max-w-md mx-auto bg-slate-200/60 backdrop-blur-md p-1 sm:p-1.5 rounded-xl sm:rounded-2xl select-none border border-slate-200/40">
          {["All", "Tech", "Design", "Business"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setSelectedCourse(null);
              }}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 border-0 cursor-pointer ${
                activeTab === tab
                  ? "bg-[#512d7c] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900 bg-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 🚀 COURSE GRID CARDS TRACK VIEWPORTS (MOBILE FRIENDLY CONSTRAINTS) */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-[2.5rem] max-w-md mx-auto shadow-xs">
            <span className="text-5xl block mb-3">📁</span>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No active modules synced.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-6xl mx-auto w-full">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setSelectedType(null);
                }}
                className="w-full max-w-sm sm:max-w-none mx-auto bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer relative"
              >
                <div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center text-xl sm:text-2xl mb-5 sm:mb-6 group-hover:bg-[#512d7c] group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-inner select-none">
                    {course.department?.toLowerCase() === "tech" ? "💻" : 
                     course.department?.toLowerCase() === "business" ? "📈" : 
                     course.department?.toLowerCase() === "design" ? "🎨" : "📚"}
                  </div>

                  <span className="text-[9px] font-black tracking-widest text-[#512d7c] bg-[#512d7c]/5 px-2.5 py-1 rounded-md border border-[#512d7c]/10 uppercase inline-block mb-3">
                    {course.department || "General"} Discipline
                  </span>
                  
                  <h3 className="text-lg sm:text-xl font-black text-[#512d7c] leading-tight mb-2 sm:mb-3 tracking-wide uppercase">
                    {course.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-400 font-bold leading-relaxed mb-6 sm:mb-8 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100/80 mt-auto">
                  <button 
                    type="button" 
                    className="w-full py-3 sm:py-4 bg-slate-50 group-hover:bg-[#512d7c] text-slate-700 group-hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-colors duration-300 border-0 cursor-pointer"
                  >
                    View Details &amp; Enroll
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INTERMEDIATE BLOCK: CATALOG DYNAMIC BLUEPRINT EXPLANATION */}
        <div className="mt-14 sm:mt-16 text-center max-w-2xl mx-auto px-4 border-b border-slate-200/60 pb-14">
          <h4 className="text-sm font-black text-slate-800 tracking-wide uppercase mb-2">
            💡 Our Active Curriculum is Not Limited to This Grid
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 font-bold leading-relaxed mb-5">
            DGG Academy continuously updates its educational ecosystem with targeted sub-modules, localized growth programs, and specialized sandbox frameworks. Sign up for a free learning account to access our complete real-time training sequence blueprints.
          </p>
          <a
            href="/signup"
            className="inline-block px-6 py-3 bg-[#512d7c] hover:bg-[#3f2162] text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-xs decoration-none"
          >
            Create Account to View All
          </a>
        </div>

        {/* 🔥 FIXED HIGH-CONTRAST GRADIENT WORKSPACE CONTAINER (Resolves image_034ff0.png layout washing) */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-[#3c1e5e] via-[#24113a] to-[#12061f] rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-purple-950/40">
          
          {/* Internal Luminous Custom Mesh Blend rings */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#f2b42c]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-72 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[10px] sm:text-xs font-black text-[#f2b42c] uppercase tracking-widest block mb-3">
              Corporate &amp; Individual Upskilling
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase mb-4 leading-tight">
              Flexible Training Frameworks for Modern Industry Teams
            </h3>
            <p className="text-xs sm:text-sm text-purple-100/90 font-medium leading-relaxed mb-8 text-center px-1 sm:px-4">
              DGG Academy powers structural corporate transformations by upskilling industry employees through flexible delivery tracks. Our complete curriculum pipeline is systematically deployed via highly integrated hybrid execution, premium remote sandboxes, and immersive physical on-site cohorts designed to match institutional schedules.
            </p>
            
            {/* Direct corporate mail link anchor */}
            <a
              href="mailto:contact@dglobalgrowthfield.com?subject=Corporate%20Employee%20Training%20Inquiry"
              className="inline-block px-8 py-3.5 sm:py-4 bg-[#f2b42c] hover:bg-white text-black hover:text-[#512d7c] font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md decoration-none border-0 cursor-pointer"
            >
              Get Started &amp; Explore More Courses
            </a>
          </div>
        </div>

        {/* 🛸 MODAL DETAIL DISPLAY SCREEN GRID OVERLAY */}
        {selectedCourse && (
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 transition-opacity duration-300 animate-fade-in"
            onClick={() => setSelectedCourse(null)}
          >
            <div
              className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 sm:p-10 relative text-left border border-slate-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-5 right-6 text-3xl text-slate-400 hover:text-red-500 border-0 bg-transparent cursor-pointer font-light transition-colors focus:outline-none"
                onClick={() => setSelectedCourse(null)}
              >
                ✕
              </button>
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-[#512d7c]/5 border border-[#512d7c]/10 text-[#512d7c] rounded-md font-bold text-[9px] tracking-widest uppercase mb-2">
                  {selectedCourse.department || "General"} Curriculum Pipeline
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#512d7c] leading-tight tracking-tight uppercase">
                  {selectedCourse.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-bold leading-relaxed mb-8 border-b border-slate-100 pb-6">
                {selectedCourse.description}
              </p>

              <div className="mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Syllabus Framework Objectives
                </h3>
                <ul className="space-y-3.5 pl-0 text-left">
                  {selectedCourse.what_you_learn && selectedCourse.what_you_learn.length > 0 ? (
                    selectedCourse.what_you_learn.map((item, i) => (
                      <li key={i} className="text-xs sm:text-sm flex items-start gap-3 font-bold text-slate-600 leading-relaxed">
                        <span className="text-amber-500 font-black text-md leading-none">✔</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400 italic">No syllabus blueprints mapped yet to this dashboard vector.</li>
                  )}
                </ul>
              </div>

              {selectedCourse.duration && (
                <div className="mb-8 bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
                  <span>⏳</span>
                  <div>
                    <span className="uppercase text-slate-400 font-black tracking-wider text-[10px] mr-1.5">Track Duration:</span> 
                    {selectedCourse.duration}
                  </div>
                </div>
              )}

              <div className="mb-8 border-t border-slate-100 pt-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center sm:text-left">
                  Select Training Track Package
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Option Card 1: Self Paced */}
                  <div
                    onClick={() => setSelectedType("self_paced")}
                    className={`p-5 border-2 rounded-2xl cursor-pointer text-center transition-all duration-300 flex flex-col justify-between ${
                      selectedType === "self_paced"
                        ? "border-[#f2b42c] bg-amber-50/40 shadow-sm scale-[1.02]"
                        : "border-slate-200/80 bg-white hover:border-[#512d7c]/30"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-[#512d7c] uppercase tracking-wider">Self-Paced</h4>
                      <p className="text-lg font-black text-amber-600 tracking-tight mt-1">
                        ₦{selectedCourse.prices?.self_paced?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-3 border-t border-slate-100 pt-2">On-Demand Portal</p>
                  </div>

                  {/* Option Card 2: Batch Sync */}
                  <div
                    onClick={() => setSelectedType("batch")}
                    className={`p-5 border-2 rounded-2xl cursor-pointer text-center transition-all duration-300 flex flex-col justify-between ${
                      selectedType === "batch"
                        ? "border-[#f2b42c] bg-amber-50/40 shadow-sm scale-[1.02]"
                        : "border-slate-200/80 bg-white hover:border-[#512d7c]/30"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-[#512d7c] uppercase tracking-wider">Batch Sync</h4>
                      <p className="text-lg font-black text-amber-600 tracking-tight mt-1">
                        ₦{selectedCourse.prices?.batch?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-3 border-t border-slate-100 pt-2">Live Group Cohorts</p>
                  </div>

                  {/* Option Card 3: One-on-One */}
                  <div
                    onClick={() => setSelectedType("one_on_one")}
                    className={`p-5 border-2 rounded-2xl cursor-pointer text-center transition-all duration-300 flex flex-col justify-between ${
                      selectedType === "one_on_one"
                        ? "border-[#f2b42c] bg-amber-50/40 shadow-sm scale-[1.02]"
                        : "border-slate-200/80 bg-white hover:border-[#512d7c]/30"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-[#512d7c] uppercase tracking-wider">Private 1:1</h4>
                      <p className="text-lg font-black text-amber-600 tracking-tight mt-1">
                        ₦{selectedCourse.prices?.one_on_one?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-3 border-t border-slate-100 pt-2">Dedicated Mentor</p>
                  </div>

                </div>
              </div>

              {selectedType && (
                <button
                  type="button"
                  onClick={() => handleEnroll(selectedCourse, selectedType)}
                  className="w-full py-4 bg-[#512d7c] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md hover:bg-[#3d225d] transition-all border-0 cursor-pointer transform hover:scale-[1.01]"
                >
                  Confirm Registration Model – ₦{selectedCourse.prices?.[selectedType]?.toLocaleString() || "0"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}