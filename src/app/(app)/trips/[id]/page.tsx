import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ScrollReveal from "@/components/ScrollReveal";
import PreDepartureChecklist from "@/components/PreDepartureChecklist";
import TripConcierge from "@/components/TripConcierge";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      package: true,
      paymentPlan: { include: { payments: { orderBy: { dueDate: "asc" } } } },
      countdown: true,
      couple: { include: { partner1: true, partner2: true } },
    },
  });

  if (!booking) notFound();

  const isOwner =
    booking.couple.partner1Id === session.user.id ||
    booking.couple.partner2Id === session.user.id;
  if (!isOwner) redirect("/dashboard");

  const pkg = booking.package;
  const paymentPlan = booking.paymentPlan;
  const countdown = booking.countdown;

  const paidAmount =
    paymentPlan?.payments
      .filter((p) => p.status === "COMPLETED")
      .reduce((s, p) => s + p.amount, 0) || 0;

  const progress =
    paymentPlan && paymentPlan.totalAmount > 0
      ? Math.min(Math.round((paidAmount / paymentPlan.totalAmount) * 100), 100)
      : 0;

  const daysUntil = countdown
    ? Math.max(
        0,
        Math.ceil(
          (new Date(countdown.targetDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : null;

  // Fetch package components for itinerary
  const template = await db.packageTemplate.findFirst({
    where: { slug: pkg?.slug },
    include: {
      components: {
        include: { product: true },
        orderBy: { dayOffset: "asc" },
      },
    },
  });

  // Build concierge data
  const hotelComponent = template?.components.find(
    (c) => c.componentType === "ACCOMMODATION"
  );

  const itineraryDays = pkg
    ? Array.from({ length: pkg.duration }).map((_, dayIndex) => {
        const dayNum = dayIndex + 1;
        const label =
          dayNum === 1
            ? "Arrival"
            : dayNum === pkg.duration
              ? "Departure"
              : `Day ${dayNum}`;

        const items: Array<{
          time: string;
          title: string;
          description: string;
          type: "flight" | "transfer" | "hotel" | "experience" | "meal" | "free";
          status: "confirmed" | "pending" | "voucher";
          voucherCode?: string;
        }> = [];

        // Arrival/departure flights
        if (dayNum === 1) {
          items.push({
            time: "09:00",
            title: "Departure Flight",
            description: `International flight to ${pkg.destination}. Business class seats pre-selected.`,
            type: "flight",
            status: "confirmed",
          });
          items.push({
            time: "14:00",
            title: "Private Transfer",
            description: `Airport pickup in luxury vehicle. Direct to ${hotelComponent?.product?.name || "your hotel"}.`,
            type: "transfer",
            status: "confirmed",
          });
          items.push({
            time: "16:00",
            title: "Hotel Check-in",
            description: `Welcome drink and suite orientation at ${hotelComponent?.product?.name || "your hotel"}.`,
            type: "hotel",
            status: "confirmed",
          });
          items.push({
            time: "19:00",
            title: "Welcome Dinner",
            description: "Private table for two. Chef's tasting menu with wine pairing.",
            type: "meal",
            status: "confirmed",
          });
        } else if (dayNum === pkg.duration) {
          items.push({
            time: "10:00",
            title: "Late Check-out",
            description: "Extended check-out until 2 PM. Breakfast in bed included.",
            type: "hotel",
            status: "confirmed",
          });
          items.push({
            time: "14:30",
            title: "Private Transfer",
            description: "Departure transfer to airport. Express check-in assistance.",
            type: "transfer",
            status: "confirmed",
          });
          items.push({
            time: "17:00",
            title: "Return Flight",
            description: `International flight home. Business class.`,
            type: "flight",
            status: "confirmed",
          });
        } else {
          // Scheduled experiences for this day
          const dayExps =
            template?.components.filter(
              (c) =>
                c.componentType === "EXPERIENCE" && c.dayOffset === dayIndex
            ) || [];

          items.push({
            time: "08:00",
            title: "Breakfast",
            description: "Buffet breakfast at the hotel restaurant. Fresh local specialties.",
            type: "meal",
            status: "confirmed",
          });

          dayExps.forEach((exp, i) => {
            items.push({
              time: i === 0 ? "10:00" : "14:00",
              title: exp.product?.name || "Experience",
              description:
                exp.product?.description || "A curated experience for two.",
              type: "experience",
              status: "voucher",
              voucherCode: `SV-${exp.id.slice(-6).toUpperCase()}`,
            });
          });

          if (dayExps.length === 0) {
            items.push({
              time: "10:00",
              title: "Free Time",
              description:
                "Explore at your own pace. Your concierge can arrange anything on request.",
              type: "free",
              status: "confirmed",
            });
          }

          items.push({
            time: "19:00",
            title: "Dinner",
            description: "Reservation held at recommended restaurant. Dress code: smart casual.",
            type: "meal",
            status: "confirmed",
          });
        }

        return { day: dayNum, label, items };
      })
    : [];

  const conciergeData = {
    destination: pkg?.destination || "Your Destination",
    departureDate: countdown?.targetDate?.toISOString() || new Date().toISOString(),
    duration: pkg?.duration || 0,
    hotel: hotelComponent?.product
      ? {
          name: hotelComponent.product.name,
          imageUrl: hotelComponent.product.imageUrl,
          checkIn: "15:00",
          checkOut: "11:00",
        }
      : null,
    itinerary: itineraryDays,
    emergencyContacts: [
      { name: "SREVOL Concierge", role: "24/7 Support", phone: "+1 (800) 555-SREV", available: "Always" },
      { name: "Local Emergency", role: "Medical/Police", phone: "112", available: "Always" },
      { name: "Hotel Front Desk", role: "Direct Line", phone: "+30 22860 71453", available: "24h" },
    ],
    milestones: [
      { label: "Booked", date: booking.createdAt.toISOString(), completed: true },
      { label: "Documents", date: "", completed: false },
      { label: "Insurance", date: "", completed: false },
      { label: "Final Payment", date: "", completed: false },
      { label: "Boarding", date: countdown?.targetDate?.toISOString() || "", completed: false },
    ],
  };

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Back link */}
          <ScrollReveal animation="fade-up">
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-sm text-warm-white/55 hover:text-ember transition-colors duration-300 mb-8"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Itineraries
            </Link>
          </ScrollReveal>

          {/* Header */}
          <ScrollReveal animation="fade-up">
            <div className="mb-10">
              <span
                className={`inline-block px-3 py-1 text-[10px] font-medium tracking-wider uppercase rounded-full border ${
                  booking.status === "CONFIRMED"
                    ? "text-green-400 bg-green-500/10 border-green-500/20"
                    : booking.status === "CANCELLED"
                      ? "text-red-400 bg-red-500/10 border-red-500/20"
                      : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                }`}
              >
                {booking.status}
              </span>
              <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-warm-white">
                {pkg?.title || "Your Departure"}
              </h1>
              <p className="mt-2 text-lg text-warm-white/55">
                {pkg?.destination} · {pkg?.duration} days ·{" "}
                {formatPrice(booking.totalPrice)} for 2
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trip Concierge */}
              {booking.status === "CONFIRMED" && (
                <ScrollReveal animation="fade-up" delay={0.1}>
                  <TripConcierge data={conciergeData} />
                </ScrollReveal>
              )}

              {/* Countdown */}
              {countdown && daysUntil !== null && (
                <ScrollReveal animation="fade-up" delay={0.15}>
                  <div className="bg-obsidian-light/50 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
                    <h3 className="font-serif text-lg font-bold text-warm-white mb-4 tracking-luxury">
                      Countdown
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="font-serif text-4xl sm:text-5xl font-bold text-ember">
                          {daysUntil}
                        </p>
                        <p className="text-xs text-warm-white/50 tracking-luxury uppercase mt-1">
                          Days
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-warm-white/65">
                          {countdown.message}
                        </p>
                        <p className="text-xs text-warm-white/45 mt-1">
                          Target:{" "}
                          {new Date(countdown.targetDate).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Pre-Departure Manifest */}
              {daysUntil !== null && daysUntil <= 30 && (
                <ScrollReveal animation="fade-up" delay={0.2}>
                  <PreDepartureChecklist daysUntil={daysUntil} />
                </ScrollReveal>
              )}

              {/* Payment Progress */}
              {paymentPlan && (
                <ScrollReveal animation="fade-up" delay={0.25}>
                  <div className="bg-obsidian-light/50 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
                    <h3 className="font-serif text-lg font-bold text-warm-white mb-6 tracking-luxury">
                      Fare Commitment
                    </h3>
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-warm-white/55">
                          Fare Lock Progress
                        </span>
                        <span className="text-ember font-bold">{progress}%</span>
                      </div>
                      <div className="h-2 bg-obsidian-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-ember rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-warm-white/45 mt-2">
                        <span>{formatPrice(paidAmount)} contributed</span>
                        <span>
                          {formatPrice(paymentPlan.totalAmount)} locked fare target
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {paymentPlan.payments.map((payment, i) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-obsidian-muted/15"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                payment.status === "COMPLETED"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-obsidian-muted/30 text-warm-white/45"
                              }`}
                            >
                              {payment.status === "COMPLETED" ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              ) : (
                                String(i + 1).padStart(2, "0")
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-warm-white/60">
                                Contribution {i + 1}
                              </p>
                              <p className="text-[11px] text-warm-white/45">
                                Due{" "}
                                {new Date(payment.dueDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric", year: "numeric" }
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-warm-white">
                              {formatPrice(payment.amount)}
                            </p>
                            <p
                              className={`text-[10px] tracking-wider uppercase ${
                                payment.status === "COMPLETED"
                                  ? "text-green-400"
                                  : "text-warm-white/45"
                              }`}
                            >
                              {payment.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Package Details */}
              {pkg?.description && (
                <ScrollReveal animation="fade-up" delay={0.3}>
                  <div className="bg-obsidian-light/50 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
                    <h3 className="font-serif text-lg font-bold text-warm-white mb-4 tracking-luxury">
                      About This Route
                    </h3>
                    <p className="text-sm text-warm-white/65 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <ScrollReveal animation="fade-left" delay={0.15}>
                <div className="bg-obsidian-light/50 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6">
                  <h3 className="font-serif text-lg font-bold text-warm-white mb-6 tracking-luxury">
                    Itinerary Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-white/55">Route</span>
                      <span className="text-sm text-warm-white/90">
                        {pkg?.destination || "TBD"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-white/55">Duration</span>
                      <span className="text-sm text-warm-white/90">
                        {pkg?.duration} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-white/55">Travelers</span>
                      <span className="text-sm text-warm-white/90">2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-white/55">Reserved On</span>
                      <span className="text-sm text-warm-white/90">
                        {new Date(booking.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Actions */}
              {booking.status !== "CANCELLED" && (
                <ScrollReveal animation="fade-left" delay={0.25}>
                  <div className="bg-obsidian-light/50 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6">
                    <h3 className="font-serif text-lg font-bold text-warm-white mb-4 tracking-luxury">
                      Actions
                    </h3>
                    <div className="space-y-3">
                      <Link
                        href="/dashboard"
                        className="block w-full py-2.5 text-center text-sm font-medium text-warm-white bg-ember/10 rounded-xl hover:bg-ember/20 transition-all border border-ember/10"
                      >
                        Enter Departure Lounge
                      </Link>
                      {booking.status === "CONFIRMED" && (
                        <a
                          href={`/pass/${booking.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2.5 text-center text-sm font-medium text-amber bg-amber/10 rounded-xl hover:bg-amber/20 transition-all border border-amber/10"
                        >
                          Share Boarding Pass
                        </a>
                      )}
                      <button
                        disabled={booking.status !== "CONFIRMED"}
                        className="w-full py-2.5 text-center text-sm font-medium text-red-400 bg-red-500/5 rounded-xl hover:bg-red-500/10 transition-all border border-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Rebook Departure
                      </button>
                    </div>
                    <p className="text-[11px] text-warm-white/40 mt-3 text-center">
                      Rebooking converts to future travel credit minus 5% fee.
                    </p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
