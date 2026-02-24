export default function FreeResourcesCTA() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-[#512d7c] via-[#512d7c] to-[#f2b42c]/35">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center bg-white/80 rounded-3xl shadow-lg">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#512d7c] mb-6">
          Access Free Resources Now
        </h2>
        <p className="text-sm sm:text-lg md:text-xl text-black max-w-3xl mx-auto mb-8">
          Sign up today to unlock introductory videos, PDFs, and starter guides – completely free, no payment required!
        </p>

        <a
          href="/signup"
          className="inline-flex items-center justify-center px-5 py-3 sm:px-8 sm:py-4 bg-[#512d7c] text-white text-sm sm:text-lg font-bold rounded-full shadow-xl hover:bg-[#3b215c] transition-all duration-300"
        >
          Sign Up Free & Get Instant Access
        </a>

        <p className="text-xs sm:text-sm md:text-base text-gray-800 mt-5">
          No card needed • Instant access • Learn at your own pace
        </p>
      </div>
    </section>
  );
}
