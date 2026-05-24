"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import DepartureBoard, { EmptyDepartures, type DepartureItem } from "@/components/DepartureBoard";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface Bucket {
  id: string;
  targetAmount: number;
  protectedTarget: number;
  savedAmount: number;
  monthlyAmount: number;
  months: number;
  status: string;
  inflationBufferApplied: number;
  repricedAt: Date | null;
  actualBookedPrice: number | null;
  tier: { name: string; slug: string };
}

interface BookingItem {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: Date;
  package: { title: string | null; destination: string | null; image: string | null } | null;
  countdown: { targetDate: Date; message: string | null } | null;
  tier: { name: string; slug: string } | null;
}

interface DashboardViewProps {
  user: { id: string; email: string; name: string | null; role: string };
  couple: {
    id: string;
    name: string | null;
    partner2Name: string | null;
    partner2Initial: string | null;
    invitationPending: boolean;
    invitationExpires: Date | null;
    referralCode: string | null;
    referralCredit: number;
  } | null;
  buckets: Bucket[];
  bookings: BookingItem[];
}

function StatCard({
  label,
  value,
  subtext,
  delay = 0,
}: {
  label: string;
  value: string;
  subtext: string;
  delay?: number;
}) {
  return (
    <ScrollReveal animation="fade-up" delay={delay} className="group">
      <div className="relative bg-obsidian-light/30 backdrop-blur-sm rounded-2xl border border-obsidian-muted/20 p-6 transition-all duration-500 ease-expo hover:border-ember/10 hover:bg-obsidian-light/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
        <p className="text-xs text-warm-white/30 tracking-wide-luxury uppercase">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-warm-white mt-2 font-serif">
          {value}
        </p>
        <p className="text-xs text-warm-white/20 mt-2 tracking-luxury">
          {subtext}
        </p>
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "radial-gradient(circle, rgba(212,165,116,0.04) 0%, transparent 70%)",
          }}
        />
      </div>
    </ScrollReveal>
  );
}

