"use client";

interface PriceBreakdownProps {
  accommodation: number;
  experiences: number;
  transfersAndMeals: number;
  total: number;
  nightlyRate: number;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function PriceBreakdown({
  accommodation,
  experiences,
  transfersAndMeals,
  total,
  nightlyRate,
}: PriceBreakdownProps) {
  const items = [
    { label: "Accommodation", value: accommodation, color: "bg-amber" },
    { label: "Experiences", value: experiences, color: "bg-ember" },
    { label: "Transfers & Dining", value: transfersAndMeals, color: "bg-warm-white/30" },
  ];

  return (
    <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
      <h3 className="font-serif text-lg font-bold text-warm-white mb-6 tracking-luxury">
        Fare Transparency
      </h3>

      {/* Visual bar */}
      <div className="flex h-2 rounded-full overflow-hidden mb-6">
        {items.map((item) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div
              key={item.label}
              className={`${item.color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>

      {/* Breakdown rows */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-sm text-warm-white/40">{item.label}</span>
            </div>
            <span className="text-sm font-mono text-warm-white/60">
              {formatPrice(item.value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-5 border-t border-obsidian-muted/15">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-warm-white/60">
            Total Locked Fare
          </span>
          <span className="text-xl font-serif font-bold text-amber">
            {formatPrice(total)}
          </span>
        </div>
        {nightlyRate > 0 && (
          <p className="text-[10px] text-warm-white/15 mt-1 text-right">
            {formatPrice(nightlyRate)} per night · Includes all taxes
          </p>
        )}
      </div>

      <div className="mt-4 p-3 bg-green-500/5 rounded-xl border border-green-500/10">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-green-400/60 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-[11px] text-green-400/60 leading-relaxed">
            Fare Lock Guarantee: If hotel prices drop before your final booking, we rebook at the lower rate. If they rise, your fare is protected.
          </p>
        </div>
      </div>
    </div>
  );
}
