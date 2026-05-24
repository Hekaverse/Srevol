"use client";

import ScrollReveal from "./ScrollReveal";

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
  return (
    <section className="py-32 lg:py-44 bg-ivory relative overflow-hidden">
      {/* Subtle background shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(199,107,74,0.1) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, rgba(212,165,86,0.1) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <span className="text-xs font-medium text-ember tracking-wide-luxury uppercase">
            The Departure Sequence
          </span>
          <h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-obsidian tracking-tight">
            Every Phase
            <br />
            <span className="text-ember">Brings You Closer</span>
          </h2>
          <p className="mt-6 text-lg text-stone max-w-xl mx-auto leading-relaxed">
            From reservation to boarding, each milestone is part of the departure.
            Your departure board fills in slowly — and that is the magic.
          </p>
        </ScrollReveal>

        {/* Departure Phases */}
        <ScrollReveal animation="fade-up" delay={0.3} className="mt-20">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-obsidian-muted/15" />

            <div className="space-y-12">
              {phases.map((phase, index) => (
                <div
                  key={phase.label}
                  className={`relative flex items-start gap-6 md:gap-0 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-warm-white border border-obsidian-muted/20 flex items-center justify-center z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-ember/80" />
                  </div>

                  {/* Content */}
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                  }`}>
                    <p className="text-[10px] font-medium text-ember tracking-[0.2em] uppercase">
                      {phase.detail}
                    </p>
                    <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-obsidian">
                      {phase.label}
                    </h3>
                    <p className="mt-2 text-sm text-stone leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
