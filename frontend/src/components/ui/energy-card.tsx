import Link from "next/link";
import { MapPin, Zap, Star } from "lucide-react";
import { Chip } from "./chip";
import type { Listing } from "@/types";

interface EnergyCardProps {
  listing: Listing;
}

export function EnergyCard({ listing }: EnergyCardProps) {
  return (
    <Link href={`/trade/${listing.id}`}>
      <div className="card-hover-accent bg-surface-lowest rounded-xl p-5 shadow-soft transition-smooth cursor-pointer">
        {/* Header: Name + Status */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="headline-sm text-on-surface">
              {listing.householdName}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
              <MapPin className="h-3.5 w-3.5" />
              <span className="body-md">{listing.suburb}</span>
              <span className="body-md">· {listing.distanceKm} km</span>
            </div>
          </div>
          <Chip variant={listing.status === "active" ? "active" : "expired"}>
            {listing.status}
          </Chip>
        </div>

        {/* Metrics */}
        <div className="flex items-end justify-between">
          <div className="flex gap-6">
            {/* kWh Available */}
            <div>
              <p className="label-md text-on-surface-variant mb-0.5">
                Available
              </p>
              <div className="flex items-baseline gap-1">
                <Zap className="h-4 w-4 text-primary-container" />
                <span className="font-display text-xl font-bold text-on-surface">
                  {listing.kwhAvailable}
                </span>
                <span className="body-md text-on-surface-variant">kWh</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="label-md text-on-surface-variant mb-0.5">Price</p>
              <span className="font-display text-xl font-bold text-primary">
                ${listing.pricePerKwh.toFixed(2)}
              </span>
              <span className="body-md text-on-surface-variant">/kWh</span>
            </div>
          </div>

          {/* Reliability */}
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-tertiary fill-tertiary" />
            <span className="label-md text-on-surface-variant">
              {(listing.reliabilityScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
