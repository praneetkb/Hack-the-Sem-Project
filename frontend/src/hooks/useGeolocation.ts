"use client";

import { useState, useEffect } from "react";

// Sydney CBD — fallback when user denies location
const SYDNEY_CBD = { lat: -33.8688, lng: 151.2093 };

export interface GeolocationState {
  lat: number;
  lng: number;
  isDefault: boolean;
  loading: boolean;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    ...SYDNEY_CBD,
    isDefault: true,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isDefault: false,
          loading: false,
        });
      },
      () => {
        // Denied or error — use Sydney CBD
        setState((s) => ({ ...s, loading: false }));
      },
      { timeout: 10000 }
    );
  }, []);

  return state;
}
