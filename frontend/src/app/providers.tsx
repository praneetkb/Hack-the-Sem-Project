"use client";

import { LocationProvider } from "@/lib/location-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <LocationProvider>{children}</LocationProvider>;
}
