import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
