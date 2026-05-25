"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

export default function RouteNetworkMap() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-obsidian relative">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="hairline" />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div
            className={`transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/45">
              Global Coverage
            </span>
            <p className="mt-2 font-serif text-lg text-warm-white/40">
              20 routes · 4 cabin classes · 6 continents
            </p>
          </div>

          <div
            className={`hidden lg:flex items-center gap-6 transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            {[
              { tier: "horizon", label: "Horizon", color: "#C9A87C" },
              { tier: "meridian", label: "Meridian", color: "#C97B7B" },
              { tier: "celestial", label: "Celestial", color: "#D4A574" },
              { tier: "astral", label: "Astral", color: "#E8C9A0" },
            ].map((item) => (
              <div key={item.tier} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5" style={{ backgroundColor: item.color }} />
                <span className="text-[9px] text-warm-white/45 tracking-wider uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`transition-all duration-[1500ms] ease-expo ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          <Globe />
        </div>

        <p
          className={`mt-6 text-center text-[10px] tracking-[0.2em] uppercase text-warm-white/30 transition-all duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "0.6s" }}
        >
          Drag to explore · Scroll to continue
        </p>
      </div>
    </section>
  );
}
