import type {
  Household,
  MeterReading,
  Listing,
  Trade,
  ForecastPoint,
} from "@/types";

// ------------------------------- HOUSEHOLDS ------------------------------------------

export const households: Household[] = [
  {
    id: "h1",
    name: "The Nguyen Family",
    email: "nguyen@example.com",
    role: "prosumer",
    creditBalance: 42.5,
    location: { lat: -33.8688, lng: 151.2093, suburb: "Surry Hills" },
    reliabilityScore: 0.97,
  },
  {
    // using this household as the buyer for the demo
    id: "h2",
    name: "Smith Residence",
    email: "smith@example.com",
    role: "prosumer",
    creditBalance: 15.0,
    walletAddress: "7sp7yC4W2xwz2hzJF6YtGaHpizwejbRby7q79hJCqpST", 
    location: { lat: -33.8712, lng: 151.2127, suburb: "Darlinghurst" },
    reliabilityScore: 0.97,
    energyPurchased: 0, 
  },
  {
    id: "h3",
    name: "O'Brien Household",
    email: "obrien@example.com",
    role: "prosumer",
    creditBalance: 68.3,
    location: { lat: -33.8651, lng: 151.2099, suburb: "Woolloomooloo" },
    reliabilityScore: 0.94,
  },
  {
    // using this household as the seller for the demo
    id: "h4",
    name: "Patel Family",
    email: "patel@example.com",
    role: "prosumer",
    creditBalance: 31.2,
    walletAddress: "9P643o3WMV5j1jJVa8bx9ypmJtA7B33Mj8g79iuW7HVa", 
    location: { lat: -33.8775, lng: 151.2157, suburb: "Paddington" },
    reliabilityScore: 0.91,
  },
  {
    id: "h5",
    name: "Chen Residence",
    email: "chen@example.com",
    role: "prosumer",
    creditBalance: 55.8,
    location: { lat: -33.8561, lng: 151.2153, suburb: "Potts Point" },
    reliabilityScore: 0.98,
  },
  {
    id: "h6",
    name: "Williams Home",
    email: "williams@example.com",
    role: "consumer",
    creditBalance: 8.4,
    location: { lat: -33.8836, lng: 151.2108, suburb: "Redfern" },
    reliabilityScore: 1.0,
  },
  {
    id: "h7",
    name: "Kumar Household",
    email: "kumar@example.com",
    role: "prosumer",
    creditBalance: 73.1,
    location: { lat: -33.8616, lng: 151.2048, suburb: "Chippendale" },
    reliabilityScore: 0.96,
  },
  {
    id: "h8",
    name: "Garcia Family",
    email: "garcia@example.com",
    role: "prosumer",
    creditBalance: 22.7,
    location: { lat: -33.8745, lng: 151.2052, suburb: "Newtown" },
    reliabilityScore: 0.89,
  },
  {
    id: "h9",
    name: "Thompson Residence",
    email: "thompson@example.com",
    role: "prosumer",
    creditBalance: 61.4,
    location: { lat: -33.8523, lng: 151.2108, suburb: "Elizabeth Bay" },
    reliabilityScore: 0.99,
  },
  {
    id: "h10",
    name: "Lee Household",
    email: "lee@example.com",
    role: "consumer",
    creditBalance: 5.9,
    location: { lat: -33.886, lng: 151.198, suburb: "Erskineville" },
    reliabilityScore: 1.0,
  },
];

// The "current user" for the dashboard
export const currentUser = households[1];

// ------------------------- METER READINGS (24hrs for current user, bell curve generation) --------------------

