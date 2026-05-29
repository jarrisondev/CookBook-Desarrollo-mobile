import { useEffect, useRef } from 'react';
import { useLocationTracking } from './useLocationTracking';
import { publishDriverLocation } from '../services/firebase/rides';

/**
 * While a driver has an active rideId, watches their location and publishes
 * it to the ride doc so the rider can see them moving toward pickup / along
 * the trip. Throttled by `useLocationTracking`'s distance filter; we also
 * skip writes if we've published within the last 2.5s to keep Firestore
 * writes reasonable.
 */
export function useDriverRideLocationPublisher(rideId: string | null) {
  const coords = useLocationTracking({ enabled: !!rideId });
  const lastPublishedAt = useRef(0);

  useEffect(() => {
    if (!rideId || !coords) return;
    const now = Date.now();
    if (now - lastPublishedAt.current < 2500) return;
    lastPublishedAt.current = now;
    publishDriverLocation(rideId, {
      lat: coords.latitude,
      lng: coords.longitude,
    }).catch((err) => {
      console.warn('[driver-location] publish failed:', err);
    });
  }, [rideId, coords]);

  return coords;
}
