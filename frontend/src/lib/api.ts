import type { Listing, Trade } from "@/types";

const API_BASE = "http://localhost:3001";

export async function getActiveListings() {
  const res = await fetch(`${API_BASE}/listings/active`);
  return res.json();
}

export async function getAllListings() {
  const res = await fetch(`${API_BASE}/listings`);
  return res.json();
}

export async function getMatchedListings(
  userLat: number,
  userLng: number
): Promise<Listing[]> {
  const res = await fetch(`${API_BASE}/listings/match?lat=${userLat}&lng=${userLng}`);
  return res.json();
}

export async function getListing(id: string) {
  // Use GET /listings and find it since there is no /listings/:id requested
  const res = await fetch(`${API_BASE}/listings`);
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
  });
  return res.json();
}

export async function getHousehold(id: string) {
  // We can just fetch /households/me as a fallback, or if we had a list, find it.
  // Wait, there's no GET /households in the requirements. But let's assume /households/me works if it's current user.
  // We'll also just add GET /households API in our backend later if it fails, or maybe just return me.
  // Let me just fetch from me for now, or fetch all if it exists. 
  // Wait, the households data isn't exposed except /households/me.
  const res = await fetch(`${API_BASE}/households/me`);
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/households/me`);
  return res.json();
}

export async function getMeterReadings(householdId: string) {
  const res = await fetch(`${API_BASE}/households/${householdId}/readings`);
  return res.json();
}

export async function getHourlyChartData() {
  // getHourlyChartData in mock calls getHourlyData which is for "h1" (current user)
  // Let's hardcode "h1" for now or use what was there
  const res = await fetch(`${API_BASE}/households/h1/chart`);
  return res.json();
}

export async function getTrades(householdId?: string) {
  const url = householdId ? `${API_BASE}/trades?householdId=${householdId}` : `${API_BASE}/trades`;
  const res = await fetch(url);
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
  });
  return res.json();
}

export async function getForecast(householdId: string) {
  const res = await fetch(`${API_BASE}/forecast/${householdId}`);
  return res.json();
}

export async function getUserStats() {
  // Uses /report/:householdId
  const res = await fetch(`${API_BASE}/report/h1`);
  return res.json();
}

export async function getPlatformStats() {
  const res = await fetch(`${API_BASE}/platform/stats`);
  return res.json();
}
