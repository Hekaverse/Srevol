"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Select Your Route",
    description:
      "Browse curated routes — from Santorini sunsets to Maldives overwater villas. Every route is designed exclusively for two travelers.",
    detail: "Minimum reservation: 2 tickets. Always.",
  },
  {
    number: "02",
    title: "Confirm Your Departure Window",
    description:
      "Pick your travel date up to 4 years ahead. We'll build a fare commitment that fits your life — small monthly contributions that make the extraordinary feel effortless.",
    detail: "12 to 48 months. Your pace.",
  },
  {
    number: "03",
    title: "Craft Your Private Manifest",
    description:
      "Each partner selects amenities independently. Spa or scuba? Sunset cruise or wine tasting? Our manifest engine resolves preferences and crafts the perfect shared itinerary.",
    detail: "Private manifest for surprise proposals.",
  },
  {
    number: "04",
    title: "Await Your Boarding Call",
    description:
      "A beautiful shared departure board keeps the anticipation alive. Watch the days tick away as your adventure draws closer — together, always.",
    detail: "The wait is part of the departure.",
  },
];

interface HowItWorksProps {
  variant?: "light" | "dark";
}

function StepCard({
  step,
  index,
  isVisible,
  variant,
}: {
  step: (typeof steps)[0];
  index: number;
  isVisible: boolean;
  variant: "light" | "dark";
}) {
  const isEven = index % 2 === 0;
  const isDark = variant === "dark";

  return (
    <div
      className={`relative flex items-center gap-8 md:gap-16 transition-all duration-1000 ease-expo ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Number */}
      <div
        className={`hidden md:block flex-shrink-0 w-24 text-right ${
          isEven ? "md:order-1" : "md:order-3"
        }`}
      >
        <span className={`font-serif text-6xl lg:text-8xl font-bold select-none ${isDark ? "text-obsidian-muted/20" : "text-obsidian-muted/20"}`}>
          {step.number}
        </span>
      </div>

      {/* Connector dot */}
      <div className="hidden md:flex flex-shrink-0 w-8 h-8 items-center justify-center md:order-2">
        <div className="w-2.5 h-2.5 rounded-full bg-ember/80" />
      </div>

      {/* Content */}
      <div className={`flex-1 ${isEven ? "md:order-3" : "md:order-1 md:text-right"}`}>
        <div className={`md:hidden font-serif text-5xl font-bold mb-4 select-none ${isDark ? "text-obsidian-muted/20" : "text-obsidian-muted/20"}`}>
          {step.number}
        </div>
        <h3 className={`font-serif text-2xl md:text-3xl lg:text-4xl font-bold mb-4 tracking-tight ${isDark ? "text-warm-white" : "text-obsidian"}`}>
          {step.title}
        </h3>
        <p className={`leading-relaxed max-w-md md:text-lg ${isDark ? "text-warm-white/40" : "text-stone"}`}>
          {step.description}
        </p>
        <p className="mt-4 text-sm text-ember font-medium tracking-luxury">
          {step.detail}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks({ variant = "light" }: HowItWorksProps) {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDark = variant === "dark";

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set([...prev, index]));
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(ref);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className={`py-32 lg:py-44 relative overflow-hidden ${isDark ? "bg-obsidian" : "bg-ivory"}`}>
      {/* Decorative line */}
      <div className="absolute left-1/2 top-36 bottom-36 w-px bg-obsidian-muted/10 hidden md:block" />

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal animation="fade-up" className="text-center mb-28">
          <span className="text-xs font-medium text-ember tracking-wide-luxury uppercase">
            The Experience
          </span>
          <h2 className={`mt-5 font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight ${isDark ? "text-warm-white" : "text-obsidian"}`}>
            How It Works
          </h2>
          <p className={`mt-6 text-lg max-w-lg mx-auto leading-relaxed ${isDark ? "text-warm-white/30" : "text-stone"}`}>
            From first dream to final boarding pass, every step is designed around the two of you.
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="space-y-24 md:space-y-36">
          {steps.map((step, index) => (
            <div key={step.number} ref={(el) => { stepRefs.current[index] = el; }}>
              <StepCard
                step={step}
                index={index}
                isVisible={visibleSteps.has(index)}
                variant={variant}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
