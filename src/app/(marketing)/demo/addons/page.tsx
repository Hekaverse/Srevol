"use client";

import { useState } from "react";
import { AddOnOption, detectConflicts, buildSchedule } from "@/lib/addon-engine";

const demoAddOns: AddOnOption[] = [
  { id: "catamaran", title: "Sunset Catamaran Cruise", dayOffset: 2, startTime: "17:00", endTime: "20:00", requiresBoth: true, category: "EXPERIENCE" },
  { id: "spa-couples", title: "Couples Spa Retreat", dayOffset: 2, startTime: "14:00", endTime: "17:00", requiresBoth: true, category: "SPA" },
  { id: "wine-tasting", title: "Private Wine Tasting", dayOffset: 2, startTime: "16:00", endTime: "18:00", requiresBoth: false, category: "DINING" },
  { id: "helicopter", title: "Coastal Helicopter Tour", dayOffset: 3, startTime: "09:00", endTime: "11:00", requiresBoth: false, category: "EXPERIENCE" },
  { id: "cooking-class", title: "Mediterranean Cooking Class", dayOffset: 3, startTime: "10:00", endTime: "13:00", requiresBoth: true, category: "EXPERIENCE" },
  { id: "beach-dinner", title: "Private Beach Dinner", dayOffset: 4, startTime: "19:00", endTime: "22:00", requiresBoth: true, category: "DINING" },
];

const partner1Id = "alex";
const partner2Id = "jordan";

