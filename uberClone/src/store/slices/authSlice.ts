import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Gender = 'male' | 'female' | 'other';
export type UserRole = 'rider' | 'driver';

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  role: UserRole;
  photoUri?: string;
  level: string;
  balance: number;
};

type AuthState = {
  isAuthenticated: boolean;
  user: UserProfile | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<UserProfile>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    signOut(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { signIn, signOut, updateProfile } = authSlice.actions;
export const authReducer = authSlice.reducer;
