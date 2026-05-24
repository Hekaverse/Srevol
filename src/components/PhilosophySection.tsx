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
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-ivory relative">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-32 lg:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left — vertical rule + label */}
          <div
            className={`lg:col-span-3 flex flex-row lg:flex-col items-start gap-6 transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="hairline-v h-16 lg:h-24 self-stretch lg:self-auto" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-stone pt-1 lg:pt-0">
              Philosophy
            </span>
          </div>

          {/* Right — large editorial text */}
          <div className="lg:col-span-8 lg:col-start-5">
            <p
              className={`font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] text-obsidian leading-[1.35] tracking-tight transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              The best journeys are not the ones you take, but the ones you
              <span className="text-ember"> anticipate together</span>. We
              believe that the months of dreaming, planning, and waiting are as
              precious as the departure itself. Every route is designed for two
              travelers who understand that the journey begins long before the
              cabin door closes.
            </p>

            <div
              className={`mt-16 flex items-center gap-6 transition-all duration-1000 ease-expo ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "0.5s" }}
            >
              <div className="hairline-ember w-16" />
              <span className="text-[11px] tracking-[0.2em] uppercase text-stone">
                Two tickets. One cabin. No exceptions.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
