import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const limit = await apiRateLimit(request);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination");

    if (!destination) {
      return NextResponse.json(
        { success: false, error: "Destination required" },
        { status: 400 }
      );
    }

    // For now, return mock flights from our database
    // Future: integrate Amadeus API with origin/destination IATA codes
    const flights = await db.travelProduct.findMany({
      where: {
        productType: "FLIGHT",
        destination: { contains: destination },
        isActive: true,
      },
      orderBy: { basePrice: "asc" },
      take: 5,
    });

    return NextResponse.json({ success: true, flights });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to search flights" },
      { status: 500 }
    );
  }
}
