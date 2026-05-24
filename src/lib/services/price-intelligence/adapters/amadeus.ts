import { env } from "@/lib/env";
import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

interface AmadeusToken {
  access_token: string;
  expires_in: number;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAmadeusToken(): Promise<string | null> {
  if (!env.AMADEUS_CLIENT_ID || !env.AMADEUS_CLIENT_SECRET) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token;
  }

  try {
    const res = await fetch("https://api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: env.AMADEUS_CLIENT_ID,
        client_secret: env.AMADEUS_CLIENT_SECRET,
      }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as AmadeusToken;
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return data.access_token;
  } catch {
    return null;
  }
}

export class AmadeusAdapter extends BaseAdapter {
  name = "amadeus";
  productTypes = ["FLIGHT"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    const token = await getAmadeusToken();
    if (!token) return [];

    // Amadeus flight search requires origin/destination IATA codes
    // For now, we return empty and let mock adapter fill in
    // A full implementation would map destinations to IATA codes
    return [];
  }

  async searchAirports(keyword: string): Promise<Array<{ code: string; name: string; city: string; country: string }>> {
    const token = await getAmadeusToken();
    if (!token) return [];

    try {
      const res = await fetch(
        `https://api.amadeus.com/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page[limit]=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) return [];

      const data = await res.json();
      return (data.data || [])
        .filter((loc: any) => loc.subType === "AIRPORT")
        .map((loc: any) => ({
          code: loc.iataCode,
          name: loc.name,
          city: loc.address?.cityName || "",
          country: loc.address?.countryName || "",
        }));
    } catch {
      return [];
    }
  }
}
