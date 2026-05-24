"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PackageTemplate {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  destination: string;
  image: string;
  basePrice: number;
  duration: number;
  tier: { name: string; slug: string } | null;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price / 100);
}

export default function RouteIndex() {
  const [packages, setPackages] = useState<PackageTemplate[]>([]);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPackages(data.templates);
      });
  }, []);

  return (
    <section className="bg-obsidian relative">
      {/* Section header */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-32 lg:pt-44 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/30">
              The Network
            </span>
            <h2
              className="mt-4 font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-warm-white tracking-tight"
              style={{ lineHeight: 0.95 }}
            >
              Curated
              <br />
              <span className="text-ember">Routes</span>
            </h2>
          </div>
          <p className="text-sm text-warm-white/25 max-w-xs leading-relaxed lg:text-right">
            Twenty-one departures across four cabin classes. Each route chosen
            for romance.
          </p>
        </div>
      </div>

      {/* Background image preview on hover */}
      <div className="relative">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="absolute inset-0 transition-opacity duration-700 ease-expo pointer-events-none"
            style={{
              opacity: hoveredSlug === pkg.slug ? 0.08 : 0,
              backgroundImage: `url(${pkg.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        {/* Route list */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-12">
          {packages.length === 0 && (
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="py-8 border-t border-warm-white/5">
                  <div className="h-6 w-96 skeleton-shimmer" />
                </div>
              ))}
            </div>
          )}

          {packages.map((pkg, index) => (
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
                style={{
                  transitionDelay: `${index * 30}ms`,
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left — route code + tier */}
                  <div className="hidden lg:flex items-center gap-6 w-48 flex-shrink-0">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-warm-white/20 font-mono">
                      SV-{String(index + 1).padStart(3, "0")}
                    </span>
                    {pkg.tier && (
                      <span className="text-[9px] tracking-[0.2em] uppercase text-warm-white/15">
                        {pkg.tier.name}
                      </span>
                    )}
                  </div>

                  {/* Center — destination */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-warm-white/80 group-hover:text-warm-white transition-colors duration-500 truncate">
                      {pkg.title}
                    </h3>
                    <p className="mt-1 text-xs text-warm-white/20 group-hover:text-warm-white/30 transition-colors duration-500">
                      {pkg.subtitle}
                    </p>
                  </div>

                  {/* Right — price + duration */}
                  <div className="flex items-center gap-6 lg:gap-10 flex-shrink-0">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm text-warm-white/60 font-serif">
                        {formatPrice(pkg.basePrice)}
                      </p>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-warm-white/15">
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
      </div>

      {/* View all link */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-16 lg:py-20">
        <Link
          href="/packages"
          className="group inline-flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-warm-white/30 hover:text-ember transition-colors duration-500"
        >
          <span>View All Routes</span>
          <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-500 ease-expo" />
        </Link>
      </div>
    </section>
  );
}
