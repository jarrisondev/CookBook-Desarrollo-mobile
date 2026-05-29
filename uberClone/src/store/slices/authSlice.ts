import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../models';

type AuthState = {
  status: 'loading' | 'unauthenticated' | 'authenticated';
  user: User | null;
};

const initialState: AuthState = {
  status: 'loading',
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authResolved(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
    },
    signedIn(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    signedOut(state) {
      state.user = null;
      state.status = 'unauthenticated';
    },
    profileUpdated(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { authResolved, signedIn, signedOut, profileUpdated } = authSlice.actions;
export const authReducer = authSlice.reducer;
export type { User };
export type UserRole = User['role'];
