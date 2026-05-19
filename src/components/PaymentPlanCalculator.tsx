"use client";

import { useState } from "react";

interface PaymentPlanCalculatorProps {
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
  totalPrice,
  protectedTotal,
  minMonths = 12,
  maxMonths = 48,
  inflationBuffer = 0.15,
}: PaymentPlanCalculatorProps) {
  const [months, setMonths] = useState(24);
  const target = protectedTotal || totalPrice;
  const monthlyAmount = Math.ceil(target / months);

  return (
    <div>
      {/* Price protection banner */}
      {protectedTotal && (
        <div className="mb-5 p-3 bg-green-500/5 rounded-xl border border-green-500/10 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
          <div>
            <p className="text-xs font-medium text-green-400">Price Protected</p>
            <p className="text-[11px] text-warm-white/30 mt-0.5">
              Savings target includes {Math.round(inflationBuffer * 100)}% buffer against price increases.
            </p>
          </div>
        </div>
      )}

      {/* Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-warm-white/40">Duration</span>
          <span className="font-semibold text-rose-gold">{months} months</span>
        </div>
        <input
          type="range"
          min={minMonths}
          max={maxMonths}
          step={1}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="w-full h-1.5 bg-plum-700 rounded-full appearance-none cursor-pointer accent-rose-gold"
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
            <span className="text-warm-white/40">Base Package Price</span>
            <span className="font-medium text-warm-white/50">{formatPrice(totalPrice)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-white/40">{protectedTotal ? "Protected Target" : "Package Price"}</span>
          <span className="font-bold text-warm-white">{formatPrice(target)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-white/40">Monthly Payment</span>
          <span className="font-bold text-rose-gold text-lg">{formatPrice(monthlyAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-white/40">First Payment</span>
          <span className="font-medium text-warm-white/70">Today</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-white/40">Final Payment</span>
          <span className="font-medium text-warm-white/70">
            {new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-rose-gold/10 rounded-xl border border-rose-gold/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-rose-gold">Total Payable</span>
          <span className="text-lg font-bold text-warm-white">{formatPrice(monthlyAmount * months)}</span>
        </div>
        <p className="text-xs text-warm-white/30 mt-1">
          {protectedTotal
            ? "No interest. Price protected. Cancel anytime with store credit."
            : "No interest. No hidden fees. Cancel anytime with store credit."}
        </p>
      </div>

      <button className="w-full mt-6 py-3.5 text-base font-medium text-plum-900 bg-rose-gold rounded-xl hover:bg-rose-gold-light transition-all">
        Start This Plan
      </button>
    </div>
  );
}
