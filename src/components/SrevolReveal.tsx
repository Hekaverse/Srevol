"use client";

import { useState, useEffect } from "react";

const letters = [
  { front: "S", back: "L", delay: 0 },
  { front: "R", back: "O", delay: 0.1 },
  { front: "E", back: "V", delay: 0.2 },
  { front: "V", back: "E", delay: 0.3 },
  { front: "O", back: "R", delay: 0.4 },
  { front: "L", back: "S", delay: 0.5 },
];

export default function SrevolReveal() {
  const [revealed, setRevealed] = useState(false);
  const [autoFlip, setAutoFlip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setAutoFlip(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Word container */}
      <div
        className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 cursor-pointer"
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => setRevealed(false)}
        onClick={() => setRevealed(!revealed)}
      >
        {letters.map((letter, i) => (
          <div
            key={i}
            className="relative"
            style={{
              perspective: "600px",
              animationDelay: `${letter.delay}s`,
            }}
          >
            <div
              className="relative w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-28 transition-transform duration-700"
              style={{
                transformStyle: "preserve-3d",
                transform:
                  revealed || autoFlip ? "rotateY(180deg)" : "rotateY(0deg)",
                transitionDelay: `${letter.delay}s`,
              }}
            >
              {/* Front: SREVOL */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl border border-rose-gold/30 bg-plum-800/50 backdrop-blur-sm"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-warm-white">
                  {letter.front}
                </span>
              </div>

              {/* Back: LOVERS */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl border border-rose-gold/50 bg-rose-gold/20 backdrop-blur-sm"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <span className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-rose-gold">
                  {letter.back}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hint text */}
      <div
        className={`text-center mt-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "1.5s" }}
      >
        <p className="text-sm sm:text-base text-rose-gold/70 tracking-[0.3em] uppercase">
          {revealed || autoFlip ? "Lovers. Read it backwards." : "Read it backwards"}
        </p>
      </div>
    </div>
  );
}
