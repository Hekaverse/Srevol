export const metadata = {
  title: "FAQ — SREVOL",
  description: "Frequently asked questions about SREVOL's private carrier experience, fare commitments, and reservation process.",
};

const faqs = [
  {
    question: "What is SREVOL?",
    answer: "SREVOL is a private carrier built exclusively for two. We help you reserve, lock, and depart on extraordinary routes together — from milestone havens to celebration adventures.",
  },
  {
    question: "How do fare commitments work?",
    answer: "Choose your route and cabin class, select a commitment length from 6 to 60 months, and contribute monthly. Your reservation includes a fare lock buffer so you're protected against price increases.",
  },
  {
    question: "Can I change my departure?",
    answer: "Yes. You can rebook at any time and your contributed amount converts to SREVOL future travel credit. Cash reimbursements are available within 14 days of your first contribution, minus a 5% rebooking fee.",
  },
  {
    question: "Is my reservation secure?",
    answer: "Absolutely. We use Stripe for secure contribution processing and never store your card details. Your funds are held securely until your itinerary is confirmed.",
  },
  {
    question: "Does my co-traveler need a profile?",
    answer: "One partner creates the account and invites the other. Both can log in, view the departure lounge, and manage the itinerary together.",
  },
  {
    question: "What routes are available?",
    answer: "We curate departures across four cabin classes: Horizon (Bali, Mexico, Portugal), Meridian (Santorini, Maldives, Kyoto), Celestial (Bora Bora, Patagonia, Safari), and Astral (Private islands, Antarctica, around-the-world).",
  },
  {
    question: "When is my itinerary confirmed?",
    answer: "Final itinerary details are confirmed 12-18 months before departure, once your reservation target is reached or you choose to book early. We reprice and match you to the best available inventory.",
  },
  {
    question: "Can I reserve for more than 2 travelers?",
    answer: "SREVOL is designed exclusively for couples. Every departure is priced and planned for two travelers.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-ember tracking-[0.4em] uppercase">
              Help Center
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-warm-white tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-warm-white/30">
              Everything you need to know about reserving your departure.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-obsidian-light/20 backdrop-blur-sm rounded-2xl border border-obsidian-muted/20 p-6"
              >
                <h3 className="font-serif text-lg font-bold text-warm-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm text-warm-white/40 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