export default function AddOnDemoPage() {
  const [p1Selections, setP1Selections] = useState<string[]>(["catamaran", "wine-tasting"]);
  const [p2Selections, setP2Selections] = useState<string[]>(["spa-couples", "wine-tasting"]);
  const [p1Secrets, setP1Secrets] = useState<string[]>([]);
  const [p2Secrets, setP2Secrets] = useState<string[]>(["spa-couples"]);

  const toggleSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], id: string) => {
    if (current.includes(id)) setter(current.filter((x) => x !== id));
    else setter([...current, id]);
  };

  const partner1Sels = p1Selections.map((id) => ({ addOnId: id, isSecret: p1Secrets.includes(id) }));
  const partner2Sels = p2Selections.map((id) => ({ addOnId: id, isSecret: p2Secrets.includes(id) }));

  const conflicts = detectConflicts(demoAddOns, partner1Sels, partner2Sels, partner1Id, partner2Id);
  const schedule = buildSchedule(demoAddOns, partner1Sels, partner2Sels, partner1Id, partner2Id);

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-medium text-ember tracking-[0.4em] uppercase">Demo</span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-warm-white">
              Add-On Conflict Engine
            </h1>
            <p className="mt-4 text-lg text-warm-white/40 max-w-2xl mx-auto">
              See how SREVOL intelligently manages both partners&apos; selections. 
              Toggle activities below to watch conflicts resolve in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Partner 1 */}
            <div className="bg-obsidian-light/50 rounded-2xl border border-obsidian-muted/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-obsidian-muted flex items-center justify-center">
                  <span className="text-sm font-bold text-warm-white">A</span>
                </div>
                <div>
                  <h3 className="font-bold text-warm-white">Alex</h3>
                  <p className="text-xs text-warm-white/30">Partner 1</p>
                </div>
              </div>
              <div className="space-y-3">
                {demoAddOns.map((addOn) => {
                  const selected = p1Selections.includes(addOn.id);
                  const secret = p1Secrets.includes(addOn.id);
                  return (
                    <div
                      key={addOn.id}
                      onClick={() => toggleSelection(setP1Selections, p1Selections, addOn.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selected ? "border-ember/40 bg-ember/5" : "border-obsidian-muted/30 hover:border-obsidian-muted"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-warm-white">{addOn.title}</p>
                          <p className="text-xs text-warm-white/30 mt-1">Day {addOn.dayOffset + 1} • {addOn.startTime}–{addOn.endTime}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-ember bg-ember" : "border-obsidian-muted"}`}>
                          {selected && <svg className="w-3 h-3 text-obsidian" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
                        </div>
                      </div>
                      {selected && (
                        <button onClick={(e) => { e.stopPropagation(); toggleSelection(setP1Secrets, p1Secrets, addOn.id); }}
                          className={`mt-2 text-xs px-2 py-1 rounded-full transition-colors ${secret ? "bg-ember text-obsidian" : "bg-obsidian-muted text-warm-white/40 hover:bg-obsidian-muted"}`}>
                          {secret ? "🤫 Secret" : "Make Secret"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Partner 2 */}
            <div className="bg-obsidian-light/50 rounded-2xl border border-obsidian-muted/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-ember/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-warm-white">J</span>
                </div>
                <div>
                  <h3 className="font-bold text-warm-white">Jordan</h3>
                  <p className="text-xs text-warm-white/30">Partner 2</p>
                </div>
              </div>
              <div className="space-y-3">
                {demoAddOns.map((addOn) => {
                  const selected = p2Selections.includes(addOn.id);
                  const secret = p2Secrets.includes(addOn.id);
                  return (
                    <div
                      key={addOn.id}
                      onClick={() => toggleSelection(setP2Selections, p2Selections, addOn.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selected ? "border-ember/40 bg-ember/5" : "border-obsidian-muted/30 hover:border-obsidian-muted"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-warm-white">{addOn.title}</p>
                          <p className="text-xs text-warm-white/30 mt-1">Day {addOn.dayOffset + 1} • {addOn.startTime}–{addOn.endTime}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-ember bg-ember" : "border-obsidian-muted"}`}>
                          {selected && <svg className="w-3 h-3 text-obsidian" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
                        </div>
                      </div>
                      {selected && (
                        <button onClick={(e) => { e.stopPropagation(); toggleSelection(setP2Secrets, p2Secrets, addOn.id); }}
                          className={`mt-2 text-xs px-2 py-1 rounded-full transition-colors ${secret ? "bg-ember text-obsidian" : "bg-obsidian-muted text-warm-white/40 hover:bg-obsidian-muted"}`}>
                          {secret ? "🤫 Secret" : "Make Secret"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="bg-obsidian-light/50 rounded-2xl border border-obsidian-muted/30 p-6">
                <h3 className="font-bold text-warm-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Conflicts ({conflicts.length})
                </h3>
                {conflicts.length === 0 ? (
                  <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <p className="text-sm text-green-400 font-medium">✨ No conflicts detected!</p>
                    <p className="text-xs text-green-400/60 mt-1">Your schedule is perfectly aligned.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conflicts.map((conflict, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${
                        conflict.type === "REQUIRES_BOTH" ? "bg-amber-500/10 border-amber-500/20" :
                        conflict.type === "SAME_CATEGORY" ? "bg-blue-500/10 border-blue-500/20" :
                        "bg-red-500/10 border-red-500/20"
                      }`}>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          conflict.type === "REQUIRES_BOTH" ? "bg-amber-500/20 text-amber-400" :
                          conflict.type === "SAME_CATEGORY" ? "bg-blue-500/20 text-blue-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>{conflict.type.replace("_", " ")}</span>
                        <p className="text-sm text-warm-white/70 mt-2">{conflict.message}</p>
                        <p className="text-xs text-warm-white/40 mt-1 italic">{conflict.resolution}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-obsidian-light/50 rounded-2xl border border-obsidian-muted/30 p-6">
                <h3 className="font-bold text-warm-white mb-4">Resolved Schedule</h3>
                {schedule.length === 0 ? (
                  <p className="text-sm text-warm-white/30">No activities selected yet.</p>
                ) : (
                  <div className="space-y-4">
                    {schedule.map((day) => (
                      <div key={day.dayOffset}>
                        <h4 className="text-xs font-semibold text-ember uppercase tracking-wider mb-2">Day {day.dayOffset + 1}</h4>
                        <div className="space-y-2">
                          {day.items.map((item, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${
                              item.status === "conflict" ? "bg-red-500/5 border-red-500/20" :
                              item.status === "confirmed" ? "bg-green-500/5 border-green-500/20" :
                              "bg-amber-500/5 border-amber-500/20"
                            }`}>
                              <div className="text-xs font-mono text-warm-white/30">{item.time}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-warm-white truncate">{item.addOn.title}{item.isSecret && <span className="ml-1">🤫</span>}</p>
                                <p className="text-xs text-warm-white/30">{item.selectedBy.length === 2 ? "Both partners" : item.selectedBy[0] === partner1Id ? "Alex only" : "Jordan only"}</p>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${item.status === "confirmed" ? "bg-green-500" : "bg-red-500"}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
