import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Language = 'es' | 'en';

type PreferencesState = {
  language: Language;
  pushNotifications: boolean;
  promoOffers: boolean;
  darkMode: boolean;
};

const initialState: PreferencesState = {
  language: 'es',
  pushNotifications: true,
  promoOffers: true,
  darkMode: false,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    togglePushNotifications(state, action: PayloadAction<boolean>) {
      state.pushNotifications = action.payload;
    },
    togglePromoOffers(state, action: PayloadAction<boolean>) {
      state.promoOffers = action.payload;
    },
    toggleDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
  },
});

export const {
  setLanguage,
  togglePushNotifications,
  togglePromoOffers,
  toggleDarkMode,
} = preferencesSlice.actions;
export const preferencesReducer = preferencesSlice.reducer;
