import { useEffect, useState } from 'react';
import { MapView } from './MapView';
import type { MapMarker } from './MapView';
import { useLocation } from '../hooks/useLocation';
import { getRoute } from '../services/google';
import type { Route } from '../services/google';
import type { Coordinates } from '../hooks/useLocation';
import type { Ride } from '../models';

type Props = {
  ride: Ride | null;
  showMyLocationButton?: boolean;
  /**
   * Override the route origin. Default: the ride's pickup point.
   * Use this on the driver side while heading to pickup, where the
   * route should go from the driver's live location to the rider.
   */
  routeFrom?: Coordinates;
  /**
   * Override the route destination. Default: the ride's dropoff point.
   */
  routeTo?: Coordinates;
  /**
   * Live driver location to render as a separate marker (used on the
   * rider side so they can see the driver moving on the map).
   */
  driverLocation?: Coordinates;
  /**
   * Called whenever the Directions API result for the current origin →
   * destination pair changes. Lets the parent screen show the live
   * distance / ETA without firing a second Directions request.
   */
  onRouteChange?: (route: Route | null) => void;
  /**
   * Tightens the camera fit by using a smaller edge padding. Used on
   * "in-progress" screens where the bottom sheet is short and the user
   * wants to see less of the surrounding city.
   */
  tightFit?: boolean;
  /**
   * Hide the pickup pin marker. Used once the driver has picked up the
   * rider so the in-progress map isn't crowded.
   */
  hidePickupMarker?: boolean;
};

const TIGHT_EDGE_PADDING = { top: 90, right: 40, bottom: 240, left: 40 };

function pointToCoord(p?: { lat?: number; lng?: number }): Coordinates | null {
  if (!p || p.lat === undefined || p.lng === undefined) return null;
  return { latitude: p.lat, longitude: p.lng };
}

export function RideMap({
  ride,
  showMyLocationButton = true,
  routeFrom,
  routeTo,
  driverLocation,
  onRouteChange,
  tightFit,
  hidePickupMarker,
}: Props) {
  const { coords: myCoords } = useLocation();
  const [polyline, setPolyline] = useState<Coordinates[] | undefined>();

  const pickupCoord = pointToCoord(ride?.pickup);
  const dropoffCoord = pointToCoord(ride?.dropoff);

  const origin = routeFrom ?? pickupCoord;
  const destination = routeTo ?? dropoffCoord;

  useEffect(() => {
    if (!origin || !destination) {
      setPolyline(undefined);
      onRouteChange?.(null);
      return;
    }
    let cancelled = false;
    getRoute(origin, destination)
      .then((r) => {
        if (cancelled) return;
        setPolyline(r?.polyline);
        onRouteChange?.(r);
      })
      .catch((err) => {
        if (!cancelled) console.warn('[ride-map] directions failed:', err);
      });
    return () => {
      cancelled = true;
    };
  }, [
    origin?.latitude,
    origin?.longitude,
    destination?.latitude,
    destination?.longitude,
    onRouteChange,
  ]);

  const markers: MapMarker[] = [];
  if (pickupCoord && !hidePickupMarker) {
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
  if (driverLocation) {
    markers.push({
      id: 'driver',
      coordinate: driverLocation,
      title: ride?.driverName,
      kind: 'car',
    });
  }

  // Coords the camera should keep visible: route endpoints + the polyline.
  const fitTo: Coordinates[] = [];
  if (origin) fitTo.push(origin);
  if (destination) fitTo.push(destination);
  if (driverLocation) fitTo.push(driverLocation);
  if (polyline && polyline.length > 1) fitTo.push(...polyline);

  return (
    <MapView
      initialCoordinates={origin ?? destination ?? myCoords}
      myLocation={myCoords}
      markers={markers}
      routePolyline={polyline}
      fitTo={fitTo.length >= 2 ? fitTo : undefined}
      edgePadding={tightFit ? TIGHT_EDGE_PADDING : undefined}
      showMyLocationButton={showMyLocationButton}
    />
  );
}
