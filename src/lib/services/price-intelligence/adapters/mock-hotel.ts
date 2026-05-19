import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

// Curated mock hotel data that feels real and romantic
const MOCK_HOTELS: Record<string, FetchedProduct[]> = {
  "Santorini, Greece": [
    {
      externalId: "sant-001",
      name: "Canaves Oia Suites",
      description: "Iconic cliffside suites with infinity pools and uninterrupted caldera views.",
      destination: "Santorini, Greece",
      country: "Greece",
      latitude: 36.4618,
      longitude: 25.3753,
      imageUrl: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&h=600&fit=crop",
      galleryUrls: [],
      starRating: 5,
      reviewScore: 9.6,
      reviewCount: 842,
      amenities: ["Infinity Pool", "Spa", "Private Terrace", "Caldera View", "Champagne Breakfast"],
      price: 185000, // $1,850/night
      currency: "USD",
      productType: "HOTEL",
    },
    {
      externalId: "sant-002",
      name: "Katikies Santorini",
      description: "Whitewashed luxury perched on the cliffs of Oia.",
      destination: "Santorini, Greece",
      country: "Greece",
      latitude: 36.4615,
      longitude: 25.3750,
      imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
      galleryUrls: [],
      starRating: 5,
      reviewScore: 9.4,
      reviewCount: 1203,
      amenities: ["Infinity Pool", "Spa", "Fine Dining", "Caldera View", "Butler Service"],
      price: 210000,
      currency: "USD",
      productType: "HOTEL",
    },
    {
      externalId: "sant-003",
      name: "Grace Hotel Santorini",
      description: "Intimate boutique hotel with stunning sunset views.",
      destination: "Santorini, Greece",
      country: "Greece",
      latitude: 36.4245,
      longitude: 25.4282,
      imageUrl: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed2a?w=800&h=600&fit=crop",
      galleryUrls: [],
      starRating: 5,
      reviewScore: 9.5,
      reviewCount: 678,
      amenities: ["Infinity Pool", "Spa", "Private Dining", "Sunset View", "Yoga"],
      price: 165000,
      currency: "USD",
      productType: "HOTEL",
    },
  ],
  "Maldives": [
    {
      externalId: "mal-001",
      name: "Soneva Jani",
      description: "Overwater villas with retractable roofs for stargazing from your bed.",
      destination: "Maldives",
      country: "Maldives",
      latitude: 5.8521,
      longitude: 73.3542,
      imageUrl: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop",
      galleryUrls: [],
      starRating: 5,
      reviewScore: 9.8,
      reviewCount: 456,
      amenities: ["Overwater Villa", "Private Pool", "Cinema Paradiso", "Observatory", "Water Slide"],
      price: 350000,
      currency: "USD",
      productType: "HOTEL",
    },
    {
      externalId: "mal-002",
      name: "Four Seasons Landaa Giraavaru",
      description: "Pristine coral reef sanctuary with award-winning spa.",
      destination: "Maldives",
      country: "Maldives",
      latitude: 5.2784,
      longitude: 73.1234,
      imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&h=600&fit=crop",
      galleryUrls: [],
      starRating: 5,
      reviewScore: 9.6,
      reviewCount: 892,
      amenities: ["Overwater Villa", "Marine Discovery Centre", "Ayurvedic Spa", "Sunset Cruise", "Private Island"],
      price: 280000,
      currency: "USD",
      productType: "HOTEL",
    },
  ],
  "Kyoto, Japan": [
    {
      externalId: "kyo-001",
      name: "Hoshinoya Kyoto",
      description: "Riverboat arrival to a secluded ryokan in the Arashiyama bamboo groves.",
      destination: "Kyoto, Japan",
      country: "Japan",
      latitude: 35.0116,
      longitude: 135.7681,
      imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop",
      galleryUrls: [],
      starRating: 5,
      reviewScore: 9.7,
      reviewCount: 334,
      amenities: ["Riverboat Arrival", "Kaiseki Dining", "Tea Ceremony", "Bamboo Grove View", "Onsen"],
      price: 120000,
      currency: "USD",
      productType: "HOTEL",
    },
  ],
  "Amalfi Coast, Italy": [
    {
      externalId: "ama-001",
      name: "Monastero Santa Rosa",
      description: "17th-century monastery turned cliffside sanctuary with legendary gardens.",
      destination: "Amalfi Coast, Italy",
      country: "Italy",
      latitude: 40.6340,
      longitude: 14.6027,
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop",
      galleryUrls: [],
      starRating: 5,
      reviewScore: 9.5,
      reviewCount: 567,
      amenities: ["Infinity Pool", "Herb Garden", "Cliffside Spa", "Private Beach Access", "Cooking School"],
      price: 145000,
      currency: "USD",
      productType: "HOTEL",
    },
  ],
};

export class MockHotelAdapter extends BaseAdapter {
  name = "mock-hotel-provider";
  productTypes = ["HOTEL"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    await this.delay(300 + Math.random() * 700); // Simulate API latency

    const key = Object.keys(MOCK_HOTELS).find((k) =>
      query.destination.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(query.destination.toLowerCase())
    );

    if (!key) return [];

    const hotels = MOCK_HOTELS[key];

    // Add realistic price variation based on date
    const variation = this.getSeasonalMultiplier(query.checkInDate);

    return hotels.map((h) => ({
      ...h,
      price: Math.round(h.price * variation * (0.95 + Math.random() * 0.1)),
    }));
  }

  private getSeasonalMultiplier(date?: Date): number {
    if (!date) return 1;
    const month = date.getMonth();
    // Summer (Jun-Aug) and Dec holidays = peak
    if ([5, 6, 7, 11].includes(month)) return 1.3;
    // Shoulder season
    if ([4, 8, 9, 10].includes(month)) return 1.1;
    // Low season
    return 0.85;
  }
}
