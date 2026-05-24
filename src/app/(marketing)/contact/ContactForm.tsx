"use client";

import { useState } from "react";
import FloatingInput from "@/components/FloatingInput";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to send");
      } else {
        setSent(true);
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <ScrollReveal animation="fade-up">
        <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-serif text-xl font-bold text-warm-white">Message Transmitted</h3>
          <p className="mt-2 text-sm text-warm-white/30">We'll respond within 24 hours.</p>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal animation="fade-up" delay={0.1}>
      <div className="bg-obsidian-light/20 backdrop-blur-sm rounded-3xl border border-obsidian-muted/20 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
              <p className="text-sm text-red-400/80">{error}</p>
            </div>
          )}
          <FloatingInput id="contact-name" type="text" label="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FloatingInput id="contact-email" type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="relative">
            <textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="peer w-full px-4 pt-6 pb-2.5 rounded-xl border bg-obsidian/50 text-warm-white placeholder-transparent focus:outline-none transition-all duration-300 ease-expo border-obsidian-muted/40 focus:border-ember/40 focus:ring-1 focus:ring-ember/10 resize-none"
              placeholder="Message"
            />
            <label htmlFor="contact-message" className="absolute left-4 top-1.5 text-[10px] text-ember/70 tracking-wider uppercase pointer-events-none">
              Message
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-base font-medium text-obsidian bg-ember rounded-xl hover:bg-ember-dark transition-all disabled:opacity-40"
          >
            {loading ? "Transmitting..." : "Transmit Message"}
          </button>
        </form>
      </div>
    </ScrollReveal>
  );
}
