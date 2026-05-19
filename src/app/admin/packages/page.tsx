"use client";

import { useState } from "react";
import Link from "next/link";

interface AssembledPackage {
  hotel: { name: string; price: number; starRating: number | null };
  flights: { name: string; price: number }[];
  activities: { name: string; price: number; dayOffset: number }[];
  totalPrice: number;
  nightlyRate: number;
}

export default function PackageBuilderAdminPage() {
  const [destination, setDestination] = useState("Santorini, Greece");
  const [duration, setDuration] = useState(7);
  const [budgetMax, setBudgetMax] = useState(500000);
  const [building, setBuilding] = useState(false);
  const [result, setResult] = useState<AssembledPackage | null>(null);

  const build = async () => {
    setBuilding(true);
    try {
      const res = await fetch("/api/packages/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, duration, budgetMax }),
      });
      const data = await res.json();
      if (data.success) setResult(data.package);
    } finally {
      setBuilding(false);
    }
  };

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  return (
    <div className="min-h-screen bg-plum-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/admin" className="text-sm text-rose-gold hover:underline">← Back to Command Center</Link>
          <h1 className="mt-2 font-serif text-3xl font-bold text-warm-white">Package Builder</h1>
          <p className="mt-2 text-warm-white/40">Auto-assemble packages from real inventory in seconds.</p>
        </div>

        <div className="p-6 bg-plum-800/50 rounded-2xl border border-plum-700/30 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-warm-white/50 mb-2">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-plum-600 bg-plum-900/50 text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-white/50 mb-2">Duration (days)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-plum-600 bg-plum-900/50 text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
              />
            </div>
            <div>
              <label className="block text-sm text-warm-white/50 mb-2">Budget Max ($)</label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-plum-600 bg-plum-900/50 text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold/50"
              />
            </div>
          </div>
          <button
            onClick={build}
            disabled={building}
            className="mt-4 px-6 py-2.5 text-sm font-medium text-plum-900 bg-rose-gold rounded-full hover:bg-rose-gold-light transition-all disabled:opacity-50"
          >
            {building ? "Assembling..." : "Build Package"}
          </button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="p-8 bg-plum-800/30 rounded-2xl border border-plum-700/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-warm-white">Assembled Package</h2>
                <div className="text-right">
                  <p className="font-serif text-3xl font-bold text-rose-gold">{formatPrice(result.totalPrice)}</p>
                  <p className="text-xs text-warm-white/30">total for 2 people</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-plum-900/50 rounded-xl border border-plum-700/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-rose-gold uppercase tracking-wider">Hotel</p>
                      <p className="text-lg font-bold text-warm-white mt-1">{result.hotel.name}</p>
                      <p className="text-sm text-warm-white/40">{result.hotel.starRating}★ • {formatPrice(result.nightlyRate)}/night</p>
                    </div>
                    <p className="text-lg font-bold text-warm-white">{formatPrice(result.hotel.price * duration)}</p>
                  </div>
                </div>

                <div className="p-4 bg-plum-900/50 rounded-xl border border-plum-700/20">
                  <p className="text-xs text-rose-gold uppercase tracking-wider mb-3">Flights</p>
                  <div className="space-y-2">
                    {result.flights.map((f, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <p className="text-sm text-warm-white/70">{f.name}</p>
                        <p className="text-sm font-medium text-warm-white">{formatPrice(f.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-plum-900/50 rounded-xl border border-plum-700/20">
                  <p className="text-xs text-rose-gold uppercase tracking-wider mb-3">Activities</p>
                  <div className="space-y-2">
                    {result.activities.map((a, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-warm-white/70">{a.name}</p>
                          <p className="text-xs text-warm-white/30">Day {a.dayOffset + 1}</p>
                        </div>
                        <p className="text-sm font-medium text-warm-white">{formatPrice(a.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
