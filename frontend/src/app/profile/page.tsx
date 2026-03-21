import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { User, Wallet, Zap, Star, Clock } from "lucide-react";
import { currentUser, userStats, trades } from "@/lib/mock-data";

export default function ProfilePage() {
  const userTrades = trades.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="headline-lg text-on-surface mb-8">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-surface-lowest rounded-xl p-8 shadow-soft mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="headline-md text-on-surface">{currentUser.name}</h2>
            <p className="body-md text-on-surface-variant">
              {currentUser.email}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Chip variant="active">{currentUser.role}</Chip>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-tertiary fill-tertiary" />
                <span className="label-md text-on-surface-variant">
                  {(currentUser.reliabilityScore * 100).toFixed(0)}% reliability
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button variant="secondary" size="md" disabled>
          Edit Profile — Coming Soon
        </Button>
      </div>

      {/* Wallet */}
      <div className="bg-surface-lowest rounded-xl p-6 shadow-soft mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-primary" />
          <h3 className="headline-sm text-on-surface">My Wallet</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-low rounded-lg p-4 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {userStats.creditBalance}
            </p>
            <p className="label-md text-on-surface-variant">Credits</p>
          </div>
          <div className="bg-surface-low rounded-lg p-4 text-center">
            <p className="font-display text-3xl font-bold text-on-surface">
              {userStats.carbonOffsetKg}
            </p>
            <p className="label-md text-on-surface-variant">kg CO₂ saved</p>
          </div>
        </div>
      </div>

      {/* Token History */}
      <div className="bg-surface-lowest rounded-xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-secondary" />
          <h3 className="headline-sm text-on-surface">Trade History</h3>
        </div>

        {userTrades.length > 0 ? (
          <div className="space-y-3">
            {userTrades.map((trade) => {
              const isSeller = trade.sellerId === currentUser.id;
              return (
                <div
                  key={trade.id}
                  className="flex items-center justify-between bg-surface-low rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isSeller ? "bg-primary/10" : "bg-secondary/10"
                      }`}
                    >
                      <Zap
                        className={`h-4 w-4 ${
                          isSeller ? "text-primary" : "text-secondary"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="body-md text-on-surface font-medium">
                        {isSeller ? "Sold" : "Bought"} {trade.kwhAmount} kWh
                      </p>
                      <p className="label-md text-on-surface-variant">
                        {isSeller
                          ? `to ${trade.buyerName}`
                          : `from ${trade.sellerName}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`body-md font-medium ${
                        isSeller ? "text-primary" : "text-secondary"
                      }`}
                    >
                      {isSeller ? "+" : "-"}${trade.totalCost.toFixed(2)}
                    </p>
                    <Chip variant={trade.status as "settled" | "matched" | "delivered" | "failed"}>
                      {trade.status}
                    </Chip>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="body-md text-on-surface-variant text-center py-4">
            No trades yet.
          </p>
        )}
      </div>
    </div>
  );
}
