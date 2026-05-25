"use client";

import { useEffect, useState } from "react";

const LETTERS = ["S", "R", "E", "V", "O", "L"];

export default function TakeoffLoader({ message = "Cleared for Departure" }: { message?: string }) {
  const [phase, setPhase] = useState<"runway" | "taxi" | "rotate" | "liftoff" | "away">("runway");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("taxi"), 200);
    const t2 = setTimeout(() => setPhase("rotate"), 700);
    const t3 = setTimeout(() => setPhase("liftoff"), 1200);
    const t4 = setTimeout(() => setPhase("away"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (phase === "away") return null;

  const isLiftoff = phase === "liftoff";
  const isRotate = phase === "rotate";
  const isTaxi = phase === "taxi";

  return (
    <div className="fixed inset-0 z-[400] bg-obsidian flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 80%, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Runway */}
      <div className="absolute bottom-[28%] left-0 right-0 h-px flex items-center justify-center">
        {/* Runway edge lights */}
        <div className="absolute inset-x-[10%] flex justify-between items-center">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: isTaxi || isRotate || isLiftoff
                  ? `rgba(212, 165, 116, ${0.15 + (i / 24) * 0.5})`
                  : "rgba(212, 165, 116, 0.05)",
                transitionDelay: `${i * 30}ms`,
                boxShadow: isTaxi || isRotate || isLiftoff
                  ? `0 0 ${4 + (i / 24) * 8}px rgba(212, 165, 116, ${0.1 + (i / 24) * 0.3})`
                  : "none",
              }}
            />
          ))}
        </div>
        {/* Center line */}
        <div
          className="h-px transition-all duration-700 ease-out"
          style={{
            width: isTaxi || isRotate || isLiftoff ? "80%" : "0%",
            background: "linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.3) 20%, rgba(212,165,116,0.3) 80%, transparent 100%)",
          }}
        />
      </div>

      {/* Letters */}
      <div className="relative flex items-end gap-1 sm:gap-2" style={{ marginBottom: "-2px" }}>
        {LETTERS.map((char, i) => {
          const stagger = i * 80;
          const liftY = isLiftoff ? -(180 + i * 15) : 0;
          const liftX = isLiftoff ? (i - 2.5) * 12 : 0;
          const scale = isLiftoff ? 0.4 : 1;
          const opacity = isLiftoff ? 0 : 1;
          const rotate = isLiftoff ? (i - 2.5) * -3 : 0;

          return (
            <div key={i} className="relative">
              {/* Motion blur trail */}
              {(isRotate || isLiftoff) && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{
                    bottom: 0,
                    opacity: isLiftoff ? 0.08 : 0.15,
                    transition: `all 600ms ease-out ${stagger}ms`,
                    transform: `translateY(${liftY * 0.5}px) translateX(${liftX * 0.5}px) scale(${0.7 + scale * 0.3})`,
                  }}
                >
                  <span className="font-serif text-4xl sm:text-5xl tracking-widest text-ember blur-sm">
                    {char}
                  </span>
                </div>
              )}

              {/* Main letter */}
              <span
                className="font-serif text-4xl sm:text-5xl tracking-widest inline-block transition-all ease-out"
                style={{
                  color: isTaxi || isRotate || isLiftoff ? "#E8C9A0" : "rgba(232,201,160,0.3)",
                  transform: `translateY(${liftY}px) translateX(${liftX}px) scale(${scale}) rotate(${rotate}deg)`,
                  opacity: isLiftoff ? 0 : isTaxi || isRotate ? 1 : 0.3,
                  transitionDuration: isLiftoff ? "800ms" : "600ms",
                  transitionDelay: `${stagger}ms`,
                  textShadow: isTaxi || isRotate
                    ? "0 0 30px rgba(212,165,116,0.3), 0 0 60px rgba(212,165,116,0.1)"
                    : "none",
                }}
              >
                {char}
              </span>

              {/* Engine heat glow under each letter */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-4 h-8 rounded-full blur-xl transition-all duration-500 pointer-events-none"
                style={{
                  bottom: -16,
                  opacity: isRotate ? 0.4 : isLiftoff ? 0.6 : 0,
                  background: "radial-gradient(circle, rgba(199,107,74,0.5) 0%, transparent 70%)",
                  transitionDelay: `${stagger}ms`,
                  transform: isLiftoff ? `translateY(20px) scale(1.5)` : "scale(1)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Message */}
      <div
        className="absolute mt-24 transition-all duration-700 ease-out"
        style={{
          opacity: isRotate ? 1 : 0,
          transform: isRotate ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-warm-white/30">
          {message}
        </p>
      </div>

      {/* Speed lines during liftoff */}
      {isLiftoff && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-warm-white/5"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${20 + Math.random() * 60}%`,
                width: `${40 + Math.random() * 80}px`,
                animation: `speedLine 0.6s ease-out ${i * 50}ms forwards`,
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes speedLine {
          from {
            transform: translateX(-20px);
            opacity: 0.3;
          }
          to {
            transform: translateX(120px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
