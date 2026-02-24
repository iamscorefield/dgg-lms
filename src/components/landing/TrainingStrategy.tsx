export default function TrainingStrategy() {
  const stages = [
    {
      title: "Stage 1: Digital Literacy",
      icon: "📖",
      items: [
        "Computer components basics",
        "Basic OS & software navigation",
        "Internet & browser fundamentals",
        "Online communication & collaboration",
        "AI assistance and prompting",
      ],
    },
    {
      title: "Stage 2: Specialized Skills",
      icon: "💻",
      items: [
        "Coding (Python, JavaScript, HTML, CSS)",
        "AI & machine learning basics",
        "Data analytics with spreadsheets, SQL, Power BI, Tableau",
        "Digital marketing & online branding",
        "Web design, development & CRM integrations",
      ],
    },
    {
      title: "Stage 3: Digital Monetization",
      icon: "💰",
      items: [
        "Freelancing on platforms like Upwork",
        "Build online portfolio & resume/CV",
        "Affiliate marketing & e-commerce",
        "Content creation and outreach monetization",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-[#512d7c] mb-16">
          Our Training Strategy
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {stages.map((stage) => (
            <div key={stage.title} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-5xl">{stage.icon}</div>
                <h3 className="text-2xl font-bold text-[#512d7c]">{stage.title}</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                {stage.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}