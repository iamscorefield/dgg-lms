"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowser } from "@/lib/supabase-client";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import { Timer, ArrowLeft, ArrowRight, CheckCircle2, BookOpen, HelpCircle, ShieldCheck, FileText, Award, Play, Video, MoveHorizontal, X, Layers, GraduationCap, Copy, Check } from "lucide-react";

type Lesson = {
  id: number;
  title: string | null;
  full_description: string | null;
  video_url: string | null;
  pdf_url: string | null;
  sort_order: number | null;
};

type Assessment = {
  id: number;
  title: string | null;
  full_description: string | null;
  assessment_type: string | null;
  total_points: number | null;
  pdf_url: string | null;
  sort_order: number | null;
};

type CourseInfo = {
  id: string;
  title: string | null;
};

type ModuleInfo = {
  id: string;
  title: string | null;
  course_id: string;
};

type Progress = {
  id: string;
  current_lesson_index: number;
  current_assessment_index: number;
  lessons_completed: boolean;
  assessments_completed: boolean;
};

type BankQuestion = {
  id: string;
  question_index: number;
  question_type: "objective" | "theory";
  question_text: string;
  options_array: string[] | null;
  correct_option_index: number | null;
};

type LessonSlide = {
  id: string;
  slide_index: number;
  slide_title: string;
  slide_content: any; 
  practical_exercise: string | null;
  youtube_video_code?: string;
  is_video_slide?: boolean;
};

