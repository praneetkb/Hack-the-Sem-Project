import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { Zap, ArrowRight, Sun, RefreshCw, Leaf, Building2, Shield } from "lucide-react";
import { NeighborhoodMap } from "@/components/visualizations/neighborhood-map";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Section (Two-Column) ─────────────────────────── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                <Zap className="h-4 w-4 text-primary" />
                <span className="label-md text-primary font-semibold">WattExchange</span>
              </div>
              <h1 className="display-lg text-on-surface mb-6">
                Stop Selling to the Grid for 3 Cents. <br />
                <span className="text-primary">Sell to Your Neighbor for 15!</span>
              </h1>

              <p className="body-lg text-on-surface-variant max-w-xl mb-10">
                You generate the energy, you should set the price.
                Sell your surplus solar directly to nearby households
                secured on the Solana blockchain — transparent, instant, and decentralized.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/marketplace">
                  <Button variant="primary" size="lg">
                    <Zap className="h-5 w-5" />
                    Sell My Surplus
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button variant="secondary" size="lg">
                    See How It Works
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Live Animation */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-soft border border-outline-variant/30">
              <NeighborhoodMap />
            </div>
          </div>
        </div>
      </section>

      {/* ── Live Stats Bar ────────────────────────────────── */}
      <section className="energy-gradient py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
            <div>
              <p className="font-display text-3xl font-bold text-on-primary">
                1,247 kWh
              </p>
              <p className="body-md text-on-primary/80">Energy Traded</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-on-primary">
                10 Homes
              </p>
              <p className="body-md text-on-primary/80">Active Households</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-on-primary">
                524 kg
              </p>
              <p className="body-md text-on-primary/80">CO₂ Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-surface-low">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="headline-lg text-on-surface text-center mb-4">
            How It Works
          </h2>
          <p className="body-lg text-on-surface-variant text-center max-w-2xl mx-auto mb-16">
            Three simple steps to start trading clean energy in your community.
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Sun,
                step: "01",
                title: "List Your Surplus",
                description:
                  "Your solar panels generate more than you need? List the excess on our marketplace with your desired price.",
              },
              {
                icon: RefreshCw,
                step: "02",
                title: "Get Matched",
                description:
                  "Our matching engine pairs you with nearby buyers based on proximity, price, and reliability for the best trade.",
              },
              {
                icon: Shield,
                step: "03",
                title: "Trade Securely",
                description:
                  "Energy tokens transfer automatically via Solana smart contracts. Every trade is recorded on-chain — no middleman.",
              },
            ].map((item) => (
              <TiltCard
                key={item.step}
                className="bg-surface-lowest rounded-xl p-8 shadow-soft"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg energy-gradient">
                    <item.icon className="h-5 w-5 text-on-primary" />
                  </div>
                  <span className="label-md text-primary-container">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="headline-sm text-on-surface mb-2">
                  {item.title}
                </h3>
                <p className="body-md text-on-surface-variant">
                  {item.description}
                </p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Empowering Sustainable Cities & Communities ──── */}
      <section className="bg-surface-low py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                <Leaf className="h-4 w-4 text-primary" />
                <span className="label-md text-primary">SDG Impact</span>
              </div>

              <h2 className="headline-lg text-on-surface mb-6">
                Empowering <span className="text-primary">Sustainable<br />Cities &</span> Communities.
              </h2>

              <p className="body-lg text-on-surface-variant max-w-xl mb-8">
                Decentralized energy markets reduce grid strain and create
                resilient, self-sustaining communities powered by local
                renewables. By enabling peer-to-peer trading, we make renewable
                energy more accessible and affordable for everyone.
              </p>

              {/* SDG Items (Vertical List) */}
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="headline-sm text-on-surface mb-1">SDG 7: Clean Energy</h3>
                    <p className="body-md text-on-surface-variant">
                      Increasing the share of renewable energy in the global mix by enabling
                      micro-generation monetization for every household.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary/15">
                    <Building2 className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="headline-sm text-on-surface mb-1">SDG 11: Sustainable Cities</h3>
                    <p className="body-md text-on-surface-variant">
                      Reducing transmission waste through localized energy grids, making urban
                      centers resilient and self-sufficient.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Network Impact Card */}
            <TiltCard className="bg-surface-lowest rounded-2xl p-8 shadow-soft relative">
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary rounded-full px-3 py-1 text-xs font-semibold">
                  <span className="inline-block h-2 w-2 rounded-full bg-on-primary animate-pulse"></span>
                  LIVE AUDIT
                </span>
              </div>

              <h3 className="headline-sm text-on-surface mb-8">Network Impact</h3>

              <div className="mb-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="label-md text-on-surface-variant tracking-widest">CARBON OFFSET GOAL</span>
                  <span className="label-md font-semibold text-primary">70% Achieved</span>
                </div>
                <div className="w-full h-2.5 bg-surface-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "70%" }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-display text-4xl font-bold text-primary mb-1">420t</p>
                  <p className="label-md text-on-surface-variant tracking-widest">CO2 SAVED</p>
                </div>
                <div>
                  <p className="font-display text-4xl font-bold text-primary mb-1">14k</p>
                  <p className="label-md text-on-surface-variant tracking-widest">TREES EQUIVALENT</p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ── Core Ecosystem ───────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="headline-lg text-on-surface mb-4">
              Core Ecosystem
            </h2>
            <p className="body-lg text-on-surface-variant max-w-2xl mx-auto">
              The building blocks powering decentralized energy trade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Dynamic P2P Trading */}
            <TiltCard className="bg-surface-lowest rounded-2xl p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl energy-gradient mb-5">
                <Zap className="h-6 w-6 text-on-primary" />
              </div>
              <h3 className="headline-sm text-on-surface mb-3">Dynamic P2P Trading</h3>
              <p className="body-md text-on-surface-variant mb-6">
                Algorithmically matched trading that finds the best rates in your local
                micro-grid. No middlemen, just neighbors.
              </p>
              <div className="relative rounded-xl overflow-hidden bg-secondary p-4">
                <svg viewBox="0 0 280 72" className="w-full h-16" preserveAspectRatio="none">
                  <rect x="4" y="52" width="16" height="20" rx="2" fill="#2ecc71" opacity="0.6" />
                  <rect x="24" y="42" width="16" height="30" rx="2" fill="#2ecc71" opacity="0.7" />
                  <rect x="44" y="32" width="16" height="40" rx="2" fill="#2ecc71" opacity="0.8" />
                  <rect x="64" y="22" width="16" height="50" rx="2" fill="#2ecc71" />
                  <rect x="84" y="38" width="16" height="34" rx="2" fill="#2ecc71" opacity="0.7" />
                  <rect x="104" y="44" width="16" height="28" rx="2" fill="#2ecc71" opacity="0.6" />
                  <rect x="124" y="48" width="16" height="24" rx="2" fill="#2ecc71" opacity="0.6" />
                  <rect x="144" y="40" width="16" height="32" rx="2" fill="#2ecc71" opacity="0.7" />
                  <rect x="164" y="34" width="16" height="38" rx="2" fill="#2ecc71" opacity="0.8" />
                  <rect x="184" y="26" width="16" height="46" rx="2" fill="#2ecc71" />
                  <rect x="204" y="42" width="16" height="30" rx="2" fill="#2ecc71" opacity="0.7" />
                  <rect x="224" y="48" width="16" height="24" rx="2" fill="#2ecc71" opacity="0.6" />
                  <rect x="244" y="36" width="16" height="36" rx="2" fill="#2ecc71" opacity="0.8" />
                  <rect x="264" y="30" width="16" height="42" rx="2" fill="#2ecc71" />
                </svg>
                <div className="absolute bottom-3 right-3">
                  <span className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary rounded-full px-2.5 py-1 text-xs font-semibold">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-on-primary animate-pulse"></span>
                    Matching Engine Active
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* Card 2: Solana Settlement */}
            <TiltCard className="bg-secondary rounded-2xl p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container mb-5">
                <Shield className="h-6 w-6 text-on-primary-container" />
              </div>
              <h3 className="headline-sm text-on-primary mb-3">Solana Settlement</h3>
              <p className="body-md text-on-primary/70 mb-8">
                Instant payouts with sub-cent fees. Every watt is logged on the
                immutable ledger.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                  <span className="font-mono text-xs text-on-primary/60">TX HASH: 8fd...3x2</span>
                  <span className="inline-flex items-center gap-1 rounded bg-primary-container px-2 py-0.5 text-xs font-semibold text-on-primary-container">
                    ✓ SUCCESS
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                  <span className="font-mono text-xs text-on-primary/60">TX HASH: a4b...7z9</span>
                  <span className="inline-flex items-center gap-1 rounded bg-primary-container px-2 py-0.5 text-xs font-semibold text-on-primary-container">
                    ✓ SUCCESS
                  </span>
                </div>
              </div>
            </TiltCard>

            {/* Card 3: AI Forecasting */}
            <TiltCard className="rounded-2xl p-8 shadow-soft" style={{ backgroundColor: "#fdb813" }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/10 mb-5">
                <Sun className="h-6 w-6 text-on-surface" />
              </div>
              <h3 className="headline-sm text-on-surface mb-3">AI Forecasting</h3>
              <p className="body-md text-on-surface/80">
                Predictive analytics suggest when to hold or sell based on weather
                patterns and peak demand hours.
              </p>
            </TiltCard>

            {/* Card 4: Real-time Node Health */}
            <TiltCard className="bg-surface-lowest rounded-2xl p-8 shadow-soft flex flex-col">
              <h3 className="headline-sm text-on-surface mb-3">Real-time Node Health</h3>
              <p className="body-md text-on-surface-variant mb-8">
                Monitor your energy generation, storage, and consumption in a single
                unified interface.
              </p>
              <div className="flex flex-col items-center justify-center flex-1">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="#e1e3e4" strokeWidth="8" />
                  <circle
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    stroke="#006d37"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="332.5 6.8"
                    strokeDashoffset="0"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px" }}
                  />
                  <text x="70" y="66" textAnchor="middle" fontSize="28" fontWeight="700" fill="#006d37">98%</text>
                  <text x="70" y="86" textAnchor="middle" fontSize="11" fontWeight="600" fill="#42474e" letterSpacing="2">OPTIMAL</text>
                </svg>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────── */}
      <section className="energy-gradient py-24 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
            <Zap className="h-4 w-4 text-white" />
            <span className="label-md text-white font-semibold">WattExchange</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
            The Future is<br />
            <span className="text-white">
              Decentralized & Luminous.
            </span>
          </h2>

          <p className="body-lg text-white/80 max-w-lg mx-auto mb-8">
            Join a global movement toward sustainable, decentralized energy
            trading. Every trade brings us closer to a cleaner future.
          </p>

          <Link href="/marketplace">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              Browse Marketplace
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
