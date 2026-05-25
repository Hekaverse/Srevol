"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"letterbox" | "typing" | "line" | "expand" | "done">("letterbox");
  const [visibleChars, setVisibleChars] = useState(0);
  const text = "SREVOL";

  useEffect(() => {
    // Start in letterbox, then type
    const t1 = setTimeout(() => setPhase("typing"), 400);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;

    const typeInterval = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= text.length) {
          clearInterval(typeInterval);
          setTimeout(() => setPhase("line"), 300);
          return prev;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(typeInterval);
  }, [phase]);

  useEffect(() => {
    if (phase === "line") {
      setTimeout(() => setPhase("expand"), 900);
    }
    if (phase === "expand") {
      setTimeout(() => setPhase("done"), 1200);
    }
  }, [phase]);

  if (phase === "done") return null;

  const isLetterbox = phase === "letterbox" || phase === "typing" || phase === "line";
  const isExpanding = phase === "expand";

  return (
    <div
      className={`fixed inset-0 z-[300] bg-obsidian flex flex-col items-center justify-center transition-all duration-[1200ms] ease-expo ${
        isExpanding ? "opacity-0" : "opacity-100"
      }`}
      style={{
        clipPath: isLetterbox
          ? "inset(30% 10% 30% 10%)"
          : isExpanding
          ? "inset(0% 0% 0% 0%)"
          : "inset(0% 0% 0% 0%)",
      }}
    >
      {/* Film grain overlay on loading screen */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Letterbox bars */}
      {isLetterbox && (
        <>
          <div className="absolute top-0 left-0 right-0 h-[30%] bg-black z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-black z-10" />
          <div className="absolute top-[30%] bottom-[30%] left-0 w-[10%] bg-black z-10" />
          <div className="absolute top-[30%] bottom-[30%] right-0 w-[10%] bg-black z-10" />
        </>
      )}

      {/* Center content */}
      <div className="relative z-20 text-center">
        {/* Typing text */}
        <div className="font-serif text-5xl sm:text-6xl tracking-[0.4em] text-warm-white">
          {text.split("").map((char, i) => (
            <span
              key={i}
              className="inline-block transition-all duration-200"
              style={{
                opacity: i < visibleChars ? 1 : 0,
                transform: i < visibleChars ? "translateY(0)" : "translateY(8px)",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Drawing line */}
        <div className="mt-8 mx-auto w-40 h-px bg-warm-white/10 overflow-hidden">
          <div
            className="h-full bg-warm-white/50 transition-transform duration-700 ease-expo"
            style={{
              transform:
                phase === "line" || phase === "expand"
                  ? "scaleX(1)"
                  : "scaleX(0)",
              transformOrigin: "left",
            }}
          />
        </div>

        {/* Subtle caption */}
        <p
          className={`mt-6 text-[9px] tracking-[0.4em] uppercase text-warm-white/20 transition-opacity duration-500 ${
            phase === "line" || phase === "expand" ? "opacity-100" : "opacity-0"
          }`}
        >
          The Private Carrier for Two
        </p>
      </div>
    </div>
  );
}
