"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BoardingPass from "@/components/BoardingPass";
import ScrollReveal from "@/components/ScrollReveal";

interface BookingData {
  id: string;
  package: {
    title: string | null;
    destination: string | null;
    image: string | null;
  } | null;
  paymentPlan: {
    totalAmount: number;
    months: number;
  } | null;
  countdown: {
    targetDate: string;
  } | null;
  tier: {
    name: string;
  } | null;
  couple: {
    partner1Name: string | null;
    partner2Name: string | null;
  } | null;
}

export default function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch("/api/me/bookings");
        const data = await res.json();
        if (data.success && data.bookings?.length > 0) {
          setBooking(data.bookings[0]);
          setStatus("success");
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          setBooking(data.bookings?.[0] || null);
          setStatus("success");
          clearInterval(interval);
        }
      } catch {
        if (attempts >= maxAttempts) {
          setStatus("success");
          clearInterval(interval);
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-28 pb-24">
        <div className="max-w-lg mx-auto px-6 lg:px-8">
          {status === "loading" && (
            <ScrollReveal animation="fade-up">
              <div className="text-center py-16">
                <div className="w-12 h-12 border-2 border-ember/30 border-t-ember rounded-full animate-spin mx-auto mb-6" />
                <h1 className="font-serif text-3xl font-bold text-warm-white">
                  Confirming Your Reservation
                </h1>
                <p className="mt-3 text-sm text-warm-white/30">
                  Finalizing your itinerary...
                </p>
              </div>
            </ScrollReveal>
          )}

          {status === "success" && (
            <>
              <ScrollReveal animation="fade-up">
                <div className="text-center mb-8">
                  <h1 className="font-serif text-3xl font-bold text-warm-white">
                    Welcome Aboard
                  </h1>
                  <p className="mt-2 text-sm text-warm-white/30">
                    Your reservation is confirmed. Your boarding pass is ready.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="scale-in" delay={0.3}>
                <BoardingPass
                  destination={booking?.package?.destination || "Your Destination"}
                  departureDate={booking?.countdown?.targetDate}
                  passenger1={booking?.couple?.partner1Name || undefined}
                  passenger2={booking?.couple?.partner2Name || undefined}
                  tierName={booking?.tier?.name || undefined}
                  bookingId={booking?.id}
                />
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={0.5}>
                <div className="flex items-center justify-center gap-3 mt-8">
                  <a
                    href={`/pass/${booking?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Get Shareable Pass
                  </a>
                </div>
                <p className="text-center text-[11px] text-warm-white/15 mt-3">
                  Download a high-res boarding pass to share with your partner — or the world.
                </p>
              </ScrollReveal>
            </>
          )}

          {status === "error" && (
            <ScrollReveal animation="fade-up">
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="font-serif text-3xl font-bold text-warm-white">
                  Something Went Wrong
                </h1>
                <p className="mt-3 text-sm text-warm-white/30">
                  We couldn&apos;t verify your contribution. Contact crew services if you were charged.
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </main>
    </div>
  );
}
