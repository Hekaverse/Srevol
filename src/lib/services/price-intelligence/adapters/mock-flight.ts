import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

export class MockFlightAdapter extends BaseAdapter {
  name = "mock-flight-provider";
  productTypes = ["FLIGHT"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    await this.delay(400 + Math.random() * 600);

    // Generate realistic flight prices based on destination
    const basePrices: Record<string, number> = {
      "Santorini, Greece": 85000,
      "Greece": 85000,
      "Maldives": 120000,
      "Kyoto, Japan": 95000,
      "Japan": 95000,
      "Amalfi Coast, Italy": 78000,
      "Italy": 78000,
      "Bora Bora": 135000,
      "Switzerland": 82000,
    };

    const match = Object.entries(basePrices).find(([key]) =>
      query.destination.toLowerCase().includes(key.toLowerCase())
    );

    if (!match) return [];

    const basePrice = match[1];
    const variation = 0.9 + Math.random() * 0.3;

    return [
      {
        externalId: `flt-${Date.now()}-out`,
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
        externalId: `flt-${Date.now()}-out-prem`,
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
        externalId: `flt-${Date.now()}-out-biz`,
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
