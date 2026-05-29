import { useCallback, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MessageCircle, Phone, Star, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Avatar,
  Button,
  IconButton,
  RideMap,
} from '../../../components';
import { shadows } from '../../../theme';
import { useAppDispatch } from '../../../store';
import { setActiveRideId } from '../../../store/slices/driverSlice';
import {
  cancelRide,
  markDriverArrived,
} from '../../../services/firebase/rides';
import { secondsToMinutes } from '../../../services/google';
import type { Route } from '../../../services/google';
import { useIconColor } from '../../../hooks/useIconColor';
import { useDriverRideLocationPublisher } from '../../../hooks/useDriverRideLocationPublisher';
import { useDriverRideSubscription } from '../../../hooks/useDriverRideSubscription';
import { coarseCoords } from '../../../utils/coords';
import type { DriverStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<DriverStackParamList, 'DriverPickup'>;

export function DriverPickupScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconColor = useIconColor();
  const [loading, setLoading] = useState(false);
  const [liveRoute, setLiveRoute] = useState<Route | null>(null);
  const { ride, rideId } = useDriverRideSubscription();
  const liveCoords = useDriverRideLocationPublisher(rideId);
  const routeOrigin = coarseCoords(liveCoords ?? undefined);
  const handleRouteChange = useCallback((r: Route | null) => setLiveRoute(r), []);
  const liveEtaMin = liveRoute ? secondsToMinutes(liveRoute.durationSeconds) : undefined;

  const handleCancel = async () => {
    if (!rideId) return;
    try {
      await cancelRide(rideId);
    } catch {}
    if (navigation.canGoBack()) navigation.popToTop();
    dispatch(setActiveRideId(null));
  };

  const handleArrived = async () => {
    if (!rideId) return;
    setLoading(true);
    try {
      await markDriverArrived(rideId);
      navigation.replace('DriverWaiting');
    } catch (err) {
      Alert.alert('Viaje', err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (!ride) return null;

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <RideMap
        ride={ride}
        routeFrom={routeOrigin}
        routeTo={
          ride.pickup.lat !== undefined && ride.pickup.lng !== undefined
            ? { latitude: ride.pickup.lat, longitude: ride.pickup.lng }
            : undefined
        }
        driverLocation={liveCoords ?? undefined}
        onRouteChange={handleRouteChange}
        tightFit
      />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="flex-row items-center justify-between mt-2">
          <IconButton
            icon={<ChevronLeft size={22} color={iconColor.primary} />}
            onPress={() => navigation.goBack()}
          />
          <View className="bg-ink-900 px-4 py-1.5 rounded-full" style={shadows.card}>
            <Text className="text-white font-semibold text-sm">
              {t('driver.pickup.goingToPickup')} · {liveEtaMin ?? ride.etaMin ?? 4} min
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8"
          style={shadows.cardLg}
        >
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />

          <View className="flex-row items-center">
            <Avatar name={ride.riderName} size={56} />
            <View className="flex-1 ml-4">
              <Text className="text-ink-900 dark:text-white font-bold text-lg">
                {ride.riderName}
              </Text>
              {ride.riderRating !== undefined ? (
                <View className="flex-row items-center mt-0.5">
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text className="text-ink-700 dark:text-ink-200 text-sm ml-1">
                    {ride.riderRating.toFixed(1)}
                  </Text>
                </View>
              ) : null}
              <Text className="text-muted dark:text-ink-400 text-xs mt-0.5">
                {ride.pickup.address}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-6">
            <View className="items-center flex-1">
              <IconButton
                icon={<Phone size={20} color="#16A34A" />}
                onPress={() => undefined}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">
                {t('driver.pickup.callRider')}
              </Text>
            </View>
            <View className="items-center flex-1">
              <IconButton
                icon={<MessageCircle size={20} color="#16A34A" />}
                onPress={() => undefined}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">
                {t('driver.pickup.messageRider')}
              </Text>
            </View>
            <View className="items-center flex-1">
              <IconButton
                icon={<X size={20} color="#EF4444" />}
                onPress={handleCancel}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">
                {t('driver.pickup.cancelRide')}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Button
              label={t('driver.pickup.arrivedAtPickup')}
              onPress={handleArrived}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
