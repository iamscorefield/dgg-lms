export default function TrainingModels() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#512d7c] text-center mb-16">
          Our Three Learning Models
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow hover:shadow-xl transition">
            <div className="text-6xl mb-6 text-center">👨🏽‍💻</div>
            <h3 className="text-2xl font-bold text-[#512d7c] mb-6 text-center">
              Self-Paced Learning
            </h3>
            <p className="text-gray-800 text-lg mb-6 text-center">
              Learn at your own speed with high-quality recorded videos, PDFs, quizzes, and lifetime access.
            </p>
            <ul className="text-gray-800 space-y-3">
              <li>Flexible schedule – anytime, anywhere</li>
              <li>Downloadable resources & notes</li>
              <li>Self-assessment quizzes</li>
              <li>Certificate on completion</li>
            </ul>
          </div>

          <div className="bg-[#512d7c] p-8 rounded-2xl shadow-xl text-white">
            <div className="text-6xl mb-6 text-center text-white">🧑‍🧑‍🧒‍🧒</div>
            <h3 className="text-2xl font-bold mb-6 text-center">
              Batch Training (Live Group)
            </h3>
            <p className="text-gray-200 text-lg mb-6 text-center">
              Join live interactive group sessions with fixed schedules, peer interaction, and direct instructor support.
            </p>
            <ul className="text-gray-200 space-y-3">
              <li>Live Zoom classes & recordings</li>
              <li>Group discussions & networking</li>
              <li>Weekly assignments + feedback</li>
              <li>Community support group</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow hover:shadow-xl transition">
            <div className="text-6xl mb-6 text-center">👥</div>
            <h3 className="text-2xl font-bold text-[#512d7c] mb-6 text-center">
              One-on-One Tutoring
            </h3>
            <p className="text-gray-800 text-lg mb-6 text-center">
              Personalized private sessions with your dedicated expert tutor – custom pace, deep focus, and direct mentorship.
            </p>
            <ul className="text-gray-800 space-y-3">
              <li>1-on-1 Zoom sessions</li>
              <li>Customized learning plan</li>
              <li>Unlimited Q&A & feedback</li>
              <li>Priority support & fast progress</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}