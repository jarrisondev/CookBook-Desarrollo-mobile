import { useEffect, useMemo, useRef, useState } from 'react';
import { autocomplete, newSessionToken } from '../services/google';
import type { PlacePrediction } from '../services/google';
import type { Coordinates } from './useLocation';

type Options = {
  debounceMs?: number;
  location?: Coordinates;
  radiusMeters?: number;
  language?: string;
};

export type AutocompleteState = {
  predictions: PlacePrediction[];
  loading: boolean;
  error: Error | null;
  sessionToken: string;
};

export function usePlacesAutocomplete(
  input: string,
  { debounceMs = 250, location, radiusMeters, language }: Options = {},
): AutocompleteState {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sessionTokenRef = useRef<string>(newSessionToken());

  // Reset session token whenever the input is cleared (treat as new "session")
  useEffect(() => {
    if (input.trim().length === 0) {
      sessionTokenRef.current = newSessionToken();
      setPredictions([]);
      setError(null);
    }
  }, [input]);

  // Memoize location to avoid re-running when the same coords come back
  const stableLocation = useMemo(
    () =>
      location
        ? { latitude: location.latitude, longitude: location.longitude }
        : undefined,
    [location?.latitude, location?.longitude],
  );

  useEffect(() => {
    const trimmed = input.trim();
    if (trimmed.length < 2) {
      setPredictions([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      autocomplete(trimmed, {
        sessionToken: sessionTokenRef.current,
        location: stableLocation,
        radiusMeters,
        language,
      })
        .then((next) => {
          if (cancelled) return;
          setPredictions(next);
          setLoading(false);
        })
        .catch((err: Error) => {
          if (cancelled) return;
          console.warn('[autocomplete] error:', err);
          setError(err);
          setPredictions([]);
          setLoading(false);
        });
    }, debounceMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [input, debounceMs, stableLocation, radiusMeters, language]);

  return {
    predictions,
    loading,
    error,
    sessionToken: sessionTokenRef.current,
  };
}
