"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-obsidian">
      {/* Single hairline */}
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="hairline" />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          {/* Left — wordmark + tagline */}
          <div>
            <Link
              href="/"
              className="font-serif text-2xl tracking-[0.15em] uppercase text-warm-white hover:text-ember transition-colors duration-500"
            >
              Srevol
            </Link>
            <p className="mt-3 text-xs text-warm-white/20 tracking-luxury">
              The Private Carrier for Two
            </p>
          </div>

          {/* Right — minimal links */}
          <div className="flex flex-wrap items-center gap-6 lg:gap-10">
            {[
              { label: "Routes", href: "/packages" },
              { label: "Experience", href: "/how-it-works" },
              { label: "Contact", href: "/contact" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.15em] uppercase text-warm-white/20 hover:text-warm-white/60 transition-colors duration-500"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[10px] text-warm-white/10 tracking-luxury">
            &copy; {new Date().getFullYear()} SREVOL. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            {["Instagram", "TikTok"].map((social) => (
              <a
                key={social}
                href={`https://${social.toLowerCase()}.com/srevol`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.15em] uppercase text-warm-white/10 hover:text-warm-white/40 transition-colors duration-500"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
