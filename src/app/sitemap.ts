import { db } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://srevol.com";

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

  // Package routes
  const templates = await db.packageTemplate.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "/" ? 1.0 : 0.8,
    })),
    ...templates.map((t) => ({
      url: `${baseUrl}/packages/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
