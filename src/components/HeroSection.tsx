"use client";

import { useEffect, useState } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 2800); // after loading screen + expand
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Deep vignette over the generative sky */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.7) 70%)",
        }}
      />

      {/* Massive typography — bleeding off edges */}
      <div className="absolute inset-0 z-10 flex items-end overflow-hidden">
        <h1
          className={`font-serif font-light text-warm-white leading-[0.78] tracking-[-0.02em] select-none transition-all duration-[2000ms] ease-expo ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
          }`}
          style={{
            fontSize: "clamp(8rem, 24vw, 28rem)",
            marginLeft: "-0.08em",
            marginBottom: "-0.12em",
          }}
        >
          SREVOL
        </h1>
      </div>

      {/* Right-edge vertical tagline */}
      <div
        className={`absolute right-6 lg:right-10 bottom-32 z-10 transition-all duration-1000 ease-expo ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "0.8s" }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-warm-white/25"
          style={{ writingMode: "vertical-rl" }}
        >
          The Private Carrier for Two
        </span>
      </div>

      {/* Top-left meta */}
      <div
        className={`absolute top-24 left-8 lg:left-12 z-10 transition-all duration-1000 ease-expo ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "0.5s" }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-warm-white/15 font-mono">
          EST. 2026
        </span>
      </div>

      {/* Bottom-center scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-all duration-1000 ease-expo ${
          mounted ? "opacity-20" : "opacity-0"
        }`}
        style={{ transitionDelay: "1.5s" }}
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-warm-white/40 to-transparent" />
      </div>
    </section>
  );
}
