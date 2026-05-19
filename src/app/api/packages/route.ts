import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const destination = searchParams.get("destination") || undefined;

    const templates = await db.packageTemplate.findMany({
      where: {
        isActive: true,
        ...(category && { category: category as any }),
        ...(destination && { destination: { contains: destination } }),
      },
      orderBy: { basePrice: "asc" },
      include: {
        tier: true,
      },
    });

    // Also fetch top curated hotels as "featured properties"
    const featuredHotels = await db.travelProduct.findMany({
      where: {
        productType: "HOTEL",
        isActive: true,
        romanceScore: { gte: 70 },
      },
      orderBy: { romanceScore: "desc" },
      take: 6,
    });

    return NextResponse.json({
      success: true,
      templates: templates.map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        subtitle: t.subtitle,
        destination: t.destination,
        image: t.image,
        basePrice: t.basePrice,
        duration: t.duration,
        category: t.category,
        isPremium: t.isPremium,
        tier: t.tier ? { name: t.tier.name, slug: t.tier.slug } : null,
      })),
      featuredHotels: featuredHotels.map((h) => ({
        id: h.id,
        name: h.name,
        destination: h.destination,
        imageUrl: h.imageUrl,
        basePrice: h.basePrice,
        romanceScore: h.romanceScore,
        starRating: h.starRating,
        reviewScore: h.reviewScore,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
