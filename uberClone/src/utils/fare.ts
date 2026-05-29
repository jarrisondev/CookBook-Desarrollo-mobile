import type { RideCategory } from '../constants/mockData';

/**
 * Compute the trip fare for a given category, distance and duration.
 * Formula: max(minimumFare, baseFare + km*perKm + min*perMinute).
 * Result is rounded to the nearest 50 COP since fares are in pesos.
 */
export function calculateFare(
  category: RideCategory,
  distanceKm: number | undefined,
  durationMin: number | undefined,
): number {
  const km = distanceKm ?? 3;
  const min = durationMin ?? category.defaultEtaMin;
  const total = category.baseFare + km * category.perKm + min * category.perMinute;
  const fare = Math.max(category.minimumFare, total);
  return Math.round(fare / 50) * 50;
}
