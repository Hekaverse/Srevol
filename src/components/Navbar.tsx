"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    setScrolled(!isHome);
    const handleScroll = () => setScrolled(window.scrollY > 50 || !isHome);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const navLinks = [
    { href: "/packages", label: "Routes" },
    { href: "/how-it-works", label: "The Experience" },
    ...(isAuthenticated
      ? [
          { href: "/dashboard", label: "Departure Lounge" },
          { href: "/trips", label: "My Itinerary" },
        ]
      : []),
    ...(isAdmin ? [{ href: "/admin", label: "Flight Deck" }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const firstName = session?.user?.name?.split(" ")[0];
  const displayName = firstName || session?.user?.email || "";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-expo ${
        scrolled
          ? "py-3 bg-obsidian/85 backdrop-blur-xl border-b border-ember/5"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group relative">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-warm-white group-hover:text-ember transition-colors duration-500">
              SREVOL
            </span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-ember group-hover:w-full transition-all duration-700 ease-expo" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative text-sm transition-colors duration-500 link-underline ${
                  isActive(link.href)
                    ? "text-ember"
                    : "text-warm-white/60 hover:text-warm-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-warm-white/40 tracking-luxury">
                  {displayName}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-warm-white/40 hover:text-warm-white transition-colors duration-500 link-underline"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-warm-white/40 hover:text-warm-white transition-colors duration-500 link-underline"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="group relative px-6 py-2.5 text-sm font-medium text-warm-white bg-ember rounded-full overflow-hidden transition-all duration-500 ease-expo hover:shadow-lg hover:shadow-ember/20 hover:glow-ember"
                >
                  <span className="relative z-10">Enter</span>
                  <div className="absolute inset-0 bg-ember-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-expo origin-left" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-warm-white p-2"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-px bg-current transition-all duration-500 ease-expo ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-px bg-current transition-all duration-500 ease-expo ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-obsidian/95 backdrop-blur-xl border-b border-ember/10 transition-all duration-700 ease-expo overflow-hidden ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-8 space-y-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`block text-lg transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-ember"
                  : "text-warm-white/70 hover:text-ember"
              }`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-6 border-t border-ember/10 space-y-4">
            {isAuthenticated ? (
              <>
                <p className="text-warm-white/40 text-sm tracking-luxury">{displayName}</p>
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="block text-warm-white/50 hover:text-warm-white transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-warm-white/50 hover:text-warm-white transition-colors">Sign In</Link>
                <Link
                  href="/register"
                  className="inline-block px-6 py-2.5 text-sm font-medium text-warm-white bg-ember rounded-full overflow-hidden relative group"
                >
                  <span className="relative z-10">Enter</span>
                  <div className="absolute inset-0 bg-ember-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-expo origin-left" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
