import { useEffect } from 'react';
import { observeAuthState } from '../services/firebase/auth';
import { getUserProfile } from '../services/firebase/users';
import { serializeUser } from '../models';
import { useAppDispatch } from '../store';
import { authResolved } from '../store/slices/authSlice';

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = observeAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch(authResolved(null));
        return;
      }
      try {
        const profile = await getUserProfile(firebaseUser.uid);
        dispatch(authResolved(profile ? serializeUser(profile) : null));
      } catch {
        dispatch(authResolved(null));
      }
    });
    return unsub;
  }, [dispatch]);
}
