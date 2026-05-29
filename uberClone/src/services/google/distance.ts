import { googleFetch } from './client';
import type { Coordinates } from '../../hooks/useLocation';

export type DistanceEstimate = {
  distanceMeters: number;
  durationSeconds: number;
};

type DistanceMatrixResponse = {
  rows: Array<{
    elements: Array<{
      status: string;
      distance?: { value?: number };
      duration?: { value?: number };
    }>;
  }>;
};

export async function getDistance(
  origin: Coordinates,
  destination: Coordinates,
  mode: 'driving' | 'walking' = 'driving',
): Promise<DistanceEstimate | null> {
  const data = await googleFetch<DistanceMatrixResponse>(
    '/distancematrix/json',
    {
      origins: `${origin.latitude},${origin.longitude}`,
      destinations: `${destination.latitude},${destination.longitude}`,
      mode,
      language: 'es',
    },
  );
  const el = data.rows?.[0]?.elements?.[0];
  if (!el || el.status !== 'OK') return null;
  return {
    distanceMeters: el.distance?.value ?? 0,
    durationSeconds: el.duration?.value ?? 0,
  };
}

export function metersToKm(meters: number): number {
  return Math.round((meters / 1000) * 10) / 10;
}

export function secondsToMinutes(seconds: number): number {
  return Math.max(1, Math.round(seconds / 60));
}
