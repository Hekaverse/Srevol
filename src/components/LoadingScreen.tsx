"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"typing" | "line" | "fade" | "done">("typing");
  const [visibleChars, setVisibleChars] = useState(0);
  const text = "SREVOL";

  useEffect(() => {
    // Type out letters
    const typeInterval = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= text.length) {
          clearInterval(typeInterval);
          setTimeout(() => setPhase("line"), 200);
          return prev;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    if (phase === "line") {
      setTimeout(() => setPhase("fade"), 800);
    }
    if (phase === "fade") {
      setTimeout(() => setPhase("done"), 600);
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-obsidian flex flex-col items-center justify-center transition-opacity duration-500 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Typing text */}
      <div className="font-serif text-4xl sm:text-5xl tracking-[0.3em] text-warm-white">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className="transition-opacity duration-100"
            style={{ opacity: i < visibleChars ? 1 : 0 }}
          >
            {char}
          </span>
        ))}
      </div>

      {/* Drawing line */}
      <div className="mt-6 w-32 h-px bg-warm-white/20 overflow-hidden">
        <div
          className="h-full bg-warm-white/60 transition-transform duration-700 ease-expo"
          style={{
            transform:
              phase === "line" || phase === "fade"
                ? "scaleX(1)"
                : "scaleX(0)",
            transformOrigin: "left",
          }}
        />
      </div>
    </div>
  );
}
