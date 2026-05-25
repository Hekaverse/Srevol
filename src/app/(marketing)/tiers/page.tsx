import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import ScrollReveal from "@/components/ScrollReveal";
import TiltCard from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Cabin Classes — SREVOL",
  description: "Select your service class. From Horizon to Astral, every cabin is a promise designed for two.",
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export const dynamic = "force-dynamic";

export default async function TiersPage() {
  const tiers = await db.budgetTier.findMany({
    where: { isActive: true },
    orderBy: { minPrice: "asc" },
  });

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal animation="fade-up" className="text-center mb-20">
            <span className="text-xs font-medium text-ember tracking-wide-luxury uppercase">
              Select Your Cabin
            </span>
            <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-warm-white tracking-tight">
              Where Will Your Story
              <br />
              <span className="text-ember">Take Flight?</span>
            </h1>
            <p className="mt-6 text-lg text-warm-white/55 max-w-2xl mx-auto leading-relaxed">
              Every cabin is a promise. Select the service class that matches your dream,
              and we&apos;ll secure the route back to today — one contribution at a time.
            </p>
          </ScrollReveal>

          {/* Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => {
              const destinations = tier.destinations
                ? (JSON.parse(tier.destinations) as string[])
                : [];
              const monthly = Math.ceil(tier.maxPrice / tier.defaultMonths);
              const protectedMax = Math.round(
                tier.maxPrice * (1 + (tier.inflationBuffer || 0.15))
              );
              return (
                <ScrollReveal
                  key={tier.slug}
                  animation="fade-up"
                  delay={index * 0.1}
                >
                  <TiltCard
                    className="group relative bg-obsidian-light/50 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 hover:border-ember/15 transition-all duration-500 flex flex-col h-full"
                    maxTilt={4}
                    glareOpacity={0.04}
                  >
                    <div className="font-serif text-6xl font-bold text-obsidian-muted/25 mb-6 select-none">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-warm-white group-hover:text-ember transition-colors duration-500">
                      {tier.name}
                    </h3>

                    <p className="mt-4 text-sm text-warm-white/55 leading-relaxed flex-1">
                      {tier.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {destinations.slice(0, 3).map((d) => (
                        <span
                          key={d}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-obsidian-muted/15 text-warm-white/50 tracking-wider uppercase border border-obsidian-muted/15"
                        >
                          {d}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-obsidian-muted/15">
                      <p className="text-[10px] text-warm-white/45 tracking-wide-luxury uppercase">
                        Base estimate
                      </p>
                      <p className="font-serif text-2xl font-bold text-warm-white mt-1">
                        {formatPrice(tier.minPrice)}
                        <span className="text-sm font-normal text-warm-white/50">
                          {" "}
                          — {formatPrice(tier.maxPrice)}
                        </span>
                      </p>

                      <div className="mt-4 p-4 bg-obsidian/30 rounded-2xl border border-obsidian-muted/10">
                        <p className="text-xs text-ember/60 flex items-center gap-2">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                          </svg>
                          Fare Lock Guarantee
                        </p>
                        <p className="text-xs text-warm-white/50 mt-2">
                          Reservation target:{" "}
                          <span className="text-warm-white/40">
                            {formatPrice(protectedMax)}
                          </span>
                        </p>
                        <p className="text-[10px] text-warm-white/40 mt-1">
                          Includes {Math.round((tier.inflationBuffer || 0.15) * 100)}%
                          buffer
                        </p>
                      </div>

                      <p className="text-[11px] text-warm-white/45 mt-4 tracking-luxury">
                        From {formatPrice(monthly)}/mo &middot;{" "}
                        {tier.defaultMonths} months
                      </p>
                    </div>

                    <Link
                      href={`/register?tier=${tier.slug}`}
                      className="mt-6 block w-full py-3 text-center text-sm font-medium text-warm-white rounded-xl transition-all duration-500 ease-expo hover:shadow-lg"
                      style={{
                        backgroundColor: tier.accentColor || "#C76B4A",
                      }}
                    >
                      Secure {tier.name}
                    </Link>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Fare Lock Info */}
          <ScrollReveal animation="fade-up" delay={0.3} className="mt-20">
            <div className="relative p-8 sm:p-10 bg-obsidian-light/40 rounded-3xl border border-obsidian-muted/15 overflow-hidden">
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
                style={{
                  background:
                    "radial-gradient(circle, rgba(199,107,74,0.08) 0%, transparent 70%)",
                }}
              />
              <h3 className="font-serif text-xl font-bold text-warm-white mb-8 flex items-center gap-3 relative z-10">
                <svg
                  className="w-5 h-5 text-ember/60"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
                How Fare Lock Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {[
                  {
                    title: "Reserve with a Buffer",
                    desc: "Your monthly contribution includes a fare lock buffer (10-20%) so you're covered if prices rise.",
                  },
                  {
                    title: "We Reprice at Booking",
                    desc: "12-18 months before departure, we check live fares and match you to the best available route.",
                  },
                  {
                    title: "You Choose",
                    desc: "If fares dropped: upgrade or receive credit. If fares rose: your buffer covers it, or you choose how to adjust.",
                  },
                ].map((step, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-warm-white/60">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-xs text-warm-white/50 mt-2 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.4} className="mt-16 text-center">
            <p className="text-sm text-warm-white/40 italic">
              &ldquo;Every great departure begins long before boarding.&rdquo;
            </p>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
