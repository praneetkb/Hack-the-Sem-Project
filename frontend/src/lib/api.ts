import type { Listing, Trade } from "@/types";
import {
  households,
  currentUser,
  listings,
  activeListings,
  trades,
  forecast,
  userStats,
  platformStats,
  meterReadings,
  getHourlyData,
} from "@/lib/mock-data";
import { getDistance } from "@/lib/distance";

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

export async function getActiveListings(): Promise<Listing[]> {
  await delay();
  return activeListings;
}

export async function getAllListings(): Promise<Listing[]> {
  await delay();
  return listings;
}

export async function getMatchedListings(
  userLat: number,
  userLng: number
): Promise<Listing[]> {
  await delay();

  const distances = activeListings.map((l) => {
    const h = households.find((h) => h.id === l.householdId);
    const dist = h ? getDistance(userLat, userLng, h.location.lat, h.location.lng) : Infinity;
    return { listing: l, dist };
  });

  const maxDist = Math.max(...distances.map((d) => d.dist), 1);
  const maxPrice = Math.max(...activeListings.map((l) => l.pricePerKwh), 1);

  return distances
    .map(({ listing, dist }) => ({
      listing,
      score:
        (1 - dist / maxDist) * 0.7 +
        (1 - listing.pricePerKwh / maxPrice) * 0.3,
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ listing }) => listing);
}

export async function getListing(id: string): Promise<Listing | null> {
  await delay();
  return listings.find((l) => l.id === id) ?? null;
}

export async function createListing(data: {
  kwhAvailable: number;
  pricePerKwh: number;
}): Promise<Listing> {
  await delay();
  const newListing: Listing = {
    id: `listing-${Date.now()}`,
    householdId: currentUser.id,
    householdName: currentUser.name,
    suburb: currentUser.location.suburb,
    kwhAvailable: data.kwhAvailable,
    pricePerKwh: data.pricePerKwh,
    reliabilityScore: currentUser.reliabilityScore,
    distanceKm: 0,
    status: "active",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };
  activeListings.push(newListing);
  listings.push(newListing);
  return newListing;
}

export async function getHousehold(id: string) {
  await delay();
  return households.find((h) => h.id === id) ?? null;
}

export async function getCurrentUser() {
  await delay();
  return currentUser;
}

export async function getMeterReadings(householdId: string) {
  await delay();
  return meterReadings.filter((r) => r.householdId === householdId);
}

export async function getHourlyChartData() {
  await delay();
  return getHourlyData();
}

export async function getTrades(householdId?: string): Promise<Trade[]> {
  await delay();
  if (householdId) {
    return trades.filter(
      (t) => t.buyerId === householdId || t.sellerId === householdId
    );
  }
  return trades;
}

export async function createTrade(data: {
  listingId: string;
  kwhAmount: number;
  solanaSignature?: string;
}): Promise<Trade> {
  await delay();
  const listing = listings.find((l) => l.id === data.listingId);
  const seller = households.find((h) => h.id === listing?.householdId);
  const newTrade: Trade = {
    id: `trade-${Date.now()}`,
    listingId: data.listingId,
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    sellerId: listing?.householdId ?? "unknown",
    sellerName: seller?.name ?? "Unknown",
    kwhAmount: data.kwhAmount,
    pricePerKwh: listing?.pricePerKwh ?? 0,
    totalCost: data.kwhAmount * (listing?.pricePerKwh ?? 0),
    status: "settled",
    txHash: data.solanaSignature,
    createdAt: new Date().toISOString(),
  };
  trades.push(newTrade);
  return newTrade;
}

export async function getForecast(householdId: string) {
  await delay();
  return forecast;
}

export async function getUserStats() {
  await delay();
  return userStats;
}

export async function getPlatformStats() {
  await delay();
  return platformStats;
}
