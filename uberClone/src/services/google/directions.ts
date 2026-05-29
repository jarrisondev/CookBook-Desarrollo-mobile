import { googleFetch } from './client';
import type { Coordinates } from '../../hooks/useLocation';

export type Route = {
  polyline: Coordinates[];
  distanceMeters: number;
  durationSeconds: number;
};

type DirectionsResponse = {
  routes: Array<{
    overview_polyline?: { points?: string };
    legs?: Array<{
      distance?: { value?: number };
      duration?: { value?: number };
    }>;
  }>;
};

/**
 * Decode a Google encoded polyline into a list of coordinates.
 * Reference: developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
export function decodePolyline(encoded: string): Coordinates[] {
  const points: Coordinates[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let b: number;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dLat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dLng;
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

export async function getRoute(
  origin: Coordinates,
  destination: Coordinates,
  mode: 'driving' | 'walking' = 'driving',
): Promise<Route | null> {
  const data = await googleFetch<DirectionsResponse>('/directions/json', {
    origin: `${origin.latitude},${origin.longitude}`,
    destination: `${destination.latitude},${destination.longitude}`,
    mode,
    language: 'es',
  });
  const route = data.routes?.[0];
  if (!route?.overview_polyline?.points) return null;
  const leg = route.legs?.[0];
  return {
    polyline: decodePolyline(route.overview_polyline.points),
    distanceMeters: leg?.distance?.value ?? 0,
    durationSeconds: leg?.duration?.value ?? 0,
  };
}