function generateMeterReadings(householdId: string): MeterReading[] {
  const readings: MeterReading[] = [];
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  for (let i = 0; i < 96; i++) {
    // every 15 min
    const timestamp = new Date(startOfDay.getTime() + i * 15 * 60 * 1000);
    const hour = timestamp.getHours() + timestamp.getMinutes() / 60;

    // Solar generation: bell curve peaking at noon
    const peakGen = 4.2; // kW peak
    const generation =
      hour >= 5 && hour <= 19
        ? peakGen *
          Math.exp(-0.5 * Math.pow((hour - 12) / 2.5, 2)) *
          (0.9 + Math.random() * 0.2)
        : 0;

    // Consumption: morning + evening spikes
    const baseConsumption = 0.5;
    const morningSpike =
      hour >= 6 && hour <= 9
        ? 1.5 * Math.exp(-0.5 * Math.pow((hour - 7.5) / 1, 2))
        : 0;
    const eveningSpike =
      hour >= 17 && hour <= 22
        ? 2.0 * Math.exp(-0.5 * Math.pow((hour - 19) / 1.5, 2))
        : 0;
    const consumption =
      (baseConsumption + morningSpike + eveningSpike) *
      (0.85 + Math.random() * 0.3);

    const genKwh = Math.round(generation * 0.25 * 1000) / 1000; // 15-min interval
    const conKwh = Math.round(consumption * 0.25 * 1000) / 1000;

    readings.push({
      id: `mr-${householdId}-${i}`,
      householdId,
      timestamp: timestamp.toISOString(),
      generation: genKwh,
      consumption: conKwh,
      surplus: Math.round((genKwh - conKwh) * 1000) / 1000,
    });
  }
  return readings;
}

export const meterReadings = generateMeterReadings("h2"); // 24 hours of data for the current user (Smith Residence)

// calculate totals for the dashboard stats (helper function)
export function getEnergyTotals() {
  const totalGen = meterReadings.reduce((sum, r) => sum + r.generation, 0);
  const totalCon = meterReadings.reduce((sum, r) => sum + r.consumption, 0);
  const totalSur = meterReadings.reduce((sum, r) => sum + r.surplus, 0);

  return {
    generation: Math.round(totalGen * 100) / 100,
    consumption: Math.round(totalCon * 100) / 100,
    surplus: Math.round(totalSur * 100) / 100,
  };
}

// Hourly aggregated data for charts
export function getHourlyData() {
  const hourly: {
    hour: number;
    generation: number;
    consumption: number;
    surplus: number;
  }[] = [];
  for (let h = 0; h < 24; h++) {
    const hourReadings = meterReadings.filter((r) => {
      const rHour = new Date(r.timestamp).getHours();
      return rHour === h;
    });
    const gen = hourReadings.reduce((sum, r) => sum + r.generation, 0);
    const con = hourReadings.reduce((sum, r) => sum + r.consumption, 0);
    hourly.push({
      hour: h,
      generation: Math.round(gen * 100) / 100,
      consumption: Math.round(con * 100) / 100,
      surplus: Math.round((gen - con) * 100) / 100,
    });
  }
  return hourly;
}

// ----------------------------- LISTINGS ----------------------------------------

