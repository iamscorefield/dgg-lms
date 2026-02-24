// src/components/CourseGrid.tsx
"use client";

import { useState, useEffect } from "react";
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
      },
      onClose: () => toast.error("Payment cancelled"),
    });
    handler.openIframe();
  };

  return (
    <section id="courses" className="py-4 bg-white">
      <div className="max-w-7xl mx-auto px-0">
        <h2 className="text-3xl md:text-4xl font-bold text-[#512d7c] mb-8">
          Our Available Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="text-6xl mb-6 text-center">
                {course.department === "Tech"
                  ? "💻"
                  : course.department === "Business"
                  ? "📈"
                  : course.department === "Design"
                  ? "🎨"
                  : "📚"}
              </div>
              <h3 className="text-2xl font-bold text-[#512d7c] mb-4 text-center">
                {course.title}
              </h3>
              <p className="text-gray-800 mb-6 line-clamp-4 text-center">
                {course.description}
              </p>
              <button className="w-full py-3 bg-[#512d7c] text-white font-medium rounded-lg hover:bg-[#3f2361] transition">
                View Details & Enroll
              </button>
            </div>
          ))}
        </div>

        {selectedCourse && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCourse(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-6 text-4xl text-gray-600 hover:text-gray-900"
                onClick={() => setSelectedCourse(null)}
              >
                ×
              </button>
              <h2 className="text-4xl font-bold text-[#512d7c] mb-6 text-center">
                {selectedCourse.title}
              </h2>
              <p className="text-lg text-gray-800 mb-8 text-center">
                {selectedCourse.description}
              </p>

              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#512d7c] mb-4 text-center">
                  What You Will Learn
                </h3>
                <ul className="list-disc pl-6 space-y-3 text-gray-800 text-lg">
                  {selectedCourse.what_you_learn?.map((item, i) => (
                    <li key={i}>{item}</li>
                  )) || <li>No details available yet</li>}
                </ul>
              </div>

              {selectedCourse.duration && (
                <div className="mb-10 text-center">
                  <p className="text-lg text-gray-800">
                    <span className="font-bold">Duration:</span>{" "}
                    {selectedCourse.duration}
                  </p>
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-2xl font-bold text-[#512d7c] mb-6 text-center">
                  Choose Your Learning Type
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div
                    onClick={() => setSelectedType("self_paced")}
                    className={`p-6 border-2 rounded-xl cursor-pointer text-center transition ${
                      selectedType === "self_paced"
                        ? "border-[#f2b42c] bg-[#f2b42c]/10"
                        : "border-gray-200 hover:border-[#f2b42c]"
                    }`}
                  >
                    <h4 className="text-xl font-bold text-[#512d7c]">
                      Self-Paced
                    </h4>
                    <p className="text-3xl font-bold text-[#f2b42c] mt-2">
                      ₦{selectedCourse.prices.self_paced.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Learn at your own pace
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedType("batch")}
                    className={`p-6 border-2 rounded-xl cursor-pointer text-center transition ${
                      selectedType === "batch"
                        ? "border-[#f2b42c] bg-[#f2b42c]/10"
                        : "border-gray-200 hover:border-[#f2b42c]"
                    }`}
                  >
                    <h4 className="text-xl font-bold text-[#512d7c]">
                      Batch
                    </h4>
                    <p className="text-3xl font-bold text-[#f2b42c] mt-2">
                      ₦{selectedCourse.prices.batch.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Live group sessions
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedType("one_on_one")}
                    className={`p-6 border-2 rounded-xl cursor-pointer text-center transition ${
                      selectedType === "one_on_one"
                        ? "border-[#f2b42c] bg-[#f2b42c]/10"
                        : "border-gray-200 hover:border-[#f2b42c]"
                    }`}
                  >
                    <h4 className="text-xl font-bold text-[#512d7c]">
                      One-on-One
                    </h4>
                    <p className="text-3xl font-bold text-[#f2b42c] mt-2">
                      ₦{selectedCourse.prices.one_on_one.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Personalized tutoring
                    </p>
                  </div>
                </div>
              </div>

              {selectedType && (
                <button
                  onClick={() => handleEnroll(selectedCourse, selectedType)}
                  className="w-full py-5 bg-[#f2b42c] text-black text-2xl font-bold rounded-full shadow-xl hover:bg-[#e0a51a] transition-all duration-300"
                >
                  Enroll in {selectedType.replace("_", " ")} – ₦
                  {selectedCourse.prices[selectedType].toLocaleString()}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
