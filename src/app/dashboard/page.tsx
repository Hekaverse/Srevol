"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
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
  repricedAt: string | null;
  actualBookedPrice: number | null;
  tier: { name: string; slug: string };
}

interface Couple {
  id: string;
  name: string | null;
}

interface DashboardData {
  user: { id: string; email: string; name: string | null; role: string };
  couple: Couple | null;
  buckets: Bucket[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/dashboard", { credentials: "include" })
      .then((res) => res.json().then((result) => ({ result, ok: res.ok, status: res.status })))
      .then(({ result, status }) => {
        if (result.error === "Unauthorized" || status === 401) {
          window.location.href = "/login";
          return;
        }
        if (result.success) {
          setData(result);
        } else {
          setError(result.error || "Failed to load dashboard");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard");
        setLoading(false);
      });
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-plum-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-gold/20 border-t-rose-gold rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-warm-white/40">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-plum-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error || "Something went wrong"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm text-plum-900 bg-rose-gold rounded-full hover:bg-rose-gold-light transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { user, couple, buckets } = data;
  const totalSaved = buckets.reduce((s, b) => s + b.savedAmount, 0);
  const totalTarget = buckets.reduce((s, b) => s + (b.protectedTarget || b.targetAmount), 0);
  const activeBucket = buckets[0];

  const getStatusMessage = (bucket: Bucket | undefined) => {
    if (!bucket) return { text: "No active plan", color: "text-warm-white/40" };
    const progress = Math.round((bucket.savedAmount / (bucket.protectedTarget || bucket.targetAmount)) * 100);
    if (bucket.status === "SAVING") {
      if (progress >= 100) return { text: "Ready to Book", color: "text-green-400" };
      return { text: `${progress}% Funded`, color: "text-rose-gold" };
    }
    if (bucket.status === "READY_TO_BOOK") return { text: "Repricing Available", color: "text-amber-400" };
    if (bucket.status === "BOOKED") return { text: "Booked", color: "text-green-400" };
    return { text: bucket.status, color: "text-warm-white/40" };
  };

  return (
    <div className="min-h-screen bg-plum-900">
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-warm-white">
              Hello, {user.name || user.email}
            </h1>
            <p className="mt-2 text-warm-white/40">
              {activeBucket
                ? `Your ${activeBucket.tier.name} escape is ${Math.round((activeBucket.savedAmount / (activeBucket.protectedTarget || activeBucket.targetAmount)) * 100)}% funded.`
                : couple
                ? "No active journeys yet. Ready to start one?"
                : "Complete your couple profile to get started."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-plum-800/50 rounded-2xl border border-plum-700/30 p-6">
              <p className="text-sm text-warm-white/40">Total Saved</p>
              <p className="text-2xl font-bold text-warm-white mt-1">{formatPrice(totalSaved)}</p>
              <p className="text-xs text-warm-white/25 mt-1">
                {totalTarget > 0 ? `of ${formatPrice(totalTarget)} protected target` : "Start saving today"}
              </p>
            </div>
            <div className="bg-plum-800/50 rounded-2xl border border-plum-700/30 p-6">
              <p className="text-sm text-warm-white/40">Active Journeys</p>
              <p className="text-2xl font-bold text-warm-white mt-1">{buckets.length}</p>
              <p className="text-xs text-warm-white/25 mt-1">{buckets.length === 0 ? "None yet — explore tiers" : "In progress"}</p>
            </div>
            <div className="bg-plum-800/50 rounded-2xl border border-plum-700/30 p-6">
              <p className="text-sm text-warm-white/40">Next Payment</p>
              <p className="text-2xl font-bold text-warm-white mt-1">
                {activeBucket ? formatPrice(activeBucket.monthlyAmount) : "$0"}
              </p>
              <p className="text-xs text-warm-white/25 mt-1">{activeBucket ? "Due monthly" : "No plan active"}</p>
            </div>
          </div>

          {buckets.length === 0 && (
            <div className="mb-10 p-8 bg-plum-800/30 rounded-2xl border border-plum-700/30 text-center">
              <p className="text-lg text-warm-white/60">
                {couple ? "You haven't started a journey yet." : "Welcome! Let's set up your couple profile."}
              </p>
              <p className="mt-2 text-sm text-warm-white/40">
                {couple
                  ? "Choose a tier and begin your countdown to the perfect escape."
                  : "Start by exploring destinations or inviting your partner."}
              </p>
              <Link href="/tiers" className="inline-block mt-6 px-6 py-3 text-sm font-medium text-plum-900 bg-rose-gold rounded-full hover:bg-rose-gold-light transition-all">
                Explore Tiers
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {activeBucket && (
                <>
                  <div className="bg-plum-800/50 rounded-2xl border border-plum-700/30 overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src="https://images.unsplash.com/photo-1613395877344-13d4c79e4284?w=1200&h=400&fit=crop"
                        alt="Your escape"
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-plum-900/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-2 py-1 text-[10px] font-medium bg-rose-gold text-plum-900 rounded-full">{activeBucket.tier.name}</span>
                        <h3 className="font-serif text-xl font-bold text-warm-white mt-2">Your {activeBucket.tier.name} Escape</h3>
                        <p className="text-sm text-warm-white/50">
                          {formatPrice(activeBucket.savedAmount)} saved
                          {activeBucket.repricedAt && ` • Repriced ${new Date(activeBucket.repricedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className={`text-sm font-bold ${getStatusMessage(activeBucket).color}`}>
                          {getStatusMessage(activeBucket).text}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-warm-white/40">Savings Progress</span>
                          <span className="font-semibold text-rose-gold">
                            {Math.round((activeBucket.savedAmount / (activeBucket.protectedTarget || activeBucket.targetAmount)) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-plum-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-gold rounded-full transition-all"
                            style={{ width: `${Math.min(Math.round((activeBucket.savedAmount / (activeBucket.protectedTarget || activeBucket.targetAmount)) * 100), 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-warm-white/25">Target: {formatPrice(activeBucket.targetAmount)}</p>
                          <p className="text-xs text-rose-gold/60">Protected: {formatPrice(activeBucket.protectedTarget || activeBucket.targetAmount)}</p>
                        </div>
                      </div>

                      <div className="mb-6 p-4 bg-plum-900/50 rounded-xl border border-plum-700/20">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-rose-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-warm-white">Price Protection Active</p>
                            <p className="text-xs text-warm-white/40 mt-1">
                              {Math.round((activeBucket.inflationBufferApplied || 0.15) * 100)}% inflation buffer applied.
                              {activeBucket.actualBookedPrice
                                ? ` Final booked price: ${formatPrice(activeBucket.actualBookedPrice)}.`
                                : " Your savings are protected against price increases until booking."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link href="/countdown" className="inline-flex items-center gap-2 px-4 py-2 text-sm text-rose-gold bg-rose-gold/10 rounded-full hover:bg-rose-gold/20 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          View Countdown
                        </Link>
                        <Link href="/demo/addons" className="inline-flex items-center gap-2 px-4 py-2 text-sm text-rose-gold bg-rose-gold/10 rounded-full hover:bg-rose-gold/20 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          Add Experiences
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-plum-800/50 rounded-2xl border border-plum-700/30 p-6">
                    <h3 className="font-bold text-warm-white mb-4">Payment Timeline</h3>
                    <div className="space-y-3">
                      {Array.from({ length: Math.min(8, activeBucket.months) }).map((_, i) => {
                        const protectedTarget = activeBucket.protectedTarget || activeBucket.targetAmount;
                        const isPaid = i < Math.floor((activeBucket.savedAmount / protectedTarget) * activeBucket.months);
                        return (
                          <div key={i} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                              <div className={`w-2.5 h-2.5 rounded-full ${isPaid ? "bg-green-500" : i === Math.floor((activeBucket.savedAmount / protectedTarget) * activeBucket.months) ? "bg-rose-gold animate-pulse" : "bg-plum-600"}`} />
                            </div>
                            <div className="flex-1"><p className="text-sm text-warm-white/60">Month {i + 1}</p></div>
                            <div className="text-sm font-medium text-warm-white/60">{formatPrice(activeBucket.monthlyAmount)}</div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${isPaid ? "bg-green-500/10 text-green-400" : "bg-plum-700 text-warm-white/20"}`}>
                              {isPaid ? "Paid" : "Pending"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-plum-800/50 rounded-2xl border border-plum-700/30 p-6">
                <h3 className="font-bold text-warm-white mb-4">Your Couple</h3>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-plum-600 flex items-center justify-center border-2 border-plum-800"><span className="text-sm font-bold text-warm-white">{user.name?.[0] || "Y"}</span></div>
                    <div className="w-10 h-10 rounded-full bg-blush/30 flex items-center justify-center border-2 border-plum-800"><span className="text-sm font-bold text-warm-white">P</span></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-white">{couple?.name || "You & Partner"}</p>
                    <p className="text-xs text-warm-white/30">{couple ? "Couple profile active" : "Invite your partner"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-plum-800/50 rounded-2xl border border-plum-700/30 p-6">
                <h3 className="font-bold text-warm-white mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link href="/tiers" className="block text-sm text-warm-white/40 hover:text-rose-gold py-2 transition-colors">Explore Tiers</Link>
                  <Link href="/packages" className="block text-sm text-warm-white/40 hover:text-rose-gold py-2 transition-colors">Browse Destinations</Link>
                  <Link href="/demo/addons" className="block text-sm text-warm-white/40 hover:text-rose-gold py-2 transition-colors">Add-On Conflict Engine</Link>
                  {user.role === "ADMIN" && (
                    <Link href="/admin" className="block text-sm text-warm-white/40 hover:text-rose-gold py-2 transition-colors">Command Center</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
