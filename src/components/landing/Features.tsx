export default function Features() {
  const features = [
    { icon: "🎥", title: "Video lessons", desc: "High-quality recorded & live sessions with clear explanations." },
    { icon: "📝", title: "Assignments", desc: "Clear instructions, due dates, linked lessons." },
    { icon: "📤", title: "Submissions", desc: "Upload code, docs, zips – automatically timestamped." },
    { icon: "🧑‍🏫", title: "Instructor tools", desc: "Create assignments, review work, manage feedback." },
    { icon: "🔐", title: "Secure access", desc: "Role-based login for students and instructors." },
    { icon: "⚡", title: "Scalable", desc: "Next.js + Supabase for performance and growth." },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-[#512d7c] mb-16">
          Everything you need to teach and learn
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-6">{f.icon}</div>
              <h3 className="text-2xl font-bold text-[#512d7c] mb-4">{f.title}</h3>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}