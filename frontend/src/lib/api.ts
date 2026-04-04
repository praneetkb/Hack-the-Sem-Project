import type { Listing, Trade } from "@/types";

const API_BASE = "http://localhost:3001";

export async function getActiveListings() {
  const res = await fetch(`${API_BASE}/listings/active`, { cache: 'no-store' });
  return res.json();
}

export async function getAllListings() {
  const res = await fetch(`${API_BASE}/listings`, { cache: 'no-store' });
  return res.json();
}

export async function getMatchedListings(
  userLat: number,
  userLng: number
): Promise<Listing[]> {
  const res = await fetch(`${API_BASE}/listings/match?lat=${userLat}&lng=${userLng}`, { cache: 'no-store' });
  return res.json();
}

export async function getListing(id: string) {
  // Use GET /listings and find it since there is no /listings/:id requested
  const res = await fetch(`${API_BASE}/listings`, { cache: 'no-store' });
  const listings = await res.json();
  return listings.find((l: any) => l.id === id) ?? null;
}

export async function createListing(data: {
  kwhAvailable: number;
  pricePerKwh: number;
}): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: 'no-store'
  });
  return res.json();
}

export async function getHousehold(id: string) {
  const res = await fetch(`${API_BASE}/households/me`, { cache: 'no-store' });
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/households/me`, { cache: 'no-store' });
  return res.json();
}

export async function getMeterReadings(householdId: string) {
  const res = await fetch(`${API_BASE}/households/${householdId}/readings`, { cache: 'no-store' });
  return res.json();
}

export async function getHourlyChartData() {
  const res = await fetch(`${API_BASE}/households/h1/chart`, { cache: 'no-store' });
  return res.json();
}

export async function getTrades(householdId?: string) {
  const url = householdId ? `${API_BASE}/trades?householdId=${householdId}` : `${API_BASE}/trades`;
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}

export async function createTrade(data: {
  listingId: string;
  kwhAmount: number;
  solanaSignature?: string;
}): Promise<Trade> {
  const res = await fetch(`${API_BASE}/trades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: 'no-store'
  });
  return res.json();
}

export async function getForecast(householdId: string) {
  const res = await fetch(`${API_BASE}/forecast/${householdId}`, { cache: 'no-store' });
  return res.json();
}

export async function getUserStats() {
  const res = await fetch(`${API_BASE}/report/h1`, { cache: 'no-store' });
  return res.json();
}

export async function getPlatformStats() {
  const res = await fetch(`${API_BASE}/platform/stats`, { cache: 'no-store' });
  return res.json();
}
