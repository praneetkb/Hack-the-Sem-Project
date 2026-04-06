"use client";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { User, Wallet, Zap, Star, Clock, ArrowUpRight, ArrowDownLeft, Leaf } from "lucide-react";
import { currentUser, userStats, trades } from "@/lib/mock-data";
import { useState } from "react";
import { connectWallet, getWalletBalance, getTransactionHistory } from "@/lib/wallet";

export default function ProfilePage() {
  const userTrades = trades.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
  );

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [solTransactions, setSolTransactions] = useState<any[]>([]);

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      if (!address) return;

      const balance = await getWalletBalance(address);
      setSolBalance(balance);

      const history = await getTransactionHistory(address);
      setSolTransactions(history);
    } catch (err) {
      console.error("Wallet error:", err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="headline-lg text-on-surface mb-8">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-surface-lowest rounded-2xl shadow-soft mb-6 overflow-hidden">
        {/* Gradient header strip */}
        <div className="energy-gradient h-24 w-full" />
        <div className="px-8 pb-8 -mt-10">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-lowest shadow-soft border-4 border-surface-lowest mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>

          {/* Name / info row with Edit button */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="headline-md text-on-surface">{currentUser.name}</h2>
              <p className="body-md text-on-surface-variant mb-3">{currentUser.email}</p>
              <div className="flex items-center gap-3">
                <Chip variant="active">{currentUser.role}</Chip>
                <div className="flex items-center gap-1.5 rounded-full bg-surface-low px-3 py-1">
                  <Star className="h-3.5 w-3.5 text-tertiary fill-tertiary" />
                  <span className="label-md text-on-surface font-medium">
                    {(currentUser.reliabilityScore * 100).toFixed(0)}% reliability
                  </span>
                </div>
              </div>
            </div>
            <Button variant="secondary" size="md" disabled className="shrink-0">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-lowest rounded-xl p-5 shadow-soft text-center">
          <p className="font-display text-3xl font-bold text-primary mb-1">
            {userStats.totalKwhSold?.toFixed(1) ?? "—"}
          </p>
          <p className="label-md text-on-surface-variant">kWh Sold</p>
        </div>
        <div className="bg-surface-lowest rounded-xl p-5 shadow-soft text-center">
          <p className="font-display text-3xl font-bold text-secondary mb-1">
            {userStats.totalKwhBought?.toFixed(1) ?? "—"}
          </p>
          <p className="label-md text-on-surface-variant">kWh Bought</p>
        </div>
        <div className="bg-surface-lowest rounded-xl p-5 shadow-soft text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Leaf className="h-5 w-5 text-primary" />
            <p className="font-display text-3xl font-bold text-primary">
              {userStats.carbonOffsetKg}
            </p>
          </div>
          <p className="label-md text-on-surface-variant">kg CO₂ Saved</p>
        </div>
      </div>

      {/* Wallet */}
      <div className="bg-surface-lowest rounded-2xl p-6 shadow-soft mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg energy-gradient">
              <Wallet className="h-4 w-4 text-on-primary" />
            </div>
            <h3 className="headline-sm text-on-surface">My Wallet</h3>
          </div>
          <Button
            size="md"
            onClick={handleConnectWallet}
          >
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Phantom"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 rounded-xl p-4">
            <p className="label-md text-on-surface-variant mb-1">SOL Balance</p>
            <p className="font-display text-3xl font-bold text-primary">
              {solBalance.toFixed(4)}
            </p>
            <p className="label-md text-on-surface-variant">SOL</p>
          </div>
          <div className="bg-surface-low rounded-xl p-4">
            <p className="label-md text-on-surface-variant mb-1">Credits</p>
            <p className="font-display text-3xl font-bold text-on-surface">
              {currentUser.creditBalance}
            </p>
            <p className="label-md text-on-surface-variant">WattCredits</p>
          </div>
        </div>
      </div>

      {/* Trade History */}
      <div className="bg-surface-lowest rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
            <Clock className="h-4 w-4 text-secondary" />
          </div>
          <h3 className="headline-sm text-on-surface">Trade History</h3>
        </div>

        {solTransactions.length > 0 ? (
          <div className="space-y-3">
            {solTransactions.map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-surface-low rounded-xl p-4"
              >
                <div>
                  <p className="body-md text-on-surface font-medium">
                    {tx?.transaction.signatures[0].slice(0, 8)}...
                  </p>
                  <p className="label-md text-on-surface-variant">
                    Slot {tx?.slot} · To: {tx?.transaction.message.accountKeys[1].toString().slice(0, 8)}...
                  </p>
                </div>
                <span className="label-md font-semibold text-on-surface">
                  {(tx?.meta?.preBalances[0] - tx?.meta?.postBalances[0]) / 1e9} SOL
                </span>
              </div>
            ))}
          </div>
        ) : userTrades.length > 0 ? (
          <div className="space-y-3">
            {userTrades.map((trade) => {
              const isSell = trade.sellerId === currentUser.id;
              return (
                <div
                  key={trade.id}
                  className="flex items-center gap-4 bg-surface-low rounded-xl p-4"
                >
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${isSell ? "bg-primary/10" : "bg-secondary/10"}`}>
                    {isSell
                      ? <ArrowUpRight className="h-4 w-4 text-primary" />
                      : <ArrowDownLeft className="h-4 w-4 text-secondary" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="body-md text-on-surface font-medium">
                      {isSell
                        ? `Sold ${trade.kwhAmount} kWh to ${trade.buyerName}`
                        : `Bought ${trade.kwhAmount} kWh from ${trade.sellerName}`}
                    </p>
                    <p className="label-md text-on-surface-variant">
                      ${trade.totalCost.toFixed(2)} · ${trade.pricePerKwh.toFixed(2)}/kWh
                    </p>
                  </div>
                  <div className="text-right">
                    <Chip variant={trade.status}>
                      {trade.status}
                    </Chip>
                    <p className="label-md text-on-surface-variant mt-1">
                      {new Date(trade.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Zap className="mx-auto h-10 w-10 text-on-surface-variant/30 mb-3" />
            <p className="body-md text-on-surface-variant">No trades yet.</p>
            <p className="label-md text-on-surface-variant/60 mt-1">
              Head to the marketplace to start trading.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
