'use client';

import { useState, useEffect } from 'react';

export default function BatchCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const target = new Date('2026-02-01T00:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setTimeLeft(`${days} days ${hours} hours until next batch!`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-[#512d7c] text-white text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Next Batch Starts Soon!</h2>
        <p className="text-3xl font-bold mb-10">{timeLeft}</p>
        <a href="/signup" className="inline-block px-10 py-5 bg-[#f2b42c] text-black font-bold rounded-full hover:bg-[#e0a51a] transition shadow-lg">
          Reserve Your Spot
        </a>
      </div>
    </section>
  );
}