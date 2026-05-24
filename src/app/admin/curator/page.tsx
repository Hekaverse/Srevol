"use client";

import { useState } from "react";
import Link from "next/link";

interface CurationResult {
  productId: string;
  name: string;
  score: number;
  tags: string[];
  reasons: string[];
}

export default function CuratorAdminPage() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<CurationResult[] | null>(null);
  const [stats, setStats] = useState<{ totalScored: number } | null>(null);

  const runCuration = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/curator", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setStats({ totalScored: data.totalScored });
      }
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-sm text-ember hover:underline">← Back to Command Center</Link>
            <h1 className="mt-2 font-serif text-3xl font-bold text-warm-white">Romance Curator</h1>
            <p className="mt-2 text-warm-white/40">AI scoring engine that identifies the most romantic route products.</p>
          </div>
          <button
            onClick={runCuration}
            disabled={running}
            className="px-6 py-2.5 text-sm font-medium text-obsidian bg-ember rounded-full hover:bg-ember-light transition-all disabled:opacity-50"
          >
            {running ? "Scoring..." : "Run Curation Engine"}
          </button>
        </div>

        {stats && (
          <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
            <p className="text-green-400 font-medium">Curation complete!</p>
            <p className="text-sm text-warm-white/40 mt-1">{stats.totalScored} products scored and ranked.</p>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {results.map((r, i) => (
              <div key={r.productId} className="p-6 bg-obsidian-light/30 rounded-2xl border border-obsidian-muted/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-obsidian-muted flex items-center justify-center">
                      <span className="text-sm font-bold text-ember">#{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-warm-white">{r.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {r.tags.slice(0, 6).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 rounded-full bg-obsidian-muted/50 text-warm-white/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-3xl font-bold text-ember">{r.score}</div>
                    <div className="text-xs text-warm-white/30">romance score</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-plum-700/20">
                  <p className="text-xs text-warm-white/30 uppercase tracking-wider mb-2">Reasoning</p>
                  <ul className="space-y-1">
                    {r.reasons.map((reason, j) => (
                      <li key={j} className="text-sm text-warm-white/50 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-ember/50" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {!results && !running && (
          <div className="text-center py-20">
            <p className="text-warm-white/30">Click "Run Curation Engine" to score all travel products.</p>
          </div>
        )}
      </div>
    </div>
  );
}
