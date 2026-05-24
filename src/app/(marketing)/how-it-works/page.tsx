import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";

export const metadata: Metadata = {
  title: "The Experience — SREVOL",
  description: "From first dream to final boarding pass. Learn how SREVOL helps couples reserve, lock, and depart together.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <HowItWorks variant="dark" />
        
        <section className="py-32 bg-obsidian relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(199,107,74,0.3) 0%, transparent 70%)" }}
          />
          
          <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-warm-white text-center mb-20">
              The Details That Matter
            </h2>
            
            <div className="space-y-16">
              {[
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
              ].map((item, i) => (
                <div key={item.title} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-obsidian-light border border-obsidian-muted flex items-center justify-center">
                    <span className="font-serif text-lg font-bold text-ember">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-warm-white">{item.title}</h3>
                    <p className="mt-2 text-warm-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
