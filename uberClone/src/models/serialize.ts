import { Timestamp } from '@firebase/firestore';
import type { Ride, User } from './index';

function timestampToIso(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    typeof (value as { seconds: number }).seconds === 'number'
  ) {
    return new Date((value as { seconds: number }).seconds * 1000).toISOString();
  }
  if (typeof value === 'string') return value;
  return undefined;
}

export function serializeUser(user: User): User {
  return {
    ...user,
    createdAt: timestampToIso(user.createdAt) as User['createdAt'],
    updatedAt: timestampToIso(user.updatedAt) as User['updatedAt'],
  };
}

export function serializeRide(ride: Ride): Ride {
  return {
    ...ride,
    createdAt: timestampToIso(ride.createdAt) as Ride['createdAt'],
    acceptedAt: timestampToIso(ride.acceptedAt) as Ride['acceptedAt'],
    arrivedAt: timestampToIso(ride.arrivedAt) as Ride['arrivedAt'],
    startedAt: timestampToIso(ride.startedAt) as Ride['startedAt'],
    completedAt: timestampToIso(ride.completedAt) as Ride['completedAt'],
    cancelledAt: timestampToIso(ride.cancelledAt) as Ride['cancelledAt'],
  };
}
