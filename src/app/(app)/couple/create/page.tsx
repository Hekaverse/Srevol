"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FloatingInput from "@/components/FloatingInput";
import ScrollReveal from "@/components/ScrollReveal";

export default function CreateCouplePage() {
  const { status } = useSession();
  const router = useRouter();

  const [coupleName, setCoupleName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingCouple, setCheckingCouple] = useState(true);

  // Read referral code from localStorage (set by homepage)
  useEffect(() => {
    const ref = localStorage.getItem("srevol_ref");
    if (ref) setReferralCode(ref);
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Check if user already has a couple
  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/couple")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.couple) {
          router.push("/dashboard");
        } else {
          setCheckingCouple(false);
        }
      })
      .catch(() => setCheckingCouple(false));
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Create couple
      const createRes = await fetch("/api/couple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: coupleName.trim() || undefined,
          referralCode: referralCode || undefined,
        }),
      });

      const createData = await createRes.json();

      if (!createData.success) {
        setError(createData.error || "Failed to register traveling party");
        setLoading(false);
        return;
      }

      // Step 2: Send invitation if partner email provided
      if (partnerEmail.trim()) {
        const inviteRes = await fetch("/api/couple/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: partnerEmail.trim() }),
        });

        const inviteData = await inviteRes.json();

        if (!inviteData.success) {
          // Couple was created but invite failed — still redirect to dashboard
          console.error("[create-couple] invite failed:", inviteData.error);
        }
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (status === "loading" || checkingCouple) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
          <p className="text-sm text-warm-white/30 tracking-luxury">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-lg mx-auto px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <span className="text-xs font-medium text-ember tracking-[0.4em] uppercase">
                Register Together
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-warm-white tracking-tight">
                Register Your Traveling
                <br />
                <span className="text-ember">Party</span>
              </h1>
              <p className="mt-4 text-sm text-warm-white/30 leading-relaxed max-w-sm mx-auto">
                Name your traveling party and invite your co-traveler to plan your departure together.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.1}>
            <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
                    <p className="text-sm text-red-400/80">{error}</p>
                  </div>
                )}

                <FloatingInput
                  id="couple-name"
                  type="text"
                  label="Traveling Party Name"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  placeholder="e.g., Alex & Jordan"
                  autoComplete="off"
                />
                <p className="text-xs text-warm-white/40 -mt-4 ml-1">
                  Optional — defaults to your name & Partner.
                </p>

                <FloatingInput
                  id="partner-email"
                  type="email"
                  label="Co-Traveler's Email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  autoComplete="off"
                />
                <p className="text-xs text-warm-white/40 -mt-4 ml-1">
                  Optional — you can invite them later from your departure lounge.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-base font-medium text-warm-white bg-ember rounded-xl transition-all duration-500 ease-expo hover:bg-ember-dark hover:shadow-lg hover:shadow-ember/15 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-warm-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Register Traveling Party"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-obsidian-muted/15">
                <p className="text-xs text-warm-white/45 text-center leading-relaxed">
                  By registering your traveling party, you and your co-traveler can share reservation funds,
                  departure boards, and itinerary details.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
