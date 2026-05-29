import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from '@firebase/firestore';
import { db } from './config';

export type CardBrand = 'visa' | 'mastercard';

export type NewCardInput = {
  brand: CardBrand;
  last4: string;
  holder: string;
  expires: string;
};

export type StoredCard = NewCardInput & {
  id: string;
  default?: boolean;
};

function cardsRef(uid: string) {
  return collection(db, 'users', uid, 'cards');
}

function cardDoc(uid: string, cardId: string) {
  return doc(db, 'users', uid, 'cards', cardId);
}

function parseCard(id: string, data: Record<string, unknown>): StoredCard {
  return {
    id,
    brand: data.brand as CardBrand,
    last4: String(data.last4),
    holder: String(data.holder),
    expires: String(data.expires),
    default: Boolean(data.default),
  };
}

export async function addCardForUser(uid: string, card: NewCardInput) {
  const existing = await getDocs(cardsRef(uid));
  const isFirst = existing.empty;
  const ref = await addDoc(cardsRef(uid), {
    ...card,
    default: isFirst,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listCardsForUser(uid: string): Promise<StoredCard[]> {
  const q = query(cardsRef(uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => parseCard(d.id, d.data()));
}

export function subscribeToCards(
  uid: string,
  onChange: (cards: StoredCard[]) => void,
) {
  const q = query(cardsRef(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => onChange(snap.docs.map((d) => parseCard(d.id, d.data()))),
    (err) => console.warn('[cards] subscribeToCards error:', err),
  );
}

export async function setDefaultCard(uid: string, cardId: string) {
  const snap = await getDocs(cardsRef(uid));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.update(d.ref, { default: d.id === cardId });
  });
  await batch.commit();
}

export async function deleteCard(uid: string, cardId: string) {
  await deleteDoc(cardDoc(uid, cardId));
  // If we deleted the default, promote the most recent remaining card
  const remaining = await listCardsForUser(uid);
  if (remaining.length > 0 && !remaining.some((c) => c.default)) {
    await setDefaultCard(uid, remaining[0].id);
  }
}

export function detectBrand(cardNumberDigits: string): CardBrand {
  if (cardNumberDigits.startsWith('4')) return 'visa';
  return 'mastercard';
}
