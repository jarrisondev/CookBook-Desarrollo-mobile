import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from '@firebase/app';
// @ts-expect-error – getReactNativePersistence is exported only by the RN
// bundle; metro.config.js forces @firebase/auth to resolve to dist/rn/index.js.
import { getReactNativePersistence, initializeAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import type { Auth } from '@firebase/auth';
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
