import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type DriverState = {
  online: boolean;
  activeRideId: string | null;
};

const initialState: DriverState = {
  online: false,
  activeRideId: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.online = action.payload;
    },
    setActiveRideId(state, action: PayloadAction<string | null>) {
      state.activeRideId = action.payload;
    },
    resetDriver() {
      return initialState;
    },
  },
});

export const { setOnline, setActiveRideId, resetDriver } = driverSlice.actions;
export const driverReducer = driverSlice.reducer;
