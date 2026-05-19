/**
 * SREVOL Add-On Conflict Engine
 * 
 * This module handles the intelligent scheduling of add-ons for couples.
 * When both partners select add-ons, the engine detects timing conflicts
 * and suggests resolutions.
 */

export interface AddOnOption {
  id: string;
  title: string;
  dayOffset: number;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  requiresBoth: boolean;
  category: string;
}

export interface PartnerSelection {
  addOnId: string;
  isSecret: boolean;
}

export interface Conflict {
  type: "TIMING_OVERLAP" | "REQUIRES_BOTH" | "SAME_CATEGORY";
  addOnA: AddOnOption;
  addOnB: AddOnOption;
  partnerA: string;
  partnerB: string;
  message: string;
  resolution: string;
}

export interface ResolvedSchedule {
  dayOffset: number;
  items: {
    time: string;
    addOn: AddOnOption;
    selectedBy: string[]; // partner IDs
    isSecret: boolean;
    status: "confirmed" | "conflict" | "pending";
  }[];
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function timesOverlap(
  startA: string, endA: string,
  startB: string, endB: string
): boolean {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);
  return sA < eB && sB < eA;
}

export function detectConflicts(
  addOns: AddOnOption[],
  partner1Selections: PartnerSelection[],
  partner2Selections: PartnerSelection[],
  partner1Id: string,
  partner2Id: string
): Conflict[] {
  const conflicts: Conflict[] = [];
  const allSelections = [
    ...partner1Selections.map((s) => ({ ...s, partnerId: partner1Id })),
    ...partner2Selections.map((s) => ({ ...s, partnerId: partner2Id })),
  ];

  // Map selections to add-on details
  const selectionMap = new Map<string, { addOn: AddOnOption; partnerId: string; isSecret: boolean }>();
  for (const sel of allSelections) {
    const addOn = addOns.find((a) => a.id === sel.addOnId);
    if (addOn) {
      selectionMap.set(`${sel.addOnId}-${sel.partnerId}`, {
        addOn,
        partnerId: sel.partnerId,
        isSecret: sel.isSecret,
      });
    }
  }

  // Check every pair for conflicts
  const entries = Array.from(selectionMap.values());
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];

      // Same partner can't do overlapping things
      if (a.partnerId === b.partnerId) {
        if (
          a.addOn.dayOffset === b.addOn.dayOffset &&
          timesOverlap(a.addOn.startTime, a.addOn.endTime, b.addOn.startTime, b.addOn.endTime)
        ) {
          conflicts.push({
            type: "TIMING_OVERLAP",
            addOnA: a.addOn,
            addOnB: b.addOn,
            partnerA: a.partnerId,
            partnerB: b.partnerId,
            message: `You selected "${a.addOn.title}" and "${b.addOn.title}" at overlapping times on Day ${a.addOn.dayOffset + 1}.`,
            resolution: `Choose one, or select different time slots if available.`,
          });
        }
        continue;
      }

      // Different partners on same day, same time
      if (
        a.addOn.dayOffset === b.addOn.dayOffset &&
        timesOverlap(a.addOn.startTime, a.addOn.endTime, b.addOn.startTime, b.addOn.endTime)
      ) {
        // If one requires both, it's not a conflict — it's a shared activity
        if (a.addOn.requiresBoth || b.addOn.requiresBoth) {
          // This is actually a match if both selected it
          if (a.addOn.id === b.addOn.id) {
            continue; // Both selected same required-both activity = perfect
          }
        }

        conflicts.push({
          type: "TIMING_OVERLAP",
          addOnA: a.addOn,
          addOnB: b.addOn,
          partnerA: a.partnerId,
          partnerB: b.partnerId,
          message: `${a.partnerId === partner1Id ? "Partner 1" : "Partner 2"} wants "${a.addOn.title}" while ${b.partnerId === partner1Id ? "Partner 1" : "Partner 2"} wants "${b.addOn.title}" at the same time on Day ${a.addOn.dayOffset + 1}.`,
          resolution: `Discuss and choose one shared activity, or book different time slots.`,
        });
      }

      // Same category on same day (soft conflict — suggestion)
      if (
        a.addOn.dayOffset === b.addOn.dayOffset &&
        a.addOn.category === b.addOn.category &&
        a.addOn.id !== b.addOn.id
      ) {
        // Only flag if they're close in time (within 2 hours)
        const endA = timeToMinutes(a.addOn.endTime);
        const startB = timeToMinutes(b.addOn.startTime);
        const gap = Math.abs(startB - endA);
        if (gap <= 120) {
          conflicts.push({
            type: "SAME_CATEGORY",
            addOnA: a.addOn,
            addOnB: b.addOn,
            partnerA: a.partnerId,
            partnerB: b.partnerId,
            message: `Two ${a.addOn.category.toLowerCase()} activities are booked close together on Day ${a.addOn.dayOffset + 1}.`,
            resolution: `Consider spacing them out for a more relaxed pace.`,
          });
        }
      }
    }
  }

  // Check requiresBoth add-ons where only one partner selected
  for (const addOn of addOns) {
    if (addOn.requiresBoth) {
      const p1Selected = partner1Selections.some((s) => s.addOnId === addOn.id);
      const p2Selected = partner2Selections.some((s) => s.addOnId === addOn.id);
      if (p1Selected && !p2Selected) {
        conflicts.push({
          type: "REQUIRES_BOTH",
          addOnA: addOn,
          addOnB: addOn,
          partnerA: partner1Id,
          partnerB: partner2Id,
          message: `"${addOn.title}" requires both partners, but only Partner 1 selected it.`,
          resolution: `Partner 2 needs to confirm, or choose a different activity.`,
        });
      }
      if (!p1Selected && p2Selected) {
        conflicts.push({
          type: "REQUIRES_BOTH",
          addOnA: addOn,
          addOnB: addOn,
          partnerA: partner1Id,
          partnerB: partner2Id,
          message: `"${addOn.title}" requires both partners, but only Partner 2 selected it.`,
          resolution: `Partner 1 needs to confirm, or choose a different activity.`,
        });
      }
    }
  }

  return conflicts;
}

