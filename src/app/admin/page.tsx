"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminDashboard() {
  const [seedStatus, setSeedStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [seedResult, setSeedResult] = useState<any>(null);

  const runSeed = async () => {
    setSeedStatus("loading");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedResult(data);
      setSeedStatus("done");
    } catch {
      setSeedStatus("error");
    }
  };

  const cards = [
    {
      title: "Price Intelligence",
      desc: "Sync real-time prices from travel APIs, view historical trends, and monitor price drops.",
      href: "/admin/prices",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Romance Curator",
      desc: "Run the AI scoring engine, browse curated products, and tune the romance algorithm.",
      href: "/admin/curator",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: "Package Builder",
      desc: "Auto-assemble packages from real inventory, match to budget tiers, and generate quotes.",
      href: "/admin/packages",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-plum-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-serif text-3xl font-bold text-warm-white">SREVOL Command Center</h1>
            <p className="mt-2 text-warm-white/40">Automation, intelligence, and curation at your fingertips.</p>
          </div>
          <button
            onClick={runSeed}
            disabled={seedStatus === "loading"}
            className="px-6 py-2.5 text-sm font-medium text-plum-900 bg-rose-gold rounded-full hover:bg-rose-gold-light transition-all disabled:opacity-50"
          >
            {seedStatus === "loading" ? "Seeding..." : "Run Full Seed"}
          </button>
        </div>

        {seedStatus === "done" && seedResult && (
          <div className="mb-10 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <p className="text-green-400 font-medium">✨ Seed completed successfully!</p>
            <div className="mt-3 grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-warm-white/40">Budget Tiers</p>
                <p className="text-warm-white font-bold">{seedResult.seeded?.budgetTiers || 0}</p>
              </div>
              <div>
                <p className="text-warm-white/40">Templates</p>
                <p className="text-warm-white font-bold">{seedResult.seeded?.packageTemplates || 0}</p>
              </div>
              <div>
                <p className="text-warm-white/40">Products Synced</p>
                <p className="text-warm-white font-bold">{seedResult.synced?.productsFetched || 0}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group p-8 bg-plum-800/50 rounded-2xl border border-plum-700/30 hover:border-rose-gold/30 transition-all"
            >
              <div className="text-rose-gold mb-4">{card.icon}</div>
              <h3 className="text-lg font-bold text-warm-white group-hover:text-rose-gold transition-colors">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-warm-white/40 leading-relaxed">{card.desc}</p>
              <span className="mt-4 inline-block text-sm text-rose-gold group-hover:translate-x-1 transition-transform">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
