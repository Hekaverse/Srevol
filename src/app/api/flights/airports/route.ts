import { NextResponse } from "next/server";
import { AmadeusAdapter } from "@/lib/services/price-intelligence/adapters/amadeus";
import { apiRateLimit } from "@/lib/rate-limit";

const COMMON_AIRPORTS = [
  { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA" },
  { code: "LHR", name: "Heathrow", city: "London", country: "UK" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France" },
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
  { code: "HND", name: "Haneda", city: "Tokyo", country: "Japan" },
  { code: "SIN", name: "Changi", city: "Singapore", country: "Singapore" },
  { code: "SYD", name: "Kingsford Smith", city: "Sydney", country: "Australia" },
  { code: "FRA", name: "Frankfurt", city: "Frankfurt", country: "Germany" },
  { code: "AMS", name: "Schiphol", city: "Amsterdam", country: "Netherlands" },
  { code: "FCO", name: "Leonardo da Vinci", city: "Rome", country: "Italy" },
  { code: "MAD", name: "Adolfo Suárez Madrid", city: "Madrid", country: "Spain" },
  { code: "BKK", name: "Suvarnabhumi", city: "Bangkok", country: "Thailand" },
  { code: "IST", name: "Istanbul", city: "Istanbul", country: "Turkey" },
  { code: "YYZ", name: "Toronto Pearson", city: "Toronto", country: "Canada" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "USA" },
  { code: "MIA", name: "Miami International", city: "Miami", country: "USA" },
  { code: "ORD", name: "O'Hare International", city: "Chicago", country: "USA" },
  { code: "DFW", name: "Dallas/Fort Worth International", city: "Dallas", country: "USA" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta", city: "Atlanta", country: "USA" },
  { code: "DEN", name: "Denver International", city: "Denver", country: "USA" },
  { code: "SEA", name: "Seattle-Tacoma International", city: "Seattle", country: "USA" },
  { code: "BOS", name: "Logan International", city: "Boston", country: "USA" },
  { code: "LAS", name: "Harry Reid International", city: "Las Vegas", country: "USA" },
  { code: "PHX", name: "Phoenix Sky Harbor", city: "Phoenix", country: "USA" },
  { code: "MUC", name: "Munich", city: "Munich", country: "Germany" },
  { code: "ZRH", name: "Zurich", city: "Zurich", country: "Switzerland" },
  { code: "VIE", name: "Vienna International", city: "Vienna", country: "Austria" },
  { code: "BCN", name: "Barcelona-El Prat", city: "Barcelona", country: "Spain" },
  { code: "CPH", name: "Copenhagen", city: "Copenhagen", country: "Denmark" },
];

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
    const query = searchParams.get("q")?.toLowerCase() || "";

    // Try Amadeus first if configured
    const amadeus = new AmadeusAdapter();
    const amadeusResults = await amadeus.searchAirports(query);

    if (amadeusResults.length > 0) {
      return NextResponse.json({ success: true, airports: amadeusResults });
    }

    // Fallback to common airports
    const filtered = COMMON_AIRPORTS.filter(
      (a) =>
        a.code.toLowerCase().includes(query) ||
        a.city.toLowerCase().includes(query) ||
        a.name.toLowerCase().includes(query) ||
        a.country.toLowerCase().includes(query)
    ).slice(0, 8);

    return NextResponse.json({ success: true, airports: filtered });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to search airports" },
      { status: 500 }
    );
  }
}