export function buildSchedule(
  addOns: AddOnOption[],
  partner1Selections: PartnerSelection[],
  partner2Selections: PartnerSelection[],
  partner1Id: string,
  partner2Id: string
): ResolvedSchedule[] {
  const conflicts = detectConflicts(addOns, partner1Selections, partner2Selections, partner1Id, partner2Id);
  const conflictSet = new Set<string>();
  for (const c of conflicts) {
    if (c.type === "TIMING_OVERLAP" || c.type === "REQUIRES_BOTH") {
      conflictSet.add(c.addOnA.id);
      conflictSet.add(c.addOnB.id);
    }
  }

  const allSelections = [
    ...partner1Selections.map((s) => ({ ...s, partnerId: partner1Id })),
    ...partner2Selections.map((s) => ({ ...s, partnerId: partner2Id })),
  ];

  // Group by day
  const dayMap = new Map<number, ResolvedSchedule["items"]>();

  for (const sel of allSelections) {
    const addOn = addOns.find((a) => a.id === sel.addOnId);
    if (!addOn) continue;

    const day = addOn.dayOffset;
    if (!dayMap.has(day)) {
      dayMap.set(day, []);
    }

    const items = dayMap.get(day)!;
    const existing = items.find((i) => i.addOn.id === addOn.id);

    if (existing) {
      if (!existing.selectedBy.includes(sel.partnerId)) {
        existing.selectedBy.push(sel.partnerId);
      }
      existing.isSecret = existing.isSecret || sel.isSecret;
    } else {
      items.push({
        time: addOn.startTime,
        addOn,
        selectedBy: [sel.partnerId],
        isSecret: sel.isSecret,
        status: conflictSet.has(addOn.id) ? "conflict" : "confirmed",
      });
    }
  }

  // Sort each day by time
  for (const items of dayMap.values()) {
    items.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }

  return Array.from(dayMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([dayOffset, items]) => ({ dayOffset, items }));
}
