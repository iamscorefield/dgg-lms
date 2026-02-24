export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-[#512d7c] text-center mb-16">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow">
            <div className="text-6xl font-bold text-[#f2b42c] mb-6 text-center">1</div>
            <h3 className="text-2xl font-bold text-[#512d7c] mb-4 text-center">Sign Up & Explore</h3>
            <p className="text-gray-800 text-center">Create account → access free resources → browse courses</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow">
            <div className="text-6xl font-bold text-[#f2b42c] mb-6 text-center">2</div>
            <h3 className="text-2xl font-bold text-[#512d7c] mb-4 text-center">Enroll & Pay</h3>
            <p className="text-gray-800 text-center">Choose model → Pay via Paystack → Unlock content/sessions</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow">
            <div className="text-6xl font-bold text-[#f2b42c] mb-6 text-center">3</div>
            <h3 className="text-2xl font-bold text-[#512d7c] mb-4 text-center">Learn & Grow</h3>
            <p className="text-gray-800 text-center">Complete lessons → Get feedback → Earn certificate</p>
          </div>
        </div>
      </div>
    </section>
  );
}