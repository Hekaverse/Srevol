"use client";

import { useEffect, useRef, useState } from "react";
import BarcodeSeparator from "./BarcodeSeparator";

const phases = [
  { label: "Flight Plan Filed", detail: "T-12 months", desc: "Your reservation is secured. The route is locked. The anticipation begins." },
  { label: "Cleared for Departure", detail: "T-6 months", desc: "Fare repricing is active. Your buffer protects you. Final itinerary details emerge." },
  { label: "Boarding Preparation", detail: "T-3 months", desc: "Ground excursions confirmed. Layover suite selected. The departure board ticks closer." },
  { label: "Final Approach", detail: "T-1 month", desc: "Travel documents prepared. Final confirmations sent. The cabin awaits." },
  { label: "Wheels Up", detail: "T-0", desc: "The departure you secured years ago becomes the moment you live together." },
];

export default function CountdownPreview() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ivory">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="hairline" />

        <div className="py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div
              className={`lg:col-span-4 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="hairline-v h-16 mb-6" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone">
                Departure Sequence
              </span>
              <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl text-obsidian tracking-tight" style={{ lineHeight: 1.05 }}>
                Every Phase
                <br />
                <span className="text-ember">Brings You Closer</span>
              </h2>
              <div className="mt-8">
                <BarcodeSeparator />
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              {phases.map((phase, index) => (
                <div
                  key={phase.label}
                  className={`border-t border-obsidian/5 py-8 lg:py-10 transition-all duration-700 ease-expo ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-xl lg:text-2xl text-obsidian">
                      {phase.label}
                    </h3>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-stone/50 font-mono flex-shrink-0">
                      {phase.detail}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone/60 leading-relaxed max-w-md">
                    {phase.desc}
                  </p>
                </div>
              ))}
              <div className="border-t border-obsidian/5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
