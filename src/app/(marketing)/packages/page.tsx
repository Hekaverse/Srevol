import type { Metadata } from "next";
import { db } from "@/lib/db";
import PackagesGrid from "./PackagesGrid";

export const metadata: Metadata = {
  title: "Routes — SREVOL",
  description: "Browse curated SREVOL routes for two. From Santorini to Bora Bora, find your perfect departure.",
};

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const templates = await db.packageTemplate.findMany({
    where: { isActive: true },
    orderBy: { basePrice: "asc" },
    include: { tier: true },
  });

  const featuredHotels = await db.travelProduct.findMany({
    where: {
      productType: "HOTEL",
      isActive: true,
      romanceScore: { gte: 70 },
    },
    orderBy: { romanceScore: "desc" },
    take: 6,
  });

  // Get booking counts for social proof
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const bookingCounts = await db.booking.groupBy({
    by: ["packageId"],
    where: {
      status: "CONFIRMED",
      createdAt: { gte: thirtyDaysAgo },
    },
    _count: { id: true },
  });

  const countMap = new Map(bookingCounts.map((b) => [b.packageId, b._count.id]));

  const serialized = templates.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    subtitle: t.subtitle ?? "",
    description: t.description ?? "",
    destination: t.destination ?? "",
    image: t.image ?? "",
    gallery: t.gallery ? JSON.parse(t.gallery) : [],
    basePrice: t.basePrice,
    duration: t.duration,
    category: t.category,
    isPremium: t.isPremium,
    tier: t.tier ? { name: t.tier.name, slug: t.tier.slug } : null,
    recentBookings: countMap.get(t.id) || 0,
  }));

  return (
    <div className="min-h-screen bg-obsidian">
      <main className="pt-32 pb-24">
        <PackagesGrid templates={serialized} />
      </main>
    </div>
  );
}
