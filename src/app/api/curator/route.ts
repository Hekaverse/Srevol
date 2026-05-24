import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { adminRateLimit, apiRateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { curateAllProducts, getCuratedProducts } from "@/lib/services/curator/scorer";

const curatorPostSchema = z.object({
  secret: z.string().min(1),
});

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

    const expectedSecret = env.SEED_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Secret not configured" },
        { status: 500 }
      );
    }
    if (parsed.data.secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: "Invalid secret" },
        { status: 403 }
      );
    }

    const results = await curateAllProducts();
    return NextResponse.json({
      success: true,
      totalScored: results.length,
      results: results.slice(0, 20),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Curation failed" },
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
  const limit = await apiRateLimit(request);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
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
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
