import { useEffect, useState } from 'react';
import { useAppSelector } from '../store';
import { subscribeToCards } from '../services/firebase/cards';
import type { StoredCard } from '../services/firebase/cards';

export function useUserCards() {
  const uid = useAppSelector((s) => s.auth.user?.uid);
  const [cards, setCards] = useState<StoredCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setCards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToCards(uid, (next) => {
      setCards(next);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  const defaultCard = cards.find((c) => c.default) ?? cards[0];
  return { cards, defaultCard, loading };
}
