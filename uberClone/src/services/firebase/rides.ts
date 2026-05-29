import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@firebase/firestore';
import { db } from './config';
import { buildConverter, rideSchema } from '../../models';
import type {
  PaymentMethod,
  Ride,
  RideCategory,
  RidePoint,
  RideStatus,
  User,
} from '../../models';

const rideConverter = buildConverter<Ride>(rideSchema, 'id');
const ridesCollection = collection(db, 'rides').withConverter(rideConverter);

export function rideDocRef(rideId: string) {
  return doc(ridesCollection, rideId);
}

export type CreateRideInput = {
  rider: User;
  pickup: RidePoint;
  dropoff: RidePoint;
  category: RideCategory;
  fareEstimate: number;
  distanceKm?: number;
  etaMin?: number;
  paymentMethod?: PaymentMethod;
  cardLast4?: string;
  bonusPercent?: number;
};

export async function createRide(input: CreateRideInput): Promise<string> {
  const payload = {
    status: 'searching' as RideStatus,
    riderId: input.rider.uid,
    riderName: input.rider.fullName,
    riderPhone: input.rider.phone,
    riderPhotoUri: input.rider.photoUri,
    riderRating: input.rider.rating,
    pickup: input.pickup,
    dropoff: input.dropoff,
    category: input.category,
    fareEstimate: input.fareEstimate,
    paymentMethod: input.paymentMethod ?? 'cash',
    cardLast4: input.cardLast4,
    distanceKm: input.distanceKm,
    etaMin: input.etaMin,
    bonusPercent: input.bonusPercent,
    createdAt: serverTimestamp(),
  };
  const cleaned = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined),
  );
  const ref = await addDoc(collection(db, 'rides'), cleaned);
  return ref.id;
}

export async function acceptRide(rideId: string, driver: User) {
  await updateDoc(doc(db, 'rides', rideId), {
    status: 'accepted' satisfies RideStatus,
    driverId: driver.uid,
    driverName: driver.fullName,
    driverPhotoUri: driver.photoUri ?? null,
    driverRating: driver.rating,
    driverPlate: driver.vehicle?.plate ?? null,
    driverCar:
      driver.vehicle
        ? `${driver.vehicle.brand} ${driver.vehicle.model} · ${driver.vehicle.color}`
        : null,
    acceptedAt: serverTimestamp(),
  });
}

export async function markDriverArrived(rideId: string) {
  await updateDoc(doc(db, 'rides', rideId), {
    status: 'arrived' satisfies RideStatus,
    arrivedAt: serverTimestamp(),
  });
}

export async function startRide(rideId: string) {
  await updateDoc(doc(db, 'rides', rideId), {
    status: 'inProgress' satisfies RideStatus,
    startedAt: serverTimestamp(),
  });
}

export async function completeRide(
  rideId: string,
  data: { finalFare: number; tip?: number },
) {
  await updateDoc(doc(db, 'rides', rideId), {
    status: 'completed' satisfies RideStatus,
    finalFare: data.finalFare,
    tip: data.tip ?? 0,
    completedAt: serverTimestamp(),
  });
}

export async function publishDriverLocation(
  rideId: string,
  coords: { lat: number; lng: number },
) {
  await updateDoc(doc(db, 'rides', rideId), {
    driverLocation: {
      lat: coords.lat,
      lng: coords.lng,
      updatedAt: serverTimestamp(),
    },
  });
}

export async function cancelRide(rideId: string) {
  await updateDoc(doc(db, 'rides', rideId), {
    status: 'cancelled' satisfies RideStatus,
    cancelledAt: serverTimestamp(),
  });
}

export async function rateRide(
  rideId: string,
  data: { rating: number; comment?: string },
) {
  await updateDoc(doc(db, 'rides', rideId), {
    rating: data.rating,
    comment: data.comment ?? null,
  });
}

export function subscribeToRide(
  rideId: string,
  onChange: (ride: Ride | null) => void,
) {
  return onSnapshot(
    rideDocRef(rideId),
    (snap) => {
      try {
        onChange(snap.exists() ? snap.data() : null);
      } catch (err) {
        console.warn('[rides] subscribeToRide parse failed:', err);
      }
    },
    (err) => console.warn('[rides] subscribeToRide error:', err),
  );
}

export function subscribeToOpenRequests(
  onChange: (rides: Ride[]) => void,
) {
  const q = query(
    ridesCollection,
    where('status', '==', 'searching'),
    orderBy('createdAt', 'desc'),
    limit(10),
  );
  return onSnapshot(
    q,
    (snap) => {
      const rides: Ride[] = [];
      snap.docs.forEach((d) => {
        try {
          rides.push(d.data());
        } catch (err) {
          console.warn('[rides] subscribeToOpenRequests parse failed for', d.id, err);
        }
      });
      onChange(rides);
    },
    (err) => {
      const e = err as { code?: string; message?: string };
      console.warn(
        `[rides] subscribeToOpenRequests error code=${e.code ?? '?'} message=${e.message ?? err}`,
      );
    },
  );
}

export function subscribeToActiveRiderRide(
  riderId: string,
  onChange: (ride: Ride | null) => void,
) {
  const q = query(
    ridesCollection,
    where('riderId', '==', riderId),
    where('status', 'in', ['searching', 'accepted', 'arrived', 'inProgress']),
    limit(1),
  );
  return onSnapshot(
    q,
    (snap) => {
      try {
        onChange(snap.docs[0]?.data() ?? null);
      } catch (err) {
        console.warn('[rides] subscribeToActiveRiderRide parse failed:', err);
      }
    },
    (err) => {
      const e = err as { code?: string; message?: string };
      console.warn(
        `[rides] subscribeToActiveRiderRide error code=${e.code ?? '?'} message=${e.message ?? err}`,
      );
    },
  );
}

export function subscribeToActiveDriverRide(
  driverId: string,
  onChange: (ride: Ride | null) => void,
) {
  const q = query(
    ridesCollection,
    where('driverId', '==', driverId),
    where('status', 'in', ['accepted', 'arrived', 'inProgress']),
    limit(1),
  );
  return onSnapshot(
    q,
    (snap) => {
      try {
        onChange(snap.docs[0]?.data() ?? null);
      } catch (err) {
        console.warn('[rides] subscribeToActiveDriverRide parse failed:', err);
      }
    },
    (err) => console.warn('[rides] subscribeToActiveDriverRide error:', err),
  );
}

export async function getRiderHistory(riderId: string): Promise<Ride[]> {
  const q = query(
    ridesCollection,
    where('riderId', '==', riderId),
    where('status', 'in', ['completed', 'cancelled']),
    orderBy('createdAt', 'desc'),
    limit(50),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function getDriverHistory(driverId: string): Promise<Ride[]> {
  const q = query(
    ridesCollection,
    where('driverId', '==', driverId),
    where('status', 'in', ['completed', 'cancelled']),
    orderBy('createdAt', 'desc'),
    limit(50),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