function ProgressBar({
  saved,
  target,
  label,
}: {
  saved: number;
  target: number;
  label?: string;
}) {
  const pct = Math.min(Math.round((saved / target) * 100), 100);
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-warm-white/30 tracking-luxury">{label}</span>
          <span className="font-semibold text-ember font-serif">{pct}%</span>
        </div>
      )}
      <div className="h-1.5 bg-obsidian-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-expo relative"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-ember" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-[11px] text-warm-white/20 tracking-luxury">
          Secured: {formatPrice(saved)}
        </p>
        <p className="text-[11px] text-ember/40 tracking-luxury">
          Target: {formatPrice(target)}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  month,
  amount,
  isPaid,
  isCurrent,
}: {
  month: number;
  amount: string;
  isPaid: boolean;
  isCurrent: boolean;
}) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-500 ${
            isPaid
              ? "bg-green-500/60"
              : isCurrent
                ? "bg-ember w-2.5 h-2.5 animate-pulse"
                : "bg-obsidian-muted/40"
          }`}
        />
      </div>
      <div className="flex-1">
        <p
          className={`text-sm transition-colors duration-300 ${
            isPaid
              ? "text-warm-white/50"
              : isCurrent
                ? "text-warm-white/70"
                : "text-warm-white/20"
          }`}
        >
          Cycle {month}
        </p>
      </div>
      <div
        className={`text-sm font-medium transition-colors duration-300 ${
          isPaid
            ? "text-warm-white/50"
            : isCurrent
              ? "text-warm-white/70"
              : "text-warm-white/20"
        }`}
      >
        {amount}
      </div>
      <span
        className={`text-[10px] px-2.5 py-1 rounded-full tracking-wider uppercase transition-all duration-300 ${
          isPaid
            ? "bg-green-500/8 text-green-400/70"
            : isCurrent
              ? "bg-ember/10 text-ember/70"
              : "bg-obsidian-muted/30 text-warm-white/15"
        }`}
      >
        {isPaid ? "Contributed" : isCurrent ? "Current" : "Upcoming"}
      </span>
    </div>
  );
}

function getStatusMessage(bucket: Bucket | undefined) {
  if (!bucket) return { text: "No active reservation", color: "text-warm-white/30" };
  const progress = Math.round(
    (bucket.savedAmount / (bucket.protectedTarget || bucket.targetAmount)) * 100
  );
  if (bucket.status === "SAVING") {
    if (progress >= 100)
      return { text: "Ready to Book", color: "text-green-400/80" };
    return { text: `${progress}% Funded`, color: "text-ember" };
  }
  if (bucket.status === "READY_TO_BOOK")
    return { text: "Repricing Available", color: "text-amber-400/80" };
  if (bucket.status === "BOOKED")
    return { text: "Booked", color: "text-green-400/80" };
  return { text: bucket.status, color: "text-warm-white/30" };
}

export default function DashboardView({
  user,
  couple,
  buckets,
  bookings,
}: DashboardViewProps) {
  const totalSaved = buckets.reduce((s, b) => s + b.savedAmount, 0);
  const totalTarget = buckets.reduce(
    (s, b) => s + (b.protectedTarget || b.targetAmount),
    0
  );
  const activeBucket = buckets[0];
  const firstName =
    user.name?.split(" ")[0] || user.email?.split("@")[0] || "Traveler";

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal animation="fade-up" className="mb-14">
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-white tracking-tight">
                Welcome aboard, {firstName}
              </h1>
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-ember/60 animate-pulse" />
            </div>
            <p className="mt-3 text-warm-white/30 text-lg max-w-xl leading-relaxed">
              {activeBucket
                ? `Your ${activeBucket.tier.name} reservation is ${Math.round((activeBucket.savedAmount / (activeBucket.protectedTarget || activeBucket.targetAmount)) * 100)}% secured.`
                : couple
                  ? "No active reservations yet. Ready to secure one?"
                  : "Complete your traveling party profile to get started."}
            </p>
          </ScrollReveal>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            <StatCard
              label="Reservation Fund"
              value={formatPrice(totalSaved)}
              subtext={
                totalTarget > 0
                  ? `of ${formatPrice(totalTarget)} locked fare`
                  : "Start securing today"
              }
              delay={0.1}
            />
            <StatCard
              label="Confirmed Departures"
              value={String(buckets.length)}
              subtext={
                buckets.length === 0 ? "None yet — select cabin class" : "In progress"
              }
              delay={0.2}
            />
            <StatCard
              label="Next Contribution"
              value={activeBucket ? formatPrice(activeBucket.monthlyAmount) : "$0"}
              subtext={activeBucket ? "Due each cycle" : "No reservation active"}
              delay={0.3}
            />
          </div>

          {/* Departure Board */}
          <ScrollReveal animation="fade-up" delay={0.15} className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-warm-white tracking-luxury">
                Departure Board
              </h2>
              <Link
                href="/trips"
                className="text-sm text-ember hover:text-ember-light transition-colors"
              >
                View all →
              </Link>
            </div>
            {(() => {
              const departureItems = bookings.map((bk, i) => {
                const daysUntil = bk.countdown
                  ? Math.max(
                      0,
                      Math.ceil(
                        (new Date(bk.countdown.targetDate).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )
                  : 999;
                let status: DepartureItem["status"] = "ON TIME";
                if (daysUntil === 0) status = "GATE CLOSED";
                else if (daysUntil < 0) status = "DEPARTED";
                else if (daysUntil <= 3) status = "FINAL CALL";
                else if (daysUntil <= 14) status = "BOARDING";
                else if (bk.status !== "CONFIRMED") status = "DELAYED";

                return {
                  id: bk.id,
                  routeCode: `SV-${String(100 + i).slice(1)}`,
                  destination: bk.package?.destination || bk.package?.title || "Unknown",
                  gate: String.fromCharCode(65 + (i % 4)) + String((i % 9) + 1),
                  boardingTime: bk.countdown?.targetDate || new Date(),
                  status,
                  tier: bk.tier?.name || "Horizon",
                  image: bk.package?.image,
                };
              });
              return departureItems.length > 0 ? (
                <DepartureBoard items={departureItems} />
              ) : (
                <EmptyDepartures />
              );
            })()}
          </ScrollReveal>

          {/* Empty State */}
          {buckets.length === 0 && (
            <ScrollReveal animation="scale-in" className="mb-14">
              <div className="relative p-12 bg-obsidian-light/20 rounded-3xl border border-obsidian-muted/20 text-center overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(212,165,116,0.1) 0%, transparent 70%)",
                  }}
                />
                <p className="text-xl text-warm-white/50 font-serif">
                  {couple
                    ? "You haven't secured a reservation yet."
                    : "Welcome! Let's set up your traveling party."}
                </p>
                <p className="mt-3 text-sm text-warm-white/25 max-w-md mx-auto leading-relaxed">
                  {couple
                    ? "Select a cabin class and begin your countdown to the perfect departure."
                    : "Start by selecting a cabin class or inviting your co-traveler."}
                </p>
                <Link
                  href="/tiers"
                  className="inline-block mt-8 px-8 py-3.5 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all duration-500 ease-expo hover:shadow-lg hover:shadow-ember/15"
                >
                  Select Cabin Class
                </Link>
              </div>
            </ScrollReveal>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {activeBucket && (
                <>
                  {/* Active Journey Card */}
                  <ScrollReveal animation="fade-up" delay={0.1}>
                    <div className="relative bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 overflow-hidden group transition-all duration-500 hover:border-ember/10">
                      <div className="relative h-56">
                        <Image
                          src="https://images.unsplash.com/photo-1613395877344-13d4c79e4284?w=1200&h=400&fit=crop"
                          alt="Your departure"
                          fill
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          className="object-cover transition-transform duration-[1.5s] ease-expo group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                        <div className="absolute bottom-5 left-6">
                          <span className="px-3 py-1.5 text-[10px] font-medium tracking-[0.2em] uppercase bg-ember text-obsidian rounded-full">
                            {activeBucket.tier.name}
                          </span>
                          <h3 className="font-serif text-2xl font-bold text-warm-white mt-3">
                            Your {activeBucket.tier.name} Departure
                          </h3>
                          <p className="text-sm text-warm-white/40 mt-1">
                            {formatPrice(activeBucket.savedAmount)} secured
                            {activeBucket.repricedAt &&
                              ` · Repriced ${activeBucket.repricedAt.toLocaleDateString()}`}
                          </p>
                        </div>
                        <div className="absolute top-5 right-6">
                          <span
                            className={`text-sm font-bold tracking-luxury ${getStatusMessage(activeBucket).color}`}
                          >
                            {getStatusMessage(activeBucket).text}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <ProgressBar
                          saved={activeBucket.savedAmount}
                          target={
                            activeBucket.protectedTarget || activeBucket.targetAmount
                          }
                          label="Savings Progress"
                        />

                        {/* Price Protection */}
                        <div className="mt-8 p-5 bg-obsidian/40 rounded-2xl border border-obsidian-muted/15">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-ember/8 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-5 h-5 text-ember/70"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-warm-white/80">
                                Fare Lock Guarantee Active
                              </p>
                              <p className="text-xs text-warm-white/30 mt-1.5 leading-relaxed">
                                {Math.round(
                                  (activeBucket.inflationBufferApplied || 0.15) * 100
                                )}
                                % inflation buffer applied.
                                {activeBucket.actualBookedPrice
                                  ? ` Final booked price: ${formatPrice(activeBucket.actualBookedPrice)}.`
                                  : " Your savings are protected against price increases until booking."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 mt-8">
                          <Link
                            href="/countdown"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-ember bg-ember/8 rounded-full hover:bg-ember/15 transition-all duration-300 border border-ember/10"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            View Departure Board
                          </Link>
                          <Link
                            href="/demo/addons"
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-warm-white/50 bg-warm-white/5 rounded-full hover:bg-warm-white/10 transition-all duration-300 border border-warm-white/8"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Select Amenities
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Contribution Schedule */}
                  <ScrollReveal animation="fade-up" delay={0.2}>
                    <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
                      <h3 className="font-serif text-lg font-bold text-warm-white mb-6 tracking-luxury">
                        Contribution Schedule
                      </h3>
                      <div className="space-y-4">
                        {Array.from({
                          length: Math.min(8, activeBucket.months),
                        }).map((_, i) => {
                          const protectedTarget =
                            activeBucket.protectedTarget || activeBucket.targetAmount;
                          const paidMonths = Math.floor(
                            (activeBucket.savedAmount / protectedTarget) *
                              activeBucket.months
                          );
                          const isPaid = i < paidMonths;
                          const isCurrent = i === paidMonths;
                          return (
                            <TimelineItem
                              key={i}
                              month={i + 1}
                              amount={formatPrice(activeBucket.monthlyAmount)}
                              isPaid={isPaid}
                              isCurrent={isCurrent}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </ScrollReveal>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Couple Card */}
              <ScrollReveal animation="fade-left" delay={0.15}>
                <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6">
                  <h3 className="font-serif text-lg font-bold text-warm-white mb-6 tracking-luxury">
                    Your Traveling Party
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <div className="w-12 h-12 rounded-full bg-obsidian-muted/40 flex items-center justify-center border-2 border-obsidian-light">
                        <span className="text-sm font-bold text-warm-white/80">
                          {user.name?.[0] || "Y"}
                        </span>
                      </div>
                      {couple?.partner2Initial ? (
                        <div className="w-12 h-12 rounded-full bg-ember/20 flex items-center justify-center border-2 border-obsidian-light">
                          <span className="text-sm font-bold text-warm-white/80">
                            {couple.partner2Initial}
                          </span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-warm-white/5 flex items-center justify-center border-2 border-dashed border-obsidian-muted/40">
                          <span className="text-xs text-warm-white/30">+</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-warm-white/80 truncate">
                        {couple?.name || "You & Partner"}
                      </p>
                      {couple?.partner2Name ? (
                        <p className="text-xs text-warm-white/25 mt-0.5 tracking-luxury">
                          {couple.partner2Name} linked
                        </p>
                      ) : couple?.invitationPending ? (
                        <p className="text-xs text-amber-300/50 mt-0.5 tracking-luxury">
                          Invite pending
                        </p>
                      ) : couple ? (
                        <p className="text-xs text-warm-white/25 mt-0.5 tracking-luxury">
                          Traveling party active
                        </p>
                      ) : (
                        <p className="text-xs text-warm-white/25 mt-0.5 tracking-luxury">
                          Invite co-traveler
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Invite / Create actions */}
                  {!couple && (
                    <Link
                      href="/couple/create"
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all duration-300"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Register Traveling Party
                    </Link>
                  )}

                  {couple && !couple.partner2Name && (
                    <div className="mt-5 space-y-2">
                      {couple.invitationPending ? (
                        <>
                          <p className="text-[11px] text-warm-white/20">
                            Invitation expires{" "}
                            {couple.invitationExpires
                              ? new Date(couple.invitationExpires).toLocaleDateString()
                              : "soon"}
                          </p>
                          <button
                            onClick={() => {
                              const email = prompt("Resend invitation to email:")
                              if (email) {
                                fetch("/api/couple/invite", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ email }),
                                })
                                  .then((r) => r.json())
                                  .then((data) => {
                                    if (data.success) {
                                      alert("Invitation resent!")
                                      window.location.reload()
                                    } else {
                                      alert(data.error || "Failed to resend")
                                    }
                                  })
                              }
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-ember bg-ember/8 rounded-full hover:bg-ember/15 transition-all duration-300 border border-ember/10"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Resend Invite
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            const email = prompt("Enter partner's email:")
                            if (email) {
                              fetch("/api/couple/invite", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email }),
                              })
                                .then((r) => r.json())
                                .then((data) => {
                                  if (data.success) {
                                    alert("Invitation sent!")
                                    window.location.reload()
                                  } else {
                                    alert(data.error || "Failed to send")
                                  }
                                })
                            }
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all duration-300"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Invite Co-Traveler
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Referral Credit */}
              {couple?.referralCode && (
                <ScrollReveal animation="fade-left" delay={0.22}>
                  <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6">
                    <h3 className="font-serif text-lg font-bold text-warm-white mb-4 tracking-luxury">
                      Future Travel Credit
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-3xl font-bold text-amber">
                        {formatPrice(couple.referralCredit)}
                      </span>
                      <span className="text-[10px] text-warm-white/20 tracking-wider uppercase">
                        Available
                      </span>
                    </div>
                    <div className="mt-4 p-3 bg-obsidian/40 rounded-xl border border-amber/5">
                      <p className="text-[9px] font-mono tracking-[0.15em] text-warm-white/15 uppercase mb-1">
                        Your Referral Code
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-amber/70 tracking-wider">
                          {couple.referralCode}
                        </span>
                        <button
                          onClick={() => {
                            const url = `${window.location.origin}/?ref=${couple.referralCode}`;
                            navigator.clipboard.writeText(url);
                          }}
                          className="text-[10px] text-warm-white/20 hover:text-amber transition-colors"
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-warm-white/15 mt-3 leading-relaxed">
                      Share your code. When a new couple signs up and books, you both earn $50 in future travel credit.
                    </p>
                  </div>
                </ScrollReveal>
              )}

              {/* Quick Links */}
              <ScrollReveal animation="fade-left" delay={0.25}>
                <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6">
                  <h3 className="font-serif text-lg font-bold text-warm-white mb-6 tracking-luxury">
                    Quick Links
                  </h3>
                  <div className="space-y-1">
                    {[
                      { href: "/trips", label: "My Itinerary" },
                      { href: "/tiers", label: "Explore Tiers" },
                      { href: "/packages", label: "Browse Routes" },
                      { href: "/demo/addons", label: "Cabin Amenity Selection" },
                      ...(user.role === "ADMIN"
                        ? [{ href: "/admin", label: "Flight Deck" }]
                        : []),
                    ].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center justify-between py-3 text-sm text-warm-white/30 hover:text-ember transition-colors duration-300 group"
                      >
                        <span>{link.label}</span>
                        <svg
                          className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
