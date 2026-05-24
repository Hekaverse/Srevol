"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function CTASection() {
  return (
    <section className="py-32 lg:py-44 bg-obsidian relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full animate-breathe"
          style={{ background: "radial-gradient(circle, rgba(40,30,30,0.4) 0%, transparent 70%)", animationDelay: "0s" }}
        />
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] rounded-full animate-breathe"
          style={{ background: "radial-gradient(circle, rgba(199,107,74,0.08) 0%, transparent 70%)", animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <ScrollReveal animation="scale-in">
          <svg className="w-16 h-8 mx-auto mb-12 text-ember/30" viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth={1}>
            <path d="M32 28C32 28 8 20 8 10C8 4 14 0 20 0C26 0 30 6 32 10C34 6 38 0 44 0C50 0 56 4 56 10C56 20 32 28 32 28Z"
              className="draw-line"
              style={{ strokeDasharray: 200, strokeDashoffset: 0, transition: "stroke-dashoffset 2s ease-out 0.5s" }}
            />
          </svg>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={0.2}>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-warm-white tracking-tight leading-[1.1]">
            Your Departure
            <br />
            <span className="text-ember">Is Already Written</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={0.4}>
          <p className="mt-8 text-lg text-warm-white/30 max-w-xl mx-auto leading-relaxed italic">
            &ldquo;Every great departure begins long before boarding.&rdquo;
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={0.6}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tiers"
              className="group relative px-8 py-4 text-base font-medium text-warm-white bg-ember rounded-full overflow-hidden transition-all duration-500 ease-expo hover:shadow-xl hover:shadow-ember/20 hover:glow-ember"
            >
              <span className="relative z-10 flex items-center gap-2">
                Secure Your Departure
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-ember-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-expo origin-left" />
            </Link>
            <Link href="/packages"
              className="px-8 py-4 text-base font-medium text-warm-white/50 border border-warm-white/10 rounded-full hover:bg-warm-white/5 hover:border-warm-white/20 transition-all duration-500 ease-expo"
            >
              Browse Routes
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={0.8}>
          <div className="mt-24 pt-10 border-t border-warm-white/8">
            <p className="text-xs text-warm-white/15 tracking-wide-luxury uppercase mb-10">
              Trusted by couples securing their perfect departure
            </p>
            <div className="flex items-center justify-center gap-12 text-warm-white/15">
              {[
                { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", label: "Secure Contributions" },
                { icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z", label: "Fare Lock Guarantee" },
                { icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", label: "Couples First" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={item.icon} /></svg>
                  <span className="text-xs tracking-luxury">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
