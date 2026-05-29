import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store';
import { resetRide, setCurrentRideId } from '../store/slices/rideSlice';
import { subscribeToActiveRiderRide } from '../services/firebase/rides';
import {
  findRideStack,
  getCurrentRouteName,
  navigateOnStack,
  popOutOfRideFlow,
  type RideNav,
} from './_rideNavigationHelpers';
import type { MainStackParamList } from '../navigation/types';
import type { RideStatus } from '../models';

const STATUS_TO_SCREEN: Partial<Record<RideStatus, keyof MainStackParamList>> = {
  searching: 'SearchingDriver',
  accepted: 'RideTracking',
  arrived: 'DriverArrived',
  inProgress: 'TripInProgress',
};

const RIDE_FLOW_SCREENS = new Set<string>([
  'SearchingDriver',
  'RideTracking',
  'DriverArrived',
  'TripInProgress',
  'Payment',
  'Rating',
]);

/**
 * Restores the rider's active ride on app boot (or when entering the Main
 * stack). Navigates to the matching screen if a ride exists, and pops back
 * to Tabs when it goes away.
 */
export function useRiderActiveRideBootstrap() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const user = useAppSelector((s) => s.auth.user);
  const lastRideId = useRef<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'rider') return;
    return subscribeToActiveRiderRide(user.uid, (ride) => {
      const stack: RideNav = findRideStack(navigation as RideNav, 'SearchingDriver');
      const currentRoute = getCurrentRouteName(stack);

      if (!ride) {
        if (!lastRideId.current) return;
        dispatch(resetRide());
        lastRideId.current = null;
        popOutOfRideFlow(stack, currentRoute, RIDE_FLOW_SCREENS);
        return;
      }

      lastRideId.current = ride.id;
      dispatch(setCurrentRideId(ride.id));

      const target = STATUS_TO_SCREEN[ride.status];
      if (!target || currentRoute === target) return;
      navigateOnStack(stack, target);
    });
  }, [user, dispatch, navigation]);
}
