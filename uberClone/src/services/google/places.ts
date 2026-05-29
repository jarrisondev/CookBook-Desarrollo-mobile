import { googleFetch } from './client';
import type { Coordinates } from '../../hooks/useLocation';

export type PlacePrediction = {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
};

export type PlaceDetails = {
  placeId: string;
  name: string;
  address: string;
  coordinates: Coordinates;
};

type AutocompleteResponse = {
  predictions: Array<{
    place_id: string;
    description: string;
    structured_formatting?: {
      main_text?: string;
      secondary_text?: string;
    };
  }>;
};

type PlaceDetailsResponse = {
  result: {
    place_id: string;
    name?: string;
    formatted_address?: string;
    geometry?: {
      location?: { lat: number; lng: number };
    };
  };
};

/**
 * Search places matching `input`. Pair with newSessionToken() to bill the
 * search + the final details call as one request.
 */
export async function autocomplete(
  input: string,
  options: {
    sessionToken: string;
    language?: string;
    location?: Coordinates;
    radiusMeters?: number;
  },
): Promise<PlacePrediction[]> {
  if (!input.trim()) return [];
  const params: Record<string, string | undefined> = {
    input,
    sessiontoken: options.sessionToken,
    language: options.language ?? 'es',
  };
  if (options.location) {
    params.location = `${options.location.latitude},${options.location.longitude}`;
    params.radius = String(options.radiusMeters ?? 30000);
  }
  const data = await googleFetch<AutocompleteResponse>(
    '/place/autocomplete/json',
    params,
  );
  return (data.predictions ?? []).map((p) => ({
    placeId: p.place_id,
    mainText: p.structured_formatting?.main_text ?? p.description,
    secondaryText: p.structured_formatting?.secondary_text ?? '',
    description: p.description,
  }));
}

/**
 * Resolve a Place ID into name + address + coordinates.
 * Use the same sessionToken you used for autocomplete to keep the same
 * billed session.
 */
export async function getPlaceDetails(
  placeId: string,
  sessionToken: string,
): Promise<PlaceDetails | null> {
  const data = await googleFetch<PlaceDetailsResponse>('/place/details/json', {
    place_id: placeId,
    sessiontoken: sessionToken,
    fields: 'place_id,name,formatted_address,geometry/location',
    language: 'es',
  });
  const r = data.result;
  if (!r || !r.geometry?.location) return null;
  return {
    placeId: r.place_id,
    name: r.name ?? r.formatted_address ?? '',
    address: r.formatted_address ?? r.name ?? '',
    coordinates: {
      latitude: r.geometry.location.lat,
      longitude: r.geometry.location.lng,
    },
  };
}
