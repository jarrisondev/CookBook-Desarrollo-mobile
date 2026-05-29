import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveRideId } from '../store/slices/driverSlice';
import { subscribeToRide } from '../services/firebase/rides';
import type { Ride } from '../models';
import type { DriverStackParamList } from '../navigation/types';

/**
 * Subscribes the driver to its active ride doc and exposes the latest
 * snapshot. When the ride is cancelled, clears `activeRideId` and pops
 * back to the driver tabs. When `activeRideId` is missing (e.g. user
 * navigated directly), goes back so we don't render an empty screen.
 */
export function useDriverRideSubscription() {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const rideId = useAppSelector((s) => s.driver.activeRideId);
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    if (!rideId) {
      if (navigation.canGoBack()) navigation.goBack();
      return;
    }
    return subscribeToRide(rideId, (r) => {
      if (!r) return;
      setRide(r);
      if (r.status === 'cancelled') {
        dispatch(setActiveRideId(null));
        if (navigation.canGoBack()) navigation.popToTop();
      }
    });
  }, [rideId, navigation, dispatch]);

  return { ride, rideId };
}
