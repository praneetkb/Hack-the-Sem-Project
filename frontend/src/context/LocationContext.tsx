"use client";

import { createContext, useContext } from "react";
import { useGeolocation, type GeolocationState } from "@/hooks/useGeolocation";

const LocationContext = createContext<GeolocationState>({
  lat: -33.8688,
  lng: 151.2093,
  isDefault: true,
  loading: true,
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const location = useGeolocation();
  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
