import { db } from "@/lib/db";

export interface PackageAssemblyConfig {
  destination: string;
  duration: number;
  tierId?: string;
  budgetMax?: number;
}

export interface HotelOption {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  starRating: number | null;
  reviewScore: number | null;
  reviewCount: number | null;
  description: string | null;
}

export interface FlightOption {
  id: string;
  name: string;
  price: number;
}

export interface ActivityOption {
  id: string;
  name: string;
  price: number;
  romanceScore: number;
  description: string | null;
}

export interface AssembledPackage {
  availableHotels: HotelOption[];
  availableFlights: FlightOption[];
  availableActivities: ActivityOption[];
  selectedHotelId: string;
  selectedFlightId: string;
  selectedActivityIds: string[];
  totalPrice: number;
  nightlyRate: number;
  duration: number;
}

export async function assemblePackage(
  config: PackageAssemblyConfig
): Promise<AssembledPackage | null> {
  const { destination, duration, budgetMax } = config;

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
      take: 10,
    }),
  ]);

  if (hotels.length === 0) return null;

  const hotelOptions: HotelOption[] = hotels.map((h) => ({
    id: h.id,
    name: h.name,
    price: h.basePrice,
    imageUrl: h.imageUrl,
    starRating: h.starRating,
    reviewScore: h.reviewScore,
    reviewCount: h.reviewCount,
    description: h.description,
  }));

  const flightOptions: FlightOption[] = allFlights.map((f) => ({
    id: f.id,
    name: f.name,
    price: f.basePrice,
  }));

  const activityOptions: ActivityOption[] = activities.map((a) => ({
    id: a.id,
    name: a.name,
    price: a.basePrice,
    romanceScore: a.romanceScore,
    description: a.description,
  }));

  // Defaults
  const selectedHotel = hotels[0];
  const selectedFlight = allFlights.length >= 2 ? allFlights[1] : allFlights[0] || null;
  const defaultActivities = activities.slice(0, Math.min(activities.length, Math.floor(duration / 2)));

  const hotelTotal = selectedHotel.basePrice * duration;
  const flightTotal = selectedFlight ? selectedFlight.basePrice : 0;
  const activityTotal = defaultActivities.reduce((sum, a) => sum + a.basePrice, 0);
  const totalPrice = hotelTotal + flightTotal + activityTotal;

  return {
    availableHotels: hotelOptions,
    availableFlights: flightOptions,
    availableActivities: activityOptions,
    selectedHotelId: selectedHotel.id,
    selectedFlightId: selectedFlight?.id || "",
    selectedActivityIds: defaultActivities.map((a) => a.id),
    totalPrice,
    nightlyRate: selectedHotel.basePrice,
    duration,
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

    const template = await tx.packageTemplate.findFirst({
      where: { destination: { contains: destination }, isActive: true },
    });

    const generated = await tx.generatedPackage.create({
      data: {
        templateId: template?.id || null,
        bucketId: bucket.id,
        assembledProducts: JSON.stringify({
          hotelId: assembled.selectedHotelId,
          flightId: assembled.selectedFlightId,
          activityIds: assembled.selectedActivityIds,
          pricesAtGeneration: {
            hotel: assembled.availableHotels.find((h) => h.id === assembled.selectedHotelId)?.price || 0,
            flight: assembled.availableFlights.find((f) => f.id === assembled.selectedFlightId)?.price || 0,
            activities: assembled.availableActivities
              .filter((a) => assembled.selectedActivityIds.includes(a.id))
              .reduce((s, a) => s + a.price, 0),
          },
        }),
        totalPrice: assembled.totalPrice,
        status: "DRAFT",
      },
    });

    await tx.alertQueue.create({
      data: {
        bucketId: bucket.id,
        alertType: "PACKAGE_GENERATED",
        title: "Your dream package is ready",
        message: `We've assembled a ${destination} route based on your ${bucket.tier?.name || "fare commitment"}. Total: $${(assembled.totalPrice / 100).toFixed(0)}`,
        channel: "IN_APP",
      },
    });

    return { generated, assembled };
  });

  return result;
}
