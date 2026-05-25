"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BarcodeSeparator from "./BarcodeSeparator";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-obsidian min-h-[70vh] flex items-center">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-32 lg:py-44 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-1">
            <div
              className={`hairline-v h-20 mb-6 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
              }`}
              style={{ transformOrigin: "top" }}
            />
          </div>
          <div className="lg:col-span-8 lg:col-start-3">
            <span
              className={`text-[10px] tracking-[0.3em] uppercase text-warm-white/40 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              Final Call
            </span>

            <h2
              className={`mt-4 font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-warm-white tracking-tight transition-all duration-[1500ms] ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ lineHeight: 0.95, transitionDelay: "0.1s" }}
            >
              Your Departure
              <br />
              <span className="text-ember">Is Already Written</span>
            </h2>

            <p
              className={`mt-10 text-lg text-warm-white/50 max-w-lg leading-relaxed font-light italic transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.4s" }}
            >
              &ldquo;Every great departure begins long before boarding.&rdquo;
            </p>

            <div
              className={`mt-14 flex flex-col sm:flex-row items-start gap-5 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "0.6s" }}
            >
              <Link
                href="/tiers"
                className="group inline-flex items-center gap-4 px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-obsidian bg-ember transition-all duration-500 ease-expo hover:bg-ember-light"
              >
                <span>Secure Your Departure</span>
                <span className="w-4 h-px bg-current group-hover:w-8 transition-all duration-500 ease-expo" />
              </Link>
              <Link
                href="/packages"
                className="group inline-flex items-center gap-4 px-8 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-white/30 border border-warm-white/10 hover:border-warm-white/25 hover:text-warm-white/50 transition-all duration-500 ease-expo"
              >
                <span>View Route Map</span>
                <span className="w-4 h-px bg-current group-hover:w-8 transition-all duration-500 ease-expo" />
              </Link>
            </div>

            <div
              className={`mt-20 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: "0.8s" }}
            >
              <BarcodeSeparator className="mb-6" />
              <div className="flex flex-wrap items-center gap-8">
                {["Secure Contributions", "Fare Lock Guarantee", "Couples First"].map(
                  (item) => (
                    <span
                      key={item}
                      className="text-[10px] tracking-[0.15em] uppercase text-warm-white/30"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
