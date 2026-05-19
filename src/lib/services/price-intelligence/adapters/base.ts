export interface PriceQuery {
  destination: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  adults?: number;
  children?: number;
  currency?: string;
}

export interface FetchedProduct {
  externalId: string;
  name: string;
  description?: string;
  destination: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  galleryUrls?: string[];
  starRating?: number;
  reviewScore?: number;
  reviewCount?: number;
  amenities?: string[];
  price: number; // in cents
  currency: string;
  productType: "HOTEL" | "FLIGHT" | "ACTIVITY" | "CRUISE" | "TRANSFER";
}

export interface PriceAdapter {
  name: string;
  productTypes: readonly ("HOTEL" | "FLIGHT" | "ACTIVITY" | "CRUISE" | "TRANSFER")[];
  fetchPrices(query: PriceQuery): Promise<FetchedProduct[]>;
}

export abstract class BaseAdapter implements PriceAdapter {
  abstract name: string;
  abstract readonly productTypes: readonly ("HOTEL" | "FLIGHT" | "ACTIVITY" | "CRUISE" | "TRANSFER")[];
  abstract fetchPrices(query: PriceQuery): Promise<FetchedProduct[]>;

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
