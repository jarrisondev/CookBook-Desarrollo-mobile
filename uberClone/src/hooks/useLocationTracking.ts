import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import type { Coordinates } from './useLocation';

/**
 * Subscribes to continuous location updates while `enabled` is true.
 * Uses `watchPosition` with a distance filter so we don't fire updates
 * while standing still. Cleans up on unmount or when disabled.
 */
export function useLocationTracking({ enabled }: { enabled: boolean }) {
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const watchId = Geolocation.watchPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn('[useLocationTracking] watchPosition error:', err.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 15,
        interval: 4000,
        fastestInterval: 2000,
      },
    );
    return () => Geolocation.clearWatch(watchId);
  }, [enabled]);

  return coords;
}
