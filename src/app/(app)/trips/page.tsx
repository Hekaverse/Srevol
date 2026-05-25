import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function getStatusColor(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "text-green-400 bg-green-500/10 border-green-500/20";
    case "PENDING":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "CANCELLED":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    case "COMPLETED":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    default:
      return "text-warm-white/40 bg-warm-white/5 border-warm-white/10";
  }
}

export default async function TripsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const couple = await db.couple.findFirst({
    where: {
      OR: [{ partner1Id: session.user.id }, { partner2Id: session.user.id }],
    },
  });

  const bookings = couple
    ? await db.booking.findMany({
        where: { coupleId: couple.id },
        include: {
          package: true,
          paymentPlan: { include: { payments: true } },
          countdown: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const totalPaid = bookings.reduce((sum, b) => {
    const paid =
      b.paymentPlan?.payments.reduce((s, p) =>
        p.status === "COMPLETED" ? s + p.amount : s, 0
      ) || 0;
    return sum + paid;
  }, 0);

  const activeTrips = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING"
  );

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-medium text-ember tracking-[0.4em] uppercase">
                  Your Departures
                </span>
                <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-warm-white tracking-tight">
                  My Itinerary
                </h1>
                <p className="mt-3 text-warm-white/55">
                  {activeTrips.length} active{" "}
                  {activeTrips.length === 1 ? "departure" : "departures"} ·{" "}
                  {formatPrice(totalPaid)} secured
                </p>
              </div>
              <Link
                href="/packages"
                className="px-6 py-2.5 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all"
              >
                Reserve New Route
              </Link>
            </div>
          </ScrollReveal>

          {bookings.length === 0 ? (
            <ScrollReveal animation="fade-up" delay={0.1}>
              <div className="text-center py-24 bg-obsidian-light/50 rounded-3xl border border-obsidian-muted/20">
                <div className="w-16 h-16 rounded-full bg-obsidian-muted/30 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-7 h-7 text-warm-white/55"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-xl font-bold text-warm-white">
                  No departures yet
                </h3>
                <p className="mt-2 text-sm text-warm-white/55 max-w-sm mx-auto">
                  Your departure begins with a single route. Browse our
                  curated departures and start planning.
                </p>
                <Link
                  href="/packages"
                  className="inline-block mt-6 px-6 py-2.5 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all"
                >
                  Browse Routes
                </Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking, index) => {
                const pkg = booking.package;
                const progress =
                  booking.paymentPlan && booking.paymentPlan.totalAmount > 0
                    ? Math.min(
                        Math.round(
                          (booking.paymentPlan.payments
                            .filter((p) => p.status === "COMPLETED")
                            .reduce((s, p) => s + p.amount, 0) /
                            booking.paymentPlan.totalAmount) *
                            100
                        ),
                        100
                      )
                    : 0;

                return (
                  <ScrollReveal
                    key={booking.id}
                    animation="fade-up"
                    delay={index * 0.08}
                  >
                    <Link
                      href={`/trips/${booking.id}`}
                      className="group block bg-obsidian-light/50 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8 hover:border-ember/15 transition-all duration-500"
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Image */}
                        <div className="sm:w-48 h-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-obsidian-muted/30">
                          {pkg?.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={pkg.image}
                              alt={pkg.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-2xl font-serif text-warm-white/25">
                                S
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span
                                className={`inline-block px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase rounded-full border ${getStatusColor(booking.status)}`}
                              >
                                {booking.status}
                              </span>
                              <h3 className="mt-3 font-serif text-xl font-bold text-warm-white group-hover:text-ember transition-colors duration-500">
                                {pkg?.title || "Unknown Departure"}
                              </h3>
                              <p className="mt-1 text-sm text-warm-white/55">
                                {pkg?.destination} · {pkg?.duration} days
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-serif text-lg font-bold text-warm-white">
                                {formatPrice(booking.totalPrice)}
                              </p>
                              <p className="text-xs text-warm-white/45">
                                for 2
                              </p>
                            </div>
                          </div>

                          {/* Progress */}
                          {booking.paymentPlan && (
                            <div className="mt-5">
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className="text-warm-white/50">
                                  Fare Lock Progress
                                </span>
                                <span className="text-ember font-medium">
                                  {progress}%
                                </span>
                              </div>
                              <div className="h-1.5 bg-obsidian-muted/30 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-ember rounded-full transition-all duration-1000"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <p className="text-[11px] text-warm-white/45 mt-2">
                                {booking.paymentPlan.payments.filter(
                                  (p) => p.status === "COMPLETED"
                                ).length}{" "}
                                of {booking.paymentPlan.months} payments
                                completed
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
