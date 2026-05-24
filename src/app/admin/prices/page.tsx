"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  destination: string;
  productType: string;
  basePrice: number;
  currency: string;
  romanceScore: number;
  source: string;
  priceUpdatedAt: string;
}

export default function PriceAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const fetchProducts = async () => {
    const res = await fetch(`/api/curator?limit=100${filter !== "ALL" ? `&productType=${filter}` : ""}`);
    const data = await res.json();
    if (data.success) setProducts(data.products);
    setLoading(false);
  };

  const runSync = async () => {
    setSyncing(true);
    await fetch("/api/prices/sync", { method: "POST" });
    await fetchProducts();
    setSyncing(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  return (
    <div className="min-h-screen bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-ember hover:underline">← Back to Command Center</Link>
            <h1 className="mt-2 font-serif text-3xl font-bold text-warm-white">Price Intelligence</h1>
          </div>
          <button
            onClick={runSync}
            disabled={syncing}
            className="px-6 py-2.5 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync Prices Now"}
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          {["ALL", "HOTEL", "FLIGHT", "ACTIVITY"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                filter === f ? "bg-ember text-obsidian" : "border border-obsidian-muted text-warm-white/50 hover:text-warm-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-warm-white/30">Loading...</p>
        ) : (
          <div className="bg-obsidian-light/30 rounded-2xl border border-obsidian-muted/30 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-obsidian-muted/30">
                  <th className="px-6 py-4 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-4 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Romance</th>
                  <th className="px-6 py-4 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-obsidian-muted/20 hover:bg-obsidian-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-warm-white">{p.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-obsidian-muted text-warm-white/60">{p.productType}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-white/50">{p.destination}</td>
                    <td className="px-6 py-4 text-sm font-medium text-ember">{formatPrice(p.basePrice)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-obsidian-muted rounded-full overflow-hidden">
                          <div className="h-full bg-ember rounded-full" style={{ width: `${p.romanceScore}%` }} />
                        </div>
                        <span className="text-xs text-warm-white/40">{p.romanceScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-warm-white/30">{p.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
