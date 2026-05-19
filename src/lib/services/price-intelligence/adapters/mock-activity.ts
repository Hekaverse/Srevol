import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

const MOCK_ACTIVITIES: Record<string, FetchedProduct[]> = {
  "Santorini, Greece": [
    {
      externalId: "act-sant-001",
      name: "Private Sunset Catamaran Cruise with BBQ",
      description: "Sail the caldera on a luxury catamaran. Swim in hot springs, snorkel, and dine as the sun sets.",
      destination: "Santorini, Greece",
      country: "Greece",
      imageUrl: "https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&h=600&fit=crop",
      reviewScore: 4.9,
      reviewCount: 1240,
      amenities: ["Open Bar", "Gourmet BBQ", "Snorkeling Gear", "Hotel Transfer", "Small Group"],
      price: 28000,
      currency: "USD",
      productType: "ACTIVITY",
    },
    {
      externalId: "act-sant-002",
      name: "Volcanic Wine Tasting Tour",
      description: "Visit three family-owned vineyards. Taste Assyrtiko and Vinsanto where they're grown.",
      destination: "Santorini, Greece",
      country: "Greece",
      reviewScore: 4.8,
      reviewCount: 890,
      amenities: ["Private Driver", "5 Wines", "Local Cheese Pairing", "Cellar Tour"],
      price: 18500,
      currency: "USD",
      productType: "ACTIVITY",
    },
    {
      externalId: "act-sant-003",
      name: "Couples Photography Session in Oia",
      description: "Professional photographer captures your love against Santorini's iconic blue domes.",
      destination: "Santorini, Greece",
      country: "Greece",
      reviewScore: 4.9,
      reviewCount: 456,
      amenities: ["2 Hour Session", "50+ Edited Photos", "Sunset Timing", "Multiple Locations"],
      price: 45000,
      currency: "USD",
      productType: "ACTIVITY",
    },
  ],
  "Maldives": [
    {
      externalId: "act-mal-001",
      name: "Private Sandbank Dinner Under the Stars",
      description: "Your own island. Your own chef. Candlelit dinner with nothing but bioluminescent waves.",
      destination: "Maldives",
      country: "Maldives",
      reviewScore: 5.0,
      reviewCount: 234,
      amenities: ["Private Island", "Personal Chef", "Champagne", "Stargazing Setup", "Return Boat"],
      price: 65000,
      currency: "USD",
      productType: "ACTIVITY",
    },
    {
      externalId: "act-mal-002",
      name: "Manta Ray Night Snorkel",
      description: "Swim alongside gentle giants under the moonlight.",
      destination: "Maldives",
      country: "Maldives",
      reviewScore: 4.9,
      reviewCount: 567,
      amenities: ["Expert Guide", "Underwater Torch", "Wetsuit", "Hot Chocolate After"],
      price: 22000,
      currency: "USD",
      productType: "ACTIVITY",
    },
  ],
};

export class MockActivityAdapter extends BaseAdapter {
  name = "mock-activity-provider";
  productTypes = ["ACTIVITY"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    await this.delay(200 + Math.random() * 500);

    const key = Object.keys(MOCK_ACTIVITIES).find((k) =>
      query.destination.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(query.destination.toLowerCase())
    );

    if (!key) return [];

    const activities = MOCK_ACTIVITIES[key];
    return activities.map((a) => ({
      ...a,
      price: Math.round(a.price * (0.95 + Math.random() * 0.1)),
    }));
  }
}
