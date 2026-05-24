"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import TiltCard from "@/components/TiltCard";
import ScrollReveal from "@/components/ScrollReveal";

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

function PackageSkeleton() {
  return (
    <div className="relative h-96 rounded-3xl overflow-hidden skeleton-shimmer">
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div className="h-6 w-32 skeleton-shimmer rounded" />
        <div className="h-4 w-48 skeleton-shimmer rounded" />
      </div>
    </div>
  );
}

export default function PackagesGrid({
  templates,
}: {
  templates: PackageTemplate[];
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? templates
      : templates.filter((p) => p.category === activeFilter.toUpperCase());

  const filters = ["All", "Milestone", "Celebration", "Short Haul", "Adventure"];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Header */}
      <ScrollReveal animation="fade-up" className="text-center mb-20">
        <span className="text-xs font-medium text-ember tracking-wide-luxury uppercase">
          The SREVOL Network
        </span>
        <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-warm-white tracking-tight">
          Curated Routes
        </h1>
        <p className="mt-6 text-lg text-warm-white/30 max-w-2xl mx-auto leading-relaxed">
          Every route is chosen for two. Browse, dream, and secure your departure.
        </p>
      </ScrollReveal>

      {/* Filters */}
      <ScrollReveal
        animation="fade-up"
        delay={0.2}
        className="flex flex-wrap items-center justify-center gap-3 mb-16"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-500 ease-expo ${
              activeFilter === filter
                ? "bg-ember text-warm-white shadow-lg shadow-ember/10"
                : "border border-warm-white/10 text-warm-white/40 hover:border-warm-white/25 hover:text-warm-white/70"
            }`}
          >
            {filter}
          </button>
        ))}
      </ScrollReveal>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pkg, index) => (
          <ScrollReveal
            key={pkg.id}
            animation="fade-up"
            delay={index * 0.08}
          >
            <Link href={`/packages/${pkg.slug}`} className="group block">
              <TiltCard
                className="relative h-96 rounded-3xl overflow-hidden"
                maxTilt={5}
                glareOpacity={0.05}
              >
                <Image
                  src={
                    pkg.image ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop"
                  }
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.5s] ease-expo group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
                {pkg.isPremium && (
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1.5 text-[10px] font-medium tracking-[0.2em] uppercase text-warm-white bg-ember rounded-full">
                      Premium
                    </span>
                  </div>
                )}
                {pkg.recentBookings > 0 && (
                  <div className="absolute top-5 right-5">
                    <span className="px-3 py-1.5 text-[10px] font-medium tracking-[0.2em] uppercase text-warm-white/80 bg-obsidian/60 backdrop-blur-sm rounded-full border border-warm-white/10">
                      {pkg.recentBookings} booked this month
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-warm-white group-hover:text-ember transition-colors duration-500">
                        {pkg.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-warm-white/40">
                        {pkg.subtitle}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-warm-white font-serif">
                        {formatPrice(pkg.basePrice)}
                      </p>
                      <p className="text-[10px] text-warm-white/25 tracking-wide-luxury uppercase">
                        cabin for 2
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-warm-white/8 flex items-center justify-between">
                    <span className="text-[11px] text-warm-white/25 tracking-wide-luxury uppercase">
                      {pkg.destination} &middot; {pkg.duration} days
                    </span>
                    <span className="text-[11px] text-ember/70 font-medium group-hover:translate-x-1 transition-transform duration-300">
                      View Route &rarr;
                    </span>
                  </div>
                </div>
              </TiltCard>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-warm-white/30 text-lg">
            No routes match this filter.
          </p>
          <button
            onClick={() => setActiveFilter("All")}
            className="mt-4 text-ember/70 hover:text-ember transition-colors"
          >
            Show all routes
          </button>
        </div>
      )}
    </div>
  );
}
