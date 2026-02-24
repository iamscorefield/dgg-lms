export default function TrainingTiers() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#512d7c] text-center mb-16">
          Our Training Tiers
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow hover:shadow-xl transition">
            <h3 className="text-3xl font-bold text-[#512d7c] mb-6 text-center">Basic Tier</h3>
            <ul className="text-gray-800 space-y-3 mb-8">
              <li>3-month training</li>
              <li>Digital Literacy</li>
              <li>Specialized Course</li>
              <li>Digital Monetization</li>
              <li>Certificate</li>
            </ul>
            <button className="w-full py-4 bg-[#512d7c] text-white font-bold rounded-full hover:bg-[#3f2361]">
              Choose Basic
            </button>
          </div>

          <div className="bg-[#512d7c] p-8 rounded-2xl shadow-xl text-white">
            <h3 className="text-3xl font-bold mb-6 text-center">Standard Tier</h3>
            <ul className="space-y-3 mb-8">
              <li>6-month training</li>
              <li>Expanded curriculum</li>
              <li>Portfolio & resume support</li>
              <li>Team projects</li>
              <li>Standard certificate</li>
            </ul>
            <button className="w-full py-4 bg-[#f2b42c] text-black font-bold rounded-full hover:bg-[#e0a51a]">
              Choose Standard
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow hover:shadow-xl transition">
            <h3 className="text-3xl font-bold text-[#512d7c] mb-6 text-center">Advanced Tier</h3>
            <ul className="text-gray-800 space-y-3 mb-8">
              <li>1-year training</li>
              <li>1:1 mentorship</li>
              <li>Premium tools & portfolio support</li>
              <li>Advanced certificate</li>
            </ul>
            <button className="w-full py-4 bg-[#512d7c] text-white font-bold rounded-full hover:bg-[#3f2361]">
              Choose Advanced
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}