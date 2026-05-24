import { db } from "@/lib/db";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXTAUTH_URL || "https://srevol.com").trim();

  // Static routes
  const staticRoutes = [
    "/",
    "/packages",
    "/tiers",
    "/how-it-works",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/login",
    "/register",
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : 0.8,
  }));

  // Package routes — gracefully handle missing DB during build
  let packageEntries: MetadataRoute.Sitemap = [];
  try {
    const templates = await db.packageTemplate.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    packageEntries = templates.map((t) => ({
      url: `${baseUrl}/packages/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB not available during build — static routes only
  }

  return [...staticEntries, ...packageEntries];
}
