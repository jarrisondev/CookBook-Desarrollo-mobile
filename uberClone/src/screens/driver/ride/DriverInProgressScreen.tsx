import { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, RideMap } from '../../../components';
import { shadows } from '../../../theme';
import { completeRide } from '../../../services/firebase/rides';
import { useDriverRideLocationPublisher } from '../../../hooks/useDriverRideLocationPublisher';
import { useDriverRideSubscription } from '../../../hooks/useDriverRideSubscription';
import { metersToKm, secondsToMinutes } from '../../../services/google';
import type { Route } from '../../../services/google';
import { coarseCoords } from '../../../utils/coords';
import { formatCurrency } from '../../../utils/format';
import type { DriverStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<DriverStackParamList, 'DriverInProgress'>;

export function DriverInProgressScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [liveRoute, setLiveRoute] = useState<Route | null>(null);
  const { ride, rideId } = useDriverRideSubscription();
  const liveCoords = useDriverRideLocationPublisher(rideId);
  const routeOrigin = coarseCoords(liveCoords ?? undefined);
  const handleRouteChange = useCallback((r: Route | null) => setLiveRoute(r), []);
  const liveEtaMin = liveRoute ? secondsToMinutes(liveRoute.durationSeconds) : undefined;
  const liveDistanceKm = liveRoute ? metersToKm(liveRoute.distanceMeters) : undefined;

  const completeAndNavigate = async () => {
    if (!rideId || !ride) return;
    setLoading(true);
    try {
      await completeRide(rideId, { finalFare: ride.fareEstimate });
      navigation.replace('DriverCompleted');
    } catch (err) {
      Alert.alert('Viaje', err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = () => {
    if (!ride) return;
    if (ride.paymentMethod === 'cash') {
      Alert.alert(
        t('driver.inProgress.confirmCashTitle'),
        t('driver.inProgress.confirmCashMessage', {
          amount: formatCurrency(ride.fareEstimate),
        }),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('driver.inProgress.confirmCash'),
            onPress: () => {
              void completeAndNavigate();
            },
          },
        ],
      );
    } else {
      void completeAndNavigate();
    }
  };

  if (!ride) return null;

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <RideMap
        ride={ride}
        routeFrom={routeOrigin}
        driverLocation={liveCoords ?? undefined}
        onRouteChange={handleRouteChange}
        tightFit
        hidePickupMarker
      />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="bg-ink-900 rounded-2xl px-4 py-3 mt-2" style={shadows.card}>
          <Text className="text-white/70 text-xs">{t('driver.incoming.dropoff')}</Text>
          <View className="flex-row items-center mt-0.5">
            <MapPin size={16} color="#22C55E" />
            <Text className="text-white font-semibold ml-2 flex-1" numberOfLines={1}>
              {ride.dropoff.address}
            </Text>
          </View>
        </View>
        <View
          className="self-center bg-primary-100 px-3 py-1 rounded-full mt-3"
          style={shadows.card}
        >
          <Text className="text-primary-700 font-semibold text-sm">
            {t('driver.inProgress.etaToDropoff', { count: liveEtaMin ?? ride.etaMin ?? 4 })}
          </Text>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8"
          style={shadows.cardLg}
        >
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />

          <Text className="text-ink-900 dark:text-white font-bold text-lg mb-1">
            {t('driver.inProgress.tripInProgress')}
          </Text>
          <Text className="text-muted dark:text-ink-400 text-sm mb-6">
            {ride.riderName} · {liveDistanceKm ?? ride.distanceKm ?? 0} km ·{' '}
            {ride.paymentMethod === 'cash'
              ? t('payment.cash')
              : ride.paymentMethod === 'card'
                ? t('payment.card')
                : t('payment.wallet')}
          </Text>

          <Button
            label={t('driver.inProgress.endTrip')}
            onPress={handleEnd}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
}
