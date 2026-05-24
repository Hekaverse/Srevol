"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BoardingPassProps {
  destination: string;
  departureDate?: string;
  passenger1?: string;
  passenger2?: string;
  tierName?: string;
  bookingId?: string;
}

function generateFlightCode(destination: string): string {
  const codeMap: Record<string, string> = {
    santorini: "SV-001",
    maldives: "SV-002",
    "bora bora": "SV-003",
    seychelles: "SV-004",
    bali: "SV-005",
    kyoto: "SV-006",
    paris: "SV-007",
    dubai: "SV-008",
    tulum: "SV-009",
    "costa rica": "SV-010",
    portugal: "SV-011",
    morocco: "SV-012",
    patagonia: "SV-013",
    kenya: "SV-014",
    norway: "SV-015",
    "private island": "SV-016",
    antarctica: "SV-017",
    "around the world": "SV-018",
    amalfi: "SV-019",
    "swiss alps": "SV-020",
  };

  const normalized = destination.toLowerCase().replace(/[^a-z]/g, "");
  for (const [key, code] of Object.entries(codeMap)) {
    if (normalized.includes(key.replace(/[^a-z]/g, ""))) return code;
  }

  // Fallback: hash destination to deterministic code
  let hash = 0;
  for (let i = 0; i < destination.length; i++) {
    hash = ((hash << 5) - hash + destination.charCodeAt(i)) | 0;
  }
  const num = Math.abs(hash) % 900 + 100;
  return `SV-${num}`;
}

function getCabinClass(tierName?: string): string {
  const map: Record<string, string> = {
    horizon: "HORIZON",
    meridian: "MERIDIAN",
    celestial: "CELESTIAL",
    astral: "ASTRAL",
  };
  return map[tierName?.toLowerCase() || ""] || "MERIDIAN";
}

function getSeatCode(tierName?: string): string {
  const map: Record<string, string> = {
    horizon: "1A",
    meridian: "2A",
    celestial: "1K",
    astral: "1A",
  };
  return map[tierName?.toLowerCase() || ""] || "2A";
}

function formatBoardingDate(dateStr?: string): string {
  if (!dateStr) return "TBD";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  } catch {
    return "TBD";
  }
}

function Barcode() {
  const bars = Array.from({ length: 40 }, (_, i) => {
    const width = i % 3 === 0 ? 3 : i % 5 === 0 ? 2 : 1;
    const gap = i % 7 === 0 ? 2 : 1;
    return { width, gap, id: i };
  });

  return (
    <div className="flex items-end h-12 gap-[1px] opacity-60">
      {bars.map((bar) => (
        <div
          key={bar.id}
          className="bg-warm-white rounded-sm"
          style={{ width: bar.width, height: "100%" }}
        />
      ))}
    </div>
  );
}

function ConfirmedStamp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute -top-2 -right-2 transition-all duration-700 ${
        visible ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-[-12deg]"
      }`}
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-2 border-ember flex items-center justify-center bg-obsidian/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-[9px] font-bold text-ember tracking-[0.2em] uppercase">Confirmed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoardingPass({
  destination,
  departureDate,
  passenger1,
  passenger2,
  tierName,
  bookingId,
}: BoardingPassProps) {
  const flightCode = generateFlightCode(destination);
  const cabinClass = getCabinClass(tierName);
  const seatCode = getSeatCode(tierName);
  const boardingDate = formatBoardingDate(departureDate);

  return (
    <div className="relative max-w-lg mx-auto">
      <ConfirmedStamp />

      {/* Ticket Container */}
      <div className="relative bg-obsidian-light rounded-2xl border border-obsidian-muted/40 overflow-hidden shadow-2xl shadow-black/40">
        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-ember via-amber to-ember" />

        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-warm-white tracking-tight">SREVOL</span>
            <span className="text-[10px] text-warm-white/30 tracking-[0.3em] uppercase">Private Carrier</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Cabin Class</p>
            <p className="text-xs font-bold text-ember tracking-wider">{cabinClass}</p>
          </div>
        </div>

        {/* Perforation line */}
        <div className="relative h-px bg-obsidian-muted/30 mx-6">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-obsidian rounded-full -ml-[3px]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-obsidian rounded-full -mr-[3px]" />
          <div className="absolute inset-0 border-t border-dashed border-obsidian-muted/50" />
        </div>

        {/* Main Body */}
        <div className="px-6 py-5">
          {/* Flight Code & Route */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Flight</p>
              <p className="text-2xl font-bold text-warm-white font-mono tracking-wider">{flightCode}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Origin</p>
                <p className="text-lg font-bold text-warm-white/60 font-mono">TODAY</p>
              </div>
              <div className="flex flex-col items-center px-2">
                <div className="w-16 h-px bg-ember/40 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-ember rounded-full" />
                </div>
                <svg className="w-4 h-4 text-ember/60 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Dest</p>
                <p className="text-lg font-bold text-ember font-mono">{destination.slice(0, 3).toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Destination Full Name */}
          <div className="mb-6">
            <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Destination</p>
            <p className="font-serif text-xl font-bold text-warm-white">{destination}</p>
          </div>

          {/* Date & Seat */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Departure</p>
              <p className="text-sm font-bold text-warm-white font-mono">{boardingDate}</p>
            </div>
            <div>
              <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Seat</p>
              <p className="text-sm font-bold text-warm-white font-mono">{seatCode}</p>
            </div>
            <div>
              <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Boarding</p>
              <p className="text-sm font-bold text-ember font-mono">PRIORITY</p>
            </div>
          </div>

          {/* Passenger Names */}
          <div className="mb-6">
            <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Passengers</p>
            <div className="flex flex-wrap gap-3 mt-1">
              {passenger1 && (
                <span className="text-sm font-bold text-warm-white">
                  {passenger1}
                </span>
              )}
              {passenger2 && (
                <>
                  <span className="text-warm-white/20">&</span>
                  <span className="text-sm font-bold text-warm-white">
                    {passenger2}
                  </span>
                </>
              )}
              {!passenger1 && !passenger2 && (
                <span className="text-sm font-bold text-warm-white/40">Passenger 1 & Passenger 2</span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Tear Section */}
        <div className="relative">
          {/* Tear perforation */}
          <div className="relative h-px bg-obsidian-muted/30 mx-6">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-obsidian rounded-full -ml-1" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-obsidian rounded-full -mr-1" />
            <div className="absolute inset-0 border-t border-dashed border-obsidian-muted/50" />
          </div>

          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-warm-white/25 tracking-[0.2em] uppercase">Booking Ref</p>
              <p className="text-xs font-mono text-warm-white/60 tracking-wider">
                {bookingId?.slice(0, 12).toUpperCase() || "PENDING"}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Barcode />
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-ember via-amber to-ember" />
      </div>

      {/* Post-ticket CTA */}
      <div className="mt-10 text-center space-y-4">
        <p className="text-sm text-warm-white/30 italic">
          Please proceed to your Departure Lounge
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium text-warm-white bg-ember rounded-full hover:bg-ember-dark transition-all duration-500 ease-expo hover:shadow-xl hover:shadow-ember/20"
        >
          Enter Departure Lounge
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
