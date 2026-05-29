import { GOOGLE_MAPS_API_KEY } from '@env';

const MAPS_BASE = 'https://maps.googleapis.com/maps/api';

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
    throw new GoogleApiError('HTTP_' + res.status, `HTTP ${res.status}`);
  }
  const json = (await res.json()) as { status?: string; error_message?: string };
  if (json.status && json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new GoogleApiError(json.status, json.error_message ?? json.status);
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
