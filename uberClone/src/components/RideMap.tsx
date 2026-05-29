import { useEffect, useState } from 'react';
import { MapView } from './MapView';
import type { MapMarker } from './MapView';
import { useLocation } from '../hooks/useLocation';
import { getRoute } from '../services/google';
import type { Coordinates } from '../hooks/useLocation';
import type { Ride } from '../models';

type Props = {
  ride: Ride | null;
  /** Show the floating "my location" button. Default true. */
  showMyLocationButton?: boolean;
  /** Override the pickup coordinate (e.g. when we are the driver, our
   *  location matters more than the rider's pickup). */
  overridePickup?: Coordinates;
};

function pointToCoord(p?: { lat?: number; lng?: number }): Coordinates | null {
  if (!p || p.lat === undefined || p.lng === undefined) return null;
  return { latitude: p.lat, longitude: p.lng };
}

export function RideMap({ ride, showMyLocationButton = true, overridePickup }: Props) {
  const { coords: myCoords } = useLocation();
  const [polyline, setPolyline] = useState<Coordinates[] | undefined>();

  const pickupCoord = overridePickup ?? pointToCoord(ride?.pickup);
  const dropoffCoord = pointToCoord(ride?.dropoff);

  useEffect(() => {
    if (!pickupCoord || !dropoffCoord) {
      setPolyline(undefined);
      return;
    }
    let cancelled = false;
    getRoute(pickupCoord, dropoffCoord)
      .then((r) => {
        if (!cancelled) setPolyline(r?.polyline);
      })
      .catch((err) => {
        if (!cancelled) console.warn('[ride-map] directions failed:', err);
      });
    return () => {
      cancelled = true;
    };
  }, [
    pickupCoord?.latitude,
    pickupCoord?.longitude,
    dropoffCoord?.latitude,
    dropoffCoord?.longitude,
  ]);

  const markers: MapMarker[] = [];
  if (pickupCoord) {
    markers.push({
      id: 'pickup',
      coordinate: pickupCoord,
      title: ride?.pickup.label,
      pinColor: '#22C55E',
    });
  }
  if (dropoffCoord) {
    markers.push({
      id: 'dropoff',
      coordinate: dropoffCoord,
      title: ride?.dropoff.label,
      pinColor: '#0F1115',
    });
  }

  return (
    <MapView
      initialCoordinates={pickupCoord ?? dropoffCoord ?? myCoords}
      myLocation={myCoords}
      markers={markers}
      routePolyline={polyline}
      showMyLocationButton={showMyLocationButton}
    />
  );
}
