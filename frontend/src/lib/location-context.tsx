"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const SYDNEY_CBD = { lat: -33.8688, lng: 151.2093, suburb: "Sydney CBD" };

interface LocationState {
  lat: number;
  lng: number;
  suburb: string;
  isDenied: boolean;
  isLoading: boolean;
}

const LocationContext = createContext<LocationState>({
  ...SYDNEY_CBD,
  isDenied: false,
  isLoading: true,
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LocationState>({
    ...SYDNEY_CBD,
    isDenied: false,
    isLoading: true,
  });

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((s) => ({ ...s, isLoading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          suburb: "Your Location",
          isDenied: false,
          isLoading: false,
        });
      },
      () => {
        setState({ ...SYDNEY_CBD, isDenied: true, isLoading: false });
      },
      { timeout: 10000 }
    );
  }, []);

  return (
    <LocationContext.Provider value={state}>{children}</LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
