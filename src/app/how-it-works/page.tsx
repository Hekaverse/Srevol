import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="pt-32">
        <HowItWorks />
        
        <section className="py-32 bg-plum-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, rgba(212,165,116,0.3) 0%, transparent 70%)" }}
          />
          
          <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-warm-white text-center mb-20">
              The Details That Matter
            </h2>
            
            <div className="space-y-16">
              {[
                {
                  title: "Secure & Protected",
                  desc: "Your funds are held securely. Every booking is protected. We partner with licensed travel providers and maintain full financial transparency so you can plan with confidence.",
                },
                {
                  title: "Flexible Cancellation",
                  desc: "Life changes. If you need to cancel, your funds convert to SREVOL credits for future travel — no questions asked. Partial cash refunds available depending on timing.",
                },
                {
                  title: "Skip the Line",
                  desc: "Want to travel sooner? Pay in full to claim cancellation spots on existing bookings. Premium access to the same curated experiences, without the wait.",
                },
                {
                  title: "Discreet by Design",
                  desc: "Planning a surprise proposal? Our discreet mode ensures communications stay hidden. Your partner receives only what you choose to share, when you choose to share it.",
                },
              ].map((item, i) => (
                <div key={item.title} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-plum-800 border border-plum-700/50 flex items-center justify-center">
                    <span className="font-serif text-lg font-bold text-rose-gold">{String(i + 1).padStart(2, "0")}</span>
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
      <Footer />
    </div>
  );
}
