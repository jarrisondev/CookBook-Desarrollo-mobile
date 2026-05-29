import { GOOGLE_MAPS_API_KEY } from '@env';

const MAPS_BASE = 'https://maps.googleapis.com/maps/api';
const PLACES_NEW_BASE = 'https://places.googleapis.com/v1';

export function getApiKey(): string {
  return GOOGLE_MAPS_API_KEY;
}

export class GoogleApiError extends Error {
  constructor(public status: string, message?: string) {
    super(message ?? status);
    this.name = 'GoogleApiError';
  }
}

export async function googleFetch<T = unknown>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<T> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('[google] GOOGLE_MAPS_API_KEY is missing from @env');
    throw new GoogleApiError('NO_API_KEY', 'GOOGLE_MAPS_API_KEY is missing');
  }
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, String(v));
  });
  query.set('key', GOOGLE_MAPS_API_KEY);
  const url = `${MAPS_BASE}${path}?${query.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`[google] ${path} HTTP ${res.status}`);
    throw new GoogleApiError('HTTP_' + res.status, `HTTP ${res.status}`);
  }
  const json = (await res.json()) as { status?: string; error_message?: string };
  if (json.status && json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    console.warn(
      `[google] ${path} status=${json.status} ${json.error_message ?? ''}`,
    );
    throw new GoogleApiError(json.status, json.error_message ?? json.status);
  }
  return json as T;
}

/**
 * POST a JSON body to the Places API (New) at /v1. Authenticates with the
 * X-Goog-Api-Key header. Pass a fieldMask string to limit the response
 * shape and lower the billing tier.
 */
export async function placesNewFetch<T = unknown>(
  path: string,
  body: Record<string, unknown>,
  options: { fieldMask?: string; method?: 'GET' | 'POST' } = {},
): Promise<T> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('[google] GOOGLE_MAPS_API_KEY is missing from @env');
    throw new GoogleApiError('NO_API_KEY', 'GOOGLE_MAPS_API_KEY is missing');
  }
  const method = options.method ?? 'POST';
  const headers: Record<string, string> = {
    'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
    'Content-Type': 'application/json',
  };
  if (options.fieldMask) {
    headers['X-Goog-FieldMask'] = options.fieldMask;
  }
  const url = `${PLACES_NEW_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
  const json = (await res.json()) as
    | T
    | { error?: { status?: string; message?: string } };
  if (!res.ok) {
    const err = (json as { error?: { status?: string; message?: string } })
      .error;
    const status = err?.status ?? `HTTP_${res.status}`;
    const message = err?.message ?? `HTTP ${res.status}`;
    console.warn(`[google] places-new ${path} status=${status} ${message}`);
    throw new GoogleApiError(status, message);
  }
  return json as T;
}

/**
 * Random UUID-like token; Google accepts any unique string per session.
 * Used to group autocomplete keystrokes + a final Place Details call
 * into one billed request instead of N.
 */
export function newSessionToken(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
