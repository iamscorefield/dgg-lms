"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { createBrowser } from "@/lib/supabase-client";
import toast from "react-hot-toast";

interface StudySlot {
  id?: string; // Supabase Primary Key ID if row exists
  label: string;
  time: string;
  type: "study" | "break";
  courseTitle?: string;
  moduleNo?: number;
  lessonNo?: number;
  email_reminder_enabled?: boolean;
}

export default function CalendarSlider() {
  const supabase = createBrowser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date()));
  const [currentTime, setCurrentTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Modal Modification Context Controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Field binding states
  const [inputLabel, setInputLabel] = useState("");
  const [inputCourse, setInputCourse] = useState("");
  const [inputModule, setInputModule] = useState(1);
  const [inputLesson, setInputLesson] = useState(1);
  const [inputTime, setInputTime] = useState("");

  // Default Blueprint Array Template Core Map Configuration
  const defaultBlueprint = (): StudySlot[] => [
    { label: "Lesson 1 (Deep Focus Hour)", time: "08:00 AM - 09:00 AM", type: "study", courseTitle: "01. Digital Ecosystems Foundational Prep", moduleNo: 1, lessonNo: 1, email_reminder_enabled: false },
    { label: "Lesson 2 (Deep Focus Hour + Test)", time: "09:00 AM - 10:00 AM", type: "study", courseTitle: "01. Digital Ecosystems Foundational Prep", moduleNo: 1, lessonNo: 2, email_reminder_enabled: false },
    { label: "Strategic Mental Break (Decompress)", time: "10:00 AM - 12:00 PM", type: "break" },
    { label: "Lesson 3 (Absorption Hour)", time: "12:00 PM - 01:00 PM", type: "study", courseTitle: "01. Digital Ecosystems Foundational Prep", moduleNo: 1, lessonNo: 3, email_reminder_enabled: false },
    { label: "Lesson 4 (Final Milestone Assessment)", time: "01:00 PM - 02:00 PM", type: "study", courseTitle: "01. Digital Ecosystems Foundational Prep", moduleNo: 1, lessonNo: 4, email_reminder_enabled: false },
  ];

  const [scheduleGrid, setScheduleGrid] = useState<StudySlot[]>(defaultBlueprint());

  // 1. Live Ticker Clock Context
  useEffect(() => {
    setCurrentTime(format(new Date(), "hh:mm:ss a"));
    const timer = setInterval(() => setCurrentTime(format(new Date(), "hh:mm:ss a")), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Fetch active records from Supabase on Selected Date Change
  const fetchDaySchedule = useCallback(async (dateTarget: Date) => {
    setLoading(true);
    const dateString = format(dateTarget, "yyyy-MM-dd");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("student_learning_schedules")
        .select("*")
        .eq("user_id", user.id)
        .eq("scheduled_date", dateString)
        .order("start_time", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map database scheme to local component matrix structure
        const mappedGrid: StudySlot[] = data.map((row: any) => ({
          id: row.id,
          label: row.course_title ? `Focus: Module ${row.module_number}` : "Decompression Break",
          time: row.start_time.substring(0, 5), // '08:00:00' -> '08:00'
          type: row.lesson_number === 0 ? "break" : "study",
          courseTitle: row.course_title,
          moduleNo: row.module_number,
          lessonNo: row.lesson_number,
          email_reminder_enabled: row.email_reminder_enabled,
        }));
        setScheduleGrid(mappedGrid);
      } else {
        // If no records saved for this date, default back to clear mockup state fallback
        setScheduleGrid(defaultBlueprint());
      }
    } catch (err: any) {
      console.error("Database fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDaySchedule(selectedDate);
  }, [selectedDate, fetchDaySchedule]);

  // 3. Open Modal for custom updates
  const handleOpenModifier = (index: number) => {
    const slot = scheduleGrid[index];
    setEditingIndex(index);
    setInputLabel(slot.label);
    setInputTime(slot.time);
    setInputCourse(slot.courseTitle || "");
    setInputModule(slot.moduleNo || 1);
    setInputLesson(slot.lessonNo || 1);
    setIsModalOpen(true);
  };

  // 4. Save and Commit Mutation to Supabase Row
  const handleSaveModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null) return;

    const targetDateStr = format(selectedDate, "yyyy-MM-dd");
    const currentSlot = scheduleGrid[editingIndex];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return toast.error("Session missing.");

      // Parse text inputs cleanly into proper Postgres Time stamps
      let formattedTime = inputTime;
      if (!inputTime.includes(":")) formattedTime = "08:00:00";
      if (formattedTime.length === 5) formattedTime += ":00"; // '08:00' -> '08:00:00'

      const dbPayload = {
        user_id: user.id,
        course_title: inputCourse || currentSlot.label,
        module_number: Number(inputModule),
        lesson_number: currentSlot.type === "break" ? 0 : Number(inputLesson),
        scheduled_date: targetDateStr,
        start_time: formattedTime,
        email_reminder_enabled: currentSlot.email_reminder_enabled || false,
      };

      if (currentSlot.id) {
        // Run update query if record row already exists in database
        const { error } = await supabase
          .from("student_learning_schedules")
          .update(dbPayload)
          .eq("id", currentSlot.id);
        if (error) throw error;
      } else {
        // Insert new record entry if first time setup configuration
        const { error } = await supabase
          .from("student_learning_schedules")
          .insert([dbPayload]);
        if (error) throw error;
      }

      toast.success("Schedule committed securely to database!");
      setIsModalOpen(false);
      fetchDaySchedule(selectedDate); // Re-pull data cleanly
    } catch (err: any) {
      toast.error(`Database error: ${err.message}`);
    }
  };

  // 5. Toggle Hourly SMTP Email Alert switches
  const handleToggleEmailAlert = async (index: number, currentVal: boolean) => {
    const slot = scheduleGrid[index];
    if (!slot.id) {
      toast.error("Please modify and save this hour block configuration first before activating email hooks.");
      return;
    }

    try {
      const { error } = await supabase
        .from("student_learning_schedules")
        .update({ email_reminder_enabled: !currentVal })
        .eq("id", slot.id);

      if (error) throw error;
      
      const updated = [...scheduleGrid];
      updated[index].email_reminder_enabled = !currentVal;
      setScheduleGrid(updated);
      toast.success(!currentVal ? "Hourly Email Alert Active via Resend Node" : "Email alerts paused.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAutoApplyPreset = async () => {
    const targetDateStr = format(selectedDate, "yyyy-MM-dd");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const presetData = defaultBlueprint().map((slot, i) => ({
        user_id: user.id,
        course_title: slot.courseTitle || "Strategic Break Window",
        module_number: slot.moduleNo || 1,
        lesson_number: slot.type === "break" ? 0 : slot.lessonNo || 1,
        scheduled_date: targetDateStr,
        start_time: i === 0 ? "08:00:00" : i === 1 ? "09:00:00" : i === 2 ? "10:00:00" : i === 3 ? "12:00:00" : "13:00:00",
        email_reminder_enabled: false,
      }));

      const { error } = await supabase.from("student_learning_schedules").insert(presetData);
      if (error) throw error;

      toast.success("DGG 4-Hour Matrix written successfully!");
      fetchDaySchedule(selectedDate);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  return (
    <div className="w-full bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6 text-left relative">
      
      {/* Dynamic Status Engine */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-4">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">DGG Live LMS-Space</span>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Real-Time Learning Engine
          </p>
        </div>
        <div className="bg-slate-900 text-white font-mono text-xs px-4 py-2 rounded-2xl shadow-inner tracking-wider self-start sm:self-center">
          🕒 TIME ZONE CLOCK: <span className="text-[#f2b42c] font-black">{currentTime || "Loading Ticker..."}</span>
        </div>
      </div>

      {/* Week Navigation Strip controls */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))} className="text-xs font-bold text-gray-500 hover:text-[#512d7c] transition bg-gray-50 px-3 py-1.5 rounded-xl border-0 cursor-pointer">◀ Prev Week</button>
        <h3 className="font-extrabold text-gray-800 text-sm md:text-base">{format(selectedDate, "eeee, MMMM do, yyyy")}</h3>
        <button onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))} className="text-xs font-bold text-gray-500 hover:text-[#512d7c] transition bg-gray-50 px-3 py-1.5 rounded-xl border-0 cursor-pointer">Next Week ▶</button>
      </div>

      {/* 7 Days Slider Bar Row */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all border-0 cursor-pointer ${
                isSelected ? "bg-[#512d7c] text-white shadow-xl scale-105" : "bg-slate-50 text-gray-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">{format(day, "eee")}</span>
              <span className="text-base font-black mt-0.5">{format(day, "d")}</span>
            </button>
          );
        })}
      </div>

      {/* Timeline rendering block area */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Target Allocation Track</h4>
          <button onClick={handleAutoApplyPreset} className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition cursor-pointer">
            ⚡ Auto-Apply Expert Framework Preset
          </button>
        </div>

        {loading ? (
          <p className="text-sm font-medium text-gray-400 text-center py-6">Querying calendar cells database records...</p>
        ) : (
          <div className="space-y-3">
            {scheduleGrid.map((slot, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${slot.type === "break" ? "bg-slate-50/60 border-slate-100 border-dashed" : "bg-white border-slate-100 shadow-sm"}`}>
                <div className="flex items-start gap-3.5">
                  <span className="text-xl mt-0.5">{slot.type === "break" ? "☕" : "🎯"}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm font-bold ${slot.type === "break" ? "text-gray-400 font-medium" : "text-gray-800"}`}>{slot.label}</p>
                      {slot.type === "study" && slot.moduleNo && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">M{slot.moduleNo} • L{slot.lessonNo}</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{slot.time} {slot.type === "study" && !slot.id && "(Unsaved Local Preset)"}</p>
                    {slot.courseTitle && <p className="text-xs text-[#512d7c] font-semibold mt-1 bg-purple-50/50 px-2 py-0.5 rounded-lg inline-block">📖 {slot.courseTitle}</p>}
                  </div>
                </div>

                {slot.type === "study" && (
                  <div className="flex items-center gap-4 justify-between md:justify-end self-stretch md:self-center pt-2 md:pt-0 border-t md:border-0 border-slate-50">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={slot.email_reminder_enabled || false} onChange={() => handleToggleEmailAlert(idx, slot.email_reminder_enabled || false)} className="rounded border-gray-300 text-[#512d7c] w-4 h-4 cursor-pointer" />
                      <span className="text-xs font-bold text-gray-500">Hourly Reminder</span>
                    </label>
                    <button onClick={() => handleOpenModifier(idx)} className="text-xs font-bold text-[#512d7c] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border-0 cursor-pointer">Modify Hour</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* The Dynamic Form Modification Modal Component Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSaveModification} className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-gray-100">
            <h3 className="text-base font-black text-[#512d7c] uppercase tracking-tight border-b pb-2">Modify Schedule Target Row</h3>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 block">Course Track Title Description</label>
              <input type="text" value={inputCourse} onChange={(e) => setInputCourse(e.target.value)} className="w-full text-sm font-semibold border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#512d7c]" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">Module ID Base No</label>
                <input type="number" value={inputModule} onChange={(e) => setInputModule(Number(e.target.value))} className="w-full text-sm font-semibold border border-gray-200 rounded-xl p-2.5 outline-none" min={1} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 block">Lesson Target No</label>
                <input type="number" value={inputLesson} onChange={(e) => setInputLesson(Number(e.target.value))} className="w-full text-sm font-semibold border border-gray-200 rounded-xl p-2.5 outline-none" min={1} required />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 block">Start Timestamp Hour Range (24H Format standard)</label>
              <input type="text" value={inputTime} onChange={(e) => setInputTime(e.target.value)} className="w-full text-sm font-semibold border border-gray-200 rounded-xl p-2.5 outline-none" placeholder="e.g., 08:00" required />
            </div>

            <div className="flex items-center gap-2 justify-end pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-50 rounded-xl border-0 cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-bold bg-[#512d7c] text-white rounded-xl shadow-md border-0 cursor-pointer">Commit to Database</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}