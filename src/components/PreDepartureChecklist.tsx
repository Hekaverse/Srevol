"use client";

import { useState } from "react";

interface ChecklistItem {
  id: string;
  label: string;
  category: "documents" | "packing" | "health" | "experience";
}

const allItems: ChecklistItem[] = [
  { id: "passport", label: "Passport valid 6+ months", category: "documents" },
  { id: "visa", label: "Visa / ESTA if required", category: "documents" },
  { id: "travel-insurance", label: "Travel insurance confirmed", category: "documents" },
  { id: "flight-docs", label: "Flight confirmations printed / saved", category: "documents" },
  { id: "hotel-confirm", label: "Hotel / accommodation confirmed", category: "documents" },
  { id: "emergency-copy", label: "Emergency contact copy left with family", category: "documents" },
  { id: "weather", label: "Check weather forecast", category: "packing" },
  { id: "outfits", label: "Dinner outfits planned", category: "packing" },
  { id: " chargers", label: "Universal adapters & chargers", category: "packing" },
  { id: "meds", label: "Prescriptions & first-aid kit", category: "packing" },
  { id: "camera", label: "Camera / GoPro charged", category: "packing" },
  { id: "currency", label: "Local currency or travel card", category: "packing" },
  { id: "vaccines", label: "Vaccinations up to date", category: "health" },
  { id: "sunscreen", label: "High SPF sunscreen packed", category: "health" },
  { id: "rest", label: "Rest day before departure", category: "health" },
  { id: "experience", label: "Surprise experience selected (if applicable)", category: "experience" },
  { id: "restaurant", label: "Special dinner reservation made", category: "experience" },
  { id: "anniversary", label: "Anniversary gift packed", category: "experience" },
];

const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
  documents: { label: "Documents", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "text-amber" },
  packing: { label: "Packing", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "text-ember" },
  health: { label: "Health", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", color: "text-green-400" },
  experience: { label: "Experience", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", color: "text-warm-white/60" },
};

export default function PreDepartureChecklist({ daysUntil }: { daysUntil: number }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Show items progressively based on days until departure
  const visibleItems = allItems.filter((item) => {
    if (daysUntil <= 3) return true; // Show everything
    if (daysUntil <= 7) return item.category !== "experience";
    if (daysUntil <= 14) return ["documents", "health"].includes(item.category);
    if (daysUntil <= 30) return item.category === "documents";
    return false;
  });

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = visibleItems.length > 0
    ? Math.round((checked.size / visibleItems.length) * 100)
    : 0;

  const grouped = visibleItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="bg-obsidian-light/50 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg font-bold text-warm-white tracking-luxury">
          Pre-Departure Manifest
        </h3>
        <span className="text-[10px] font-mono tracking-wider text-amber/75 uppercase">
          {progress}% Complete
        </span>
      </div>

      <div className="h-1 bg-obsidian-muted/30 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-ember rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([cat, items]) => {
          const config = categoryConfig[cat];
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <svg className={`w-3.5 h-3.5 ${config.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={config.icon} />
                </svg>
                <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${config.color}`}>
                  {config.label}
                </span>
              </div>
              <div className="space-y-1">
                {items.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 text-left ${
                        isChecked
                          ? "bg-green-500/5 border border-green-500/10"
                          : "hover:bg-warm-white/[0.02] border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                          isChecked
                            ? "bg-green-500/20 border-green-500/40"
                            : "border-warm-white/10"
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm transition-all duration-300 ${
                          isChecked ? "text-warm-white/50 line-through" : "text-warm-white/85"
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {visibleItems.length === 0 && (
        <p className="text-sm text-warm-white/45 text-center py-6">
          Your pre-departure manifest will unlock as your departure approaches.
        </p>
      )}
    </div>
  );
}
