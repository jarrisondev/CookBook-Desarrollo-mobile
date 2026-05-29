import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Phone, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Avatar,
  Button,
  IconButton,
  RideMap,
} from '../../../components';
import { shadows } from '../../../theme';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setActiveRideId } from '../../../store/slices/driverSlice';
import { startRide, subscribeToRide } from '../../../services/firebase/rides';
import type { Ride } from '../../../models';
import type { DriverStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<DriverStackParamList, 'DriverWaiting'>;

export function DriverWaitingScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rideId = useAppSelector((s) => s.driver.activeRideId);
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rideId) {
      if (navigation.canGoBack()) navigation.goBack();
      return;
    }
    const unsub = subscribeToRide(rideId, (r) => {
      if (!r) return;
      setRide(r);
      if (r.status === 'cancelled') {
        dispatch(setActiveRideId(null));
        if (navigation.canGoBack()) navigation.popToTop();
      }
    });
    return unsub;
  }, [rideId, navigation, dispatch]);

  const handleStart = async () => {
    if (!rideId) return;
    setLoading(true);
    try {
      await startRide(rideId);
      navigation.replace('DriverInProgress');
    } catch (err) {
      Alert.alert('Viaje', err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  if (!ride) return null;

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <RideMap ride={ride} />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View
          className="bg-primary-500 px-4 py-2 rounded-full self-center mt-2"
          style={shadows.card}
        >
          <Text className="text-white font-semibold text-sm">
            {t('driver.waiting.title')}
          </Text>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8"
          style={shadows.cardLg}
        >
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />

          <View className="items-center mb-5">
            <Text className="text-ink-900 dark:text-white text-2xl font-bold text-center">
              {t('driver.waiting.title')}
            </Text>
            <Text className="text-muted dark:text-ink-400 text-sm mt-2 text-center">
              {t('driver.waiting.subtitle')}
            </Text>
          </View>

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

          <View className="flex-row justify-around mt-6">
            <View className="items-center">
              <IconButton
                icon={<Phone size={20} color="#16A34A" />}
                onPress={() => undefined}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">
                {t('driver.pickup.callRider')}
              </Text>
            </View>
            <View className="items-center">
              <IconButton
                icon={<MessageCircle size={20} color="#16A34A" />}
                onPress={() => undefined}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">
                {t('driver.pickup.messageRider')}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Button
              label={t('driver.waiting.startTrip')}
              onPress={handleStart}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
