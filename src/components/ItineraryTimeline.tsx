"use client";

interface ItineraryItem {
  type: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  durationDays: number | null;
  isOptional: boolean;
  price: number;
  starRating?: number | null;
  reviewScore?: number | null;
  amenities?: string[];
}

interface Day {
  day: number;
  items: ItineraryItem[];
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function getDayLabel(day: number, totalDays: number) {
  if (day === 1) return "Arrival";
  if (day === totalDays) return "Departure";
  return `Day ${day}`;
}

function ItemCard({ item }: { item: ItineraryItem }) {
  const isExperience = item.type === "EXPERIENCE";

  return (
    <div className="flex gap-4 group">
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            isExperience ? "bg-ember" : "bg-amber"
          }`}
        />
        <div className="w-px flex-1 bg-obsidian-muted/20 group-last:hidden" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-start gap-3">
          {item.imageUrl && (
            <div
              className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 border border-obsidian-muted/20"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-mono tracking-[0.2em] uppercase ${
                  isExperience ? "text-ember/60" : "text-amber/60"
                }`}
              >
                {isExperience ? "Experience" : "Accommodation"}
              </span>
              {item.isOptional && (
                <span className="text-[9px] font-mono tracking-wider text-warm-white/20 uppercase">
                  Optional
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-warm-white mt-0.5">
              {item.name}
            </p>
            {item.description && (
              <p className="text-xs text-warm-white/30 mt-1 leading-relaxed line-clamp-2">
                {item.description}
              </p>
            )}
            <p className="text-xs text-amber/50 mt-1.5 font-mono">
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryTimeline({
  days,
  totalDays,
}: {
  days: Day[];
  totalDays: number;
}) {
  return (
    <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg font-bold text-warm-white tracking-luxury">
          Your Itinerary
        </h3>
        <span className="text-[10px] font-mono tracking-wider text-warm-white/20 uppercase">
          {totalDays} Days
        </span>
      </div>

      <div className="space-y-6">
        {days.map((day) => (
          <div key={day.day}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-amber/60 tracking-wider">
                {String(day.day).padStart(2, "0")}
              </span>
              <div className="h-px flex-1 bg-obsidian-muted/15" />
              <span className="text-[10px] font-mono tracking-wider text-warm-white/20 uppercase">
                {getDayLabel(day.day, totalDays)}
              </span>
            </div>
            <div className="ml-5">
              {day.items.map((item, i) => (
                <ItemCard key={`${day.day}-${i}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
