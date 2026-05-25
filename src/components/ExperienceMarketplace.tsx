"use client";

interface Experience {
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  dayOffset: number | null;
  isOptional: boolean;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const categoryIcons: Record<string, string> = {
  WATER: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
  CULINARY: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  ADVENTURE: "M13 10V3L4 14h7v7l9-11h-7z",
  WELLNESS: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  CULTURE: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  PHOTOGRAPHY: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z",
  AERIAL: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  WILDLIFE: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  RAIL: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  ENTERTAINMENT: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
};

function getCategoryFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("dive") || lower.includes("snorkel") || lower.includes("water") || lower.includes("boat") || lower.includes("catamaran")) return "WATER";
  if (lower.includes("dinner") || lower.includes("cooking") || lower.includes("wine") || lower.includes("fondue") || lower.includes("culinary") || lower.includes("food") || lower.includes("chef") || lower.includes("omakase")) return "CULINARY";
  if (lower.includes("climb") || lower.includes("trek") || lower.includes("safari") || lower.includes("zip") || lower.includes("balloon") || lower.includes("helicopter") || lower.includes("snowmobile")) return "ADVENTURE";
  if (lower.includes("spa") || lower.includes("massage") || lower.includes("hammam") || lower.includes("temazcal") || lower.includes("wellness")) return "WELLNESS";
  if (lower.includes("temple") || lower.includes("tea") || lower.includes("ceremony") || lower.includes("culture") || lower.includes("museum") || lower.includes("souk") || lower.includes("sami")) return "CULTURE";
  if (lower.includes("photo") || lower.includes("shoot") || lower.includes("kimono")) return "PHOTOGRAPHY";
  if (lower.includes("heli") || lower.includes("jet") || lower.includes("aerial")) return "AERIAL";
  if (lower.includes("turtle") || lower.includes("penguin") || lower.includes("sloth") || lower.includes("wildlife") || lower.includes("migration")) return "WILDLIFE";
  if (lower.includes("train") || lower.includes("rail") || lower.includes("express")) return "RAIL";
  return "ADVENTURE";
}

export default function ExperienceMarketplace({
  experiences,
  duration,
}: {
  experiences: Experience[];
  duration: number;
}) {
  return (
    <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg font-bold text-warm-white tracking-luxury">
          Experience Marketplace
        </h3>
        <span className="text-[10px] font-mono tracking-wider text-warm-white/45 uppercase">
          {experiences.length} Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {experiences.map((exp, i) => {
          const category = getCategoryFromName(exp.name);
          const icon = categoryIcons[category] || categoryIcons.ADVENTURE;

          return (
            <div
              key={i}
              className="group relative bg-obsidian/40 rounded-2xl border border-obsidian-muted/15 overflow-hidden hover:border-ember/15 transition-all duration-500"
            >
              {exp.imageUrl && (
                <div className="relative h-40 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${exp.imageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[9px] font-mono tracking-wider text-warm-white/60 bg-obsidian/60 backdrop-blur-sm rounded-full border border-warm-white/10 uppercase">
                      {category}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <h4 className="text-sm font-medium text-warm-white group-hover:text-ember transition-colors">
                  {exp.name}
                </h4>
                {exp.description && (
                  <p className="text-xs text-warm-white/50 mt-1.5 leading-relaxed line-clamp-2">
                    {exp.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-mono text-amber/60">
                    {formatPrice(exp.price)}
                  </span>
                  {exp.isOptional && (
                    <span className="text-[9px] font-mono tracking-wider text-warm-white/40 uppercase">
                      Add-on
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
