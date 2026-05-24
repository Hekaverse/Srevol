"use client";

import Link from "next/link";
import SrevolReveal from "./SrevolReveal";

export default function Footer() {
  return (
    <footer className="bg-obsidian border-t border-ember/5 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-3xl font-bold text-warm-white group-hover:text-ember transition-colors duration-500">
                SREVOL
              </span>
            </Link>
            <p className="mt-5 text-sm text-warm-white/25 leading-relaxed max-w-xs">
              The private carrier for two. Reserve together. Depart together.
            </p>
            <div className="mt-8 flex items-center gap-6">
              {[
                { label: "Instagram", href: "https://instagram.com/srevol" },
                { label: "TikTok", href: "https://tiktok.com/@srevol" },
                { label: "Pinterest", href: "https://pinterest.com/srevol" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.label}`}
                  className="text-[11px] text-warm-white/20 hover:text-ember transition-colors duration-500 tracking-wide-luxury uppercase link-underline"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Routes */}
          <div className="md:col-span-2 md:col-start-5">
            <h3 className="text-[10px] font-semibold text-warm-white/30 uppercase tracking-[0.3em] mb-6">
              Routes
            </h3>
            <ul className="space-y-3">
              {["Santorini", "Maldives", "Bora Bora", "Amalfi Coast", "Kyoto"].map((dest) => (
                <li key={dest}>
                  <Link href={`/packages?destination=${dest.toLowerCase()}`} className="text-sm text-warm-white/25 hover:text-ember transition-colors duration-500 link-underline">
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-semibold text-warm-white/30 uppercase tracking-[0.3em] mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: "The Experience", href: "/how-it-works" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-warm-white/25 hover:text-ember transition-colors duration-500 link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-semibold text-warm-white/30 uppercase tracking-[0.3em] mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
                { label: "Rebooking Policy", href: "/terms" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-warm-white/25 hover:text-ember transition-colors duration-500 link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="text-sm text-warm-white/25 hover:text-ember transition-colors duration-500 link-underline">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-warm-white/25 hover:text-ember transition-colors duration-500 link-underline">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-warm-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-warm-white/15 tracking-luxury">
            &copy; {new Date().getFullYear()} SREVOL. The Private Carrier for Two.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-warm-white/10 hover:text-warm-white/30 transition-colors duration-500">Privacy</Link>
            <Link href="/terms" className="text-xs text-warm-white/10 hover:text-warm-white/30 transition-colors duration-500">Terms</Link>
          </div>
        </div>

        {/* Easter Egg: SrevolReveal */}
        <div className="mt-6 flex justify-center">
          <SrevolReveal compact />
        </div>
      </div>
    </footer>
  );
}
