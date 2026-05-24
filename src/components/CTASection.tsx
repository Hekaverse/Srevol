"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-obsidian py-32 lg:py-48 relative overflow-hidden">
      {/* Subtle background texture — no orbs */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(250,247,242,0.3) 1px, transparent 0)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left — vertical rule + label */}
          <div
            className={`lg:col-span-3 flex flex-row lg:flex-col items-start gap-6 transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="hairline-v h-16 lg:h-24 self-stretch lg:self-auto" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/20 pt-1 lg:pt-0">
              Reserve
            </span>
          </div>

          {/* Right — content */}
          <div className="lg:col-span-8 lg:col-start-5">
            <h2
              className={`font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-warm-white tracking-tight transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.2s", lineHeight: 0.95 }}
            >
              Your Departure
              <br />
              <span className="text-ember">Is Already Written</span>
            </h2>

            <p
              className={`mt-8 text-lg text-warm-white/30 max-w-lg leading-relaxed font-light italic transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "0.4s" }}
            >
              &ldquo;Every great departure begins long before boarding.&rdquo;
            </p>

            <div
              className={`mt-12 flex flex-col sm:flex-row items-start gap-6 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "0.6s" }}
            >
              <Link
                href="/tiers"
                className="group inline-flex items-center gap-4 px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-white bg-ember transition-all duration-500 ease-expo hover:bg-ember-light"
              >
                <span>Secure Your Departure</span>
                <span className="w-4 h-px bg-current group-hover:w-8 transition-all duration-500 ease-expo" />
              </Link>
              <Link
                href="/packages"
                className="group inline-flex items-center gap-4 px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-white/40 border border-warm-white/10 hover:border-warm-white/25 hover:text-warm-white/60 transition-all duration-500 ease-expo"
              >
                <span>Browse Routes</span>
                <span className="w-4 h-px bg-current group-hover:w-8 transition-all duration-500 ease-expo" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className={`mt-20 pt-8 border-t border-warm-white/5 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "0.8s" }}
            >
              <div className="flex flex-wrap items-center gap-8">
                {[
                  "Secure Contributions",
                  "Fare Lock Guarantee",
                  "Couples First",
                ].map((item) => (
                  <span
                    key={item}
                    className="text-[10px] tracking-[0.15em] uppercase text-warm-white/15"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
