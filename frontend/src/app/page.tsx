import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Sun, RefreshCw, Leaf, Building2, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Section (Two-Column) ─────────────────────────── */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
                <Sun className="h-4 w-4 text-primary" />
                <span className="label-md text-primary">
                  Peer-to-Peer Solar Energy Trading
                </span>
              </div>

              <h1 className="display-lg text-on-surface mb-6">
                Trade Surplus Energy<br />
                with Your Neighbors.
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

            {/* Right Column: Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80"
                alt="Solar panels on rooftop"
                fill
                className="object-cover"
              />
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
                Empowering Sustainable Cities & Communities.
              </h2>

              <p className="body-lg text-on-surface-variant max-w-xl mb-8">
                Decentralized energy markets reduce grid strain and create
                resilient, self-sustaining communities powered by local
                renewables. By enabling peer-to-peer trading, we make renewable
                energy more accessible and affordable for everyone.
              </p>

              {/* SDG Cards (Inline) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-surface-lowest rounded-xl p-6 shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 mb-3">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="headline-sm text-on-surface mb-2">
                    SDG 7 — Affordable & Clean Energy
                  </h3>
                  <p className="body-md text-on-surface-variant text-sm">
                    Accessible renewable energy for all
                  </p>
                </div>

                <div className="bg-surface-lowest rounded-xl p-6 shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15 mb-3">
                    <Building2 className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="headline-sm text-on-surface mb-2">
                    SDG 11 — Sustainable Cities
                  </h3>
                  <p className="body-md text-on-surface-variant text-sm">
                    Resilient, self-sustaining communities
                  </p>
                </div>
              </div>

              {/* Stat Boxes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="font-display text-2xl font-bold text-primary">
                    1,247 kWh
                  </p>
                  <p className="body-md text-primary/80">Energy Traded</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="font-display text-2xl font-bold text-primary">
                    10 Homes
                  </p>
                  <p className="body-md text-primary/80">Active Households</p>
                </div>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
                alt="Sustainable city community"
                fill
                className="object-cover"
              />
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Dynamic P2P Trading Card */}
            <div className="energy-gradient rounded-xl p-8 text-on-primary">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8" />
                <span className="inline-block bg-on-primary/20 text-on-primary rounded-full px-3 py-1 label-md font-semibold">
                  Live
                </span>
              </div>
              <h3 className="headline-sm text-on-primary mb-2">
                Dynamic P2P Trading
              </h3>
              <p className="body-md text-on-primary/90">
                Real-time matching connects solar sellers with nearby buyers
                based on proximity and price.
              </p>
            </div>

            {/* AI Forecasting Card */}
            <div className="bg-surface-lowest rounded-xl p-8 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary/20 mb-4">
                <Sun className="h-6 w-6 text-tertiary" />
              </div>
              <h3 className="headline-sm text-on-surface mb-2">
                AI Forecasting
              </h3>
              <p className="body-md text-on-surface-variant">
                Predictive models optimize listing times by forecasting solar
                output from weather patterns.
              </p>
            </div>

            {/* Real-time Route Health Card */}
            <div className="bg-surface-lowest rounded-xl p-8 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <span className="font-display text-2xl font-bold text-primary">
                  98%
                </span>
              </div>
              <h3 className="headline-sm text-on-surface mb-2">
                Real-time Route Health
              </h3>
              <p className="body-md text-on-surface-variant">
                Continuous monitoring ensures energy routes stay reliable and
                efficient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark CTA Section ──────────────────────────────────── */}
      <section className="py-24 text-center" style={{ background: '#0f1923' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
            The Future is<br />
            <span
              style={{
                background: 'linear-gradient(90deg, #2ecc71, #fdb813)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Decentralized & Luminous.
            </span>
          </h2>

          <p className="body-lg text-white/70 max-w-lg mx-auto mb-8">
            Join a global movement toward sustainable, decentralized energy
            trading. Every trade brings us closer to a cleaner future.
          </p>

          <Link href="/marketplace">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-secondary hover:bg-white/90"
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
