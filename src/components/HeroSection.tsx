"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SrevolReveal from "./SrevolReveal";
import AtmosphericBackground from "./AtmosphericBackground";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-plum-900 overflow-hidden">
      <AtmosphericBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* The Brand Reveal */}
        <div
          className={`transition-all duration-1000 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <SrevolReveal />
        </div>

        {/* Tagline */}
        <div
          className={`mt-10 transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-warm-white/90 leading-tight tracking-tight">
            A journey for lovers,
            <br />
            <span className="text-rose-gold">told in reverse</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-warm-white/40 max-w-2xl mx-auto leading-relaxed italic">
            From the destination back to the moment you met.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`mt-12 transition-all duration-1000 delay-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/tiers"
            className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium text-plum-900 bg-rose-gold rounded-full hover:bg-rose-gold-light transition-all duration-300 hover:shadow-xl hover:shadow-rose-gold/20"
          >
            <span>Start Your Journey</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <p className="mt-4 text-xs text-warm-white/20">
            No commitment. Explore tiers. Plan together.
          </p>
        </div>

        {/* Two-ticket badge */}
        <div
          className={`mt-16 transition-all duration-1000 delay-[1200ms] ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-warm-white/10 bg-warm-white/5">
            <svg className="w-4 h-4 text-rose-gold/70" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <span className="text-xs text-warm-white/50 tracking-wider uppercase">
              Two tickets. One journey. No exceptions.
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 delay-[1500ms] ${
          mounted ? "opacity-40" : "opacity-0"
        }`}
      >
        <span className="text-[10px] tracking-[0.4em] uppercase text-warm-white/40">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-warm-white/40 to-transparent" />
      </div>
    </section>
  );
}
