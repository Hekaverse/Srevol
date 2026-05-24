"use client";

import { useEffect, useState } from "react";

const heroImages = [
  "https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=1920&h=1080&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&h=1080&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&h=1080&fit=crop&q=80",
];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 2600); // after loading screen
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [mounted]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-obsidian">
      {/* Cinematic background — heavily treated */}
      {heroImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[3000ms] ease-expo"
          style={{
            opacity: currentImage === index && mounted ? 0.12 : 0,
            zIndex: 1,
          }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${src})`,
              filter: "grayscale(100%) contrast(1.2)",
              transform: "scale(1.1)",
            }}
          />
        </div>
      ))}

      {/* Deep vignette */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(12,12,12,0.3) 0%, rgba(12,12,12,0.95) 70%)",
        }}
      />

      {/* Massive typography — bleeding off edges */}
      <div className="absolute inset-0 z-10 flex items-end overflow-hidden">
        <h1
          className={`font-serif font-light text-warm-white leading-[0.78] tracking-[-0.02em] select-none transition-all duration-[2000ms] ease-expo ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
          }`}
          style={{
            fontSize: "clamp(8rem, 24vw, 28rem)",
            marginLeft: "-0.08em",
            marginBottom: "-0.12em",
          }}
        >
          SREVOL
        </h1>
      </div>

      {/* Right-edge vertical tagline */}
      <div
        className={`absolute right-6 lg:right-10 bottom-32 z-10 transition-all duration-1000 ease-expo ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "0.8s" }}
      >
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-warm-white/25"
          style={{ writingMode: "vertical-rl" }}
        >
          The Private Carrier for Two
        </span>
      </div>

      {/* Top-left meta */}
      <div
        className={`absolute top-24 left-8 lg:left-12 z-10 transition-all duration-1000 ease-expo ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "0.5s" }}
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-warm-white/15 font-mono">
          EST. 2026
        </span>
      </div>

      {/* Bottom-center scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-all duration-1000 ease-expo ${
          mounted ? "opacity-20" : "opacity-0"
        }`}
        style={{ transitionDelay: "1.5s" }}
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent via-warm-white/40 to-transparent" />
      </div>
    </section>
  );
}
