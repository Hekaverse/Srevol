"use client";

import { useEffect, useRef } from "react";

export default function LoadingScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    try {
      if (sessionStorage.getItem("srevol-booted")) {
        el.style.display = "none";
        return;
      }
    } catch {
      // sessionStorage blocked — just show animation
    }

    // Start visible with animation class
    el.style.display = "flex";

    const timer = setTimeout(() => {
      el.style.display = "none";
      try {
        sessionStorage.setItem("srevol-booted", "true");
      } catch {
        // ignore
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[300] bg-obsidian flex-col items-center justify-center pointer-events-none"
      style={{ display: "none" }}
    >
      <style>{`
        @keyframes bootFade {
          0%   { opacity: 1; }
          78%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes bootClip {
          0%   { clip-path: inset(30% 10% 30% 10%); }
          70%  { clip-path: inset(30% 10% 30% 10%); }
          85%  { clip-path: inset(0% 0% 0% 0%); }
          100% { clip-path: inset(0% 0% 0% 0%); }
        }
        @keyframes letterIn {
          0%, 30% { opacity: 0; transform: translateY(8px); }
          100%    { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          0%, 55% { transform: scaleX(0); }
          100%    { transform: scaleX(1); }
        }
        @keyframes captionIn {
          0%, 60% { opacity: 0; }
          100%    { opacity: 1; }
        }
      `}</style>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          animation: "bootFade 2.8s ease forwards, bootClip 2.8s ease forwards",
        }}
      >
        {/* Letterbox bars */}
        <div className="absolute top-0 left-0 right-0 h-[30%] bg-black" />
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-black" />
        <div className="absolute top-[30%] bottom-[30%] left-0 w-[10%] bg-black" />
        <div className="absolute top-[30%] bottom-[30%] right-0 w-[10%] bg-black" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="font-serif text-5xl sm:text-6xl tracking-[0.4em] text-warm-white">
            {"SREVOL".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  opacity: 0,
                  animation: `letterIn 0.5s ease ${0.35 + i * 0.1}s forwards`,
                }}
              >
                {char}
              </span>
            ))}
          </div>

          <div className="mt-8 mx-auto w-40 h-px bg-warm-white/10 overflow-hidden">
            <div
              className="h-full bg-warm-white/50 origin-left"
              style={{
                transform: "scaleX(0)",
                animation: "lineGrow 0.8s ease 0.9s forwards",
              }}
            />
          </div>

          <p
            className="mt-6 text-[9px] tracking-[0.4em] uppercase text-warm-white/30"
            style={{
              opacity: 0,
              animation: "captionIn 0.6s ease 1.2s forwards",
            }}
          >
            The Private Carrier for Two
          </p>
        </div>
      </div>
    </div>
  );
}
