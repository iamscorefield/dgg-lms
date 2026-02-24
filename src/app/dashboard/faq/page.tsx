import Sidebar from "@/components/Sidebar";
import { createServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const FAQ_ITEMS = [
  {
    question: "How do I join a live class?",
    answer:
      "Once you enroll in a course, you’ll see your live class schedule and links inside the course area. Click “Join live session” a few minutes before the start time.",
  },
  {
    question: "Can I learn at my own pace?",
    answer:
      "Yes. Most programs include recorded lessons you can watch anytime, plus optional live sessions and one‑to‑one support.",
  },
  {
    question: "How do payments and refunds work?",
    answer:
      "Payments are processed securely online. For specific refund or reschedule policies, check the course details or contact support before enrolling.",
  },
  {
    question: "Will I get a certificate?",
    answer:
      "For eligible programs, you’ll receive a digital certificate once you complete all required modules and assessments.",
  },
  {
    question: "How do I contact my tutor?",
    answer:
      "Inside each course, you’ll find tutor contact options (chat, email, or scheduled calls) depending on the program.",
  },
];

export default async function FAQPage() {
  const supabase = await createServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-[#512d7c] mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-gray-700 mb-8 max-w-2xl">
          Quick answers to common questions about using DGG Academy as a
          student.
        </p>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
            >
              <summary className="cursor-pointer text-sm sm:text-base font-semibold text-[#512d7c]">
                {item.question}
              </summary>
              <p className="mt-2 text-sm text-gray-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
