"use client";

import { useState } from "react";
import Image from "next/image";

interface ConciergeData {
  destination: string;
  departureDate: string;
  duration: number;
  hotel: {
    name: string;
    imageUrl: string | null;
    address?: string;
    phone?: string;
    checkIn: string;
    checkOut: string;
  } | null;
  itinerary: Array<{
    day: number;
    label: string;
    items: Array<{
      time: string;
      title: string;
      description: string;
      type: "flight" | "transfer" | "hotel" | "experience" | "meal" | "free";
      status: "confirmed" | "pending" | "voucher";
      voucherCode?: string;
    }>;
  }>;
  emergencyContacts: Array<{
    name: string;
    role: string;
    phone: string;
    available: string;
  }>;
  milestones: Array<{
    label: string;
    date: string;
    completed: boolean;
  }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getTypeIcon(type: string) {
  switch (type) {
    case "flight":
      return "M12 19l9 2-9-18-9 18 9-2zm0 0v-8";
    case "transfer":
      return "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4";
    case "hotel":
      return "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4";
    case "experience":
      return "M13 10V3L4 14h7v7l9-11h-7z";
    case "meal":
      return "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253";
    default:
      return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "flight":
      return "text-amber bg-amber/5 border-amber/10";
    case "transfer":
      return "text-warm-white/50 bg-warm-white/5 border-warm-white/10";
    case "hotel":
      return "text-green-400 bg-green-500/5 border-green-500/10";
    case "experience":
      return "text-ember bg-ember/5 border-ember/10";
    case "meal":
      return "text-amber bg-amber/5 border-amber/10";
    default:
      return "text-warm-white/30 bg-warm-white/3 border-warm-white/5";
  }
}

export default function TripConcierge({ data }: { data: ConciergeData }) {
  const [activeDay, setActiveDay] = useState(0);
  const daysUntil = Math.max(
    0,
    Math.ceil(
      (new Date(data.departureDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono tracking-[0.3em] text-amber/65 uppercase">
              Trip Concierge
            </p>
            <h2 className="font-serif text-2xl font-bold text-warm-white mt-1">
              {data.destination}
            </h2>
            <p className="text-sm text-warm-white/55 mt-1">
              {formatDate(data.departureDate)} · {data.duration} days
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-serif text-3xl font-bold text-ember">
                {daysUntil}
              </p>
              <p className="text-[9px] font-mono tracking-wider text-warm-white/45 uppercase">
                Days
              </p>
            </div>
            {data.hotel?.imageUrl && (
              <div className="w-16 h-16 rounded-xl bg-cover bg-center border border-obsidian-muted/20"
                style={{ backgroundImage: `url(${data.hotel.imageUrl})` }}
              />
            )}
          </div>
        </div>

        {/* Milestones */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {data.milestones.map((m, i) => (
            <div
              key={i}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border ${
                m.completed
                  ? "bg-green-500/5 border-green-500/10"
                  : "bg-obsidian-muted/20 border-obsidian-muted/10"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  m.completed ? "bg-green-400" : "bg-warm-white/10"
                }`}
              />
              <span
                className={`text-[10px] font-mono tracking-wider uppercase ${
                  m.completed ? "text-green-400/90" : "text-warm-white/45"
                }`}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Bar */}
      <div className="bg-red-500/5 rounded-2xl border border-red-500/10 p-4">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-xs font-medium text-red-400/70">24/7 Emergency Line</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              {data.emergencyContacts.map((c) => (
                <span key={c.name} className="text-[11px] text-warm-white/30">
                  {c.name} ({c.role}): <span className="text-warm-white/50">{c.phone}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {data.itinerary.map((day, i) => (
          <button
            key={day.day}
            onClick={() => setActiveDay(i)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
              activeDay === i
                ? "bg-ember/10 text-ember border-ember/20"
                : "bg-obsidian-light/40 text-warm-white/55 border-obsidian-muted/10 hover:border-warm-white/10"
            }`}
          >
            <span className="text-[10px] font-mono tracking-wider uppercase block">
              {day.label}
            </span>
            <span className="text-xs">Day {day.day}</span>
          </button>
        ))}
      </div>

      {/* Day Schedule */}
      {data.itinerary[activeDay] && (
        <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono text-amber/60 tracking-wider">
              {String(data.itinerary[activeDay].day).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 bg-obsidian-muted/15" />
            <span className="text-[10px] font-mono tracking-wider text-warm-white/45 uppercase">
              {data.itinerary[activeDay].label}
            </span>
          </div>

          <div className="space-y-4">
            {data.itinerary[activeDay].items.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${getTypeColor(item.type)}`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-obsidian/40 flex items-center justify-center">
                  <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getTypeIcon(item.type)} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider text-warm-white/55">
                      {item.time}
                    </span>
                    {item.status === "confirmed" && (
                      <span className="text-[9px] font-mono tracking-wider text-green-400/85 uppercase">
                        Confirmed
                      </span>
                    )}
                    {item.status === "voucher" && (
                      <span className="text-[9px] font-mono tracking-wider text-amber/85 uppercase">
                        Voucher Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-warm-white/80 mt-0.5">
                    {item.title}
                  </p>
                  <p className="text-xs text-warm-white/50 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  {item.voucherCode && (
                    <div className="mt-2 p-2 bg-obsidian/40 rounded-lg border border-amber/5 inline-flex items-center gap-2">
                      <span className="text-[9px] font-mono tracking-wider text-warm-white/45 uppercase">
                        Voucher
                      </span>
                      <span className="text-xs font-mono text-amber/70 tracking-wider">
                        {item.voucherCode}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
