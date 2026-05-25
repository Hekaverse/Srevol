"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/packages", label: "Destinations" },
    { href: "/how-it-works", label: "Flight Plan" },
    ...(isAuthenticated
      ? [
          { href: "/dashboard", label: "Lounge" },
          { href: "/trips", label: "Manifest" },
        ]
      : []),
    ...(isAdmin ? [{ href: "/admin", label: "Flight Deck" }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-expo ${
          scrolled
            ? "py-4 bg-obsidian/90 backdrop-blur-md"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-lg tracking-[0.2em] uppercase text-warm-white hover:text-ember transition-colors duration-500"
          >
            Srevol
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] tracking-[0.15em] uppercase transition-colors duration-500 link-editorial ${
                  isActive(link.href) ? "text-ember" : "text-warm-white/40"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-[11px] tracking-[0.15em] uppercase text-warm-white/30 hover:text-warm-white transition-colors duration-500"
              >
                Disembark
              </button>
            ) : (
              <Link
                href="/login"
                className="text-[11px] tracking-[0.15em] uppercase text-warm-white/30 hover:text-warm-white transition-colors duration-500"
              >
                Board
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[11px] tracking-[0.15em] uppercase text-warm-white/50"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-obsidian transition-all duration-700 ease-expo flex flex-col items-center justify-center gap-8 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`font-serif text-3xl text-warm-white/80 hover:text-ember transition-colors duration-500 ${
              isActive(link.href) ? "text-ember" : ""
            }`}
            style={{
              transitionDelay: menuOpen ? `${i * 50}ms` : "0ms",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease, color 0.3s ease",
            }}
          >
            {link.label}
          </Link>
        ))}
        {isAuthenticated ? (
          <button
            onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
            className="font-serif text-3xl text-warm-white/40 hover:text-warm-white transition-colors duration-500"
            style={{
              transitionDelay: menuOpen ? `${navLinks.length * 50}ms` : "0ms",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            Disembark
          </button>
        ) : (
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="font-serif text-3xl text-warm-white/40 hover:text-warm-white transition-colors duration-500"
            style={{
              transitionDelay: menuOpen ? `${navLinks.length * 50}ms` : "0ms",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            Board
          </Link>
        )}
      </div>
    </>
  );
}
