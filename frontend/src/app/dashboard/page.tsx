"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Chip } from "@/components/ui/chip";
import { EnergyFlowChart } from "@/components/charts/energy-flow-chart";
import {
  Zap,
  ShoppingCart,
  Wallet,
  Leaf,
  PlusCircle,
  Store,
  TrendingUp,
} from "lucide-react";
import {
  currentUser,
  userStats,
  trades,
  getHourlyData,
} from "@/lib/mock-data";
import { EnergyForecastCard } from "@/components/charts/energy-forecast-card";
import type { TradeStatus } from "@/types";

export default function DashboardPage() {
  const hourlyData = useMemo(() => getHourlyData(), []);

  const userTrades = trades
    .filter(
      (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
    )
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="headline-lg text-on-surface">
            Welcome back, {currentUser.name.split(" ")[1]}
          </h1>
          <p className="body-lg text-on-surface-variant mt-1">
            Your energy dashboard at a glance.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/list">
            <Button variant="primary" size="md">
              <PlusCircle className="h-4 w-4" />
              List My Surplus
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="secondary" size="md">
              <Store className="h-4 w-4" />
              Marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          label="Total Sold"
          value={userStats.totalKwhSold}
          unit="kWh"
          icon={Zap}
          trend="up"
          trendValue="4.2 kWh this week"
        />
        <StatCard
          label="Total Bought"
          value={userStats.totalKwhBought}
          unit="kWh"
          icon={ShoppingCart}
          trend="up"
          trendValue="2.1 kWh this week"
        />
        <StatCard
          label="Credit Balance"
          value={userStats.creditBalance}
          unit="credits"
          icon={Wallet}
          trend="up"
          trendValue="8.3 earned"
        />
        <StatCard
          label="Carbon Offset"
          value={userStats.carbonOffsetKg}
          unit="kg CO₂"
          icon={Leaf}
          trend="up"
          trendValue="1.8 kg this week"
        />
      </div>

      {/* Charts + Forecast Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Energy Flow Chart */}
        <div className="lg:col-span-2 bg-surface-lowest rounded-xl p-6 shadow-soft">
          <h2 className="headline-sm text-on-surface mb-4">
            Today&apos;s Energy Flow
          </h2>
          <EnergyFlowChart data={hourlyData} />
        </div>

        {/* Forecast Widget */}
        <div className="flex flex-col gap-4">
          <EnergyForecastCard householdId="h1" />
          <Link href="/list">
            <Button variant="tertiary" size="sm" className="w-full h-12 shadow-soft">
              Pre-list surplus for tomorrow
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-surface-lowest rounded-xl p-6 shadow-soft">
        <h2 className="headline-sm text-on-surface mb-4">Recent Trades</h2>

        {userTrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="label-md text-on-surface-variant pb-3 font-semibold">
                    Counterparty
                  </th>
                  <th className="label-md text-on-surface-variant pb-3 font-semibold">
                    Energy
                  </th>
                  <th className="label-md text-on-surface-variant pb-3 font-semibold">
                    Cost
                  </th>
                  <th className="label-md text-on-surface-variant pb-3 font-semibold">
                    Status
                  </th>
                  <th className="label-md text-on-surface-variant pb-3 font-semibold">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-highest">
                {userTrades.map((trade) => {
                  const isSeller = trade.sellerId === currentUser.id;
                  return (
                    <tr key={trade.id}>
                      <td className="py-3 body-md text-on-surface">
                        {isSeller ? trade.buyerName : trade.sellerName}
                        <span className="label-md text-on-surface-variant ml-1">
                          ({isSeller ? "buyer" : "seller"})
                        </span>
                      </td>
                      <td className="py-3 body-md text-on-surface">
                        {trade.kwhAmount} kWh
                      </td>
                      <td className="py-3 body-md text-on-surface">
                        ${trade.totalCost.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <Chip variant={trade.status as TradeStatus}>
                          {trade.status}
                        </Chip>
                      </td>
                      <td className="py-3 body-md text-on-surface-variant">
                        {new Date(trade.createdAt).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="body-md text-on-surface-variant">
              No trades yet. Visit the marketplace to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
