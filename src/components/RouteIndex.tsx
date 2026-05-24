"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPackages(data.templates);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const panelWidth = el.firstElementChild?.clientWidth || 1;
      const index = Math.round(scrollLeft / panelWidth);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [packages.length]);

  return (
    <section ref={sectionRef} className="bg-obsidian py-24 lg:py-32">
      {/* Section header */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 mb-12">
        <div className="flex items-end justify-between">
          <div
            className={`transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/20">
              The Network
            </span>
            <p className="mt-2 font-serif text-lg text-warm-white/40">
              {packages.length} curated routes
            </p>
          </div>
          <div
            className={`hidden lg:flex items-center gap-4 transition-all duration-1000 ease-expo ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "0.2s" }}
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-warm-white/15 font-mono">
              {String(activeIndex + 1).padStart(2, "0")} / {String(packages.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal film-strip gallery */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Left padding */}
        <div className="flex-shrink-0 w-8 lg:w-12" />

        {packages.map((pkg, index) => (
          <Link
            key={pkg.id}
            href={`/packages/${pkg.slug}`}
            className="group flex-shrink-0 snap-start"
            style={{ width: "clamp(300px, 70vw, 900px)" }}
          >
            <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden mx-2 lg:mx-3">
              {/* Image with parallax-like scale on hover */}
              <Image
                src={pkg.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop"}
                alt={pkg.title}
                fill
                sizes="70vw"
                className="object-cover transition-transform duration-[2s] ease-expo group-hover:scale-105"
                style={{ filter: "grayscale(30%) contrast(1.1)" }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />

              {/* Content overlay */}
              <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-warm-white/30 font-mono">
                      {pkg.tier?.name || "Route"}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl lg:text-4xl text-warm-white group-hover:text-ember transition-colors duration-700">
                      {pkg.title}
                    </h3>
                    <p className="mt-1 text-xs text-warm-white/30">
                      {pkg.subtitle}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg lg:text-xl text-warm-white/60 font-serif">
                      {formatPrice(pkg.basePrice)}
                    </p>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-warm-white/15">
                      {pkg.duration}d
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Right padding */}
        <div className="flex-shrink-0 w-8 lg:w-12" />
      </div>

      {/* Progress bar */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 mt-8">
        <div className="h-px bg-warm-white/5 w-full">
          <div
            className="h-full bg-warm-white/20 transition-all duration-500 ease-expo"
            style={{
              width: packages.length > 0 ? `${((activeIndex + 1) / packages.length) * 100}%` : "0%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
