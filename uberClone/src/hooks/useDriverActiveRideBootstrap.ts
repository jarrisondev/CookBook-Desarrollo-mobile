import { useEffect, useRef } from 'react';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { setActiveRideId } from '../store/slices/driverSlice';
import { subscribeToActiveDriverRide } from '../services/firebase/rides';
import type { DriverStackParamList } from '../navigation/types';
import type { RideStatus } from '../models';

const statusToScreen: Partial<Record<RideStatus, keyof DriverStackParamList>> = {
  accepted: 'DriverPickup',
  arrived: 'DriverWaiting',
  inProgress: 'DriverInProgress',
};

const rideFlowScreens = new Set<keyof DriverStackParamList>([
  'IncomingRide',
  'DriverPickup',
  'DriverWaiting',
  'DriverInProgress',
  'DriverCompleted',
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
  // The ride-flow screens live in the same stack, so finding the one that
  // owns any of them gives us the stack we want for popToTop / current
  // route checks.
  return (
    findStackOwning(nav, 'DriverPickup') ??
    findStackOwning(nav, 'RideTracking') ??
    nav
  );
}

/**
 * Restores the driver's active ride on app boot. If a ride exists
 * (accepted/arrived/inProgress), it sets `activeRideId` in redux and
 * navigates to the matching screen. If the ride goes away, it clears
 * the id and pops back to DriverTabs.
 */
export function useDriverActiveRideBootstrap() {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<DriverStackParamList>>();
  const user = useAppSelector((s) => s.auth.user);
  const lastRideId = useRef<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'driver') return;
    const unsub = subscribeToActiveDriverRide(user.uid, (ride) => {
      console.log(
        `[driver-bootstrap] active ride: ${
          ride ? `${ride.id} (${ride.status})` : 'none'
        }`,
      );

      const stack = findRideStack(navigation as AnyNav);
      const currentRoute = stack?.getState?.()?.routeNames
        ? ((stack as unknown as {
            getState: () => { routes: { name: string }[] };
          }).getState().routes.at(-1)?.name as
            | keyof DriverStackParamList
            | undefined)
        : undefined;

      if (!ride) {
        if (lastRideId.current) {
          dispatch(setActiveRideId(null));
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
      dispatch(setActiveRideId(ride.id));

      const target = statusToScreen[ride.status];
      if (!target || currentRoute === target) return;
      // Defer to next tick so we don't trigger setState during render of
      // the screen that owns the listener.
      setTimeout(() => {
        if (stack) {
          (stack.navigate as (name: string) => void)(target);
        }
      }, 0);
    });
    return unsub;
  }, [user, dispatch, navigation]);
}
