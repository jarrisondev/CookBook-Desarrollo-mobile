import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveRideId } from '../store/slices/driverSlice';
import { subscribeToActiveDriverRide } from '../services/firebase/rides';
import {
  findRideStack,
  getCurrentRouteName,
  navigateOnStack,
  popOutOfRideFlow,
  type RideNav,
} from './_rideNavigationHelpers';
import type { DriverStackParamList } from '../navigation/types';
import type { RideStatus } from '../models';

const STATUS_TO_SCREEN: Partial<Record<RideStatus, keyof DriverStackParamList>> = {
  accepted: 'DriverPickup',
  arrived: 'DriverWaiting',
  inProgress: 'DriverInProgress',
};

const RIDE_FLOW_SCREENS = new Set<string>([
  'IncomingRide',
  'DriverPickup',
  'DriverWaiting',
  'DriverInProgress',
  'DriverCompleted',
]);

/**
 * Restores the driver's active ride on app boot. Navigates to the matching
 * screen if a ride is in progress and pops back to DriverTabs otherwise.
 */
export function useDriverActiveRideBootstrap() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const user = useAppSelector((s) => s.auth.user);
  const lastRideId = useRef<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'driver') return;
    return subscribeToActiveDriverRide(user.uid, (ride) => {
      const stack: RideNav = findRideStack(navigation as RideNav, 'DriverPickup');
      const currentRoute = getCurrentRouteName(stack);

      if (!ride) {
        if (!lastRideId.current) return;
        dispatch(setActiveRideId(null));
        lastRideId.current = null;
        popOutOfRideFlow(stack, currentRoute, RIDE_FLOW_SCREENS);
        return;
      }

      lastRideId.current = ride.id;
      dispatch(setActiveRideId(ride.id));

      const target = STATUS_TO_SCREEN[ride.status];
      if (!target || currentRoute === target) return;
      navigateOnStack(stack, target);
    });
  }, [user, dispatch, navigation]);
}
