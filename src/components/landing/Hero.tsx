"use client";

import { useEffect, useState } from "react";

const featureImages = [
  { src: "/images/feature-1.jpg", alt: "Live classroom learning" },
  { src: "/images/feature-2.jpg", alt: "Online tutoring session" },
  { src: "/images/feature-3.jpg", alt: "One-on-one coaching" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % featureImages.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const currentImage = featureImages[index];

  return (
    <section className="relative bg-white pt-16 pb-10 md:pt-20 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#512d7c] leading-tight">
              Build practical Techie skills with
              <br />
              <span className="text-[#f2b42c]">D-Global Growthfield</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-black">
              Learn in the way that fits you best: structured video lessons,
              interactive live group classes, and one‑to‑one coaching with expert tutors.
            </p>

            {/* Buttons row – always side by side */}
            <div className="flex flex-row flex-wrap gap-3">
              <a
                href="/signup"
                className="text-sm sm:text-base md:text-lg px-4 py-2.5 sm:px-5 sm:py-3 bg-[#f2b42c] text-black font-bold rounded-full hover:bg-[#e0a51a] transition shadow-md text-center"
              >
                Start Learning
              </a>
              <a
                href="/login"
                className="text-sm sm:text-base md:text-lg px-4 py-2.5 sm:px-5 sm:py-3 border-2 border-[#512d7c] text-[#512d7c] font-bold rounded-full hover:bg-[#512d7c] hover:text-white transition text-center"
              >
                Login
              </a>
            </div>
          </div>

          {/* Right Image Slider */}
          <div className="relative mt-6 lg:mt-0">
            <img
              key={currentImage.src}
              src={currentImage.src}
              alt={currentImage.alt}
              className="w-full rounded-2xl shadow-2xl object-cover transition-opacity duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
