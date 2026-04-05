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

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { cache: "no-store", ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

export async function getActiveListings(): Promise<Listing[]> {
  try {
    return await fetchJSON<Listing[]>(`${API_BASE}/listings/active`);
  } catch {
    return activeListings;
  }
}

export async function getAllListings(): Promise<Listing[]> {
  try {
    return await fetchJSON<Listing[]>(`${API_BASE}/listings`);
  } catch {
    return listings;
  }
}

export async function getMatchedListings(
  userLat: number,
  userLng: number
): Promise<Listing[]> {
  try {
    return await fetchJSON<Listing[]>(
      `${API_BASE}/listings/match?lat=${userLat}&lng=${userLng}`
    );
  } catch {
    const distances = activeListings.map((l) => {
      const h = households.find((h) => h.id === l.householdId);
      const dist = h
        ? getDistance(userLat, userLng, h.location.lat, h.location.lng)
        : Infinity;
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
}

export async function getListing(id: string): Promise<Listing | null> {
  try {
    const all = await fetchJSON<Listing[]>(`${API_BASE}/listings`);
    return all.find((l) => l.id === id) ?? null;
  } catch {
    return listings.find((l) => l.id === id) ?? null;
  }
}

export async function createListing(data: {
  kwhAvailable: number;
  pricePerKwh: number;
}): Promise<Listing> {
  try {
    return await fetchJSON<Listing>(`${API_BASE}/listings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
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
}

// ---------------------------------------------------------------------------
// Households / Users
// ---------------------------------------------------------------------------

export async function getHousehold(id: string) {
  try {
    return await fetchJSON(`${API_BASE}/households/${id}`);
  } catch {
    return households.find((h) => h.id === id) ?? null;
  }
}

export async function getCurrentUser() {
  try {
    return await fetchJSON(`${API_BASE}/households/me`);
  } catch {
    return currentUser;
  }
}

// ---------------------------------------------------------------------------
// Meter readings / chart
// ---------------------------------------------------------------------------

export async function getMeterReadings(householdId: string) {
  try {
    return await fetchJSON(`${API_BASE}/households/${householdId}/readings`);
  } catch {
    return meterReadings.filter((r) => r.householdId === householdId);
  }
}

export async function getHourlyChartData() {
  try {
    return await fetchJSON(`${API_BASE}/households/h1/chart`);
  } catch {
    return getHourlyData();
  }
}

// ---------------------------------------------------------------------------
// Trades
// ---------------------------------------------------------------------------

export async function getTrades(householdId?: string): Promise<Trade[]> {
  try {
    const url = householdId
      ? `${API_BASE}/trades?householdId=${householdId}`
      : `${API_BASE}/trades`;
    return await fetchJSON<Trade[]>(url);
  } catch {
    if (householdId) {
      return trades.filter(
        (t) => t.buyerId === householdId || t.sellerId === householdId
      );
    }
    return trades;
  }
}

export async function createTrade(data: {
  listingId: string;
  kwhAmount: number;
  solanaSignature?: string;
}): Promise<Trade> {
  try {
    return await fetchJSON<Trade>(`${API_BASE}/trades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
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
}

// ---------------------------------------------------------------------------
// Forecast / stats
// ---------------------------------------------------------------------------

export async function getForecast(householdId: string) {
  try {
    return await fetchJSON(`${API_BASE}/forecast/${householdId}`);
  } catch {
    return forecast;
  }
}

export async function getUserStats() {
  try {
    return await fetchJSON(`${API_BASE}/report/h1`);
  } catch {
    return userStats;
  }
}

export async function getPlatformStats() {
  try {
    return await fetchJSON(`${API_BASE}/platform/stats`);
  } catch {
    return platformStats;
  }
}
