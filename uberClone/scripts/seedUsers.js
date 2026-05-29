/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require('firebase/auth');
const {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} = require('firebase/firestore');

const required = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '));
  process.exit(1);
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const accounts = [
  {
    email: 'rider@demo.com',
    password: 'demo1234',
    profile: {
      fullName: 'Jarrison Cano',
      phone: '+57 300 000 0000',
      gender: 'male',
      role: 'rider',
      level: 'Basic Level',
      balance: 0,
      rating: 5,
      language: 'es',
    },
  },
  {
    email: 'driver@demo.com',
    password: 'demo1234',
    profile: {
      fullName: 'Mahmud Hasan',
      phone: '+57 311 555 1212',
      gender: 'male',
      role: 'driver',
      level: 'Pro Driver',
      balance: 564.78,
      rating: 4.9,
      language: 'es',
      vehicle: {
        brand: 'Toyota',
        model: 'Corolla',
        color: 'White',
        plate: 'LON 9921',
        year: 2022,
        seats: 4,
        category: 'economic',
      },
    },
  },
];

async function ensureAccount(auth, db, account) {
  let cred;
  try {
    cred = await createUserWithEmailAndPassword(auth, account.email, account.password);
    console.log(`Created ${account.email}`);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      cred = await signInWithEmailAndPassword(auth, account.email, account.password);
      console.log(`Exists, signed in as ${account.email}`);
    } else {
      throw err;
    }
  }
  const uid = cred.user.uid;
  await setDoc(
    doc(db, 'users', uid),
    {
      uid,
      email: account.email,
      ...account.profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  console.log(`Profile written for ${account.email} (${uid})`);
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  for (const account of accounts) {
    try {
      await ensureAccount(auth, db, account);
    } catch (err) {
      console.error(`Failed for ${account.email}:`, err.message ?? err);
    }
  }
  console.log('Done.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
