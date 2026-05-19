"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPackages(data.templates.slice(0, 4));
      });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
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
    <section ref={sectionRef} className="py-32 lg:py-40 bg-plum-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(212,165,116,0.3) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-medium text-rose-gold tracking-[0.4em] uppercase">Destinations</span>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-white tracking-tight">
              Curated for Two
            </h2>
            <p className="mt-4 text-lg text-warm-white/40 max-w-md">
              Every destination is chosen for romance. Browse, dream, and begin your countdown.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll("left")} className={`w-12 h-12 rounded-full border border-warm-white/20 flex items-center justify-center transition-all ${canScrollLeft ? "text-warm-white hover:bg-warm-white/10" : "text-warm-white/20 cursor-not-allowed"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll("right")} className={`w-12 h-12 rounded-full border border-warm-white/20 flex items-center justify-center transition-all ${canScrollRight ? "text-warm-white hover:bg-warm-white/10" : "text-warm-white/20 cursor-not-allowed"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} onScroll={checkScroll} className="flex gap-6 overflow-x-auto hide-scrollbar scroll-snap-x pl-6 lg:pl-[calc((100vw-80rem)/2+1.5rem)] pr-6">
        {packages.map((pkg, index) => (
          <Link key={pkg.id} href={`/packages/${pkg.slug}`} className={`group flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${index * 200}ms` }}>
            <div className="relative h-[60vh] min-h-[400px] max-h-[600px] rounded-2xl overflow-hidden">
              <Image
                src={pkg.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop"}
                alt={pkg.title}
                fill
                sizes="(max-width: 640px) 85vw, (max-width: 768px) 60vw, (max-width: 1024px) 45vw, 35vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-900/90 via-plum-900/20 to-transparent" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                {pkg.isPremium && (
                  <span className="self-start px-3 py-1 text-[10px] font-medium tracking-[0.2em] uppercase text-plum-900 bg-rose-gold rounded-full mb-4">Premium</span>
                )}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-warm-white group-hover:text-rose-gold transition-colors">{pkg.title}</h3>
                    <p className="mt-1 text-sm text-warm-white/60">{pkg.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-warm-white">{formatPrice(pkg.basePrice)}</p>
                    <p className="text-xs text-warm-white/40">for 2</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-warm-white/10 flex items-center justify-between">
                  <span className="text-xs text-warm-white/40 tracking-wider uppercase">{pkg.destination} • {pkg.duration} days</span>
                  <span className="text-xs text-rose-gold font-medium group-hover:translate-x-1 transition-transform">Explore →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
