import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  Card,
  Divider,
  ScreenContainer,
} from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setActiveRideId } from '../../../store/slices/driverSlice';
import { subscribeToRide } from '../../../services/firebase/rides';
import { formatCurrency } from '../../../utils/format';
import type { Ride } from '../../../models';
import type { DriverStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<DriverStackParamList, 'DriverCompleted'>;

export function DriverCompletedScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rideId = useAppSelector((s) => s.driver.activeRideId);
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    if (!rideId) {
      navigation.reset({ index: 0, routes: [{ name: 'DriverTabs' }] });
      return;
    }
    const unsub = subscribeToRide(rideId, (r) => {
      if (r) setRide(r);
    });
    return unsub;
  }, [rideId, navigation]);

  const handleNext = () => {
    dispatch(setActiveRideId(null));
    navigation.reset({ index: 0, routes: [{ name: 'DriverTabs' }] });
  };

  if (!ride) return null;

  const baseFare = ride.finalFare ?? ride.fareEstimate;
  const tip = ride.tip ?? 0;
  const total = baseFare + tip;

  return (
    <ScreenContainer scroll>
      <View className="items-center mt-10">
        <View className="w-20 h-20 rounded-full bg-primary-500 items-center justify-center mb-4">
          <Star size={40} color="#fff" fill="#fff" />
        </View>
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">
          {t('driver.completed.tripCompleted')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-sm mt-1">
          {ride.riderName} · {ride.distanceKm ?? 0} km
        </Text>
      </View>

      <View className="items-center mt-8 mb-6">
        <Text className="text-muted dark:text-ink-400 text-sm">
          {t('driver.completed.youEarned')}
        </Text>
        <Text className="text-primary-600 text-5xl font-bold mt-1">
          {formatCurrency(total)}
        </Text>
      </View>

      <Card>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-muted dark:text-ink-400">
            {t('driver.completed.baseFare')}
          </Text>
          <Text className="text-ink-900 dark:text-white font-semibold">
            {formatCurrency(baseFare)}
          </Text>
        </View>
        {tip > 0 ? (
          <View className="flex-row justify-between py-1.5">
            <Text className="text-muted dark:text-ink-400">{t('driver.completed.tip')}</Text>
            <Text className="text-primary-600 font-semibold">{formatCurrency(tip)}</Text>
          </View>
        ) : null}
        <Divider className="my-3" />
        <View className="flex-row justify-between">
          <Text className="text-ink-900 dark:text-white font-bold">
            {t('driver.completed.total')}
          </Text>
          <Text className="text-ink-900 dark:text-white font-bold">
            {formatCurrency(total)}
          </Text>
        </View>
      </Card>

      <View className="mt-8">
        <Button label={t('driver.completed.next')} onPress={handleNext} />
      </View>
    </ScreenContainer>
  );
}
