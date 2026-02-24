export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#512d7c] text-center mb-16">
          What Our Students Say
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-lg text-gray-800 italic mb-6">
              "DGG Academy changed my life! The self-paced UI/UX course gave me skills I use daily at my new job."
            </p>
            <p className="font-bold text-[#512d7c]">— Adaobi O., UI/UX Designer</p>
          </div>

          <div className="bg-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-lg text-gray-800 italic mb-6">
              "One-on-one tutoring was perfect — my tutor was patient and really helped me master Python."
            </p>
            <p className="font-bold text-[#512d7c]">— Chinedu E., Software Developer</p>
          </div>

          <div className="bg-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-lg text-gray-800 italic mb-6">
              "The batch training group was fun and motivating. I learned digital marketing and started my side hustle!"
            </p>
            <p className="font-bold text-[#512d7c]">— Fatima A., Entrepreneur</p>
          </div>
        </div>
      </div>
    </section>
  );
}