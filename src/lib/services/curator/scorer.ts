import { db } from "@/lib/db";

// Romance-indicating keywords in amenities, descriptions, names
const ROMANCE_KEYWORDS = [
  "couples", "romantic", "honeymoon", "anniversary", "private", "intimate",
  "secluded", "candlelit", "sunset", "sunrise", "views", "panoramic",
  "terrace", "balcony", "pool", "infinity", "jacuzzi", "hot tub",
  "spa", "massage", "wellness", "champagne", "wine", "dining",
  "butler", "concierge", "exclusive", "adults only", "adult-only",
  "overwater", "cliffside", "beachfront", "oceanfront", "villa",
  "suite", "premium", "luxury", "boutique",
];

const COUPLES_AMENITIES = [
  "Couples Spa",
  "Champagne Breakfast",
  "Private Dining",
  "Sunset View",
  "Caldera View",
  "Ocean View",
  "Butler Service",
  "Concierge",
  "Infinity Pool",
  "Private Pool",
  "Jacuzzi",
  "Hot Tub",
  "In-Room Dining",
  "Turndown Service",
  "Rose Petals",
  "Candlelit Dinner",
  "Wine Tasting",
  "Cooking Class",
  "Private Beach",
  "Overwater Villa",
];

export interface RomanceScoreResult {
  productId: string;
  name: string;
  score: number;
  tags: string[];
  reasons: string[];
}

export function calculateRomanceScore(product: {
  name: string;
  description?: string | null;
  amenities?: string | null;
  reviewScore?: number | null;
  starRating?: number | null;
}): { score: number; tags: string[]; reasons: string[] } {
  let score = 0;
  const tags: string[] = [];
  const reasons: string[] = [];

  const text = `${product.name} ${product.description || ""}`.toLowerCase();
  const amenities = product.amenities
    ? JSON.parse(product.amenities).map((a: string) => a.toLowerCase())
    : [];

  // Keyword matching (0-40 points)
  let keywordMatches = 0;
  for (const keyword of ROMANCE_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      keywordMatches++;
      if (!tags.includes(keyword)) tags.push(keyword);
    }
  }
  score += Math.min(keywordMatches * 2, 40);
  if (keywordMatches > 0) {
    reasons.push(`${keywordMatches} romance keywords matched`);
  }

  // Couples amenities (0-30 points)
  let amenityMatches = 0;
  for (const amenity of COUPLES_AMENITIES) {
    if (amenities.some((a: string) => a.includes(amenity.toLowerCase()))) {
      amenityMatches++;
      if (!tags.includes(amenity)) tags.push(amenity);
    }
  }
  score += Math.min(amenityMatches * 3, 30);
  if (amenityMatches > 0) {
    reasons.push(`${amenityMatches} couples amenities detected`);
  }

  // Star rating (0-15 points)
  if (product.starRating) {
    score += Math.min(product.starRating * 3, 15);
    reasons.push(`Star rating: ${product.starRating}`);
  }

  // Review score (0-15 points)
  if (product.reviewScore) {
    score += Math.min((product.reviewScore / 10) * 15, 15);
    reasons.push(`Review score: ${product.reviewScore}/10`);
  }

  // Normalize to 0-100
  score = Math.min(Math.round(score), 100);

  return { score, tags, reasons };
}

export async function curateAllProducts(limit?: number): Promise<RomanceScoreResult[]> {
  const products = await db.travelProduct.findMany({
    where: { isActive: true },
    take: limit,
  });

  const results: RomanceScoreResult[] = [];

  for (const product of products) {
    const { score, tags, reasons } = calculateRomanceScore(product);

    await db.travelProduct.update({
      where: { id: product.id },
      data: {
        romanceScore: score,
        romanceTags: JSON.stringify(tags),
        curatedAt: new Date(),
      },
    });

    results.push({
      productId: product.id,
      name: product.name,
      score,
      tags,
      reasons,
    });
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

export async function getCuratedProducts(options?: {
  destination?: string;
  minScore?: number;
  productType?: "HOTEL" | "FLIGHT" | "ACTIVITY" | "CRUISE";
  limit?: number;
}) {
  return db.travelProduct.findMany({
    where: {
      isActive: true,
      ...(options?.destination && {
        destination: { contains: options.destination },
      }),
      ...(options?.minScore && { romanceScore: { gte: options.minScore } }),
      ...(options?.productType && { productType: options.productType }),
    },
    orderBy: { romanceScore: "desc" },
    take: options?.limit || 50,
  });
}
