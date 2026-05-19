import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

const RAPIDAPI_BASE = "https://booking-com15.p.rapidapi.com/api/v1";

// Map destinations to Booking.com dest_ids
const DEST_IDS: Record<string, string> = {
  "Santorini, Greece": "-813831",
  "Athens, Greece": "-814876",
  "Maldives": "-1013311",
  "Kyoto, Japan": "-1013195",
  "Tokyo, Japan": "-1013193",
  "Amalfi Coast, Italy": "-1013320",
  "Rome, Italy": "-1013319",
  "Bora Bora": "-1013312",
  "Paris, France": "-1013321",
  "Bali, Indonesia": "-1013313",
  "Lisbon, Portugal": "-1013322",
  "Marrakech, Morocco": "-1013323",
};

export class RapidApiBookingAdapter extends BaseAdapter {
  name = "rapidapi-booking";
  productTypes = ["HOTEL"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST;

    if (!apiKey || !apiHost) {
      console.warn("[RapidAPI] Missing credentials. Set RAPIDAPI_KEY and RAPIDAPI_HOST.");
      return [];
    }

    const destId = this.resolveDestId(query.destination);
    if (!destId) {
      console.warn(`[RapidAPI] No dest_id for: ${query.destination}`);
      return [];
    }

    try {
      const checkIn = query.checkInDate || new Date(Date.now() + 180 * 86400000);
      const checkOut = query.checkOutDate || new Date(Date.now() + 187 * 86400000);

      // Step 1: Search hotels
      const searchUrl = `${RAPIDAPI_BASE}/hotels/searchHotels?` + new URLSearchParams({
        dest_id: destId,
        search_type: "CITY",
        arrival_date: checkIn.toISOString().split("T")[0],
        departure_date: checkOut.toISOString().split("T")[0],
        adults: String(query.adults || 2),
        room_qty: "1",
        page_number: "1",
        currency_code: query.currency || "USD",
      });

      const searchRes = await fetch(searchUrl, {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": apiHost,
        },
      });

      if (!searchRes.ok) {
        throw new Error(`RapidAPI error: ${searchRes.status} ${searchRes.statusText}`);
      }

      const searchData = await searchRes.json();
      const hotels = searchData.data?.result || [];

      // Step 2: Fetch details for top hotels
      const results: FetchedProduct[] = [];

      for (const hotel of hotels.slice(0, 5)) {
        try {
          const hotelId = hotel.hotel_id;
          if (!hotelId) continue;

          // Fetch hotel details
          const detailUrl = `${RAPIDAPI_BASE}/hotels/getHotelDetails?` + new URLSearchParams({
            hotel_id: String(hotelId),
            arrival_date: checkIn.toISOString().split("T")[0],
            departure_date: checkOut.toISOString().split("T")[0],
            adults: String(query.adults || 2),
            room_qty: "1",
            currency_code: query.currency || "USD",
          });

          const detailRes = await fetch(detailUrl, {
            method: "GET",
            headers: {
              "x-rapidapi-key": apiKey,
              "x-rapidapi-host": apiHost,
            },
          });

          if (!detailRes.ok) continue;

          const detailData = await detailRes.json();
          const hotelData = detailData.data;

          if (!hotelData) continue;

          // Extract price
          const priceText = hotelData.product_price_breakdown?.gross_amount?.value
            || hotelData.min_rate?.extracted_value
            || "0";
          const price = Math.round(parseFloat(priceText) * 100);

          results.push({
            externalId: String(hotelId),
            name: hotelData.hotel_name || hotelData.name || "Unknown Hotel",
            description: hotelData.description || undefined,
            destination: query.destination,
            country: hotelData.country_trans || hotelData.countrycode,
            latitude: hotelData.latitude,
            longitude: hotelData.longitude,
            imageUrl: hotelData.max_1440_photo_url || hotelData.main_photo_url || undefined,
            starRating: parseFloat(hotelData.class) || undefined,
            reviewScore: hotelData.review_score ? parseFloat(hotelData.review_score) / 2 : undefined,
            reviewCount: hotelData.review_nr || undefined,
            amenities: hotelData.facilities_block?.facilities?.map((f: any) => f.name) || [],
            price,
            currency: query.currency || "USD",
            productType: "HOTEL",
          });
        } catch {
          continue;
        }
      }

      return results;
    } catch (error) {
      console.error("[RapidAPI] Fetch failed:", error);
      return [];
    }
  }

  private resolveDestId(destination: string): string | undefined {
    return DEST_IDS[destination] || Object.entries(DEST_IDS).find(([k]) => destination.toLowerCase().includes(k.toLowerCase()))?.[1];
  }
}
