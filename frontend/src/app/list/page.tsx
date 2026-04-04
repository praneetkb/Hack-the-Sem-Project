"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  Zap,
  Sun,
  Plug,
  TrendingUp,
  Users,
  CheckCircle2,
} from "lucide-react";
import {
  getMeterReadings,
  getAllListings,
  getCurrentUser,
  getPlatformStats,
  createListing
} from "@/lib/api";
import type { Listing } from "@/types";

export default function ListSurplusPage() {
  const [user, setUser] = useState<any>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [kwhToList, setKwhToList] = useState(0);
  const [pricePerKwh, setPricePerKwh] = useState(0.17);
  const [submitted, setSubmitted] = useState(false);

  const fetchData = async () => {
    try {
      const [u, l, s] = await Promise.all([
        getCurrentUser(),
        getAllListings(),
        getPlatformStats()
      ]);

      setUser(u);
      setStats(s);
      setPricePerKwh(s.avgPricePerKwh || 0.17);

      // Filter for user's active listings
      setActiveListings(l.filter((item: Listing) =>
        item.householdId === u.id && item.status === "active"
      ));

      const r = await getMeterReadings(u.id);
      setReadings(r);

      // Calculate surplus and set initial kwhToList
      const recentReadings = r.slice(-4);
      const surplus = recentReadings.reduce((sum: number, r: any) => sum + Math.max(0, r.surplus), 0);
      setKwhToList(Math.round(surplus * 10) / 10);

      setLoading(false);
    } catch (err) {
      console.error("Failed to load list page data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const latestReading = readings.length > 0 ? readings[readings.length - 1] : { generation: 0, consumption: 0, surplus: 0 };

  const currentSurplus = useMemo(() => {
    const recentReadings = readings.slice(-4);
    return recentReadings.reduce((sum, r) => sum + Math.max(0, r.surplus), 0);
  }, [readings]);

  const handleSubmit = async () => {
    try {
      await createListing({ kwhAvailable: kwhToList, pricePerKwh });
      setSubmitted(true);
      fetchData(); // Refresh list
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Failed to list energy:", err);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
        <p className="body-md text-on-surface-variant">Loading energy data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="headline-lg text-on-surface mb-2">List Surplus Energy</h1>
      <p className="body-lg text-on-surface-variant mb-8">
        Sell your excess solar energy to nearby households.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Energy Status */}
          <div className="bg-surface-lowest rounded-xl p-6 shadow-soft">
            <h2 className="headline-sm text-on-surface mb-4">
              Current Energy Status
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Sun className="h-4 w-4 text-tertiary" />
                  <span className="label-md text-on-surface-variant">
                    Generating
                  </span>
                </div>
                <p className="font-display text-2xl font-bold text-on-surface">
                  {latestReading.generation.toFixed(2)}
                </p>
                <p className="label-md text-on-surface-variant">kWh</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Plug className="h-4 w-4 text-secondary" />
                  <span className="label-md text-on-surface-variant">
                    Consuming
                  </span>
                </div>
                <p className="font-display text-2xl font-bold text-on-surface">
                  {latestReading.consumption.toFixed(2)}
                </p>
                <p className="label-md text-on-surface-variant">kWh</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="label-md text-on-surface-variant">
                    Surplus
                  </span>
                </div>
                <p className="font-display text-2xl font-bold text-primary">
                  {currentSurplus.toFixed(2)}
                </p>
                <p className="label-md text-on-surface-variant">kWh</p>
              </div>
            </div>
          </div>

          {/* Create Listing Form */}
          <div className="bg-surface-lowest rounded-xl p-6 shadow-soft">
            <h2 className="headline-sm text-on-surface mb-6">
              Create Listing
            </h2>

            {/* kWh to list */}
            <div className="mb-6">
              <label className="label-md text-on-surface-variant mb-2 block">
                Energy to List (kWh)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0.1}
                  max={50} // Allow listing up to 50kWh for demo flexibility
                  step={0.1}
                  value={kwhToList}
                  onChange={(e) => setKwhToList(parseFloat(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <div className="bg-surface-low rounded-lg px-4 py-2 min-w-[100px] text-center">
                  <span className="font-display text-xl font-bold text-on-surface">
                    {kwhToList.toFixed(1)}
                  </span>
                  <span className="body-md text-on-surface-variant ml-1">
                    kWh
                  </span>
                </div>
              </div>
            </div>

            {/* Price per kWh */}
            <div className="mb-6">
              <label className="label-md text-on-surface-variant mb-2 block">
                Price per kWh ($)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  value={pricePerKwh}
                  onChange={(e) => setPricePerKwh(parseFloat(e.target.value))}
                  className="w-full rounded-lg bg-surface-low py-2.5 px-4 body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="label-md text-on-surface-variant">
                  Market avg: ${stats?.avgPricePerKwh.toFixed(2)}/kWh
                </span>
                <span className="label-md text-on-surface-variant">
                  Grid: ${stats?.gridPricePerKwh.toFixed(2)}/kWh
                </span>
              </div>
            </div>

            {/* Estimated Earnings */}
            <div className="rounded-xl bg-primary/5 p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="body-md text-on-surface-variant">
                  Estimated earnings
                </span>
                <span className="font-display text-xl font-bold text-primary">
                  ${(kwhToList * pricePerKwh).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            {submitted ? (
              <div className="flex items-center justify-center gap-2 py-3 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                <span className="headline-sm">
                  Listing created successfully!
                </span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={kwhToList <= 0}
              >
                <Zap className="h-5 w-5" />
                List for Sale
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Market Context */}
          <div className="bg-surface-lowest rounded-xl p-6 shadow-soft">
            <h3 className="headline-sm text-on-surface mb-4">
              Market Context
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="body-md text-on-surface-variant">
                  Demand: <span className="font-medium text-primary">Medium</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                <span className="body-md text-on-surface-variant">
                  {stats?.activeHouseholds} active buyers
                </span>
              </div>

              <div>
                <p className="label-md text-on-surface-variant mb-1">
                  Suggested price range
                </p>
                <p className="body-md text-on-surface font-medium">
                  $0.13 — $0.22 per kWh
                </p>
              </div>
            </div>
          </div>

          {/* My Active Listings */}
          <div className="bg-surface-lowest rounded-xl p-6 shadow-soft">
            <h3 className="headline-sm text-on-surface mb-4">
              My Active Listings
            </h3>

            {activeListings.length > 0 ? (
              <div className="space-y-3">
                {activeListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between bg-surface-low rounded-lg p-3"
                  >
                    <div>
                      <p className="body-md text-on-surface font-medium">
                        {listing.kwhAvailable} kWh
                      </p>
                      <p className="label-md text-on-surface-variant">
                        ${listing.pricePerKwh.toFixed(2)}/kWh
                      </p>
                    </div>
                    <Chip variant="active">Active</Chip>
                  </div>
                ))}
              </div>
            ) : (
              <p className="body-md text-on-surface-variant">
                No active listings. Create one above!
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
