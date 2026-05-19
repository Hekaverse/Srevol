"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Choose Your Escape",
    description:
      "Browse curated destinations — from Santorini sunsets to Maldives overwater villas. Every experience is designed exclusively for two people.",
    detail: "Minimum booking: 2 tickets. Always.",
  },
  {
    number: "02",
    title: "Set Your Timeline",
    description:
      "Pick your travel date up to 4 years ahead. We'll build a payment plan that fits your life — small monthly commitments that make the extraordinary feel effortless.",
    detail: "12 to 48 months. Your pace.",
  },
  {
    number: "03",
    title: "Plan Together, Secretly",
    description:
      "Each partner selects add-ons independently. Spa or scuba? Sunset cruise or wine tasting? Our engine resolves conflicts and crafts the perfect shared itinerary.",
    detail: "Discreet mode for surprise proposals.",
  },
  {
    number: "04",
    title: "Count Down to Magic",
    description:
      "A beautiful shared countdown keeps the anticipation alive. Watch the days tick away as your adventure draws closer — together, always.",
    detail: "The wait is part of the story.",
  },
];

function StepCard({
  step,
  index,
  isVisible,
}: {
  step: (typeof steps)[0];
  index: number;
  isVisible: boolean;
}) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative flex items-center gap-8 md:gap-16 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Number - absolute positioned on mobile, inline on desktop */}
      <div
        className={`hidden md:block flex-shrink-0 w-24 text-right ${
          isEven ? "md:order-1" : "md:order-3"
        }`}
      >
        <span className="font-serif text-6xl lg:text-7xl font-bold text-plum-200/40">
          {step.number}
        </span>
      </div>

      {/* Connector dot */}
      <div className="hidden md:flex flex-shrink-0 w-8 h-8 items-center justify-center md:order-2">
        <div className="w-3 h-3 rounded-full bg-rose-gold" />
      </div>

      {/* Content */}
      <div className={`flex-1 ${isEven ? "md:order-3" : "md:order-1 md:text-right"}`}>
        <div className="md:hidden font-serif text-4xl font-bold text-plum-200/40 mb-3">
          {step.number}
        </div>
        <h3 className="font-serif text-2xl md:text-3xl font-bold text-plum-900 mb-3">
          {step.title}
        </h3>
        <p className="text-rich-brown/60 leading-relaxed max-w-md">
          {step.description}
        </p>
        <p className="mt-3 text-sm text-rose-gold font-medium">
          {step.detail}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = stepRefs.current.map((ref, index) => {
      if (!ref) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => new Set([...prev, index]));
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(ref);
      return observer;
    });

    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="py-32 lg:py-40 bg-cream relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute left-1/2 top-32 bottom-32 w-px bg-plum-200/20 hidden md:block" />

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24">
          <span className="text-xs font-medium text-rose-gold tracking-[0.4em] uppercase">
            The Journey
          </span>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-plum-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-6 text-lg text-rich-brown/50 max-w-lg mx-auto leading-relaxed">
            From first dream to final boarding pass, every step is designed around the two of you.
          </p>
        </div>

        {/* Steps */}
        <div ref={sectionRef} className="space-y-20 md:space-y-32">
          {steps.map((step, index) => (
            <div key={step.number} ref={(el) => { stepRefs.current[index] = el; }}>
              <StepCard
                step={step}
                index={index}
                isVisible={visibleSteps.has(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
