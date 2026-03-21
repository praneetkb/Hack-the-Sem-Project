import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-low py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo + tagline */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md energy-gradient">
              <Zap className="h-4 w-4 text-on-primary" />
            </div>
            <span className="font-display text-sm font-semibold text-on-surface">
              EnergyTrade
            </span>
          </div>

          {/* SDG Badges */}
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 label-md text-primary">
              SDG 7 — Affordable & Clean Energy
            </span>
            <span className="rounded-full bg-secondary/10 px-3 py-1 label-md text-secondary">
              SDG 11 — Sustainable Cities
            </span>
          </div>

          {/* Copyright */}
          <p className="body-md text-on-surface-variant">
            Hack the Sem 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
