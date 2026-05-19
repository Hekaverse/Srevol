"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Tier {
  id: string;
  slug: string;
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  defaultMonths: number;
  destinations: string[];
  accentColor: string;
  inflationBuffer: number;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function TiersPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tiers")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTiers(data.tiers);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-plum-900">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-rose-gold tracking-[0.4em] uppercase">Choose Your Path</span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-white tracking-tight">
              Where Will Your Story
              <br />
              <span className="text-rose-gold">Begin?</span>
            </h1>
            <p className="mt-6 text-lg text-warm-white/40 max-w-2xl mx-auto leading-relaxed">
              Every tier is a promise. Pick the escape that matches your dream,
              and we&apos;ll build the journey back to today — one payment at a time.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-warm-white/30">Loading tiers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier, index) => {
                const monthly = Math.ceil(tier.maxPrice / tier.defaultMonths);
                const protectedMax = Math.round(tier.maxPrice * (1 + tier.inflationBuffer));
                return (
                  <div
                    key={tier.slug}
                    className="group relative bg-plum-800/50 rounded-2xl border border-plum-700/30 p-6 hover:border-rose-gold/30 transition-all duration-500 flex flex-col"
                  >
                    <div className="font-serif text-5xl font-bold text-plum-700/50 mb-4">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-warm-white group-hover:text-rose-gold transition-colors">
                      {tier.name}
                    </h3>

                    <p className="mt-3 text-sm text-warm-white/40 leading-relaxed flex-1">
                      {tier.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {tier.destinations.slice(0, 3).map((d) => (
                        <span key={d} className="text-[10px] px-2 py-1 rounded-full bg-plum-700/50 text-warm-white/40 tracking-wider uppercase">
                          {d}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-plum-700/30">
                      <p className="text-xs text-warm-white/30">Base estimate</p>
                      <p className="font-serif text-2xl font-bold text-warm-white">
                        {formatPrice(tier.minPrice)}
                        <span className="text-sm font-normal text-warm-white/30"> — {formatPrice(tier.maxPrice)}</span>
                      </p>

                      <div className="mt-3 p-3 bg-plum-900/50 rounded-xl border border-plum-700/20">
                        <p className="text-xs text-rose-gold/70 flex items-center gap-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                          Price Protected
                        </p>
                        <p className="text-xs text-warm-white/30 mt-1">
                          Savings target: <span className="text-warm-white/50">{formatPrice(protectedMax)}</span>
                        </p>
                        <p className="text-[10px] text-warm-white/20 mt-1">
                          Includes {Math.round(tier.inflationBuffer * 100)}% buffer for price protection
                        </p>
                      </div>

                      <p className="text-xs text-warm-white/30 mt-3">
                        From {formatPrice(monthly)}/mo over {tier.defaultMonths} months
                      </p>
                    </div>

                    <Link
                      href={`/register?tier=${tier.slug}`}
                      className="mt-6 block w-full py-3 text-center text-sm font-medium text-plum-900 rounded-xl transition-all"
                      style={{ backgroundColor: tier.accentColor || "#D4A574" }}
                    >
                      Choose {tier.name.split(" ")[0]}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16 p-6 bg-plum-800/30 rounded-2xl border border-plum-700/30">
            <h3 className="font-bold text-warm-white mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              How Price Protection Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div>
                <p className="text-sm font-medium text-warm-white/70">1. Save with a Buffer</p>
                <p className="text-xs text-warm-white/40 mt-1">Your monthly payment includes an inflation buffer (10-20%) so you&apos;re covered if prices rise.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-warm-white/70">2. We Reprice at Booking</p>
                <p className="text-xs text-warm-white/40 mt-1">12-18 months before travel, we check live prices and match you to the best available package.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-warm-white/70">3. You Choose</p>
                <p className="text-xs text-warm-white/40 mt-1">If prices dropped: upgrade or get credit. If prices rose: your buffer covers it, or you choose how to adjust.</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-warm-white/20 italic">
              &ldquo;A journey for lovers, told in reverse — from the destination back to the moment you met.&rdquo;
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
