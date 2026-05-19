"use client";

import { useEffect, useState } from "react";

export default function CountdownPreview() {
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
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          days = 487;
          hours = 12;
          minutes = 34;
          seconds = 56;
        }
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
    <section className="py-32 lg:py-40 bg-cream relative overflow-hidden">
      {/* Subtle background shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(201,123,123,0.15) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(212,165,116,0.15) 0%, transparent 70%)" }}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <span className="text-xs font-medium text-rose-gold tracking-[0.4em] uppercase">
          The Countdown
        </span>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-plum-900 tracking-tight">
          Every Second
          <br />
          <span className="text-blush">Brings You Closer</span>
        </h2>
        <p className="mt-6 text-lg text-rich-brown/50 max-w-xl mx-auto leading-relaxed">
          A beautiful, shared countdown that builds anticipation from the moment you book 
          to the moment you board — together.
        </p>

        {/* Demo countdown */}
        <div className="mt-16 inline-flex items-center gap-6 sm:gap-10 p-8 sm:p-12 bg-white rounded-3xl border border-plum-100 shadow-xl shadow-plum-100/20">
          {units.map((unit, index) => (
            <div key={unit.label} className="flex items-center gap-6 sm:gap-10">
              <div className="text-center min-w-[60px] sm:min-w-[80px]">
                <div className="font-serif text-5xl sm:text-7xl font-bold text-plum-900 tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="mt-2 text-xs sm:text-sm text-rich-brown/40 uppercase tracking-[0.2em]">
                  {unit.label}
                </div>
              </div>
              {index < units.length - 1 && (
                <div className="text-2xl sm:text-4xl text-plum-200 font-light font-serif">:</div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-rich-brown/30 italic">
          Preview — Your Santorini escape
        </p>
      </div>
    </section>
  );
}
