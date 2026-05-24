import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { seedSchema } from "@/lib/validation";
import { env } from "@/lib/env";
import { seedBudgetTiers, seedPackageTemplates } from "@/lib/services/seed";
import { seedTravelProductsAndComponents } from "@/lib/services/seed-components";
import { adminRateLimit } from "@/lib/rate-limit";
import { syncPrices } from "@/lib/services/price-intelligence/sync";
import { curateAllProducts } from "@/lib/services/curator/scorer";

export async function POST(request: Request) {
  try {
    const limit = await adminRateLimit(request);
    if (!limit.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = seedSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const expectedSecret = env.SEED_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Seed secret not configured" },
        { status: 500 }
      );
    }
    if (parsed.data.secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Invalid seed secret" },
        { status: 403 }
      );
    }

    const tiersCount = await seedBudgetTiers();
    const templatesCount = await seedPackageTemplates();
    const componentResults = await seedTravelProductsAndComponents();
    const syncResults = await syncPrices();
    const curationResults = await curateAllProducts();

    return NextResponse.json({
      success: true,
      seeded: {
        budgetTiers: tiersCount,
        packageTemplates: templatesCount,
        travelProducts: componentResults.productsCreated,
        packageComponents: componentResults.componentsCreated,
      },
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
  } catch {
    return NextResponse.json(
      { success: false, error: "Seed operation failed" },
      { status: 500 }
    );
  }
}