export default function LearningModulePage() {
  const supabase = createBrowser();
  const router = useRouter();
  
  const params = useParams();
  const courseId = params?.courseId as string;
  const moduleId = params?.moduleId as string; 

  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);
  const [moduleInfo, setModuleInfo] = useState<ModuleInfo | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"lesson" | "assessment">("lesson");

  // --- INTERACTIVE LESSON TEXTBOOK ENGINE STATES ---
  const [lessonActive, setLessonActive] = useState(false);
  const [lessonSlides, setLessonSlides] = useState<LessonSlide[]>([]);
  const [activeLessonSlideIndex, setActiveLessonSlideIndex] = useState(0);

  // --- COPIED STATUS MAPPING STATE ---
  const [copiedState, setCopiedState] = useState<Record<number, boolean>>({});

  // --- QUIZ SLIDER MATRIX CONTROL MOTORS ---
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<BankQuestion[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(1200); 
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const stringModuleId = useMemo(() => {
    return moduleId ? String(moduleId) : "";
  }, [moduleId]);

  // Helper function to extract a fallback simple digit string (e.g., '5') if stringModuleId is a UUID/slug
  const derivedModuleNumberString = useMemo(() => {
    if (!moduleInfo?.title) return stringModuleId;
    const match = moduleInfo.title.match(/Module\s+(\d+)/i);
    return match ? match[1] : stringModuleId;
  }, [moduleInfo, stringModuleId]);

  async function updateProgress(update: Partial<Progress>) {
    if (!progress || !userId) return;
    setSaving(true);
    try {
      const { data, error: updError } = await supabase
        .from("user_module_progress")
        .update({ ...update, updated_at: new Date().toISOString() })
        .eq("id", progress.id)
        .select("*")
        .single();
      if (updError || !data) throw new Error("Could not update progress.");
      setProgress(data);
    } catch (err: any) {
      toast.error(err.message || "Error updating progress metrics.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      if (!moduleId) return;
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("You must be signed in to view this course.");
        }
        setUserId(user.id);
        setUserEmail(user.email || "unknown@student.dglobalgrowthfield.com");

        if (courseId) {
          const { data: courseData } = await supabase
            .from("courses")
            .select("id, title")
            .eq("id", courseId)
            .maybeSingle();
          if (courseData) setCourseInfo(courseData);
        }

        const { data: moduleData, error: moduleError } = await supabase
          .from("course_modules")
          .select("id, title, course_id")
          .eq("id", stringModuleId)
          .single();
        if (moduleError || !moduleData) {
          throw new Error("Module not found matching parameters.");
        }
        setModuleInfo(moduleData as unknown as ModuleInfo);

        const { data: lessonsData, error: lessonsError } = await supabase
          .from("module_lessons")
          .select("*")
          .eq("module_id", stringModuleId)
          .order("sort_order", { ascending: true });
        if (lessonsError) throw new Error("Could not load lessons.");
        setLessons((lessonsData || []) as Lesson[]);

        const { data: assessmentsData, error: assessmentsError } = await supabase
          .from("module_assessments")
          .select("*")
          .eq("module_id", stringModuleId)
          .order("sort_order", { ascending: true });
        if (assessmentsError) throw new Error("Could not load assessments.");
        setAssessments((assessmentsData || []) as Assessment[]);

        const { data: progressData, error: progressError } = await supabase
          .from("user_module_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("module_id", stringModuleId)
          .maybeSingle();

        if (progressError && progressError.code !== "PGRST116") {
          throw new Error("Could not load progress.");
        }

        if (!progressData) {
          const { data: newProgress, error: createError } = await supabase
            .from("user_module_progress")
            .insert({
              user_id: user.id,
              module_id: stringModuleId,
              current_lesson_index: 0,
              current_assessment_index: 0,
              lessons_completed: false,
              assessments_completed: false,
            })
            .select("*")
            .single();
          if (createError || !newProgress) throw new Error("Could not initialize progress.");
          setProgress(newProgress);
        } else {
          setProgress(progressData);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading module container elements.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [moduleId, stringModuleId, courseId, supabase]);

  useEffect(() => {
    if (!quizActive || timeLeft <= 0) {
      if (timeLeft === 0 && quizActive) handleAutoSubmitQuiz();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [quizActive, timeLeft]);

  const currentLesson = useMemo(() => {
    if (!lessons.length) return null;
    const index = progress?.current_lesson_index ?? 0;
    return lessons[Math.min(index, lessons.length - 1)];
  }, [lessons, progress]);

  const currentAssessment = useMemo(() => {
    if (!assessments.length) return null;
    const index = progress?.current_assessment_index ?? 0;
    return assessments[Math.min(index, assessments.length - 1)];
  }, [assessments, progress]);

  async function syncEnrollmentLedger(isFinished: boolean, lessonId: string) {
    if (!userId || !courseId) return;
    
    const lessonsCount = lessons.length || 1;
    const currentIndex = progress?.current_lesson_index ?? 0;
    const completedCount = isFinished ? lessonsCount : currentIndex + 1;
    const calculatedPercentage = Math.min(Math.round((completedCount / lessonsCount) * 100), 100);

    try {
      await supabase
        .from("user_enrollments")
        .upsert({
          user_id: userId,
          course_id: courseId,
          status: isFinished ? "completed" : "in_progress",
          progress_map: {
            current_lesson_id: lessonId || `lesson_node_${currentIndex}`,
            completed_percentage: calculatedPercentage,
            updated_timestamp: new Date().toISOString()
          }
        }, { onConflict: "user_id,course_id" });
    } catch (err) {
      console.error("Failed database synchronizer upstream:", err);
    }
  }

  const handleSelectObjectiveOption = (questionId: string, optionIndex: number) => {
    setStudentAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleTypeTheoryResponse = (questionId: string, text: string) => {
    setStudentAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const launchInteractiveLessonSlides = async () => {
    setLoading(true);
    try {
      const lessonTargetNumber = (progress?.current_lesson_index ?? 0) + 1;
      
      // 🚀 FIRST ATTEMPT: Try querying with the direct string module parameter
      let response = await supabase
        .from("lesson_slides")
        .select("*")
        .eq("course_id", courseId)
        .eq("module_id", stringModuleId)
        .eq("lesson_number", lessonTargetNumber)
        .order("slide_index", { ascending: true });

      // 🔄 AUTOMATED FALLBACK: If 0 rows return, query using the single digit index number (e.g. '5')
      if ((!response.data || response.data.length === 0) && derivedModuleNumberString !== stringModuleId) {
        response = await supabase
          .from("lesson_slides")
          .select("*")
          .eq("course_id", courseId)
          .eq("module_id", derivedModuleNumberString)
          .eq("lesson_number", lessonTargetNumber)
          .order("slide_index", { ascending: true });
      }

      if (response.error || !response.data || response.data.length === 0) {
        toast.error("⚠️ No classroom slides have been deployed for this specific unit yet.");
        setLessonSlides([]);
        setLessonActive(false);
      } else {
        const formattedSlides = response.data.map((slide: any) => {
          return {
            ...slide,
            is_video_slide: slide.slide_index === 7 || !!slide.youtube_video_code
          };
        });
        setLessonSlides(formattedSlides);
        setActiveLessonSlideIndex(0);
        setQuizActive(false);
        setLessonActive(true);
      }

      if (currentLesson && response.data && response.data.length > 0) {
        await syncEnrollmentLedger(false, String(currentLesson.id));
      }
    } catch (err) {
      toast.error("Fault parsing lesson text streams.");
    } finally {
      setLoading(false);
    }
  };

  const launchInteractiveSliderQuiz = async () => {
    if (!currentAssessment) return;
    setLoading(true);
    try {
      const lessonTargetNumber = (progress?.current_assessment_index ?? 0) + 1;
      
      // 🚀 FIRST ATTEMPT: Query quiz questions using the route parameters
      let response = await supabase
        .from("assessment_banks")
        .select("*")
        .eq("course_id", courseId)
        .eq("module_id", stringModuleId)
        .eq("lesson_number", lessonTargetNumber)
        .order("question_index", { ascending: true });

      // 🔄 AUTOMATED FALLBACK: Try querying with the single sequential digit string if empty
      if ((!response.data || response.data.length === 0) && derivedModuleNumberString !== stringModuleId) {
        response = await supabase
          .from("assessment_banks")
          .select("*")
          .eq("course_id", courseId)
          .eq("module_id", derivedModuleNumberString)
          .eq("lesson_number", lessonTargetNumber)
          .order("question_index", { ascending: true });
      }

      if (response.error || !response.data || response.data.length === 0) {
        toast.error("⚠️ No active assessment data found inside Supabase for this checkpoint.");
        setQuizQuestions([]);
        setQuizActive(false);
      } else {
        setQuizQuestions(response.data as BankQuestion[]);
        setStudentAnswers({});
        setActiveSlideIndex(0);
        setTimeLeft(1200);
        setLessonActive(false);
        setQuizActive(true);
      }
    } catch (err) {
      toast.error("Could not trace local curriculum components.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmitQuiz = () => {
    toast.error("Time expired. Closing slide deck matrix for server grading.");
    processQuizCalculations();
  };

  const processQuizCalculations = async () => {
    if (!userId || quizQuestions.length === 0) return;
    setSubmittingQuiz(true);

    try {
      let totalObjectives = 0;
      let correctObjectives = 0;

      quizQuestions.forEach(q => {
        if (q.question_type === "objective") {
          totalObjectives++;
          if (studentAnswers[q.id] === q.correct_option_index) correctObjectives++;
        }
      });

      const objectiveScore = totalObjectives > 0 ? (correctObjectives / totalObjectives) * 100 : 100;
      const passCleared = objectiveScore >= 80;

      if (passCleared && progress && (progress.current_assessment_index + 1) >= assessments.length) {
        await supabase.from("certifications").insert({
          id: `DGG-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          user_id: userId,
          track_name: courseInfo?.title || moduleInfo?.title || "DGG Academy Track Graduate",
          completion_date: new Date().toISOString().split('T')[0],
          average_assessment_score: objectiveScore,
          verification_status: "verified"
        });
        
        const currentId = currentLesson ? String(currentLesson.id) : "final_node";
        await syncEnrollmentLedger(true, currentId);
        toast.success("🎓 Complete Master Track Certification Cleared and Signed!");
      }

      if (passCleared) {
        toast.success(`Assessment Passed! Score: ${objectiveScore.toFixed(0)}%`);
        setQuizActive(false);
        await handleNextAssessment();
      } else {
        toast.error(`Score: ${objectiveScore.toFixed(0)}%. You must score 80% or greater to unlock the next block. Please try again!`);
        setQuizActive(false);
      }
    } catch (err) {
      toast.error("Grade computation transaction fault encountered.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleNextLesson = async () => {
    if (!progress) return;
    const nextIndex = progress.current_lesson_index + 1;
    const currentId = currentLesson ? String(currentLesson.id) : "unknown_node";

    if (nextIndex >= lessons.length) {
      await updateProgress({ current_lesson_index: lessons.length - 1, lessons_completed: true });
      await syncEnrollmentLedger(true, currentId);
      if (assessments.length > 0) setActiveTab("assessment");
    } else {
      await updateProgress({ current_lesson_index: nextIndex });
      await syncEnrollmentLedger(false, currentId);
    }
  };

  const handleNextAssessment = async () => {
    if (!progress) return;
    const nextIndex = progress.current_assessment_index + 1;
    if (nextIndex >= assessments.length) {
      await updateProgress({ current_assessment_index: assessments.length - 1, assessments_completed: true });
      router.push(`/dashboard/learning/${courseId}`);
    } else {
      await updateProgress({ current_assessment_index: nextIndex });
    }
  };

  const formatTimerString = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedState(prev => ({ ...prev, [index]: true }));
    toast.success("Blueprint configurations securely copied to dashboard clipboard.");
    setTimeout(() => {
      setCopiedState(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

  const activeQuestionNode = quizQuestions[activeSlideIndex];
  const activeAnswerIsProvided = activeQuestionNode ? studentAnswers[activeQuestionNode.id] !== undefined && studentAnswers[activeQuestionNode.id] !== "" : false;
  
  const activeLessonSlideNode = lessonSlides[activeLessonSlideIndex];

  return (
    <div className="flex min-h-screen bg-[#faf9fc] text-slate-800 font-sans antialiased">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-3 sm:p-6 lg:p-10 w-full max-w-full overflow-x-hidden">
        
        {lessonActive && activeLessonSlideNode ? (
          /* --- TEXTBOOK SLIDER CONSOLE --- */
          <div className="w-full max-w-3xl mx-auto bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl text-left transition-all duration-300 animate-fadeIn">
            <div className="bg-[#512d7c] p-4 sm:p-6 text-white flex items-start justify-between gap-4">
              <div className="space-y-1 text-left min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[10px] bg-white/15 px-2.5 py-0.5 rounded font-black tracking-wider uppercase text-purple-100 font-mono flex items-center gap-1">
                    <Layers size={10} /> Module {derivedModuleNumberString} • Lesson {(progress?.current_lesson_index !== undefined) ? (progress.current_lesson_index + 1) : 1}
                  </span>
                  <span className="text-[10px] bg-[#f2b42c] text-[#1b102b] px-2 py-0.5 rounded font-black tracking-wide uppercase font-mono">
                    Slide {activeLessonSlideIndex + 1} of {lessonSlides.length}
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-black text-white truncate mt-1 tracking-tight uppercase flex items-center gap-1">
                  <GraduationCap size={14} className="text-[#f2b42c] shrink-0" />
                  {courseInfo?.title || "Basic Computer and Internet Skills for Absolute Beginners"}
                </h2>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-[9px] font-black tracking-widest text-purple-200 uppercase truncate max-w-[120px]">{moduleInfo?.title || `Module ${derivedModuleNumberString}`}</p>
                  <p className="text-xs font-black text-[#f2b42c] font-mono">L-{progress ? progress.current_lesson_index + 1 : 1} S-{activeLessonSlideIndex + 1}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setLessonActive(false)}
                  className="p-2 hover:bg-white/10 rounded-xl text-purple-200 hover:text-white transition bg-transparent border-0 cursor-pointer flex-shrink-0"
                  title="Close Console"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-1.5">
              <div className="bg-[#f2b42c] h-full transition-all duration-300" style={{ width: `${((activeLessonSlideIndex + 1) / lessonSlides.length) * 100}%` }} />
            </div>

            <div className="p-4 sm:p-8 min-h-[360px] flex flex-col justify-between">
              <div className="space-y-5">
                <span className="text-xs font-black text-[#512d7c] uppercase tracking-wider block">§ {activeLessonSlideNode.slide_title}</span>
                
                <div className="space-y-4 text-left">
                  {(() => {
                    try {
                      const blocks = typeof activeLessonSlideNode.slide_content === 'string' 
                        ? JSON.parse(activeLessonSlideNode.slide_content) 
                        : activeLessonSlideNode.slide_content;

                      if (!Array.isArray(blocks)) throw new Error();

                      return blocks.map((block: any, bIdx: number) => {
                        switch (block.type) {
                          case 'heading':
                            return <h3 key={bIdx} className="text-base sm:text-lg font-black text-[#512d7c] mt-6 mb-2 uppercase tracking-wide">{block.text}</h3>;
                          
                          case 'paragraph':
                            return <p key={bIdx} className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed mb-3 text-justify">{block.text}</p>;
                          
                          case 'code':
                            return (
                              <div key={bIdx} className="relative my-5 rounded-xl overflow-hidden border border-purple-950/40 shadow-md">
                                <div className="bg-[#1b102b] px-4 py-2 flex items-center justify-between border-b border-purple-950/30">
                                  <span className="text-[10px] uppercase font-mono font-black tracking-widest text-purple-300/80">Offline Dev Engine Terminal</span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(block.text, bIdx)}
                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-200 hover:text-white transition bg-transparent border-0 cursor-pointer"
                                  >
                                    {copiedState[bIdx] ? (
                                      <>
                                        <Check size={12} className="text-emerald-400" /> Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy size={12} /> Copy Workspace
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="bg-[#2E1A47] p-4 overflow-x-auto text-purple-50 text-xs font-mono leading-relaxed whitespace-pre font-semibold selection:bg-purple-800">
                                  {block.text}
                                </pre>
                              </div>
                            );

                          case 'bullet-list':
                            return (
                              <ul key={bIdx} className="list-disc pl-5 space-y-2 my-3">
                                {block.items.map((item: string, iIdx: number) => (
                                  <li key={iIdx} className="text-sm font-semibold text-slate-600 line-height-relaxed">{item}</li>
                                ))}
                              </ul>
                            );

                          case 'numbered-list':
                            return (
                              <ol key={bIdx} className="list-decimal pl-5 space-y-3 my-3">
                                {block.items.map((item: string, iIdx: number) => (
                                  <li key={iIdx} className="text-sm font-semibold text-slate-600 leading-relaxed">{item}</li>
                                ))}
                              </ol>
                            );

                          case 'callout':
                            return (
                              <div key={bIdx} className="border-l-4 border-amber-500 bg-amber-50/60 p-4 rounded-r-xl my-4">
                                <h5 className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">{block.title}</h5>
                                <p className="text-xs font-bold text-amber-950 leading-relaxed">{block.text}</p>
                              </div>
                            );

                          case 'table':
                            return (
                              <div key={bIdx} className="space-y-2 my-6">
                                <div className="flex md:hidden items-center gap-1.5 text-[10px] font-black text-[#512d7c] bg-purple-50/70 border border-purple-200/50 w-fit px-2.5 py-1 rounded-md tracking-wider uppercase animate-pulse">
                                  <MoveHorizontal size={12} /> Swipe left / right to view table edges
                                </div>
                                
                                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-3xs bg-white">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="bg-slate-50 border-b border-slate-200">
                                        {block.headers.map((h: string, hIdx: number) => (
                                          <th key={hIdx} className="p-3 font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {block.rows.map((row: string[], rIdx: number) => (
                                        <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                                          {row.map((cell: string, cIdx: number) => (
                                            <td key={cIdx} className="p-3 font-semibold text-slate-700">{cell}</td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            );

                          default:
                            return null;
                        }
                      });
                    } catch (e) {
                      return <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{String(activeLessonSlideNode.slide_content)}</p>;
                    }
                  })()}
                </div>

                {activeLessonSlideNode.is_video_slide && (
                  <div className="mt-4 relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md animate-fadeIn">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-0"
                      src={`https://www.youtube.com/embed/${activeLessonSlideNode.youtube_video_code || "q5O_stfJsBU"}?autoplay=0&rel=0&modestbranding=1`}
                      title="DGG Academy Masterclass Visual Workshop"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {activeLessonSlideNode.practical_exercise && (
                  <div className={`border rounded-xl p-4 mt-4 transition-all ${activeLessonSlideNode.is_video_slide ? 'bg-purple-50/40 border-purple-200' : 'bg-amber-50 border-amber-200/70'}`}>
                    <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${activeLessonSlideNode.is_video_slide ? 'text-[#512d7c]' : 'text-amber-800'}`}>
                      {activeLessonSlideNode.is_video_slide ? "🎬 CORE WORKSHOP TASK" : "🛠️ Practical Field Activity Work"}
                    </h4>
                    <p className={`text-xs font-bold mt-1.5 leading-relaxed ${activeLessonSlideNode.is_video_slide ? 'text-purple-950' : 'text-amber-900'}`}>
                      {activeLessonSlideNode.practical_exercise}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  disabled={activeLessonSlideIndex === 0}
                  onClick={() => setActiveLessonSlideIndex(prev => prev - 1)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition-all"
                >
                  Previous
                </button>

                {activeLessonSlideIndex + 1 < lessonSlides.length ? (
                  <button
                    type="button"
                    onClick={() => setActiveLessonSlideIndex(prev => prev + 1)}
                    className="px-4 py-2.5 bg-[#512d7c] hover:bg-[#3d215d] text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 shadow-xs flex items-center gap-1.5"
                  >
                    Next Slide <ArrowRight size={12} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
                      setLessonActive(false);
                      await handleNextLesson();
                      setActiveTab("assessment");
                      toast.success("Lesson Complete! Verification checkpoint unlocked.");
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 shadow-sm flex items-center gap-1"
                  >
                    Proceed to Assessment <Award size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : quizActive && activeQuestionNode ? (
          /* --- ASSESSMENT MATRIX SLIDER --- */
          <div className="w-full max-w-3xl mx-auto bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl text-left animate-fadeIn">
            <div className="bg-[#512d7c] p-4 sm:p-6 text-white flex items-start justify-between gap-4">
              <div className="space-y-1 text-left min-w-0 flex-1">
                <p className="text-[10px] font-black text-purple-200 tracking-wider uppercase truncate font-mono">
                  {courseInfo?.title || "Basic Computer and Internet Skills for Absolute Beginners"}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
                  <h2 className="text-sm sm:text-base font-black text-white tracking-wide uppercase flex items-center gap-1">
                    <Layers size={13} className="text-[#f2b42c]" /> Module {derivedModuleNumberString} Checkpoint {(progress?.current_assessment_index !== undefined) ? (progress.current_assessment_index + 1) : 1}
                  </h2>
                  <span className="text-[10px] bg-[#f2b42c] text-[#1b102b] px-2 py-0.5 rounded font-black font-mono">
                    Q {activeSlideIndex + 1} / {quizQuestions.length}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-black text-purple-200 block uppercase max-w-[120px] truncate">{moduleInfo?.title}</span>
                  <span className="text-xs font-mono font-black text-[#f2b42c] flex items-center gap-1 mt-0.5 bg-white/10 px-2 py-0.5 rounded border border-white/5">
                    <Timer size={12} /> {formatTimerString(timeLeft)}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to suspend this active evaluation node?")) setQuizActive(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-xl text-purple-200 hover:text-white transition bg-transparent border-0 cursor-pointer flex-shrink-0"
                  title="Suspend Quiz"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-1.5">
              <div className="bg-[#f2b42c] h-full transition-all duration-300" style={{ width: `${((activeSlideIndex + 1) / quizQuestions.length) * 100}%` }} />
            </div>

            <div className="p-4 sm:p-8 min-h-[280px] flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{activeQuestionNode.question_text}</h3>

                {activeQuestionNode.question_type === "objective" && activeQuestionNode.options_array && (
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeQuestionNode.options_array.map((option, idx) => {
                      const isSelected = studentAnswers[activeQuestionNode.id] === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectObjectiveOption(activeQuestionNode.id, idx)}
                          className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected ? "border-[#512d7c] bg-purple-50/70 text-[#512d7c] ring-1 ring-[#512d7c]" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span>{option}</span>
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? "border-[#512d7c] bg-[#512d7c]" : "border-slate-300 bg-white"}`}>
                            {isSelected && <div className="h-1 w-1 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeQuestionNode.question_type === "theory" && (
                  <textarea
                    rows={5}
                    value={studentAnswers[activeQuestionNode.id] || ""}
                    onChange={(e) => handleTypeTheoryResponse(activeQuestionNode.id, e.target.value)}
                    placeholder="Provide your summary brief context learnings here manually to submit..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium rounded-xl focus:outline-none focus:bg-white focus:border-[#512d7c] transition-all resize-none shadow-3xs"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-slate-100 mt-8">
                <button
                  type="button"
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex(prev => prev - 1)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  Back
                </button>

                {activeSlideIndex + 1 < quizQuestions.length ? (
                  <button
                    type="button"
                    disabled={!activeAnswerIsProvided}
                    onClick={() => setActiveSlideIndex(prev => prev + 1)}
                    className="px-4 py-2.5 bg-[#512d7c] hover:bg-[#3d215d] text-white text-xs font-black uppercase tracking-wider rounded-xl disabled:opacity-50 cursor-pointer border-0"
                  >
                    Next Card
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!activeAnswerIsProvided || submittingQuiz}
                    onClick={processQuizCalculations}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl disabled:opacity-50 cursor-pointer border-0 shadow-xs"
                  >
                    {submittingQuiz ? "Submitting..." : "Finalize Assessment"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* --- STANDARD COURSE PORTAL SYLLABUS LAYOUT --- */
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="text-left">
                <span className="text-[10px] bg-purple-100 text-[#512d7c] px-3 py-1 rounded font-black tracking-wider uppercase font-mono">
                  Module {derivedModuleNumberString} Panel Layout
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#512d7c] tracking-tight uppercase mt-1">
                  {moduleInfo ? moduleInfo.title : "Module Workspace"}
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Interact sequentially with learning assets, verify progress checkpoints, and unlock upcoming tracks.
                </p>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/learning/${courseId}`)}
                className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 cursor-pointer transition shadow-3xs w-fit"
              >
                Back to course
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 space-y-4 shadow-3xs">
                <div className="flex border-b border-slate-200/60 mb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("lesson")}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-black bg-transparent cursor-pointer border-0 transition-all border-b-2 ${
                      activeTab === "lesson" ? "border-[#512d7c] text-[#512d7c]" : "border-transparent text-slate-400"
                    }`}
                  >
                    Lesson Syllabus
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("assessment")}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-black bg-transparent cursor-pointer border-0 transition-all border-b-2 ${
                      activeTab === "assessment" ? "border-[#512d7c] text-[#512d7c]" : "border-transparent text-slate-400"
                    }`}
                  >
                    Interactive Checkpoints
                  </button>
                </div>

                {activeTab === "lesson" ? (
                  currentLesson ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left p-5 bg-slate-50 border border-slate-200/60 rounded-2xl">
                      <div className="min-w-0 space-y-1">
                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                          Unit {progress ? progress.current_lesson_index + 1 : 1}: {currentLesson.title}
                        </h2>
                        {currentLesson.full_description && (
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">{currentLesson.full_description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={launchInteractiveLessonSlides}
                        className="shrink-0 px-5 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-[#512d7c] text-white hover:bg-[#3f2160] w-full sm:w-auto text-center border-0 cursor-pointer shadow-3xs transition-all"
                      >
                        Launch Slides
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-medium text-left py-4">No units available inside this track block.</p>
                  )
                ) : currentAssessment ? (
                  <div className="flex flex-col gap-4 text-left p-5 bg-slate-50 border border-slate-200/60 rounded-2xl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/40 pb-4">
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-black px-2 py-0.5 rounded uppercase font-mono">
                          <ShieldCheck size={10} /> Live Grading Active
                        </span>
                        <h2 className="text-sm sm:text-base font-black text-slate-900 mt-1 uppercase tracking-wide">
                          Checkpoint {progress ? progress.current_assessment_index + 1 : 1}: {currentAssessment.title}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={launchInteractiveSliderQuiz}
                        className="shrink-0 px-5 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-[#512d7c] text-white hover:bg-[#3f2160] w-full sm:w-auto text-center border-0 cursor-pointer shadow-sm transition"
                      >
                        Start Assessment
                      </button>
                    </div>
                    <div className="bg-white border border-slate-200/60 p-4 rounded-xl">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5"><BookOpen size={13} /> Evaluation Parameters</h4>
                      <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                        This unit sequence builds **8 Objective Multiple Choice Cards** linked natively inside your validation tables. You must achieve an accuracy rate of **80% or greater** to push your tracking metrics forward.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-medium text-left py-4">No validation targets ready inside this module container block.</p>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  {activeTab === "lesson" && lessons.length > 0 && (
                    <button
                      type="button"
                      onClick={handleNextLesson}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2.5 text-xs font-black uppercase rounded-xl bg-[#512d7c] text-white hover:bg-[#3f2160] disabled:opacity-60 border-0 cursor-pointer transition shadow-3xs"
                    >
                      {progress && progress.current_lesson_index + 1 >= lessons.length ? "Mark syllabus done" : "Next lesson"}
                    </button>
                  )}

                  {activeTab === "assessment" && assessments.length > 0 && (
                    <button
                      type="button"
                      onClick={handleNextAssessment}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2.5 text-xs font-black uppercase rounded-xl bg-[#512d7c] text-white hover:bg-[#3f2160] disabled:opacity-60 border-0 cursor-pointer transition shadow-3xs"
                    >
                      {progress && progress.current_assessment_index + 1 >= assessments.length ? "Finish module" : "Next assessment"}
                    </button>
                  )}
                </div>
              </div>

              {/* Sidebar Syllabus Panels */}
              <div className="space-y-4 text-left">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-3xs">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1"><BookOpen size={13} /> Unit Directory</h2>
                  <div className="space-y-1.5 max-h-[220px] overflow-auto pr-1">
                    {lessons.map((lesson, index) => {
                      const isCurrent = activeTab === "lesson" && progress?.current_lesson_index === index;
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            setActiveTab("lesson");
                            if (progress && progress.current_lesson_index !== index) updateProgress({ current_lesson_index: index });
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            isCurrent ? "border-[#512d7c] bg-purple-50 text-[#512d7c] font-black" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                          }`}
                        >
                          Lesson {index + 1}. {lesson.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-3xs">
                  <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1"><HelpCircle size={13} /> Exam Milestones</h2>
                  <div className="space-y-1.5 max-h-[220px] overflow-auto pr-1">
                    {assessments.map((assessment, index) => {
                      const isCurrent = activeTab === "assessment" && progress?.current_assessment_index === index;
                      return (
                        <button
                          key={assessment.id}
                          type="button"
                          onClick={() => {
                            setActiveTab("assessment");
                            if (progress && progress.current_assessment_index !== index) updateProgress({ current_assessment_index: index });
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                            isCurrent ? "border-[#512d7c] bg-purple-50 text-[#512d7c] font-black" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                          }`}
                        >
                          Quiz {index + 1}. {assessment.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}