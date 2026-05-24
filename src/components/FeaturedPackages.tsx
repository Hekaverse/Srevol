"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TiltCard from "./TiltCard";
import ScrollReveal from "./ScrollReveal";

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
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price / 100);
}

export default function FeaturedPackages() {
  const [packages, setPackages] = useState<PackageTemplate[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPackages(data.templates.slice(0, 4));
      });
  }, []);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -el.clientWidth * 0.7 : el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section className="py-32 lg:py-44 bg-obsidian relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(199,107,74,0.2) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, rgba(212,165,86,0.12) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal animation="fade-up" className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-medium text-ember tracking-wide-luxury uppercase">The Network</span>
            <h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-warm-white tracking-tight">
              Curated for Two
            </h2>
            <p className="mt-5 text-lg text-warm-white/30 max-w-md leading-relaxed">
              Every route is chosen for romance. Browse, dream, and secure your departure.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border border-warm-white/10 flex items-center justify-center transition-all duration-500 ease-expo ${
                canScrollLeft ? "text-warm-white hover:bg-warm-white/10 hover:border-warm-white/25" : "text-warm-white/15 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border border-warm-white/10 flex items-center justify-center transition-all duration-500 ease-expo ${
                canScrollRight ? "text-warm-white hover:bg-warm-white/10 hover:border-warm-white/25" : "text-warm-white/15 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </ScrollReveal>
      </div>

      <div ref={scrollRef} onScroll={checkScroll} className="flex gap-6 overflow-x-auto hide-scrollbar scroll-snap-x pl-6 lg:pl-[calc((100vw-80rem)/2+1.5rem)] pr-6">
        {packages.length === 0 && (
          <div className="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] h-[60vh] min-h-[400px] max-h-[600px] rounded-2xl skeleton-shimmer" />
        )}
        {packages.map((pkg, index) => (
          <Link
            key={pkg.id}
            href={`/packages/${pkg.slug}`}
            className="group flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] scroll-snap-align-start"
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <TiltCard className="relative h-[60vh] min-h-[400px] max-h-[600px] rounded-2xl overflow-hidden">
              <Image
                src={pkg.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop"}
                alt={pkg.title}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 60vw, (max-width: 1024px) 45vw, 35vw"
                className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-105"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                {pkg.isPremium && (
                  <span className="self-start px-3 py-1.5 text-[10px] font-medium tracking-[0.2em] uppercase text-warm-white bg-ember rounded-full mb-5">
                    Premium
                  </span>
                )}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-warm-white group-hover:text-ember transition-colors duration-500">
                      {pkg.title}
                    </h3>
                    <p className="mt-2 text-sm text-warm-white/50">{pkg.subtitle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-warm-white font-serif">{formatPrice(pkg.basePrice)}</p>
                    <p className="text-xs text-warm-white/30 tracking-luxury">cabin for 2</p>
                  </div>
                </div>
                <div className="mt-5 pt-5 border-t border-warm-white/8 flex items-center justify-between">
                  <span className="text-xs text-warm-white/30 tracking-wide-luxury uppercase">
                    {pkg.destination} &middot; {pkg.duration} days
                  </span>
                  <span className="text-xs text-ember font-medium group-hover:translate-x-1 transition-transform duration-300">
                    View Route &rarr;
                  </span>
                </div>
              </div>
            </TiltCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
