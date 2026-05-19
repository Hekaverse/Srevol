import { db } from "@/lib/db";
import { MockHotelAdapter } from "./adapters/mock-hotel";
import { MockActivityAdapter } from "./adapters/mock-activity";
import { MockFlightAdapter } from "./adapters/mock-flight";
import { SerpApiAdapter } from "./adapters/serpapi";
import { PriceQuery } from "./adapters/base";

// Build adapter list dynamically based on available API keys
function buildAdapters() {
  const adapters: import("./adapters/base").PriceAdapter[] = [
    new MockHotelAdapter(),
    new MockActivityAdapter(),
    new MockFlightAdapter(),
  ];

  // Add real adapters only if API keys are configured
  if (process.env.SERPAPI_KEY) {
    adapters.push(new SerpApiAdapter());
  }

  return adapters;
}

const DESTINATIONS = [
  "Santorini, Greece",
  "Maldives",
  "Kyoto, Japan",
  "Amalfi Coast, Italy",
  "Bora Bora",
  "Switzerland",
];

export interface SyncResult {
  destination: string;
  adapter: string;
  productsFetched: number;
  productsUpdated: number;
  errors: string[];
}

export async function syncPrices(options?: {
  destinations?: string[];
  productTypes?: ("HOTEL" | "FLIGHT" | "ACTIVITY" | "CRUISE" | "TRANSFER")[];
}): Promise<SyncResult[]> {
  const ADAPTERS = buildAdapters();
  const results: SyncResult[] = [];
  const destinations = options?.destinations || DESTINATIONS;

  for (const destination of destinations) {
    const query: PriceQuery = {
      destination,
      adults: 2,
      checkInDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      checkOutDate: new Date(Date.now() + 187 * 24 * 60 * 60 * 1000),
      currency: "USD",
    };

    for (const adapter of ADAPTERS) {
      if (options?.productTypes) {
        const hasMatch = adapter.productTypes.some((pt) =>
          options.productTypes!.includes(pt)
        );
        if (!hasMatch) continue;
      }

      const result: SyncResult = {
        destination,
        adapter: adapter.name,
        productsFetched: 0,
        productsUpdated: 0,
        errors: [],
      };

      try {
        const products = await adapter.fetchPrices(query);
        result.productsFetched = products.length;

        for (const product of products) {
          const upserted = await db.travelProduct.upsert({
            where: {
              externalId_source_productType: {
                externalId: product.externalId,
                source: adapter.name,
                productType: product.productType,
              },
            },
            update: {
              name: product.name,
              description: product.description,
              destination: product.destination,
              country: product.country,
              latitude: product.latitude,
              longitude: product.longitude,
              imageUrl: product.imageUrl,
              galleryUrls: product.galleryUrls ? JSON.stringify(product.galleryUrls) : null,
              starRating: product.starRating,
              reviewScore: product.reviewScore,
              reviewCount: product.reviewCount,
              amenities: product.amenities ? JSON.stringify(product.amenities) : null,
              basePrice: product.price,
              currency: product.currency,
              priceUpdatedAt: new Date(),
            },
            create: {
              externalId: product.externalId,
              source: adapter.name,
              productType: product.productType,
              name: product.name,
              description: product.description,
              destination: product.destination,
              country: product.country,
              latitude: product.latitude,
              longitude: product.longitude,
              imageUrl: product.imageUrl,
              galleryUrls: product.galleryUrls ? JSON.stringify(product.galleryUrls) : null,
              starRating: product.starRating,
              reviewScore: product.reviewScore,
              reviewCount: product.reviewCount,
              amenities: product.amenities ? JSON.stringify(product.amenities) : null,
              basePrice: product.price,
              currency: product.currency,
              priceUpdatedAt: new Date(),
            },
          });

          await db.priceSnapshot.create({
            data: {
              productId: upserted.id,
              price: product.price,
              currency: product.currency,
              checkInDate: query.checkInDate,
              checkOutDate: query.checkOutDate,
              adults: query.adults || 2,
              source: adapter.name,
            },
          });

          result.productsUpdated++;
        }
      } catch (error) {
        result.errors.push(
          error instanceof Error ? error.message : "Unknown error"
        );
      }

      results.push(result);
    }
  }

  return results;
}

export async function getPriceTrend(productId: string, days: number = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const snapshots = await db.priceSnapshot.findMany({
    where: {
      productId,
      fetchedAt: { gte: since },
    },
    orderBy: { fetchedAt: "asc" },
  });

  if (snapshots.length < 2) return null;

  const prices = snapshots.map((s) => s.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const current = prices[prices.length - 1];
  const first = prices[0];
  const changePct = ((current - first) / first) * 100;

  return {
    current,
    average: Math.round(avg),
    min,
    max,
    changePercent: Math.round(changePct * 10) / 10,
    dataPoints: snapshots.length,
    trend: changePct < -5 ? "dropping" : changePct > 5 ? "rising" : "stable",
  };
}
