"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthShell({ children, title, subtitle }: AuthShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(199, 107, 74, 0.04), transparent 50%),
          radial-gradient(600px circle at 80% 20%, rgba(30, 30, 30, 0.4), transparent 60%),
          radial-gradient(500px circle at 20% 80%, rgba(199, 107, 74, 0.06), transparent 60%),
          #0C0C0C
        `,
      }}
    >
      {/* Floating orbs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full animate-breathe"
        style={{ background: "radial-gradient(circle, rgba(30,30,30,0.3) 0%, transparent 70%)", animationDelay: "0s", animationDuration: "8s" }}
      />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full animate-breathe"
        style={{ background: "radial-gradient(circle, rgba(199,107,74,0.06) 0%, transparent 70%)", animationDelay: "2s", animationDuration: "10s" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-3xl font-bold text-warm-white group-hover:text-ember transition-colors duration-500">
              SREVOL
            </span>
          </Link>
          {subtitle && (
            <p className="mt-4 text-sm text-warm-white/35 tracking-luxury">{subtitle}</p>
          )}
        </div>

        {/* Form card */}
        <div className="relative">
          {/* Glow behind card */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-ember/10 via-transparent to-transparent opacity-50" />

          <div className="relative bg-obsidian-light/50 backdrop-blur-xl rounded-3xl border border-obsidian-muted/30 p-8 sm:p-10">
            {title && (
              <h1 className="font-serif text-xl font-bold text-warm-white mb-8 text-center">
                {title}
              </h1>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
