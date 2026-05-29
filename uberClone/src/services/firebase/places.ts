import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from '@firebase/firestore';
import { db } from './config';
import type { PlaceType, SavedPlace } from '../../models';

function placesRef(uid: string) {
  return collection(db, 'users', uid, 'places');
}

function placeDoc(uid: string, id: string) {
  return doc(db, 'users', uid, 'places', id);
}

function parsePlace(id: string, data: Record<string, unknown>): SavedPlace {
  return {
    id,
    label: String(data.label),
    address: String(data.address),
    type: (data.type as PlaceType) ?? 'recent',
    lat: typeof data.lat === 'number' ? data.lat : undefined,
    lng: typeof data.lng === 'number' ? data.lng : undefined,
  };
}

export type NewPlaceInput = {
  label: string;
  address: string;
  type: PlaceType;
  lat?: number;
  lng?: number;
};

export async function addPlace(uid: string, place: NewPlaceInput) {
  const payload = {
    label: place.label,
    address: place.address,
    type: place.type,
    lat: place.lat,
    lng: place.lng,
    createdAt: serverTimestamp(),
  };
  const cleaned = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );
  const ref = await addDoc(placesRef(uid), cleaned);
  return ref.id;
}

export async function updatePlace(
  uid: string,
  id: string,
  patch: Partial<NewPlaceInput>,
) {
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, v]) => v !== undefined),
  );
  await updateDoc(placeDoc(uid, id), cleaned);
}

export async function deletePlace(uid: string, id: string) {
  await deleteDoc(placeDoc(uid, id));
}

export function subscribeToPlaces(
  uid: string,
  onChange: (places: SavedPlace[]) => void,
) {
  const q = query(placesRef(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => parsePlace(d.id, d.data()))),
    (err) => console.warn('[places] subscribeToPlaces error:', err),
  );
}

/**
 * Add a recent destination, deduping by address. Caps the recents collection
 * by trimming the oldest non-pinned (home/work/favorite) entries.
 */
export async function addRecentPlace(
  uid: string,
  place: { label: string; address: string; lat?: number; lng?: number },
  maxRecents = 6,
) {
  // Dedupe: don't add if the same address already exists
  const existing = await new Promise<SavedPlace[]>((resolve) => {
    const unsub = subscribeToPlaces(uid, (list) => {
      unsub();
      resolve(list);
    });
  });
  const duplicate = existing.find(
    (p) => p.address.trim().toLowerCase() === place.address.trim().toLowerCase(),
  );
  if (duplicate) {
    // If the saved entry is missing coords but we now have them (e.g. user
    // searched a place that resolved via Geocoding), backfill so future
    // picks can draw the route immediately.
    if (
      (duplicate.lat === undefined || duplicate.lng === undefined) &&
      place.lat !== undefined &&
      place.lng !== undefined
    ) {
      await updatePlace(uid, duplicate.id, { lat: place.lat, lng: place.lng });
    }
    return duplicate.id;
  }

  const id = await addPlace(uid, {
    label: place.label,
    address: place.address,
    type: 'recent',
    lat: place.lat,
    lng: place.lng,
  });

  // Trim: drop oldest recent entries beyond the cap
  const recents = existing.filter((p) => p.type === 'recent');
  if (recents.length >= maxRecents) {
    const toDrop = recents.slice(maxRecents - 1);
    await Promise.all(toDrop.map((p) => deletePlace(uid, p.id)));
  }

  return id;
}

