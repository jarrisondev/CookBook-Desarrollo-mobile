import { googleFetch } from './client';
import type { Coordinates } from '../../hooks/useLocation';

type GeocodingResponse = {
  results: Array<{
    formatted_address?: string;
    geometry?: { location?: { lat: number; lng: number } };
  }>;
};

/**
 * Geocoding API: turn an address into latitude/longitude. We use this as
 * a fallback when Place Details didn't return coordinates so the rider's
 * destination always has a location for Directions + the map markers.
 *
 * Docs: https://developers.google.com/maps/documentation/geocoding/overview
 */
export async function geocodeAddress(
  address: string,
  language = 'es',
): Promise<Coordinates | null> {
  if (!address.trim()) return null;
  const data = await googleFetch<GeocodingResponse>('/geocode/json', {
    address,
    language,
  });
  const loc = data.results?.[0]?.geometry?.location;
  if (!loc) return null;
  return { latitude: loc.lat, longitude: loc.lng };
}
