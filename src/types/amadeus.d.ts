declare module "amadeus" {
  interface AmadeusClient {
    referenceData: {
      locations: {
        hotels: {
          byCity: {
            get(params: Record<string, unknown>): Promise<{ data: any[] }>;
          };
        };
      };
    };
    shopping: {
      hotelOffersSearch: {
        get(params: Record<string, unknown>): Promise<{ data: any[] }>;
      };
      flightOffersSearch: {
        get(params: Record<string, unknown>): Promise<{ data: any[] }>;
      };
    };
  }

  class Amadeus {
    constructor(config: { clientId: string; clientSecret: string });
    referenceData: AmadeusClient["referenceData"];
    shopping: AmadeusClient["shopping"];
  }

  export default Amadeus;
}
