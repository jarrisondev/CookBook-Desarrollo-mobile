import { useEffect, useRef } from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { resetRide, setCurrentRideId } from '../store/slices/rideSlice';
import { subscribeToActiveRiderRide } from '../services/firebase/rides';
import type { MainStackParamList } from '../navigation/types';
import type { RideStatus } from '../models';

const statusToScreen: Partial<Record<RideStatus, keyof MainStackParamList>> = {
  searching: 'SearchingDriver',
  accepted: 'RideTracking',
  arrived: 'DriverArrived',
  inProgress: 'TripInProgress',
};

const rideFlowScreens = new Set<keyof MainStackParamList>([
  'SearchingDriver',
  'RideTracking',
  'DriverArrived',
  'TripInProgress',
  'Payment',
  'Rating',
]);

type AnyNav =
  | (NavigationProp<Record<string, object | undefined>> & {
      getState?: () => { routeNames?: readonly string[] } | undefined;
      getParent?: () => AnyNav | undefined;
    })
  | undefined;

function findStackOwning(nav: AnyNav, target: string): AnyNav {
  let current = nav;
  while (current) {
    const routeNames = current.getState?.()?.routeNames ?? [];
    if (routeNames.includes(target)) return current;
    current = current.getParent?.();
  }
  return undefined;
}

function findRideStack(nav: AnyNav): AnyNav {
  return (
    findStackOwning(nav, 'SearchingDriver') ??
    findStackOwning(nav, 'RideTracking') ??
    nav
  );
}

/**
 * Restores the rider's active ride on app boot (or when navigating into the
 * Main stack). If a ride exists, it sets `currentRideId` in redux and pushes
 * the matching screen. If the ride goes away (cancelled or completed) while
 * the rider is sitting on a ride-flow screen, it pops back to Tabs.
 */
export function useRiderActiveRideBootstrap() {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAppSelector((s) => s.auth.user);
  const lastRideId = useRef<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'rider') return;
    const unsub = subscribeToActiveRiderRide(user.uid, (ride) => {
      console.log(
        `[rider-bootstrap] active ride: ${
          ride ? `${ride.id} (${ride.status})` : 'none'
        }`,
      );

      const stack = findRideStack(navigation as AnyNav);
      const currentRoute = (
        stack as unknown as {
          getState?: () => { routes: { name: string }[] } | undefined;
        }
      )?.getState?.()?.routes.at(-1)?.name as
        | keyof MainStackParamList
        | undefined;

      if (!ride) {
        if (lastRideId.current) {
          dispatch(resetRide());
          lastRideId.current = null;
          if (currentRoute && rideFlowScreens.has(currentRoute)) {
            const s = stack as
              | (AnyNav & { canGoBack?: () => boolean; popToTop?: () => void })
              | undefined;
            if (s?.canGoBack?.()) s.popToTop?.();
          }
        }
        return;
      }

      lastRideId.current = ride.id;
      dispatch(setCurrentRideId(ride.id));

      const target = statusToScreen[ride.status];
      if (!target || currentRoute === target) return;
      setTimeout(() => {
        if (stack) {
          (stack.navigate as (name: string) => void)(target);
        }
      }, 0);
    });
    return unsub;
  }, [user, dispatch, navigation]);
}
