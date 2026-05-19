import { db } from "@/lib/db";

export interface PackageAssemblyConfig {
  destination: string;
  duration: number; // days
  tierId?: string;
  budgetMax?: number; // in cents
}

export interface AssembledPackage {
  hotel: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    starRating: number | null;
  };
  flights: {
    id: string;
    name: string;
    price: number;
  }[];
  activities: {
    id: string;
    name: string;
    price: number;
    dayOffset: number;
  }[];
  totalPrice: number;
  nightlyRate: number;
}

export async function assemblePackage(
  config: PackageAssemblyConfig
): Promise<AssembledPackage | null> {
  const { destination, duration, budgetMax } = config;

  // Parallelize independent queries
  const [hotels, allFlights, activities] = await Promise.all([
    db.travelProduct.findMany({
      where: {
        productType: "HOTEL",
        destination: { contains: destination },
        isActive: true,
        ...(budgetMax && { basePrice: { lte: Math.round(budgetMax / duration / 2) } }),
      },
      orderBy: [{ romanceScore: "desc" }, { reviewScore: "desc" }],
      take: 5,
    }),
    db.travelProduct.findMany({
      where: {
        productType: "FLIGHT",
        destination: { contains: destination },
        isActive: true,
      },
      orderBy: { basePrice: "asc" },
      take: 3,
    }),
    db.travelProduct.findMany({
      where: {
        productType: "ACTIVITY",
        destination: { contains: destination },
        isActive: true,
      },
      orderBy: [{ romanceScore: "desc" }, { reviewScore: "desc" }],
      take: 8,
    }),
  ]);

  if (hotels.length === 0) return null;
  const hotel = hotels[0];

  // Pick middle-tier flight (best value for couples)
  const selectedFlight = allFlights.length >= 2 ? allFlights[1] : allFlights[0];
  const flights = selectedFlight ? [selectedFlight] : [];

  // Select top activities and distribute across days
  const selectedActivities = activities.slice(0, Math.min(activities.length, Math.floor(duration / 2)));
  const activitySchedule = selectedActivities.map((act, i) => ({
    id: act.id,
    name: act.name,
    price: act.basePrice,
    dayOffset: Math.min(i * 2 + 1, duration - 1),
  }));

  // Calculate total
  const hotelTotal = hotel.basePrice * duration;
  const flightTotal = flights.reduce((sum, f) => sum + f.basePrice, 0);
  const activityTotal = activitySchedule.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = hotelTotal + flightTotal + activityTotal;

  return {
    hotel: {
      id: hotel.id,
      name: hotel.name,
      price: hotel.basePrice,
      imageUrl: hotel.imageUrl,
      starRating: hotel.starRating,
    },
    flights: flights.map((f) => ({ id: f.id, name: f.name, price: f.basePrice })),
    activities: activitySchedule,
    totalPrice,
    nightlyRate: hotel.basePrice,
  };
}

export async function generatePackageForBucket(bucketId: string) {
  const result = await db.$transaction(async (tx) => {
    const bucket = await tx.budgetBucket.findUnique({
      where: { id: bucketId },
      include: { tier: true, couple: true },
    });

    if (!bucket) throw new Error("Bucket not found");
    if (!bucket.preferredDestinations) throw new Error("No preferred destinations");

    const destinations = JSON.parse(bucket.preferredDestinations) as string[];
    const destination = destinations[0];

    const assembled = await assemblePackage({
      destination,
      duration: 7,
      budgetMax: bucket.targetAmount,
    });

    if (!assembled) throw new Error("Could not assemble package");

    // Find matching template
    const template = await tx.packageTemplate.findFirst({
      where: { destination: { contains: destination }, isActive: true },
    });

    // Create generated package record
    const generated = await tx.generatedPackage.create({
      data: {
        templateId: template?.id || null,
        bucketId: bucket.id,
        assembledProducts: JSON.stringify({
          hotelId: assembled.hotel.id,
          flightIds: assembled.flights.map((f) => f.id),
          activityIds: assembled.activities.map((a) => a.id),
          pricesAtGeneration: {
            hotel: assembled.hotel.price,
            flights: assembled.flights.reduce((s, f) => s + f.price, 0),
            activities: assembled.activities.reduce((s, a) => s + a.price, 0),
          },
        }),
        totalPrice: assembled.totalPrice,
        status: "DRAFT",
      },
    });

    // Queue alert
    await tx.alertQueue.create({
      data: {
        bucketId: bucket.id,
        alertType: "PACKAGE_GENERATED",
        title: "Your dream package is ready",
        message: `We've assembled a ${destination} escape based on your ${bucket.tier?.name || "savings plan"}. Total: $${(assembled.totalPrice / 100).toFixed(0)}`,
        channel: "IN_APP",
      },
    });

    return { generated, assembled };
  });

  return result;
}
