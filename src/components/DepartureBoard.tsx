"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export interface DepartureItem {
  id: string;
  routeCode: string;
  destination: string;
  gate: string;
  boardingTime: Date;
  status: "ON TIME" | "BOARDING" | "FINAL CALL" | "GATE CLOSED" | "DEPARTED" | "DELAYED";
  tier: string;
  image?: string | null;
}

interface DepartureBoardProps {
  items: DepartureItem[];
}

const statusConfig: Record<string, { color: string; bg: string; blink?: boolean }> = {
  "ON TIME": { color: "text-green-400", bg: "bg-green-400/8", blink: false },
  BOARDING: { color: "text-amber", bg: "bg-amber/10", blink: true },
  "FINAL CALL": { color: "text-ember", bg: "bg-ember/10", blink: true },
  "GATE CLOSED": { color: "text-warm-white/40", bg: "bg-warm-white/5", blink: false },
  DEPARTED: { color: "text-warm-white/45", bg: "bg-warm-white/5", blink: false },
  DELAYED: { color: "text-red-400", bg: "bg-red-400/8", blink: true },
};

function Ticker() {
  const messages = [
    "WELCOME TO SREVOL DEPARTURES  —  ALL TIMES LOCAL  —  PLEASE HAVE YOUR BOARDING PASS READY  —  PREMIUM CABIN PASSENGERS MAY BOARD AT ANY TIME  —  FARE LOCK GUARANTEE ACTIVE ON ALL CONFIRMED RESERVATIONS  —  QUESTIONS? CONTACT YOUR FLIGHT CONCIERGE  —",
  ];

  return (
    <div className="overflow-hidden bg-obsidian-light/60 border-y border-amber/5 py-2">
      <div className="animate-ticker whitespace-nowrap">
        <span className="text-[10px] font-mono tracking-[0.25em] text-amber/60 uppercase">
          {messages[0]}
        </span>
        <span className="text-[10px] font-mono tracking-[0.25em] text-amber/40 uppercase ml-12">
          {messages[0]}
        </span>
      </div>
    </div>
  );
}

function BoardHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-5 py-3 bg-obsidian-light/60 border-b border-amber/10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5" aria-live="polite">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
          <span className="text-[9px] font-mono tracking-[0.3em] text-green-400 uppercase">
            Live
          </span>
        </div>
        <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/45 uppercase">
          Srevol Operations
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/45 uppercase">
          Local Time
        </span>
        <span className="text-sm font-mono text-amber/70 tracking-wider tabular-nums">
          {time}
        </span>
      </div>
    </div>
  );
}

function BoardRow({ item, index }: { item: DepartureItem; index: number }) {
  const status = statusConfig[item.status] || statusConfig["ON TIME"];
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!status.blink) return;
    const interval = setInterval(() => setShowCursor((p) => !p), 600);
    return () => clearInterval(interval);
  }, [status.blink]);

  const daysUntil = Math.max(
    0,
    Math.ceil(
      (new Date(item.boardingTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  const timeStr = new Date(item.boardingTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/trips/${item.id}`}
      className="group flex items-center gap-3 px-5 py-3.5 border-b border-amber/3 hover:bg-amber/[0.02] transition-colors duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Route Code */}
      <div className="w-16 flex-shrink-0">
        <span className="text-xs font-mono tracking-wider text-amber/60">
          {item.routeCode}
        </span>
      </div>

      {/* Destination */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-warm-white/80 truncate group-hover:text-amber transition-colors duration-300">
          {item.destination}
        </p>
        <p className="text-[9px] font-mono text-warm-white/40 tracking-wider uppercase mt-0.5">
          {item.tier} Class
        </p>
      </div>

      {/* Gate */}
      <div className="w-12 flex-shrink-0 text-center hidden sm:block">
        <span className="text-xs font-mono text-warm-white/55 tracking-wider">
          {item.gate}
        </span>
      </div>

      {/* Date */}
      <div className="w-16 flex-shrink-0 text-right hidden sm:block">
        <span className="text-xs font-mono text-warm-white/30 tabular-nums">
          {timeStr}
        </span>
      </div>

      {/* Countdown */}
      <div className="w-16 flex-shrink-0 text-right hidden md:block">
        <span className="text-xs font-mono text-warm-white/50 tabular-nums">
          {daysUntil}d
        </span>
      </div>

      {/* Status */}
      <div className="w-28 flex-shrink-0 text-right">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm ${status.color} ${status.bg}`}
        >
          {status.blink && (
            <span
              className={`w-1 h-1 rounded-full ${status.color.replace("text-", "bg-")} ${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}
            />
          )}
          {item.status}
        </span>
      </div>
    </Link>
  );
}

export default function DepartureBoard({ items }: DepartureBoardProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber/8 overflow-hidden bg-obsidian-light/40 backdrop-blur-sm" role="region" aria-label="Departure board">
      {/* Ticker */}
      <Ticker />

      {/* Header */}
      <BoardHeader />

      {/* Column Headers */}
      <div className="flex items-center gap-3 px-5 py-2 bg-obsidian-light/40 border-b border-amber/5">
        <div className="w-16 flex-shrink-0">
          <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/40 uppercase">
            Route
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/40 uppercase">
            Destination
          </span>
        </div>
        <div className="w-12 flex-shrink-0 text-center hidden sm:block">
          <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/40 uppercase">
            Gate
          </span>
        </div>
        <div className="w-16 flex-shrink-0 text-right hidden sm:block">
          <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/40 uppercase">
            Date
          </span>
        </div>
        <div className="w-16 flex-shrink-0 text-right hidden md:block">
          <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/40 uppercase">
            T-Minus
          </span>
        </div>
        <div className="w-28 flex-shrink-0 text-right">
          <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/40 uppercase">
            Status
          </span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-amber/[0.02]">
        {items.map((item, i) => (
          <BoardRow key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-2 bg-obsidian-light/40 border-t border-amber/5 flex items-center justify-between">
        <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/40 uppercase">
          {items.length} Active Departure{items.length !== 1 ? "s" : ""}
        </span>
        <span className="text-[9px] font-mono tracking-[0.2em] text-warm-white/30 uppercase">
          Srevol Departure Board v2.0
        </span>
      </div>
    </div>
  );
}

export function EmptyDepartures() {
  return (
    <div className="rounded-xl border border-amber/8 overflow-hidden bg-obsidian-light/40 backdrop-blur-sm">
      <Ticker />
      <div className="px-5 py-10 text-center">
        <p className="text-sm font-mono text-warm-white/50 tracking-wider uppercase">
          No Active Departures
        </p>
        <p className="text-xs text-warm-white/40 mt-2">
          Secure a reservation to see it on the departure board
        </p>
      </div>
    </div>
  );
}
