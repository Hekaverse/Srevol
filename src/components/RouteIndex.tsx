"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import BarcodeSeparator from "./BarcodeSeparator";

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
    <section ref={sectionRef} className="bg-obsidian">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 pt-32 pb-8">
        <div
          className={`flex items-end justify-between transition-all duration-1000 ease-expo ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/20">
              Route Map
            </span>
            <div className="mt-3 flex items-baseline gap-4">
              <p className="font-serif text-lg text-warm-white/40">
                {packages.length} active routes
              </p>
              <span className="text-[10px] tracking-[0.2em] uppercase text-warm-white/10 font-mono">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(packages.length).padStart(2, "0")}
              </span>
            </div>
          </div>
          <BarcodeSeparator />
        </div>
      </div>

      {/* Horizontal cinematic gallery */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex-shrink-0 w-8 lg:w-12" />

        {packages.map((pkg, index) => (
          <Link
            key={pkg.id}
            href={`/packages/${pkg.slug}`}
            className="group flex-shrink-0 snap-start"
            style={{ width: "clamp(320px, 85vw, 1100px)" }}
          >
            <div
              className="relative mx-2 lg:mx-4"
              style={{ height: "clamp(380px, 55vh, 600px)" }}
            >
              <Image
                src={
                  pkg.image ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop"
                }
                alt={pkg.title}
                fill
                sizes="85vw"
                className="object-cover transition-transform duration-[2.5s] ease-expo group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent" />

              {/* Top-left: route code + class */}
              <div className="absolute top-5 left-5 z-10">
                <span className="text-[10px] tracking-[0.2em] uppercase text-warm-white/40 font-mono">
                  {pkg.tier?.name || "Route"} Class
                </span>
              </div>

              {/* Top-right: route code */}
              <div className="absolute top-5 right-5 z-10">
                <span className="text-[10px] tracking-[0.2em] uppercase text-warm-white/25 font-mono">
                  SV-{String(index + 1).padStart(3, "0")}
                </span>
              </div>

              {/* Bottom: title + price */}
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-warm-white group-hover:text-ember transition-colors duration-700">
                      {pkg.title}
                    </h3>
                    <p className="mt-1 text-xs text-warm-white/35">
                      {pkg.subtitle}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl lg:text-2xl text-warm-white/70 font-serif">
                      {formatPrice(pkg.basePrice)}
                    </p>
                    <p className="text-[9px] tracking-[0.15em] uppercase text-warm-white/20">
                      {pkg.duration} days · cabin for 2
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        <div className="flex-shrink-0 w-8 lg:w-12" />
      </div>

      {/* Progress bar */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 mt-10 pb-24">
        <div className="flex items-center gap-4">
          <div className="h-px bg-warm-white/5 flex-1">
            <div
              className="h-full bg-ember/30 transition-all duration-500 ease-expo"
              style={{
                width:
                  packages.length > 0
                    ? `${((activeIndex + 1) / packages.length) * 100}%`
                    : "0%",
              }}
            />
          </div>
          <BarcodeSeparator />
        </div>
      </div>
    </section>
  );
}
