import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Experience — SREVOL",
  description: "From first dream to final boarding pass. Learn how SREVOL helps couples reserve, lock, and depart together.",
};

const principles = [
  {
    title: "Select Your Route",
    desc: "Browse curated routes — from Santorini sunsets to Maldives overwater villas. Every route is designed exclusively for two travelers.",
    detail: "Minimum reservation: 2 tickets. Always.",
  },
  {
    title: "Confirm Your Departure Window",
    desc: "Pick your travel date up to 4 years ahead. We'll build a fare commitment that fits your life — small monthly contributions that make the extraordinary feel effortless.",
    detail: "12 to 48 months. Your pace.",
  },
  {
    title: "Craft Your Private Manifest",
    desc: "Each partner selects amenities independently. Spa or scuba? Sunset cruise or wine tasting? Our manifest engine resolves preferences and crafts the perfect shared itinerary.",
    detail: "Private manifest for surprise proposals.",
  },
  {
    title: "Await Your Boarding Call",
    desc: "A beautiful shared departure board keeps the anticipation alive. Watch the days tick away as your adventure draws closer — together, always.",
    detail: "The wait is part of the departure.",
  },
];

const details = [
  {
    title: "Secured & Guaranteed",
    desc: "Your funds are held securely. Every reservation is protected. We partner with licensed travel providers and maintain full financial transparency so you can plan with confidence.",
  },
  {
    title: "Flexible Rebooking",
    desc: "Itineraries change. If you need to rebook, your funds convert to SREVOL future travel credit — no questions asked. Partial reimbursements available depending on timing.",
  },
  {
    title: "Standby Departure",
    desc: "Want to depart sooner? Pay in full to claim released reservations on existing departures. Premium access to the same curated experiences, without the wait.",
  },
  {
    title: "Private Manifest",
    desc: "Planning a surprise proposal? Our private manifest ensures communications stay hidden. Your co-traveler receives only what you choose to share, when you choose to share it.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      {/* Hero */}
      <section className="pt-40 pb-24 max-w-[1400px] mx-auto px-8 lg:px-12">
        <span className="text-[10px] tracking-[0.3em] uppercase text-warm-white/30">
          The Experience
        </span>
        <h1
          className="mt-4 font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-warm-white tracking-tight"
          style={{ lineHeight: 0.95 }}
        >
          How It
          <br />
          <span className="text-ember">Works</span>
        </h1>
        <p className="mt-6 text-sm text-warm-white/25 max-w-md leading-relaxed">
          From first dream to final boarding pass, every step is designed around
          the two of you.
        </p>
      </section>

      {/* Principles */}
      <section className="pb-32">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="hairline mb-0" />
          {principles.map((item, i) => (
            <div
              key={item.title}
              className="border-t border-warm-white/5 py-12 lg:py-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                <div className="lg:col-span-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-warm-white/15 font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="lg:col-span-5">
                  <h3 className="font-serif text-2xl lg:text-3xl text-warm-white/90 tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <div className="lg:col-span-5">
                  <p className="text-sm text-warm-white/30 leading-relaxed">
                    {item.desc}
                  </p>
                  <p className="mt-3 text-[11px] tracking-[0.1em] uppercase text-ember/50">
                    {item.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-warm-white/5" />
        </div>
      </section>

      {/* Details */}
      <section className="bg-ivory py-32 lg:py-44">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="hairline-v h-16 mb-6" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone">
                The Details
              </span>
              <h2 className="mt-4 font-serif text-3xl lg:text-4xl text-obsidian tracking-tight leading-tight">
                What matters
                <br />
                when you travel
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 space-y-12">
              {details.map((item) => (
                <div key={item.title}>
                  <h3 className="font-serif text-xl text-obsidian">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
