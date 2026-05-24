import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

const BASE_PRICES: Record<string, number> = {
  "Santorini, Greece": 85000,
  "Greece": 85000,
  "Maldives": 120000,
  "Kyoto, Japan": 95000,
  "Japan": 95000,
  "Amalfi Coast, Italy": 78000,
  "Italy": 78000,
  "Bora Bora": 135000,
  "Switzerland": 82000,
  "Bali, Indonesia": 65000,
  "Indonesia": 65000,
  "Tulum, Mexico": 45000,
  "Mexico": 45000,
  "Costa Rica": 55000,
  "Algarve, Portugal": 50000,
  "Portugal": 50000,
  "Marrakech, Morocco": 52000,
  "Morocco": 52000,
  "Seychelles": 110000,
  "Patagonia, Argentina": 105000,
  "Argentina": 105000,
  "Kenya": 90000,
  "Tromsø, Norway": 70000,
  "Norway": 70000,
  "Paris, France": 55000,
  "France": 55000,
  "Dubai, UAE": 75000,
  "UAE": 75000,
  "Zermatt, Switzerland": 82000,
  "Caribbean": 80000,
  "Antarctica": 180000,
  "Multi-Destination": 150000,
};

export class MockFlightAdapter extends BaseAdapter {
  name = "mock-flight-provider";
  productTypes = ["FLIGHT"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    await this.delay(400 + Math.random() * 600);

    const match = Object.entries(BASE_PRICES).find(([key]) =>
      query.destination.toLowerCase().includes(key.toLowerCase())
    );

    if (!match) return [];

    const basePrice = match[1];
    const variation = 0.9 + Math.random() * 0.3;

    return [
      {
        externalId: `flt-${Date.now()}-eco`,
        name: `Economy to ${query.destination}`,
        description: "Round-trip economy with 23kg baggage allowance.",
        destination: query.destination,
        reviewScore: 4.2,
        reviewCount: 15000,
        price: Math.round(basePrice * variation * 0.7),
        currency: "USD",
        productType: "FLIGHT",
      },
      {
        externalId: `flt-${Date.now()}-pe`,
        name: `Premium Economy to ${query.destination}`,
        description: "Extra legroom, priority boarding, enhanced meal service.",
        destination: query.destination,
        reviewScore: 4.5,
        reviewCount: 8200,
        price: Math.round(basePrice * variation * 1.0),
        currency: "USD",
        productType: "FLIGHT",
      },
      {
        externalId: `flt-${Date.now()}-biz`,
        name: `Business Class to ${query.destination}`,
        description: "Lie-flat seats, lounge access, fine dining at 35,000 feet.",
        destination: query.destination,
        reviewScore: 4.8,
        reviewCount: 3400,
        price: Math.round(basePrice * variation * 2.5),
        currency: "USD",
        productType: "FLIGHT",
      },
    ];
  }
}
