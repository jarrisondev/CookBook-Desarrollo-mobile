import { getApiKey, GoogleApiError, placesNewFetch } from './client';
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

type AutocompleteNewResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      place?: string;
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
    };
  }>;
};

type PlaceDetailsNewResponse = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
};

/**
 * Places API (New) autocomplete.
 * Docs: https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
 *
 * Pair with newSessionToken() to bill the search + the final details call
 * as one request.
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
  const body: Record<string, unknown> = {
    input,
    sessionToken: options.sessionToken,
    languageCode: options.language ?? 'es',
  };
  if (options.location) {
    body.locationBias = {
      circle: {
        center: {
          latitude: options.location.latitude,
          longitude: options.location.longitude,
        },
        radius: options.radiusMeters ?? 30000,
      },
    };
  }
  const data = await placesNewFetch<AutocompleteNewResponse>(
    '/places:autocomplete',
    body,
  );
  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter(
      (p): p is NonNullable<typeof p> =>
        !!p && !!(p.placeId ?? p.place) && !!p.text?.text,
    )
    .map((p) => {
      const placeId = p.placeId ?? (p.place ?? '').replace(/^places\//, '');
      const description = p.text?.text ?? '';
      return {
        placeId,
        mainText: p.structuredFormat?.mainText?.text ?? description,
        secondaryText: p.structuredFormat?.secondaryText?.text ?? '',
        description,
      };
    });
}

/**
 * Places API (New) place details.
 * Use the same sessionToken from the autocomplete call to bill as one
 * session.
 */
export async function getPlaceDetails(
  placeId: string,
  sessionToken: string,
): Promise<PlaceDetails | null> {
  if (!getApiKey()) {
    throw new GoogleApiError('NO_API_KEY', 'GOOGLE_MAPS_API_KEY is missing');
  }
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
    placeId,
  )}?sessionToken=${encodeURIComponent(sessionToken)}`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': getApiKey(),
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,location',
    },
  });
  const json = (await res.json()) as
    | PlaceDetailsNewResponse
    | { error?: { status?: string; message?: string } };
  if (!res.ok) {
    const err = (json as { error?: { status?: string; message?: string } })
      .error;
    const status = err?.status ?? `HTTP_${res.status}`;
    console.warn(
      `[google] places-new /places/${placeId} status=${status} ${err?.message ?? ''}`,
    );
    throw new GoogleApiError(status, err?.message ?? `HTTP ${res.status}`);
  }
  const data = json as PlaceDetailsNewResponse;
  if (!data.location) {
    console.warn(
      `[google] places-new /places/${placeId} returned no location, keys=${Object.keys(
        data,
      ).join(',')}`,
    );
    return null;
  }
  return {
    placeId: data.id ?? placeId,
    name: data.displayName?.text ?? data.formattedAddress ?? '',
    address: data.formattedAddress ?? data.displayName?.text ?? '',
    coordinates: {
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    },
  };
}
