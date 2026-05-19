"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
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
  category: string;
  isPremium: boolean;
  tier: { name: string; slug: string } | null;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPackages(data.templates);
        setLoading(false);
      });
  }, []);

  const filtered = activeFilter === "All"
    ? packages
    : packages.filter((p) => p.category === activeFilter.toUpperCase());

  const filters = ["All", "Honeymoon", "Anniversary", "Getaway", "Adventure"];

  return (
    <div className="min-h-screen bg-plum-900">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-rose-gold tracking-[0.4em] uppercase">All Destinations</span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-white tracking-tight">
              Curated for Two
            </h1>
            <p className="mt-4 text-lg text-warm-white/40 max-w-2xl mx-auto">
              Every destination is chosen for romance. Browse, dream, and begin your countdown.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all ${
                  activeFilter === filter
                    ? "bg-rose-gold text-plum-900"
                    : "border border-warm-white/15 text-warm-white/50 hover:border-warm-white/30 hover:text-warm-white/80"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-warm-white/30">Loading destinations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pkg) => (
                <Link key={pkg.id} href={`/packages/${pkg.slug}`} className="group block">
                  <div className="relative h-80 rounded-2xl overflow-hidden">
                    <Image
                      src={pkg.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop"}
                      alt={pkg.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-900/90 via-plum-900/30 to-transparent" />
                    {pkg.isPremium && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-plum-900 bg-rose-gold rounded-full">
                          Premium
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-warm-white group-hover:text-rose-gold transition-colors">
                            {pkg.title}
                          </h3>
                          <p className="mt-1 text-sm text-warm-white/50">{pkg.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-warm-white">{formatPrice(pkg.basePrice)}</p>
                          <p className="text-xs text-warm-white/30">for 2</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-warm-white/10 flex items-center justify-between">
                        <span className="text-xs text-warm-white/30 tracking-wider uppercase">
                          {pkg.destination} • {pkg.duration} days
                        </span>
                        <span className="text-xs text-rose-gold group-hover:translate-x-1 transition-transform">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
