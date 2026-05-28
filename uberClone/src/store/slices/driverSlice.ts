import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type RideRequest = {
  id: string;
  riderName: string;
  riderRating: number;
  pickup: { label: string; address: string };
  dropoff: { label: string; address: string };
  fare: number;
  distanceKm: number;
  etaMin: number;
  bonusPercent?: number;
};

type DriverState = {
  online: boolean;
  currentRequest: RideRequest | null;
  activeRide: RideRequest | null;
};

const initialState: DriverState = {
  online: false,
  currentRequest: null,
  activeRide: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.online = action.payload;
      if (!action.payload) {
        state.currentRequest = null;
      }
    },
    setIncomingRequest(state, action: PayloadAction<RideRequest | null>) {
      state.currentRequest = action.payload;
    },
    acceptRequest(state) {
      if (state.currentRequest) {
        state.activeRide = state.currentRequest;
        state.currentRequest = null;
      }
    },
    rejectRequest(state) {
      state.currentRequest = null;
    },
    finishRide(state) {
      state.activeRide = null;
    },
    resetDriver() {
      return initialState;
    },
  },
});

export const {
  setOnline,
  setIncomingRequest,
  acceptRequest,
  rejectRequest,
  finishRide,
  resetDriver,
} = driverSlice.actions;
export const driverReducer = driverSlice.reducer;
