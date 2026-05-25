"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"hidden" | "letterbox" | "typing" | "line" | "expand" | "done">("hidden");
  const [visibleChars, setVisibleChars] = useState(0);
  const text = "SREVOL";

  // Defer ALL sessionStorage logic until after mount to avoid hydration mismatch.
  // Server renders "hidden" (nothing). Client checks storage after mount.
  useEffect(() => {
    if (sessionStorage.getItem("srevol-booted")) {
      setPhase("done");
      return;
    }
    setPhase("letterbox");
  }, []);

  useEffect(() => {
    if (phase !== "letterbox") return;
    const t = setTimeout(() => setPhase("typing"), 300);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "typing") return;
    const interval = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("line"), 250);
          return prev;
        }
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === "line") {
      const t = setTimeout(() => setPhase("expand"), 700);
      return () => clearTimeout(t);
    }
    if (phase === "expand") {
      const t = setTimeout(() => {
        setPhase("done");
        sessionStorage.setItem("srevol-booted", "true");
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "hidden" || phase === "done") return null;

  const isLetterbox = phase === "letterbox" || phase === "typing" || phase === "line";
  const isExpanding = phase === "expand";

  return (
    <div
      className={`fixed inset-0 z-[300] bg-obsidian flex flex-col items-center justify-center transition-all duration-1000 ease-expo ${
        isExpanding ? "opacity-0" : "opacity-100"
      }`}
      style={{
        clipPath: isLetterbox ? "inset(30% 10% 30% 10%)" : "inset(0% 0% 0% 0%)",
      }}
    >
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

        <div className="mt-8 mx-auto w-40 h-px bg-warm-white/10 overflow-hidden">
          <div
            className="h-full bg-warm-white/50 transition-transform duration-700 ease-expo"
            style={{
              transform: phase === "line" || phase === "expand" ? "scaleX(1)" : "scaleX(0)",
              transformOrigin: "left",
            }}
          />
        </div>

        <p
          className={`mt-6 text-[9px] tracking-[0.4em] uppercase text-warm-white/30 transition-opacity duration-500 ${
            phase === "line" || phase === "expand" ? "opacity-100" : "opacity-0"
          }`}
        >
          The Private Carrier for Two
        </p>
      </div>
    </div>
  );
}