export const listings: Listing[] = [
  {
    id: "l1",
    householdId: "h3",
    householdName: "O'Brien Household",
    suburb: "Woolloomooloo",
    kwhAvailable: 5.2,
    pricePerKwh: 0.18,
    status: "active",
    reliabilityScore: 0.94,
    distanceKm: 0.4,
    createdAt: "2026-03-20T10:30:00Z",
    expiresAt: "2026-03-20T11:00:00Z",
  },
  {
    id: "l2",
    householdId: "h5",
    householdName: "Chen Residence",
    suburb: "Potts Point",
    kwhAvailable: 8.1,
    pricePerKwh: 0.15,
    status: "active",
    reliabilityScore: 0.98,
    distanceKm: 1.2,
    createdAt: "2026-03-20T10:15:00Z",
    expiresAt: "2026-03-20T10:45:00Z",
  },
  {
    id: "l3",
    householdId: "h7",
    householdName: "Kumar Household",
    suburb: "Chippendale",
    kwhAvailable: 3.4,
    pricePerKwh: 0.2,
    status: "active",
    reliabilityScore: 0.96,
    distanceKm: 0.8,
    createdAt: "2026-03-20T10:45:00Z",
    expiresAt: "2026-03-20T11:15:00Z",
  },
  {
    id: "l4",
    householdId: "h9",
    householdName: "Thompson Residence",
    suburb: "Elizabeth Bay",
    kwhAvailable: 11.3,
    pricePerKwh: 0.14,
    status: "active",
    reliabilityScore: 0.99,
    distanceKm: 1.8,
    createdAt: "2026-03-20T09:45:00Z",
    expiresAt: "2026-03-20T10:15:00Z",
  },
  {
    id: "l5",
    householdId: "h1",
    householdName: "The Nguyen Family",
    suburb: "Surry Hills",
    kwhAvailable: 4.7,
    pricePerKwh: 0.17,
    status: "active",
    reliabilityScore: 0.97,
    distanceKm: 0.0,
    createdAt: "2026-03-20T11:00:00Z",
    expiresAt: "2026-03-20T11:30:00Z",
  },
  {
    id: "l6",
    householdId: "h4",
    householdName: "Patel Family",
    suburb: "Paddington",
    kwhAvailable: 2.9,
    pricePerKwh: 0.22,
    status: "active",
    reliabilityScore: 0.91,
    distanceKm: 1.1,
    createdAt: "2026-03-20T10:00:00Z",
    expiresAt: "2026-03-20T10:30:00Z",
  },
  {
    id: "l7",
    householdId: "h3",
    householdName: "O'Brien Household",
    suburb: "Woolloomooloo",
    kwhAvailable: 6.8,
    pricePerKwh: 0.16,
    status: "matched",
    reliabilityScore: 0.94,
    distanceKm: 0.4,
    createdAt: "2026-03-20T09:00:00Z",
    expiresAt: "2026-03-20T09:30:00Z",
  },
  {
    id: "l8",
    householdId: "h5",
    householdName: "Chen Residence",
    suburb: "Potts Point",
    kwhAvailable: 3.1,
    pricePerKwh: 0.19,
    status: "active",
    reliabilityScore: 0.98,
    distanceKm: 1.2,
    createdAt: "2026-03-20T11:15:00Z",
    expiresAt: "2026-03-20T11:45:00Z",
  },
  {
    id: "l9",
    householdId: "h8",
    householdName: "Garcia Family",
    suburb: "Newtown",
    kwhAvailable: 7.5,
    pricePerKwh: 0.13,
    status: "active",
    reliabilityScore: 0.89,
    distanceKm: 2.1,
    createdAt: "2026-03-20T10:30:00Z",
    expiresAt: "2026-03-20T11:00:00Z",
  },
  {
    id: "l10",
    householdId: "h7",
    householdName: "Kumar Household",
    suburb: "Chippendale",
    kwhAvailable: 9.2,
    pricePerKwh: 0.15,
    status: "expired",
    reliabilityScore: 0.96,
    distanceKm: 0.8,
    createdAt: "2026-03-20T08:00:00Z",
    expiresAt: "2026-03-20T08:30:00Z",
  },
  {
    id: "l11",
    householdId: "h9",
    householdName: "Thompson Residence",
    suburb: "Elizabeth Bay",
    kwhAvailable: 4.3,
    pricePerKwh: 0.21,
    status: "active",
    reliabilityScore: 0.99,
    distanceKm: 1.8,
    createdAt: "2026-03-20T11:30:00Z",
    expiresAt: "2026-03-20T12:00:00Z",
  },
  {
    id: "l12",
    householdId: "h4",
    householdName: "Patel Family",
    suburb: "Paddington",
    kwhAvailable: 1.8,
    pricePerKwh: 0.24,
    status: "active",
    reliabilityScore: 0.91,
    distanceKm: 1.1,
    createdAt: "2026-03-20T11:00:00Z",
    expiresAt: "2026-03-20T11:30:00Z",
  },
];

export const activeListings = listings.filter((l) => l.status === "active");

// --------------------------- TRADES ------------------------------------------

