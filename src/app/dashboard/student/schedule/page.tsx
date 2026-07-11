import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import CalendarSlider from "../CalendarSlider";

export default async function StudentSchedulePage() {
  const supabase = await createServer();
  const { data: { session } } = await supabase.auth.getSession();

  // Route security gate authentication interceptor
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-800">
      
      {/* Sidebar Navigation Component Element */}
      <Sidebar role="student" />

      {/* Main Dashboard Workspace Node Content Body Container */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 space-y-8">
        
        {/* Title Header Section Layout Matrix */}
        <div className="text-left bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-[#512d7c] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#512d7c] tracking-tight uppercase">
              Learning Schedule Matrix
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 pl-4">
            Command your 4-hour micro-focus daily learning intervals, structure lesson milestones, and check weekly curriculum velocity blocks.
          </p>
        </div>

        {/* The Interactive Schedule Ribbon & Custom Modal Engine */}
        <div className="w-full">
          <CalendarSlider />
        </div>
        
      </div>
    </div>
  );
}