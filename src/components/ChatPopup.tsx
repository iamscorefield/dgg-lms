"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowser } from "@/lib/supabase-client";
import { MessageSquare, X, Send, AlertCircle, HelpCircle, ArrowLeft, User, GraduationCap } from "lucide-react";

interface ChatPopupProps {
  currentUserId: string;
  role: "student" | "tutor";
  courseId?: string;
}

interface RosterStudent {
  id: string;
  name: string;
  courseTitle: string;
}

export default function ChatPopup({ currentUserId, role, courseId = "GENERAL" }: ChatPopupProps) {
  const supabase = createBrowser();
  const [isOpen, setIsOpen] = useState(false);
  const [checkingAssignment, setCheckingAssignment] = useState(true);
  
  // Shared Active Chat States
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Student-Specific State
  const [assignedTutor, setAssignedTutor] = useState<{ id: string; name: string } | null>(null);

  // Tutor-Specific States
  const [studentRoster, setStudentRoster] = useState<RosterStudent[]>([]);
  const [activeStudent, setActiveStudent] = useState<RosterStudent | null>(null);

  // 1. INITIAL LOADING: Fetch assignments based on User Role
  useEffect(() => {
    async function loadInitialData() {
      try {
        if (role === "student") {
          // Student View: Find their single assigned tutor
          const { data: assignment } = await supabase
            .from("one_on_one_assignments")
            .select(`
              tutor_id,
              tutor:profiles!tutor_id(full_name)
            `)
            .limit(1)
            .maybeSingle();

          if (assignment?.tutor_id) {
            setAssignedTutor({
              id: assignment.tutor_id,
              name: (assignment.tutor as any)?.full_name || "Assigned Tutor",
            });
            
            // Instantly resolve the single chat room for the student
            await resolveChatRoom(currentUserId, assignment.tutor_id);
          }
        } else {
          // Tutor View: Fetch ALL students assigned to this tutor dashboard layout ledger
          const { data: assignments } = await supabase
            .from("one_on_one_assignments")
            .select(`
              enrollments(
                student_id,
                student:profiles!student_id(full_name),
                courses(title)
              )
            `)
            .eq("tutor_id", currentUserId);

          if (assignments) {
            const formattedRoster = assignments
              .map((item: any) => {
                const enrollment = item.enrollments;
                if (!enrollment || !enrollment.student_id) return null;
                return {
                  id: enrollment.student_id,
                  name: enrollment.student?.full_name || "DGG Student",
                  courseTitle: enrollment.courses?.title || "Core Track",
                };
              })
              .filter(Boolean) as RosterStudent[];

            setStudentRoster(formattedRoster);
          }
        }
      } catch (err) {
        console.error("LMS Chat sync exception failure:", err);
      } finally {
        setCheckingAssignment(false);
      }
    }

    loadInitialData();
  }, [currentUserId, role, supabase]);

  // 2. REAL-TIME LISTENER ENGINE: Sync incoming message payloads
  useEffect(() => {
    if (!roomId) return;

    const chatChannel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [roomId, supabase]);

  // Auto-scroller viewport tracking node configuration mapping anchor
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, activeStudent]);

  // Core business logic handler to load/create room tokens safely
  async function resolveChatRoom(studentUID: string, tutorUID: string) {
    let { data: room } = await supabase
      .from("chat_rooms")
      .select("id")
      .eq("student_id", studentUID)
      .eq("tutor_id", tutorUID)
      .maybeSingle();

    if (!room) {
      const { data: newRoom, error: roomErr } = await supabase
        .from("chat_rooms")
        .insert({ student_id: studentUID, tutor_id: tutorUID, course_id: courseId })
        .select("id")
        .single();
      
      if (!roomErr) room = newRoom;
    }

    if (room?.id) {
      setRoomId(room.id);
      const { data: historicalRows } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", room.id)
        .order("created_at", { ascending: true });
      
      if (historicalRows) setMessages(historicalRows);
    }
  }

  // Handle Tutor clicking on a specific student profile cell row
  const handleSelectStudent = async (student: RosterStudent) => {
    setActiveStudent(student);
    setMessages([]); // Clear previous buffer stream view frame quickly
    await resolveChatRoom(student.id, currentUserId);
  };

  // Exit back to main instructor inbox index list directory panel state
  const handleBackToRoster = () => {
    setActiveStudent(null);
    setRoomId(null);
    setMessages([]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId) return;

    const messagePayload = {
      room_id: roomId,
      sender_id: currentUserId,
      message_text: newMessage.trim(),
    };

    setNewMessage("");
    await supabase.from("chat_messages").insert(messagePayload);
  };

  if (checkingAssignment) return null;

  // Protect execution sequence if a tutor layout renders but has empty assignment arrays entirely
  if (role === "tutor" && studentRoster.length === 0) return null;
  if (role === "student" && !assignedTutor) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans print:hidden selection:bg-[#512d7c]/10">
      
      {/* FLOATING ACTION TRIGGER TOGGLE FAB BUTTONS */}
      {!isOpen && (
        <div onClick={() => setIsOpen(true)} className="relative flex items-center justify-center p-2 group cursor-pointer">
          {role === "student" ? (
            <>
              {/* Student Floating View Anchors */}
              <div className="hidden sm:block absolute right-16 mr-1 bg-white text-slate-700 border border-slate-200/90 shadow-xl px-4 py-2.5 rounded-2xl text-[11px] font-bold tracking-tight w-max max-w-[240px] text-right select-none transition-all group-hover:border-[#512d7c]/40 animate-in fade-in slide-in-from-right-3 duration-300">
                Need help?<span className="text-[#512d7c] font-black underline decoration-[#f2b42c] decoration-2"> Live-chat with Tutor</span>
              </div>
              <div className="sm:hidden absolute -top-1 -left-4 bg-[#f2b42c] text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[9px] shadow-md border-2 border-white uppercase tracking-wider select-none animate-bounce z-20 flex items-center gap-0.5 whitespace-nowrap">
                <HelpCircle size={10} className="stroke-[3]" /> Need Help?
              </div>
            </>
          ) : (
            /* Tutor Dashboard Pinned Action Badging Overlay UI */
            <div className="hidden sm:block absolute right-16 mr-1 bg-white text-slate-700 border border-slate-200/90 shadow-xl px-4 py-2.5 rounded-2xl text-[11px] font-bold tracking-tight w-max max-w-[240px] text-right select-none animate-in fade-in slide-in-from-right-3 duration-300">
              Active Communications: <span className="text-[#512d7c] font-black">Open Student Support Desk</span>
            </div>
          )}

          <button
            type="button"
            className="h-14 w-14 rounded-full bg-[#512d7c] hover:bg-[#3d215d] text-white flex items-center justify-center shadow-xl transition-all group-hover:scale-105 group-hover:rotate-6 border-0 cursor-pointer shrink-0 z-10"
          >
            <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* COMPONENT INTERFACE INBOX SLIDE-PANEL FRAME CONTAINER */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] h-[80vh] sm:h-[480px] max-h-[600px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* HEADER STRIP ELEMENT */}
          <div className="bg-[#512d7c] p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-left">
              {role === "tutor" && activeStudent && (
                <button 
                  onClick={handleBackToRoster}
                  className="mr-1 text-purple-200 hover:text-white bg-transparent border-0 cursor-pointer p-1 transition rounded-lg hover:bg-white/10"
                >
                  <ArrowLeft size={16} />
                </button>
              )}
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white/20 animate-pulse" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider">
                  {role === "student" ? "Tutor Workspace Chat" : activeStudent ? "Direct Student Support" : "Instructor Support Desk"}
                </h3>
                <p className="text-[11px] text-purple-200 font-medium truncate max-w-[180px] sm:max-w-[220px]">
                  {role === "student" ? assignedTutor?.name : activeStudent ? activeStudent.name : `${studentRoster.length} Linked Students`}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-purple-200 hover:text-white bg-transparent border-0 cursor-pointer p-1.5 transition-colors rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* RENDERING MATRIX ARCHITECTURE LAYER ROUTING ENGINE */}
          {role === "tutor" && !activeStudent ? (
            
            /* VIEW A: THE TUTOR ROSTER LIST INBOX TRACKS INDEX PANEL */
            <div className="flex-1 overflow-y-auto bg-slate-50 divide-y divide-slate-100 min-h-0">
              <div className="p-3 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-wider font-mono text-left">
                Assigned Student Support Roster channels
              </div>
              {studentRoster.map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="p-4 flex items-center justify-between bg-white hover:bg-purple-50/40 cursor-pointer transition text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-purple-50 text-[#512d7c] flex items-center justify-center shrink-0 border border-purple-100 font-bold text-xs uppercase tracking-tight">
                      <User size={14} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 tracking-tight group-hover:text-[#512d7c] transition-colors truncate">
                        {student.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] flex items-center gap-1 mt-0.5">
                        <GraduationCap size={12} className="text-slate-300" /> {student.courseTitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-slate-300 group-hover:text-[#512d7c] transition-all transform group-hover:translate-x-0.5 font-mono">
                    OPEN →
                  </span>
                </div>
              ))}
            </div>
          ) : (
            
            /* VIEW B: THE ACTIVE LIVE CHAT THREAD WORKSPACE COMPONENT PANEL */
            <>
              {/* Message Scroller Scrollbox Canvas */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 flex flex-col min-h-0">
                {messages.length === 0 && (
                  <div className="my-auto px-6 text-center space-y-2">
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-mono leading-relaxed">
                      👋 Secure real-time chat channel active!
                    </p>
                    <p className="text-xs text-gray-400 font-medium max-w-[240px] mx-auto leading-normal">
                      Messages sent below deliver instantly to your linked workspace dashboard ledger history track.
                    </p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-normal text-left shadow-3xs border transition-all ${
                        isMe 
                          ? "bg-[#512d7c] text-white border-purple-700/40 rounded-br-none self-end shadow-purple-900/5" 
                          : "bg-white text-slate-800 border-slate-200/80 rounded-bl-none self-start shadow-slate-200/20"
                      }`}
                    >
                      <p className="font-medium whitespace-pre-wrap break-words">{msg.message_text}</p>
                      <span className={`block text-[8px] font-mono mt-1 font-bold text-right ${isMe ? "text-purple-200" : "text-slate-400"}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Submissions Form Footer Panel Container */}
              <form onSubmit={sendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0 items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Reply to ${role === "student" ? "tutor" : "student"}...`}
                  className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#512d7c] text-slate-800 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="h-10 w-10 rounded-xl bg-[#512d7c] hover:bg-[#3d215d] disabled:opacity-40 text-white flex items-center justify-center border-0 cursor-pointer shrink-0 transition-all shadow-sm active:scale-95"
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}