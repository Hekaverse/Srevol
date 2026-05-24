import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Crew Services — SREVOL",
  description: "Reach the SREVOL crew services team. We're here to help with your reservation.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-lg mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-medium text-ember tracking-[0.4em] uppercase">
              Crew Services
            </span>
            <h1 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-warm-white tracking-tight">
              Reach Crew Services
            </h1>
            <p className="mt-3 text-warm-white/30">
              Questions about your itinerary? We're here to help.
            </p>
          </div>
          <ContactForm />
        </div>
      </main>
    </div>
  );
}
