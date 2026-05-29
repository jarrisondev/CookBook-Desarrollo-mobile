import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { resetRide } from '../store/slices/rideSlice';
import { subscribeToRide } from '../services/firebase/rides';
import type { Ride, RideStatus } from '../models';
import type { MainStackParamList } from '../navigation/types';

const statusToScreen: Partial<Record<RideStatus, keyof MainStackParamList>> = {
  searching: 'SearchingDriver',
  accepted: 'RideTracking',
  arrived: 'DriverArrived',
  inProgress: 'TripInProgress',
  completed: 'Rating',
};

export function useRideSubscription(onUpdate?: (ride: Ride) => void) {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const rideId = useAppSelector((s) => s.ride.currentRideId);

  useEffect(() => {
    if (!rideId) return;
    const unsub = subscribeToRide(rideId, (ride) => {
      if (!ride) return;
      onUpdate?.(ride);
      if (ride.status === 'cancelled') {
        dispatch(resetRide());
        if (navigation.canGoBack()) navigation.popToTop();
        return;
      }
      const target = statusToScreen[ride.status];
      const current = navigation.getState()?.routes.at(-1)?.name;
      if (target && current !== target) {
        (navigation.replace as (name: string) => void)(target);
      }
    });
    return unsub;
  }, [rideId, dispatch, navigation, onUpdate]);
}
