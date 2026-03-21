"use client";

import { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  ArrowLeft,
  Zap,
  MapPin,
  Star,
  Shield,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { listings, platformStats } from "@/lib/mock-data";

export default function TradeConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const listing = listings.find((l) => l.id === id);
  const [quantity, setQuantity] = useState(listing?.kwhAvailable ?? 0);
  const [confirmed, setConfirmed] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Zap className="mx-auto h-12 w-12 text-on-surface-variant/30 mb-4" />
        <h1 className="headline-lg text-on-surface mb-2">Listing Not Found</h1>
        <p className="body-lg text-on-surface-variant mb-6">
          This listing may have expired or been matched.
        </p>
        <Link href="/marketplace">
          <Button variant="secondary">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const totalCost = Math.round(quantity * listing.pricePerKwh * 100) / 100;
  const gridCost =
    Math.round(quantity * platformStats.gridPricePerKwh * 100) / 100;
  const savings = Math.round((gridCost - totalCost) * 100) / 100;

  const handleConfirm = async () => {
    setProcessing(true);
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <div className="bg-surface-lowest rounded-xl p-10 shadow-soft text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/20">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>

          <h1 className="headline-lg text-on-surface mb-2">
            Trade Confirmed!
          </h1>
          <p className="body-lg text-on-surface-variant mb-8">
            Your energy purchase has been recorded on the Solana blockchain.
          </p>

          {/* Transaction Summary */}
          <div className="bg-surface-low rounded-xl p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="body-md text-on-surface-variant">Seller</span>
                <span className="body-md text-on-surface font-medium">
                  {listing.householdName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="body-md text-on-surface-variant">Energy</span>
                <span className="body-md text-on-surface font-medium">
                  {quantity} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="body-md text-on-surface-variant">
                  Total Cost
                </span>
                <span className="body-md text-primary font-medium">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="body-md text-on-surface-variant">
                  You Saved
                </span>
                <span className="body-md text-primary font-medium">
                  ${savings.toFixed(2)} vs grid
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield className="h-4 w-4 text-on-surface-variant" />
            <button className="label-md text-primary flex items-center gap-1 cursor-pointer hover:underline">
              View on Solana Explorer
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          <Link href="/marketplace">
            <Button variant="primary" size="lg">
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Back */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 body-md text-on-surface-variant hover:text-on-surface transition-smooth mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <h1 className="headline-lg text-on-surface mb-8">Confirm Trade</h1>

      {/* Order Summary */}
      <div className="bg-surface-lowest rounded-xl p-6 shadow-soft mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="headline-sm text-on-surface">
              {listing.householdName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5 text-on-surface-variant" />
              <span className="body-md text-on-surface-variant">
                {listing.suburb} · {listing.distanceKm} km away
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-tertiary fill-tertiary" />
            <span className="label-md text-on-surface-variant">
              {(listing.reliabilityScore * 100).toFixed(0)}% reliable
            </span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="label-md text-on-surface-variant mb-2 block">
            Energy Amount (kWh)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0.5}
              max={listing.kwhAvailable}
              step={0.1}
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <div className="bg-surface-low rounded-lg px-4 py-2 min-w-[100px] text-center">
              <span className="font-display text-xl font-bold text-on-surface">
                {quantity.toFixed(1)}
              </span>
              <span className="body-md text-on-surface-variant ml-1">kWh</span>
            </div>
          </div>
          <p className="body-md text-on-surface-variant mt-1">
            Max available: {listing.kwhAvailable} kWh
          </p>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="body-md text-on-surface-variant">
              Price per kWh
            </span>
            <span className="body-md text-on-surface">
              ${listing.pricePerKwh.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="body-md text-on-surface-variant">
              Grid price per kWh
            </span>
            <span className="body-md text-on-surface-variant line-through">
              ${platformStats.gridPricePerKwh.toFixed(2)}
            </span>
          </div>
          <hr className="border-none h-px bg-surface-highest" />
          <div className="flex justify-between">
            <span className="headline-sm text-on-surface">Total</span>
            <span className="headline-sm text-primary">
              ${totalCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="body-md text-primary">Your savings</span>
            <span className="body-md text-primary font-medium">
              ${savings.toFixed(2)}
            </span>
          </div>
        </div>

        <Chip variant="active">
          {Math.round((1 - listing.pricePerKwh / platformStats.gridPricePerKwh) * 100)}% cheaper than grid
        </Chip>
      </div>

      {/* Blockchain Info */}
      <div className="flex items-center gap-3 rounded-xl bg-secondary/5 p-4 mb-8">
        <Shield className="h-5 w-5 text-secondary shrink-0" />
        <p className="body-md text-on-surface-variant">
          This transaction will be securely recorded on the{" "}
          <span className="font-medium text-secondary">Solana blockchain</span>.
          Energy tokens transfer automatically via smart contract.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link href="/marketplace" className="flex-1">
          <Button variant="tertiary" size="lg" className="w-full">
            Cancel
          </Button>
        </Link>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={handleConfirm}
          disabled={processing || quantity <= 0}
        >
          {processing ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              Confirm Trade
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
