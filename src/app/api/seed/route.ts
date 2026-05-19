import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { seedSchema } from "@/lib/validation";
import { seedBudgetTiers, seedPackageTemplates } from "@/lib/services/seed";
import { syncPrices } from "@/lib/services/price-intelligence/sync";
import { curateAllProducts } from "@/lib/services/curator/scorer";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validation
    const body = await request.json().catch(() => ({}));
    const parsed = seedSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const expectedSecret = process.env.SEED_SECRET || "srevol-dev-seed";
    if (parsed.data.secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Invalid seed secret" },
        { status: 403 }
      );
    }

    const tiersCount = await seedBudgetTiers();
    const templatesCount = await seedPackageTemplates();
    const syncResults = await syncPrices();
    const curationResults = await curateAllProducts();

    return NextResponse.json({
      success: true,
      seeded: { budgetTiers: tiersCount, packageTemplates: templatesCount },
      synced: {
        destinations: syncResults.length,
        productsFetched: syncResults.reduce((s, r) => s + r.productsFetched, 0),
        productsUpdated: syncResults.reduce((s, r) => s + r.productsUpdated, 0),
      },
      curated: {
        totalProductsScored: curationResults.length,
        topScored: curationResults.slice(0, 10),
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
