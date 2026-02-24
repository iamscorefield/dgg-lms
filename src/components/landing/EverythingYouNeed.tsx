export default function EverythingYouNeed() {
  const features = [
    { icon: "🎥", title: "Video Lessons", desc: "High-quality recorded & live sessions with clear explanations." },
    { icon: "📝", title: "Assignments & Feedback", desc: "Hands-on projects with instructor review and guidance." },
    { icon: "🔐", title: "Secure & Scalable", desc: "Security is top-north scalable for fast, safe, grows with you." },
    { icon: "🧑‍🏫", title: "Instructor Accessibility", desc: "gain one-on-one access to instructor to guide, review work, manage feedback." },
    { icon: "📤", title: "Project Submissions", desc: "Upload code, docs, zips PDF, – automatically timestamped." },
    { icon: "⚡", title: "Digital Monetization", desc: "Gain tips on how to secure remote work with your acquired skills." },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-[#512d7c] mb-16">
          Everything that keep your Learning on track
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
              <div className="text-6xl mb-6">{f.icon}</div>
              <h3 className="text-2xl font-bold text-[#512d7c] mb-4">{f.title}</h3>
              <p className="text-black">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}