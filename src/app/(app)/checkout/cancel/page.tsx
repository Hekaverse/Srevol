import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-md mx-auto px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-full bg-warm-white/5 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-warm-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="font-serif text-3xl font-bold text-warm-white">
                Contribution Cancelled
              </h1>
              <p className="mt-3 text-sm text-warm-white/30 leading-relaxed">
                No worries — your dream departure will be here when you&apos;re ready.
                Your reservation was not saved and no contribution was processed.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.2}>
            <div className="space-y-3">
              <Link
                href="/packages"
                className="block w-full py-3.5 text-center text-base font-medium text-obsidian bg-ember rounded-xl hover:bg-ember-dark transition-all"
              >
                Browse Routes
              </Link>
              <Link
                href="/dashboard"
                className="block w-full py-3.5 text-center text-base font-medium text-warm-white/50 border border-warm-white/10 rounded-xl hover:bg-warm-white/5 transition-all"
              >
                Enter Departure Lounge
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
    </div>
  );
}
