import {
  listings,
  activeListings,
  trades,
  households,
  meterReadings,
  forecast,
  currentUser,
  getHourlyData,
  userStats,
  platformStats,
} from "./mock-data";
import { getDistance } from "./distance";
import type { Listing, Trade } from "@/types";

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getActiveListings() {
  await delay();
  return activeListings;
}

export async function getAllListings() {
  await delay();
  return listings;
}

// ── Matching engine (ported from backend/src/services/matchingService.js) ──

const WEIGHTS = { proximity: 0.7, price: 0.3 };

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 1;
  return (value - min) / (max - min);
}

export async function getMatchedListings(
  userLat: number,
  userLng: number
): Promise<Listing[]> {
  await delay();

  // Enrich each active listing with real distance from user's location
  const enriched = activeListings.map((listing) => {
    const household = households.find((h) => h.id === listing.householdId);
    const distance = household
      ? getDistance(userLat, userLng, household.location.lat, household.location.lng)
      : 999;
    return { ...listing, distanceKm: Math.round(distance * 10) / 10 };
  });

  // Normalize for scoring
  const distances = enriched.map((l) => l.distanceKm);
  const prices = enriched.map((l) => l.pricePerKwh);

  const minDist = Math.min(...distances);
  const maxDist = Math.max(...distances);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Score and sort (best match first)
  return enriched
    .map((listing) => {
      const distScore = 1 - normalize(listing.distanceKm, minDist, maxDist);
      const priceScore = 1 - normalize(listing.pricePerKwh, minPrice, maxPrice);
      const score = distScore * WEIGHTS.proximity + priceScore * WEIGHTS.price;
      return { listing, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ listing }) => listing);
}

export async function getListing(id: string) {
  await delay();
  return listings.find((l) => l.id === id) ?? null;
}

export async function createListing(data: {
  kwhAvailable: number;
  pricePerKwh: number;
}): Promise<Listing> {
  await delay(500);
  const newListing: Listing = {
    id: `l${Date.now()}`,
    householdId: currentUser.id,
    householdName: currentUser.name,
    suburb: currentUser.location.suburb,
    kwhAvailable: data.kwhAvailable,
    pricePerKwh: data.pricePerKwh,
    status: "active",
    reliabilityScore: currentUser.reliabilityScore,
    distanceKm: 0,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
  return newListing;
}

export async function getHousehold(id: string) {
  await delay();
  return households.find((h) => h.id === id) ?? null;
}

export async function getCurrentUser() {
  await delay(100);
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

export async function getTrades(householdId?: string) {
  await delay();
  if (!householdId) return trades;
  return trades.filter(
    (t) => t.buyerId === householdId || t.sellerId === householdId
  );
}

export async function createTrade(data: {
  listingId: string;
  kwhAmount: number;
}): Promise<Trade> {
  await delay(800);
  const listing = listings.find((l) => l.id === data.listingId);
  if (!listing) throw new Error("Listing not found");

  const newTrade: Trade = {
    id: `t${Date.now()}`,
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    sellerId: listing.householdId,
    sellerName: listing.householdName,
    listingId: data.listingId,
    kwhAmount: data.kwhAmount,
    pricePerKwh: listing.pricePerKwh,
    totalCost:
      Math.round(data.kwhAmount * listing.pricePerKwh * 100) / 100,
    status: "matched",
    createdAt: new Date().toISOString(),
  };
  return newTrade;
}

export async function getForecast(householdId: string) {
  await delay();
  void householdId;
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
