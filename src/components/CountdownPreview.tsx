"use client";

import { useEffect, useRef, useState } from "react";

const phases = [
  {
    label: "Flight Plan Filed",
    detail: "12+ months before departure",
    description: "Your reservation is secured. The route is locked. The anticipation begins.",
  },
  {
    label: "Cleared for Departure",
    detail: "6 months before departure",
    description: "Fare repricing is active. Your buffer protects you. Final itinerary details emerge.",
  },
  {
    label: "Boarding Preparation",
    detail: "3 months before departure",
    description: "Ground excursions confirmed. Layover suite selected. The departure board ticks closer.",
  },
  {
    label: "Final Approach",
    detail: "1 month before departure",
    description: "Travel documents prepared. Final confirmations sent. The cabin awaits.",
  },
  {
    label: "Wheels Up",
    detail: "Departure day",
    description: "The departure you secured years ago becomes the moment you live together.",
  },
];

export default function CountdownPreview() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ivory py-32 lg:py-44">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left — header */}
          <div
            className={`lg:col-span-4 transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="hairline-v h-16 mb-6" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-stone">
              The Departure Sequence
            </span>
            <h2
              className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl text-obsidian tracking-tight"
              style={{ lineHeight: 1.05 }}
            >
              Every Phase
              <br />
              <span className="text-ember">Brings You Closer</span>
            </h2>
            <p className="mt-6 text-sm text-stone leading-relaxed max-w-sm">
              From reservation to boarding, each milestone is part of the
              departure. Your departure board fills in slowly — and that is the
              magic.
            </p>
          </div>

          {/* Right — phases list */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="hairline mb-0" />
            {phases.map((phase, index) => (
              <div
                key={phase.label}
                className={`border-t border-obsidian/5 py-8 lg:py-10 transition-all duration-700 ease-expo ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-stone/60">
                      {phase.detail}
                    </span>
                    <h3 className="mt-2 font-serif text-xl lg:text-2xl text-obsidian">
                      {phase.label}
                    </h3>
                    <p className="mt-2 text-sm text-stone/70 leading-relaxed max-w-md">
                      {phase.description}
                    </p>
                  </div>
                  <span className="hidden lg:block text-[10px] tracking-[0.2em] uppercase text-obsidian/10 font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
            <div className="border-t border-obsidian/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
