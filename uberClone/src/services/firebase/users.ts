import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import { db } from './config';
import { buildConverter, userSchema } from '../../models';
import type { User, Vehicle } from '../../models';

const userConverter = buildConverter<User>(userSchema, 'uid');
const usersCollection = collection(db, 'users').withConverter(userConverter);

export function userDocRef(uid: string) {
  return doc(usersCollection, uid);
}

export async function createUserProfile(
  uid: string,
  data: Pick<User, 'email' | 'fullName' | 'phone' | 'gender' | 'role'> &
    Partial<Pick<User, 'language' | 'level' | 'balance' | 'rating' | 'photoUri'>>,
): Promise<User> {
  const ref = userDocRef(uid);
  const profile: User = {
    uid,
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    gender: data.gender,
    role: data.role,
    photoUri: data.photoUri,
    language: data.language ?? 'es',
    level: data.level ?? (data.role === 'driver' ? 'Basic Driver' : 'Basic Level'),
    balance: data.balance ?? 0,
    rating: data.rating ?? 5,
  };
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as User);
  return profile;
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(userDocRef(uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid: string, patch: Partial<User>) {
  await updateDoc(doc(db, 'users', uid), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserVehicle(uid: string, vehicle: Vehicle) {
  await updateDoc(doc(db, 'users', uid), {
    vehicle,
    updatedAt: serverTimestamp(),
  });
}
