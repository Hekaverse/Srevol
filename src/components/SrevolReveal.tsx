"use client";

import { useState, useEffect } from "react";

const letters = [
  { front: "S", back: "L", delay: 0 },
  { front: "R", back: "O", delay: 0.08 },
  { front: "E", back: "V", delay: 0.16 },
  { front: "V", back: "E", delay: 0.24 },
  { front: "O", back: "R", delay: 0.32 },
  { front: "L", back: "S", delay: 0.4 },
];

interface SrevolRevealProps {
  compact?: boolean;
}

export default function SrevolReveal({ compact = false }: SrevolRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!compact) {
      const interval = setInterval(() => {
        setRevealed((prev) => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [compact]);

  const isFlipped = revealed;

  if (compact) {
    // Easter egg version: tiny, subtle, no backgrounds — pure text flip
    return (
      <div
        className="flex items-center justify-center gap-[2px] cursor-pointer select-none"
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => setRevealed(false)}
      >
        {letters.map((letter, i) => (
          <div key={i} className="relative" style={{ perspective: "200px" }}>
            <div
              className="relative w-3 h-4 transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transitionDelay: `${letter.delay}s`,
              }}
            >
              <span
                className="absolute inset-0 flex items-center justify-center text-[10px] font-serif font-bold text-warm-white/20"
                style={{ backfaceVisibility: "hidden" }}
              >
                {letter.front}
              </span>
              <span
                className="absolute inset-0 flex items-center justify-center text-[10px] font-serif font-bold text-ember/40"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {letter.back}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Full version (legacy / standalone use)
  return (
    <div className="relative">
      <div
        className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 cursor-pointer select-none"
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => setRevealed(false)}
        onClick={() => setRevealed(!revealed)}
      >
        {letters.map((letter, i) => (
          <div
            key={i}
            className="relative"
            style={{ perspective: "600px" }}
          >
            <div
              className="relative w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-28 transition-transform duration-700 ease-in-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transitionDelay: `${letter.delay}s`,
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl border border-ember/25 bg-obsidian-light/60 backdrop-blur-sm"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-warm-white">
                  {letter.front}
                </span>
              </div>
              <div
                className="absolute inset-0 flex items-center justify-center rounded-xl sm:rounded-2xl border border-ember/40 bg-ember/10 backdrop-blur-sm"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  boxShadow: isFlipped
                    ? "0 0 30px rgba(199, 107, 74, 0.15)"
                    : "none",
                  transition: "box-shadow 0.7s ease-in-out",
                  transitionDelay: `${letter.delay + 0.35}s`,
                }}
              >
                <span className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-ember">
                  {letter.back}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`text-center mt-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: "1.5s" }}
      >
        <p className="text-sm sm:text-base text-ember/50 tracking-[0.3em] uppercase">
          The Private Carrier for Two
        </p>
      </div>
    </div>
  );
}
