"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Store,
  PlusCircle,
  User,
  Wallet,
} from "lucide-react";
import { getCurrentUser } from "@/lib/api";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/list", label: "Sell Energy", icon: PlusCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initial fetch
    getCurrentUser().then(setUser);

    // Dynamic sync for credits/balance during demo
    const interval = setInterval(() => {
      getCurrentUser().then(setUser);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg energy-gradient">
              <Zap className="h-5 w-5 text-on-primary" />
            </div>
            <span className="font-display text-lg font-bold text-on-surface hidden sm:block">
              EnergyTrade
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-smooth ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-low"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side: Wallet + Profile */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-surface-low px-3 py-1.5">
              <Wallet className="h-3.5 w-3.5 text-primary" />
              <span className="label-md text-on-surface">
                {user?.creditBalance ?? "..."} credits
              </span>
            </div>
            <Link
              href="/profile"
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-smooth ${pathname === "/profile"
                ? "bg-primary/10"
                : "bg-surface-highest hover:bg-surface-low"
                }`}
            >
              <User className="h-4 w-4 text-on-surface-variant" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
