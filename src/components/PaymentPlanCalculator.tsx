"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentPlanCalculatorProps {
  packageTemplateId: string;
  totalPrice: number;
  protectedTotal?: number;
  minMonths?: number;
  maxMonths?: number;
  inflationBuffer?: number;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PaymentPlanCalculator({
  packageTemplateId,
  totalPrice,
  protectedTotal,
  minMonths = 12,
  maxMonths = 48,
  inflationBuffer = 0.15,
}: PaymentPlanCalculatorProps) {
  const router = useRouter();
  const [months, setMonths] = useState(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const target = protectedTotal || totalPrice;
  const monthlyAmount = Math.ceil(target / months);

  async function handleStartPlan() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageTemplateId,
          months,
          totalAmount: Math.round(totalPrice * 100), // Convert to cents
        }),
      });

      const data = await res.json();

      if (!data.success) {
        if (data.error === "Unauthorized") {
          router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        if (data.error === "Register a traveling party first") {
          router.push("/couple/create");
          return;
        }
        setError(data.error || "Failed to secure reservation");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Fare lock banner */}
      {protectedTotal && (
        <div className="mb-5 p-3 bg-green-500/5 rounded-xl border border-green-500/10 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          <div>
            <p className="text-xs font-medium text-green-400">Fare Locked</p>
            <p className="text-[11px] text-warm-white/30 mt-0.5">
              Reservation target includes {Math.round(inflationBuffer * 100)}% buffer against fare increases.
            </p>
          </div>
        </div>
      )}

      {/* Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-warm-white/40">Commitment Length</span>
          <span className="font-semibold text-ember">{months} months</span>
        </div>
        <input
          type="range"
          min={minMonths}
          max={maxMonths}
          step={1}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full h-1.5 bg-obsidian-muted rounded-full appearance-none cursor-pointer accent-ember"
        />
        <div className="flex items-center justify-between text-xs text-warm-white/20 mt-1">
          <span>{minMonths} months</span>
          <span>{maxMonths} months</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 mb-6">
        {protectedTotal && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-white/40">Base Route Fare</span>
            <span className="font-medium text-warm-white/50">{formatPrice(totalPrice)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-white/40">{protectedTotal ? "Locked Fare" : "Route Fare"}</span>
          <span className="font-bold text-warm-white">{formatPrice(target)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-white/40">Monthly Contribution</span>
          <span className="font-bold text-ember text-lg">{formatPrice(monthlyAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-white/40">Initial Contribution</span>
          <span className="font-medium text-warm-white/70">Today</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-white/40">Final Contribution</span>
          <span className="font-medium text-warm-white/70">
            {new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-ember/10 rounded-xl border border-ember/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ember">Total Fare Commitment</span>
          <span className="text-lg font-bold text-warm-white">{formatPrice(monthlyAmount * months)}</span>
        </div>
        <p className="text-xs text-warm-white/30 mt-1">
          {protectedTotal
            ? "No interest. Fare locked. Rebook anytime with future travel credit."
            : "No interest. No hidden fees. Rebook anytime with future travel credit."}
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/5 rounded-xl border border-red-500/15">
          <p className="text-sm text-red-400/80">{error}</p>
        </div>
      )}

      <button
        onClick={handleStartPlan}
        disabled={loading}
        className="w-full mt-6 py-3.5 text-base font-medium text-warm-white bg-ember rounded-xl hover:bg-ember-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 text-warm-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Securing Reservation...
          </span>
        ) : (
          "Secure This Reservation"
        )}
      </button>
    </div>
  );
}
