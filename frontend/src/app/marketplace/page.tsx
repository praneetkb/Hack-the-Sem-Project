"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Zap, TrendingUp } from "lucide-react";
import { EnergyCard } from "@/components/ui/energy-card";
import { Chip } from "@/components/ui/chip";
import { activeListings, platformStats } from "@/lib/mock-data";

type SortKey = "price" | "distance" | "kwh" | "reliability";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("price");

  const filteredListings = useMemo(() => {
    let results = activeListings.filter(
      (l) =>
        l.householdName.toLowerCase().includes(search.toLowerCase()) ||
        l.suburb.toLowerCase().includes(search.toLowerCase())
    );

    results.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.pricePerKwh - b.pricePerKwh;
        case "distance":
          return a.distanceKm - b.distanceKm;
        case "kwh":
          return b.kwhAvailable - a.kwhAvailable;
        case "reliability":
          return b.reliabilityScore - a.reliabilityScore;
        default:
          return 0;
      }
    });

    return results;
  }, [search, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="headline-lg text-on-surface mb-2">
          Energy Marketplace
        </h1>
        <p className="body-lg text-on-surface-variant">
          Browse available solar energy from households in your area.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content */}
        <div className="flex-1">
          {/* Search & Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Search by name or suburb..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-surface-lowest py-2.5 pl-10 pr-4 body-md text-on-surface placeholder:text-on-surface-variant/50 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Sort Chips */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-on-surface-variant" />
              {(
                [
                  ["price", "Price"],
                  ["distance", "Distance"],
                  ["kwh", "kWh"],
                  ["reliability", "Rating"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`rounded-full px-3 py-1 label-md transition-smooth cursor-pointer ${
                    sortBy === key
                      ? "bg-primary text-on-primary"
                      : "bg-surface-lowest text-on-surface-variant hover:bg-surface-low"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Listing Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredListings.map((listing) => (
              <EnergyCard key={listing.id} listing={listing} />
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-20">
              <Zap className="mx-auto h-12 w-12 text-on-surface-variant/30 mb-4" />
              <p className="headline-sm text-on-surface-variant">
                No listings found
              </p>
              <p className="body-md text-on-surface-variant/70 mt-1">
                Try adjusting your search or check back later.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Stats */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-surface-lowest rounded-xl p-6 shadow-soft sticky top-24">
            <h3 className="headline-sm text-on-surface mb-4">Market Overview</h3>

            <div className="space-y-4">
              <div>
                <p className="label-md text-on-surface-variant">Avg Price</p>
                <p className="font-display text-2xl font-bold text-primary">
                  ${platformStats.avgPricePerKwh.toFixed(2)}
                  <span className="body-md text-on-surface-variant font-normal">
                    /kWh
                  </span>
                </p>
              </div>

              <div>
                <p className="label-md text-on-surface-variant">Grid Price</p>
                <p className="font-display text-2xl font-bold text-secondary">
                  ${platformStats.gridPricePerKwh.toFixed(2)}
                  <span className="body-md text-on-surface-variant font-normal">
                    /kWh
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="label-md text-primary">
                  Save up to{" "}
                  {Math.round(
                    (1 -
                      platformStats.avgPricePerKwh /
                        platformStats.gridPricePerKwh) *
                      100
                  )}
                  % vs grid
                </span>
              </div>

              <hr className="border-none h-px bg-surface-highest" />

              <div>
                <p className="label-md text-on-surface-variant">
                  Active Listings
                </p>
                <p className="font-display text-xl font-bold text-on-surface">
                  {platformStats.activeListingsCount}
                </p>
              </div>

              <div>
                <p className="label-md text-on-surface-variant">Total Traded</p>
                <p className="font-display text-xl font-bold text-on-surface">
                  {platformStats.totalKwhTraded.toLocaleString()} kWh
                </p>
              </div>

              <Chip variant="active">
                {platformStats.activeHouseholds} households online
              </Chip>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
