"use client";

import { useEffect, useRef, useState } from "react";

export default function PhilosophySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-ivory min-h-[80vh] flex items-center"
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-32 lg:py-44 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-1">
            <div
              className={`hairline-v h-20 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
              }`}
              style={{ transformOrigin: "top" }}
            />
          </div>
          <div className="lg:col-span-9 lg:col-start-2">
            <p
              className={`font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-obsidian leading-[1.15] tracking-tight transition-all duration-[1500ms] ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              The best journeys are not the ones you take, but the ones you{" "}
              <span className="text-ember">anticipate together</span>.
            </p>

            <p
              className={`mt-12 text-sm text-stone leading-relaxed max-w-md transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.6s" }}
            >
              Every route is designed for two travelers who understand that the
              journey begins long before the cabin door closes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
