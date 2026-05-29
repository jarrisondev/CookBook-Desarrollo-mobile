import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PaymentMethod, RideCategory, RidePoint } from '../../models';

type RideState = {
  currentRideId: string | null;
  pickup: RidePoint | null;
  destination: RidePoint | null;
  selectedCategory: RideCategory;
  fareEstimate: number;
  paymentMethod: PaymentMethod;
};

const initialState: RideState = {
  currentRideId: null,
  pickup: null,
  destination: null,
  selectedCategory: 'economic',
  fareEstimate: 0,
  paymentMethod: 'cash',
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
    setCategory(state, action: PayloadAction<RideCategory>) {
      state.selectedCategory = action.payload;
    },
    setFareEstimate(state, action: PayloadAction<number>) {
      state.fareEstimate = action.payload;
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload;
    },
    setCurrentRideId(state, action: PayloadAction<string | null>) {
      state.currentRideId = action.payload;
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
  setPaymentMethod,
  setCurrentRideId,
  resetRide,
} = rideSlice.actions;
export const rideReducer = rideSlice.reducer;
