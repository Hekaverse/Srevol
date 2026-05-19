"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 glass-dark border-b border-plum-700/30 py-4 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-warm-white group-hover:text-rose-gold transition-colors duration-300">
              SREVOL
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-rose-gold group-hover:w-full transition-all duration-500" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { href: "/packages", label: "Destinations" },
              { href: "/how-it-works", label: "The Journey" },
              ...(isAuthenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
              ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-warm-white/70 hover:text-warm-white transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-rose-gold group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-warm-white/50">
                  {session?.user?.name || session?.user?.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-warm-white/70 hover:text-warm-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-warm-white/70 hover:text-warm-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="group relative px-6 py-2.5 text-sm font-medium text-plum-900 bg-rose-gold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-rose-gold/20"
                >
                  <span className="relative z-10">Begin</span>
                  <div className="absolute inset-0 bg-rose-gold-light transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-warm-white p-2"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-px bg-current transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass-dark border-b border-plum-700/50 transition-all duration-500 ${
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-6 py-8 space-y-6">
          {[
            { href: "/packages", label: "Destinations" },
            { href: "/how-it-works", label: "The Journey" },
            ...(isAuthenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
            ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg text-warm-white/80 hover:text-rose-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 border-t border-plum-700/50 space-y-4">
            {isAuthenticated ? (
              <>
                <p className="text-warm-white/50 text-sm">{session?.user?.name || session?.user?.email}</p>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="block text-warm-white/70"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-warm-white/70">Sign In</Link>
                <Link
                  href="/register"
                  className="inline-block px-6 py-2.5 text-sm font-medium text-plum-900 bg-rose-gold rounded-full"
                >
                  Begin Your Journey
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
