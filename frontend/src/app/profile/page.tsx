"use client";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { User, Wallet, Zap, Star, Clock } from "lucide-react";
import { currentUser, userStats, trades } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { getProvider, connectWallet, getWalletBalance, getTransactionHistory } from "@/lib/wallet";

export default function ProfilePage() {
  const userTrades = trades.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
  );

  // state for wallet info 
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [solTransactions, setSolTransactions] = useState<any[]>([]);

  // load Phantom wallet
  useEffect(() => {
    const loadWallet = async () => {
      const provider = getProvider();
      if (!provider) return;

      const address = await connectWallet();
      setWalletAddress(address);

      const balance = await getWalletBalance(address);
      setSolBalance(balance);

      const history = await getTransactionHistory(address);
      setSolTransactions(history);
    };

    loadWallet();
  }, []);

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

        <Button
          onClick={async () => {
            const address = await connectWallet();
            console.log("Connected wallet:", address);
          }}
        >
          Connect Phantom Wallet
        </Button>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-low rounded-lg p-4 text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {solBalance.toFixed(4)}
            </p>
            <p className="label-md text-on-surface-variant">SOL</p>
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

        {solTransactions.length > 0 ? (
          <div className="space-y-3">
            {solTransactions.map((tx, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-surface-low rounded-lg p-3"
              >
                <div>
                  <p className="body-md text-on-surface font-medium">
                    Tx Signature: {tx?.transaction.signatures[0].slice(0, 8)}...
                  </p>
                  <p className="label-md text-on-surface-variant">
                    Slot: {tx?.slot}
                    <p className="label-md text-on-surface-variant">
                      To: {tx?.transaction.message.accountKeys[1].toString().slice(0, 8)}...
                    </p>
                    <p className="label-md text-on-surface-variant">
                      Amount: {(tx?.meta?.preBalances[0] - tx?.meta?.postBalances[0]) / 1e9} SOL
                    </p>
                  </p>
                </div>
              </div>
            ))}
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
