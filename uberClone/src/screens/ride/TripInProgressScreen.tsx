import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RideMap } from '../../components';
import { secondsToMinutes } from '../../services/google';
import type { Route } from '../../services/google';
import { shadows } from '../../theme';
import { useAppSelector } from '../../store';
import { useRideSubscription } from '../../hooks/useRideSubscription';
import type { Ride } from '../../models';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'TripInProgress'>;

export function TripInProgressScreen(_: Props) {
  const { t } = useTranslation();
  const destinationState = useAppSelector((s) => s.ride.destination);
  const [ride, setRide] = useState<Ride | null>(null);
  const [liveRoute, setLiveRoute] = useState<Route | null>(null);

  useRideSubscription(setRide);
  const handleRouteChange = useCallback((r: Route | null) => setLiveRoute(r), []);
  const liveEtaMin = liveRoute ? secondsToMinutes(liveRoute.durationSeconds) : undefined;

  const driverCoords = ride?.driverLocation
    ? {
        latitude: ride.driverLocation.lat,
        longitude: ride.driverLocation.lng,
      }
    : undefined;

  const destinationAddress =
    ride?.dropoff.address ?? destinationState?.address ?? '—';

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <RideMap
        ride={ride}
        showMyLocationButton={false}
        driverLocation={driverCoords}
        routeFrom={driverCoords}
        onRouteChange={handleRouteChange}
        tightFit
        hidePickupMarker
      />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="bg-ink-900 rounded-2xl px-4 py-3 mt-2" style={shadows.card}>
          <Text className="text-white/70 text-xs">{t('inProgress.dropoff')}</Text>
          <View className="flex-row items-center mt-0.5">
            <MapPin size={16} color="#22C55E" />
            <Text className="text-white font-semibold ml-2 flex-1" numberOfLines={1}>
              {destinationAddress}
            </Text>
          </View>
        </View>
        <View
          className="self-center bg-primary-100 px-3 py-1 rounded-full mt-3"
          style={shadows.card}
        >
          <Text className="text-primary-700 font-semibold text-sm">
            {t('inProgress.etaToDestination', { count: liveEtaMin ?? ride?.etaMin ?? 4 })}
          </Text>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8"
          style={shadows.cardLg}
        >
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />

          <Text className="text-ink-900 dark:text-white text-xl font-bold text-center">
            {t('inProgress.enjoy')}
          </Text>

          <View className="flex-row justify-between mt-6">
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('inProgress.paymentType')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold text-lg mt-0.5">
                {t('inProgress.promo')}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('inProgress.cash')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold text-lg mt-0.5">
                {t('inProgress.applied')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
