import { BaseAdapter, PriceQuery, FetchedProduct } from "./base";

const VIATOR_API_BASE = "https://api.viator.com/partner/v1";

export class ViatorAdapter extends BaseAdapter {
  name = "viator";
  productTypes = ["ACTIVITY"] as const;

  async fetchPrices(query: PriceQuery): Promise<FetchedProduct[]> {
    const apiKey = process.env.VIATOR_API_KEY;
    if (!apiKey) {
      console.warn("[Viator] No API key found. Set VIATOR_API_KEY in .env.local");
      return [];
    }

    // For now, return empty. Wire up the real fetch when you have a key.
    // Real implementation would POST to VIATOR_API_BASE + /products/search
    // with destination ID, couples/romantic tags, and parse the response.
    return [];
  }
}
