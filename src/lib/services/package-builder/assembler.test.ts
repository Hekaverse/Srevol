import { describe, it, expect, vi, beforeEach } from "vitest";
import { assemblePackage } from "./assembler";

// Mock Prisma client
vi.mock("@/lib/db", () => ({
  db: {
    travelProduct: {
      findMany: vi.fn(),
    },
    budgetBucket: {
      findUnique: vi.fn(),
    },
    generatedPackage: {
      create: vi.fn(),
    },
    alertQueue: {
      create: vi.fn(),
    },
    packageTemplate: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb({
      budgetBucket: { findUnique: vi.fn() },
      generatedPackage: { create: vi.fn() },
      alertQueue: { create: vi.fn() },
      packageTemplate: { findFirst: vi.fn() },
    })),
  },
}));

describe("assemblePackage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no hotels found", async () => {
    const { db } = await import("@/lib/db");
    vi.mocked(db.travelProduct.findMany).mockResolvedValue([]);

    const result = await assemblePackage({ destination: "Nowhere", duration: 7 });
    expect(result).toBeNull();
  });

  it("calculates total price correctly", async () => {
    const { db } = await import("@/lib/db");
    vi.mocked(db.travelProduct.findMany)
      .mockResolvedValueOnce([{
        id: "hotel-1",
        name: "Test Hotel",
        basePrice: 20000,
        imageUrl: null,
        starRating: 5,
      }] as any)
      .mockResolvedValueOnce([{
        id: "flight-1",
        name: "Test Flight",
        basePrice: 50000,
      }] as any)
      .mockResolvedValueOnce([{
        id: "activity-1",
        name: "Test Activity",
        basePrice: 10000,
      }] as any);

    const result = await assemblePackage({ destination: "Santorini", duration: 7 });
    expect(result).not.toBeNull();
    expect(result?.totalPrice).toBe(20000 * 7 + 50000 + 10000);
    expect(result?.availableHotels[0]?.name).toBe("Test Hotel");
  });
});
