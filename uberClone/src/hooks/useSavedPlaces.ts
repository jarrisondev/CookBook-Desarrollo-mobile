import { useEffect, useState } from 'react';
import { useAppSelector } from '../store';
import { subscribeToPlaces } from '../services/firebase/places';
import type { SavedPlace } from '../models';

export function useSavedPlaces() {
  const uid = useAppSelector((s) => s.auth.user?.uid);
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setPlaces([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToPlaces(uid, (list) => {
      setPlaces(list);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { places, loading };
}
