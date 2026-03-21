import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Sun, RefreshCw, Shield, Leaf, Building2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Section ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface py-20 sm:py-32">
        {/* Decorative gradient orb */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary-container/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-tertiary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl pl-0 sm:pl-8 lg:pl-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Sun className="h-4 w-4 text-primary" />
              <span className="label-md text-primary">
                Peer-to-Peer Solar Energy Trading
              </span>
            </div>

            <h1 className="display-lg text-on-surface mb-6">
              Trade Solar Energy
              <br />
              <span className="text-primary">With Your Neighbors</span>
            </h1>

            <p className="body-lg text-on-surface-variant max-w-xl mb-10">
              Sell your surplus solar energy directly to nearby households at
              fair prices. Every transaction is secured on the Solana
              blockchain — transparent, instant, and decentralized.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/marketplace">
                <Button variant="primary" size="lg">
                  <Zap className="h-5 w-5" />
                  Start Trading
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="secondary" size="lg">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
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
              <div
                key={item.step}
                className="bg-surface-lowest rounded-xl p-8 shadow-soft transition-smooth hover:shadow-elevated"
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SDG Section ───────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="headline-lg text-on-surface text-center mb-12">
            Aligned with UN Sustainable Development Goals
          </h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
            <div className="bg-surface-lowest rounded-xl p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary/15 mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="headline-sm text-on-surface mb-2">
                SDG 7 — Affordable & Clean Energy
              </h3>
              <p className="body-md text-on-surface-variant">
                By enabling peer-to-peer trading, we make renewable energy more
                accessible and affordable for everyone in the community.
              </p>
            </div>

            <div className="bg-surface-lowest rounded-xl p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 mb-4">
                <Building2 className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="headline-sm text-on-surface mb-2">
                SDG 11 — Sustainable Cities
              </h3>
              <p className="body-md text-on-surface-variant">
                Decentralized energy markets reduce grid strain and create
                resilient, self-sustaining communities powered by local
                renewables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="energy-gradient py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-on-primary mb-4">
            Ready to Trade Clean Energy?
          </h2>
          <p className="body-lg text-on-primary/80 max-w-xl mx-auto mb-8">
            Join your neighbors in building a sustainable, decentralized energy
            future. Every kWh traded is a step toward cleaner communities.
          </p>
          <Link href="/marketplace">
            <Button
              variant="secondary"
              size="lg"
              className="bg-on-primary text-primary hover:bg-on-primary/90"
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
