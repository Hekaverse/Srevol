import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { curateAllProducts, getCuratedProducts } from "@/lib/services/curator/scorer";

const curatorPostSchema = z.object({
  secret: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = curatorPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const expectedSecret = process.env.SEED_SECRET || "srevol-dev-seed";
    if (parsed.data.secret !== expectedSecret) {
      return NextResponse.json({ success: false, error: "Invalid secret" }, { status: 403 });
    }

    const results = await curateAllProducts();
    return NextResponse.json({
      success: true,
      totalScored: results.length,
      results: results.slice(0, 20),
    });
  } catch (error) {
    console.error("Curation error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}

const curatorQuerySchema = z.object({
  destination: z.string().optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  productType: z.enum(["HOTEL", "FLIGHT", "ACTIVITY", "CRUISE"]).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const parsed = curatorQuerySchema.safeParse(query);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const products = await getCuratedProducts(parsed.data);

    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        destination: p.destination,
        productType: p.productType,
        basePrice: p.basePrice,
        romanceScore: p.romanceScore,
        romanceTags: p.romanceTags ? JSON.parse(p.romanceTags) : [],
        starRating: p.starRating,
        reviewScore: p.reviewScore,
        imageUrl: p.imageUrl,
        priceUpdatedAt: p.priceUpdatedAt,
      })),
    });
  } catch (error) {
    console.error("Curator fetch error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}
