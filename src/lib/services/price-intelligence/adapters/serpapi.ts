import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

const SERPAPI_BASE = "https://serpapi.com/search";

export class SerpApiAdapter extends BaseAdapter {
  name = "serpapi";
  productTypes = ["HOTEL", "FLIGHT"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      console.warn("[SerpAPI] No key found. Set SERPAPI_KEY in .env.local");
      return [];
    }

    const results: FetchedProduct[] = [];

    try {
      const hotels = await this.fetchHotels(apiKey, query);
      results.push(...hotels);
    } catch (error) {
      console.error("[SerpAPI] Hotel fetch failed:", error);
    }

    try {
      const flights = await this.fetchFlights(apiKey, query);
      results.push(...flights);
    } catch (error) {
      console.error("[SerpAPI] Flight fetch failed:", error);
    }

    return results;
  }

  private async fetchHotels(apiKey: string, query: PriceQuery): Promise<FetchedProduct[]> {
    const checkIn = query.checkInDate || new Date(Date.now() + 180 * 86400000);
    const checkOut = query.checkOutDate || new Date(Date.now() + 187 * 86400000);

    const params = new URLSearchParams({
      engine: "google_hotels",
      q: `hotels in ${query.destination}`,
      check_in_date: checkIn.toISOString().split("T")[0],
      check_out_date: checkOut.toISOString().split("T")[0],
      adults: String(query.adults || 2),
      currency: query.currency || "USD",
      api_key: apiKey,
    });

    const res = await fetch(`${SERPAPI_BASE}?${params}`);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const properties = data.properties || [];
    const results: FetchedProduct[] = [];

    for (const prop of properties.slice(0, 8)) {
      const rate = prop.rate_per_night?.extracted_lowest || prop.rate_per_night?.extracted;
      const price = rate ? Math.round(parseFloat(rate.replace(/[^0-9.]/g, "")) * 100) : 0;

      results.push({
        externalId: prop.property_token || prop.name,
        name: prop.name,
        description: prop.description || undefined,
        destination: query.destination,
        imageUrl: prop.images?.[0]?.thumbnail || undefined,
        starRating: prop.overall_rating ? parseFloat(prop.overall_rating) / 2 : undefined,
        reviewScore: prop.overall_rating ? parseFloat(prop.overall_rating) : undefined,
        reviewCount: prop.reviews ? parseInt(prop.reviews.replace(/[^0-9]/g, "")) : undefined,
        amenities: prop.amenities || [],
        price: price || Math.round((100 + Math.random() * 400) * 100),
        currency: query.currency || "USD",
        productType: "HOTEL",
      });
    }

    return results;
  }

  private async fetchFlights(apiKey: string, query: PriceQuery): Promise<FetchedProduct[]> {
    const departure = query.checkInDate || new Date(Date.now() + 180 * 86400000);
    const origin = "NYC";

    const params = new URLSearchParams({
      engine: "google_flights",
      departure_id: origin,
      arrival_id: this.getAirportCode(query.destination),
      outbound_date: departure.toISOString().split("T")[0],
      type: "2",
      adults: String(query.adults || 2),
      currency: query.currency || "USD",
      api_key: apiKey,
    });

    const res = await fetch(`${SERPAPI_BASE}?${params}`);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const flights = data.best_flights || data.other_flights || [];
    const results: FetchedProduct[] = [];

    const seen = new Set<string>();
    for (const flight of flights.slice(0, 3)) {
      const priceText = flight.price;
      const price = priceText ? Math.round(parseFloat(priceText.replace(/[^0-9.]/g, "")) * 100) : 0;
      const airline = flight.flights?.[0]?.airline || "Airline";
      const travelClass = flight.flights?.[0]?.travel_class || "Economy";
      const key = `${airline}-${travelClass}-${price}`;

      if (seen.has(key)) continue;
      seen.add(key);

      results.push({
        externalId: key,
        name: `${travelClass} with ${airline}`,
        destination: query.destination,
        price: price || Math.round((300 + Math.random() * 1200) * 100),
        currency: query.currency || "USD",
        productType: "FLIGHT",
      });
    }

    return results;
  }

  private getAirportCode(destination: string): string {
    const codes: Record<string, string> = {
      "Santorini, Greece": "JTR",
      "Maldives": "MLE",
      "Kyoto, Japan": "KIX",
      "Tokyo, Japan": "NRT",
      "Amalfi Coast, Italy": "NAP",
      "Rome, Italy": "FCO",
      "Bora Bora": "BOB",
      "Paris, France": "CDG",
      "Bali, Indonesia": "DPS",
      "Lisbon, Portugal": "LIS",
      "Marrakech, Morocco": "RAK",
      "Switzerland": "ZRH",
    };
    return codes[destination] || "JFK";
  }
}
