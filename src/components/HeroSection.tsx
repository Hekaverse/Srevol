"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const heroImages = [
  "https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=1920&h=1080&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&h=1080&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&h=1080&fit=crop&q=80",
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-obsidian">
      {/* Cinematic background crossfade */}
      {heroImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-expo"
          style={{
            opacity: currentImage === index ? 0.35 : 0,
            zIndex: 1,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
            style={{ backgroundImage: `url(${src})` }}
          />
        </div>
      ))}

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(12,12,12,0.8) 100%)",
        }}
      />

      {/* Bottom gradient for readability */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(12,12,12,0.9) 0%, transparent 100%)",
        }}
      />

      {/* Content — anchored bottom-left, editorial */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-[1400px] mx-auto px-8 lg:px-12 pb-20 lg:pb-28">
        {/* Route indicator */}
        <div
          className={`transition-all duration-1000 ease-expo ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "0.2s" }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/30">
            Est. 2026 — Private Carrier
          </span>
        </div>

        {/* Massive wordmark */}
        <h1
          className={`mt-6 font-serif font-light text-warm-white leading-[0.85] tracking-tight transition-all duration-1000 ease-expo ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{
            transitionDelay: "0.5s",
            fontSize: "clamp(4rem, 15vw, 14rem)",
          }}
        >
          SREVOL
        </h1>

        {/* Hairline */}
        <div
          className={`mt-8 hairline-ember max-w-[200px] transition-all duration-1000 ease-expo ${
            mounted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
          style={{
            transitionDelay: "0.8s",
            transformOrigin: "left",
          }}
        />

        {/* Tagline row */}
        <div
          className={`mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 transition-all duration-1000 ease-expo ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "1s" }}
        >
          <p className="text-lg lg:text-xl text-warm-white/40 max-w-md leading-relaxed font-light">
            The private carrier for two.
            <br />
            Reserve your route. Lock your fare.
          </p>

          <Link
            href="/packages"
            className="group inline-flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-warm-white/50 hover:text-ember transition-colors duration-500"
          >
            <span>Explore Routes</span>
            <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-500 ease-expo" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator — bottom right */}
      <div
        className={`absolute bottom-20 lg:bottom-28 right-8 lg:right-12 z-10 flex flex-col items-center gap-3 transition-all duration-1000 ease-expo ${
          mounted ? "opacity-30" : "opacity-0"
        }`}
        style={{ transitionDelay: "2s" }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-warm-white/40 [writing-mode:vertical-lr]">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-warm-white/30 to-transparent" />
      </div>
    </section>
  );
}
