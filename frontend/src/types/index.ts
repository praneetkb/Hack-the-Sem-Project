export type HouseholdRole = "prosumer" | "consumer" | "both";

export interface Household {
  id: string;
  name: string;
  email: string;
  role: HouseholdRole;
  creditBalance: number;
  location: { lat: number; lng: number; suburb: string };
  reliabilityScore: number;
  avatarUrl?: string;
}

export interface MeterReading {
  id: string;
  householdId: string;
  timestamp: string;
  generation: number; // kWh
  consumption: number; // kWh
  surplus: number; // kWh (generation - consumption)
}

export type ListingStatus = "active" | "matched" | "expired";

export interface Listing {
  id: string;
  householdId: string;
  householdName: string;
  suburb: string;
  kwhAvailable: number;
  pricePerKwh: number;
  status: ListingStatus;
  reliabilityScore: number;
  distanceKm: number;
  createdAt: string;
  expiresAt: string;
}

export type TradeStatus = "matched" | "delivered" | "settled" | "failed";

export interface Trade {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  listingId: string;
  kwhAmount: number;
  pricePerKwh: number;
  totalCost: number;
  status: TradeStatus;
  txHash?: string;
  createdAt: string;
  settledAt?: string;
}

export interface ForecastPoint {
  hour: number;
  predictedSurplus: number;
  confidence: number;
}
