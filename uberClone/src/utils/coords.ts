import type { Coordinates } from '../hooks/useLocation';

/**
 * Snap coordinates to a coarser grid so deps that "change every meter" only
 * fire when the user actually moves a meaningful distance. Used to throttle
 * Directions API refetches while the driver is in motion: precision=3 gives
 * ~110 m grid, precision=4 gives ~11 m grid.
 */
export function coarseCoords(
  coords: Coordinates | undefined,
  precision = 3,
): Coordinates | undefined {
  if (!coords) return undefined;
  const factor = Math.pow(10, precision);
  return {
    latitude: Math.round(coords.latitude * factor) / factor,
    longitude: Math.round(coords.longitude * factor) / factor,
  };
}
