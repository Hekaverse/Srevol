"use client";

import { useEffect, useState } from "react";

export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 487,
    hours: 12,
    minutes: 34,
    seconds: 56,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 487; hours = 12; minutes = 34; seconds = 56; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-ember tracking-[0.4em] uppercase">Your Departure Board</span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-white tracking-tight">
              The Wait Is Part
              <br />
              <span className="text-ember">of the Departure</span>
            </h1>
          </div>

          <div className="bg-obsidian-light/50 rounded-3xl border border-obsidian-muted/50 p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-warm-white">Santorini Sunset Route</h2>
              <p className="mt-2 text-warm-white/40">July 14, 2027 • Santorini, Greece</p>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-8">
              {units.map((unit, index) => (
                <div key={unit.label} className="flex items-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <div className="font-serif text-5xl sm:text-7xl font-bold text-warm-white tabular-nums">
                      {String(unit.value).padStart(2, "0")}
                    </div>
                    <div className="mt-2 text-sm text-warm-white/30 uppercase tracking-[0.2em]">
                      {unit.label}
                    </div>
                  </div>
                  {index < units.length - 1 && (
                    <div className="text-3xl sm:text-5xl text-obsidian-muted font-light font-serif">:</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-between text-sm text-warm-white/30 mb-2">
                <span>Reservation confirmed</span>
                <span>Departure</span>
              </div>
              <div className="h-1.5 bg-obsidian-muted rounded-full overflow-hidden">
                <div className="h-full w-[23%] bg-ember rounded-full" />
              </div>
              <p className="mt-3 text-sm text-warm-white/20 text-center">
                23% of your commitment complete — 487 days to boarding
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Share the Board", desc: "Send a private link to your co-traveler so they can watch the days tick away too." },
              { title: "Select Amenities", desc: "Secretly reserve add-ons and experiences that will be revealed during your departure." },
              { title: "Departure Milestones", desc: "Receive curated prompts and date ideas as your boarding call gets closer." },
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-obsidian-light/30 rounded-2xl border border-obsidian-muted/30">
                <h3 className="text-lg font-bold text-warm-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-warm-white/30">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
