"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AtmosphericBackground from "./AtmosphericBackground";
import TextReveal from "./TextReveal";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-obsidian overflow-hidden">
      <AtmosphericBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* The Brand Wordmark */}
        <div
          className={`transition-all duration-1000 ease-expo ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <span className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-warm-white">
            SREVOL
          </span>
        </div>

        {/* Tagline with character reveal */}
        <div
          className={`mt-10 transition-all duration-1000 delay-500 ease-expo ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-warm-white/90 leading-tight tracking-tight">
            <TextReveal text="Every Great Departure" delay={0.8} stagger={0.025} />
            <br />
            <span className="text-ember">
              <TextReveal text="Begins Before Boarding" delay={1.4} stagger={0.03} />
            </span>
          </h1>
          <p
            className={`mt-6 text-lg sm:text-xl text-warm-white/35 max-w-2xl mx-auto leading-relaxed italic font-light transition-all duration-1000 delay-[1.8s] ease-expo ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            The private carrier for two. Reserve your route, lock your fare, and let the anticipation carry you there.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`mt-14 transition-all duration-1000 delay-[2.2s] ease-expo ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/tiers"
            className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium text-warm-white bg-ember rounded-full transition-all duration-500 ease-expo hover:shadow-xl hover:shadow-ember/20 hover:glow-ember"
          >
            <span>Secure Your Departure</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-5 text-xs text-warm-white/20 tracking-wide-luxury uppercase">
            No commitment. Preview cabins. Reserve together.
          </p>
        </div>

        {/* Two-ticket badge */}
        <div
          className={`mt-16 transition-all duration-1000 delay-[2.6s] ease-expo ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-warm-white/10 bg-warm-white/[0.03] backdrop-blur-sm">
            <svg className="w-3.5 h-3.5 text-ember/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span className="text-[10px] text-warm-white/40 tracking-wide-luxury uppercase">
              Two Tickets. One Cabin. No Exceptions.
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 delay-[3s] ease-expo ${
          mounted ? "opacity-30" : "opacity-0"
        }`}
      >
        <div className="w-px h-10 bg-gradient-to-b from-warm-white/40 to-transparent" />
      </div>
    </section>
  );
}
