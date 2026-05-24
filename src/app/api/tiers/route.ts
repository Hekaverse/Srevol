import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limit = await apiRateLimit(request);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  try {
    const tiers = await db.budgetTier.findMany({
      where: { isActive: true },
      orderBy: { minPrice: "asc" },
    });

    return NextResponse.json({
      success: true,
      tiers: tiers.map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        description: t.description,
        minPrice: t.minPrice,
        maxPrice: t.maxPrice,
        defaultMonths: t.defaultMonths,
        minMonths: t.minMonths,
        maxMonths: t.maxMonths,
        destinations: t.destinations ? JSON.parse(t.destinations) : [],
        hotelStars: t.hotelStars,
        accentColor: t.accentColor,
      })),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tiers" },
      { status: 500 }
    );
  }
}