export const trades: Trade[] = [
  {
    id: "t1",
    buyerId: "h2",
    buyerName: "Smith Residence",
    sellerId: "h1",
    sellerName: "The Nguyen Family",
    listingId: "l5",
    kwhAmount: 3.0,
    pricePerKwh: 0.17,
    totalCost: 0.51,
    status: "settled",
    txHash: "5yBv...x9Kp",
    createdAt: "2026-03-19T14:22:00Z",
    settledAt: "2026-03-19T14:37:00Z",
  },
  {
    id: "t2",
    buyerId: "h6",
    buyerName: "Williams Home",
    sellerId: "h3",
    sellerName: "O'Brien Household",
    listingId: "l7",
    kwhAmount: 6.8,
    pricePerKwh: 0.16,
    totalCost: 1.09,
    status: "delivered",
    createdAt: "2026-03-20T09:15:00Z",
  },
  {
    id: "t3",
    buyerId: "h10",
    buyerName: "Lee Household",
    sellerId: "h5",
    sellerName: "Chen Residence",
    listingId: "l2",
    kwhAmount: 4.0,
    pricePerKwh: 0.15,
    totalCost: 0.6,
    status: "matched",
    createdAt: "2026-03-20T10:30:00Z",
  },
  {
    id: "t4",
    buyerId: "h2",
    buyerName: "Smith Residence",
    sellerId: "h7",
    sellerName: "Kumar Household",
    listingId: "l3",
    kwhAmount: 2.5,
    pricePerKwh: 0.2,
    totalCost: 0.5,
    status: "settled",
    txHash: "3mRq...w7Jn",
    createdAt: "2026-03-19T11:05:00Z",
    settledAt: "2026-03-19T11:20:00Z",
  },
  {
    id: "t5",
    buyerId: "h4",
    buyerName: "Patel Family",
    sellerId: "h9",
    sellerName: "Thompson Residence",
    listingId: "l4",
    kwhAmount: 5.0,
    pricePerKwh: 0.14,
    totalCost: 0.7,
    status: "settled",
    txHash: "8kLe...p2Xz",
    createdAt: "2026-03-18T15:40:00Z",
    settledAt: "2026-03-18T15:55:00Z",
  },
  {
    id: "t6",
    buyerId: "h6",
    buyerName: "Williams Home",
    sellerId: "h1",
    sellerName: "The Nguyen Family",
    listingId: "l5",
    kwhAmount: 1.7,
    pricePerKwh: 0.17,
    totalCost: 0.29,
    status: "failed",
    createdAt: "2026-03-18T12:10:00Z",
  },
  {
    id: "t7",
    buyerId: "h10",
    buyerName: "Lee Household",
    sellerId: "h9",
    sellerName: "Thompson Residence",
    listingId: "l11",
    kwhAmount: 4.3,
    pricePerKwh: 0.21,
    totalCost: 0.9,
    status: "matched",
    createdAt: "2026-03-20T11:35:00Z",
  },
  {
    id: "t8",
    buyerId: "h8",
    buyerName: "Garcia Family",
    sellerId: "h5",
    sellerName: "Chen Residence",
    listingId: "l8",
    kwhAmount: 3.1,
    pricePerKwh: 0.19,
    totalCost: 0.59,
    status: "delivered",
    createdAt: "2026-03-20T11:20:00Z",
  },
];

// -------------------------------- FORECAST -------------------------------------------

export const forecast: ForecastPoint[] = Array.from({ length: 24 }, (_, h) => {
  const peakSurplus = 3.8;
  const predictedSurplus =
    h >= 5 && h <= 19
      ? peakSurplus *
          Math.exp(-0.5 * Math.pow((h - 12) / 2.5, 2)) -
        0.5
      : -0.5;
  return {
    hour: h,
    predictedSurplus: Math.round(Math.max(0, predictedSurplus) * 100) / 100,
    confidence: 0.7 + Math.random() * 0.25,
  };
});

// -------------------------- AGGREGATE STATS ----------------------------------

export const platformStats = {
  totalKwhTraded: 1247.6,
  activeHouseholds: 10,
  co2SavedKg: Math.round(1247.6 * 0.42),
  activeListingsCount: activeListings.length,
  avgPricePerKwh: 0.17,
  gridPricePerKwh: 0.32,
};

// Stats for current user's dashboard
export const userStats = {
  totalKwhSold: 34.2,
  totalKwhBought: 12.8,
  creditBalance: currentUser.creditBalance,
  carbonOffsetKg: Math.round(34.2 * 0.42),
};
