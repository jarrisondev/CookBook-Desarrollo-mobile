import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type RideCategoryId = 'economic' | 'xl' | 'premium';
export type RideStatus = 'idle' | 'searching' | 'matched' | 'inProgress' | 'completed' | 'cancelled';

export type RidePoint = {
  label: string;
  address: string;
  lat?: number;
  lng?: number;
};

type RideState = {
  status: RideStatus;
  pickup: RidePoint | null;
  destination: RidePoint | null;
  selectedCategory: RideCategoryId;
  fareEstimate: number;
  driverId?: string;
};

const initialState: RideState = {
  status: 'idle',
  pickup: null,
  destination: null,
  selectedCategory: 'economic',
  fareEstimate: 0,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setPickup(state, action: PayloadAction<RidePoint | null>) {
      state.pickup = action.payload;
    },
    setDestination(state, action: PayloadAction<RidePoint | null>) {
      state.destination = action.payload;
    },
    setCategory(state, action: PayloadAction<RideCategoryId>) {
      state.selectedCategory = action.payload;
    },
    setFareEstimate(state, action: PayloadAction<number>) {
      state.fareEstimate = action.payload;
    },
    setStatus(state, action: PayloadAction<RideStatus>) {
      state.status = action.payload;
    },
    resetRide() {
      return initialState;
    },
  },
});

export const {
  setPickup,
  setDestination,
  setCategory,
  setFareEstimate,
  setStatus,
  resetRide,
} = rideSlice.actions;
export const rideReducer = rideSlice.reducer;
