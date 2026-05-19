import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

let AmadeusClass: any = null;

async function loadAmadeus() {
  if (!AmadeusClass) {
    const mod = await import("amadeus");
    AmadeusClass = mod.default;
  }
  return AmadeusClass;
}

const CITY_CODES: Record<string, string> = {
  "Santorini, Greece": "JTR",
  "Athens, Greece": "ATH",
  "Maldives": "MLE",
  "Kyoto, Japan": "UKY",
  "Tokyo, Japan": "TYO",
  "Amalfi Coast, Italy": "NAP",
  "Rome, Italy": "ROM",
  "Bora Bora": "BOB",
  "Switzerland": "ZRH",
  "Paris, France": "PAR",
  "Bali, Indonesia": "DPS",
  "Mexico City, Mexico": "MEX",
  "Costa Rica": "SJO",
  "Lisbon, Portugal": "LIS",
  "Marrakech, Morocco": "RAK",
};

export class AmadeusAdapter extends BaseAdapter {
  name = "amadeus";
  productTypes = ["HOTEL", "FLIGHT"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.warn("[Amadeus] Missing credentials. Set AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET.");
      return [];
    }

    const Amadeus = await loadAmadeus();
    const amadeus = new Amadeus({ clientId, clientSecret });

    const cityCode = this.resolveCityCode(query.destination);
    if (!cityCode) {
      console.warn(`[Amadeus] No city code for: ${query.destination}`);
      return [];
    }

    const results: FetchedProduct[] = [];

    try {
      const hotels = await this.fetchHotels(amadeus, cityCode, query);
      results.push(...hotels);
    } catch (error) {
      console.error("[Amadeus] Hotel fetch failed:", error);
    }

    if (query.adults && query.adults >= 2) {
      try {
        const flights = await this.fetchFlights(amadeus, cityCode, query);
        results.push(...flights);
      } catch (error) {
        console.error("[Amadeus] Flight fetch failed:", error);
      }
    }

    return results;
  }

  private resolveCityCode(destination: string): string | undefined {
    return CITY_CODES[destination] || Object.entries(CITY_CODES).find(([k]) => destination.toLowerCase().includes(k.toLowerCase()))?.[1];
  }

  private async fetchHotels(amadeus: any, cityCode: string, query: PriceQuery): Promise<FetchedProduct[]> {
    const checkIn = query.checkInDate || new Date(Date.now() + 180 * 86400000);
    const checkOut = query.checkOutDate || new Date(Date.now() + 187 * 86400000);

    const response = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode,
      ratings: ["4", "5"].join(","),
    });

    const hotels = response?.data || [];
    const results: FetchedProduct[] = [];

    for (const hotel of hotels.slice(0, 5)) {
      try {
        const offerResponse = await amadeus.shopping.hotelOffersSearch.get({
          hotelIds: hotel.hotelId,
          adults: query.adults || 2,
          checkInDate: checkIn.toISOString().split("T")[0],
          checkOutDate: checkOut.toISOString().split("T")[0],
          currency: query.currency || "USD",
        });

        const offers = offerResponse?.data || [];
        if (offers.length === 0) continue;

        const bestOffer = offers[0];
        const price = bestOffer.offers?.[0]?.price;

        results.push({
          externalId: hotel.hotelId,
          name: hotel.name,
          description: hotel.description?.text || undefined,
          destination: query.destination,
          country: hotel.address?.countryCode,
          latitude: hotel.geoCode?.latitude,
          longitude: hotel.geoCode?.longitude,
          starRating: parseFloat(hotel.rating) || undefined,
          amenities: hotel.amenities || [],
          price: Math.round(parseFloat(price?.total || "0") * 100),
          currency: price?.currency || "USD",
          productType: "HOTEL",
        });
      } catch {
        continue;
      }
    }

    return results;
  }

  private async fetchFlights(amadeus: any, cityCode: string, query: PriceQuery): Promise<FetchedProduct[]> {
    const origin = "NYC";
    const departureDate = query.checkInDate || new Date(Date.now() + 180 * 86400000);
    const returnDate = query.checkOutDate || new Date(Date.now() + 187 * 86400000);

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: cityCode,
      departureDate: departureDate.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      adults: query.adults || 2,
      currencyCode: query.currency || "USD",
      max: 3,
    });

    const offers = response?.data || [];
    const results: FetchedProduct[] = [];

    const classMap: Record<string, string> = {
      ECONOMY: "Economy",
      PREMIUM_ECONOMY: "Premium Economy",
      BUSINESS: "Business Class",
      FIRST: "First Class",
    };

    for (const offer of offers) {
      const price = offer.price?.total;
      const travelClass = offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || "ECONOMY";

      results.push({
        externalId: offer.id,
        name: `${classMap[travelClass] || "Economy"} to ${query.destination}`,
        destination: query.destination,
        price: Math.round(parseFloat(price || "0") * 100),
        currency: offer.price?.currency || "USD",
        productType: "FLIGHT",
      });
    }

    return results;
  }
}
