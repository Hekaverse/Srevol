"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-obsidian">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="hairline" />
        <div className="py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <span className="font-serif text-lg tracking-[0.15em] uppercase text-warm-white/20">
            Srevol
          </span>
          <div className="flex flex-wrap items-center gap-6 lg:gap-10">
            {[
              { label: "Routes", href: "/packages" },
              { label: "Experience", href: "/how-it-works" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] tracking-[0.15em] uppercase text-warm-white/15 hover:text-warm-white/40 transition-colors duration-500"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <span className="text-[9px] tracking-luxury text-warm-white/10">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}
