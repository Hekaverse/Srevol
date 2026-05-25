"use client";

import Link from "next/link";
import { useState } from "react";

interface PackageTemplate {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  destination: string;
  image: string;
  basePrice: number;
  duration: number;
  category: string;
  isPremium: boolean;
  tier: { name: string; slug: string } | null;
  recentBookings: number;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price / 100);
}

export default function PackagesGrid({
  templates,
}: {
  templates: PackageTemplate[];
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const filtered =
    activeFilter === "All"
      ? templates
      : templates.filter((p) => p.category === activeFilter.toUpperCase());

  const filters = ["All", "Honeymoon", "Adventure", "Milestone", "Celebration"];

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
      {/* Header */}
      <div className="pt-20 pb-16">
        <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/55">
          The Network
        </span>
        <h1
          className="mt-4 font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-warm-white tracking-tight"
          style={{ lineHeight: 0.95 }}
        >
          Curated
          <br />
          <span className="text-ember">Routes</span>
        </h1>
        <p className="mt-6 text-sm text-warm-white/50 max-w-md leading-relaxed">
          Every route is chosen for two. Browse, dream, and secure your departure.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1 mb-12">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-[11px] tracking-[0.1em] uppercase transition-all duration-500 ease-expo ${
              activeFilter === filter
                ? "text-ember"
                : "text-warm-white/50 hover:text-warm-white/75"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Hairline */}
      <div className="hairline mb-0" />

      {/* Route list */}
      <div className="relative">
        {filtered.map((pkg, index) => (
          <Link
            key={pkg.id}
            href={`/packages/${pkg.slug}`}
            className="group block"
            onMouseEnter={() => setHoveredSlug(pkg.slug)}
            onMouseLeave={() => setHoveredSlug(null)}
          >
            <div
              className={`border-t border-warm-white/5 py-6 lg:py-8 transition-all duration-500 ease-expo ${
                hoveredSlug === pkg.slug ? "bg-warm-white/[0.02]" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left — index + tier */}
                <div className="hidden lg:flex items-center gap-6 w-40 flex-shrink-0">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-warm-white/45 font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {pkg.tier && (
                    <span className="text-[9px] tracking-[0.2em] uppercase text-warm-white/40">
                      {pkg.tier.name}
                    </span>
                  )}
                </div>

                {/* Center — destination */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-warm-white/80 group-hover:text-warm-white transition-colors duration-500 truncate">
                      {pkg.title}
                    </h3>
                    {pkg.isPremium && (
                      <span className="hidden sm:inline text-[9px] tracking-[0.2em] uppercase text-ember/60">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-warm-white/45 group-hover:text-warm-white/60 transition-colors duration-500">
                    {pkg.subtitle}
                  </p>
                </div>

                {/* Right — price + duration + arrow */}
                <div className="flex items-center gap-6 lg:gap-10 flex-shrink-0">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm text-warm-white/60 font-serif">
                      {formatPrice(pkg.basePrice)}
                    </p>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-warm-white/40">
                      Cabin for 2
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-warm-white/40">
                      {pkg.duration}d
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center">
                    <span className="w-6 h-px bg-warm-white/20 group-hover:w-10 group-hover:bg-ember transition-all duration-500 ease-expo" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Bottom border */}
        <div className="border-t border-warm-white/5" />
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-warm-white/55 text-sm tracking-luxury">
            No routes match this filter.
          </p>
          <button
            onClick={() => setActiveFilter("All")}
            className="mt-4 text-[11px] tracking-[0.15em] uppercase text-ember/50 hover:text-ember transition-colors duration-500"
          >
            Show all routes
          </button>
        </div>
      )}
    </div>
  );
}
