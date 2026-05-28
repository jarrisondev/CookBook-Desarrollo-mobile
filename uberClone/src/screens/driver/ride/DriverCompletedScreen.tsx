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
import { finishRide } from '../../../store/slices/driverSlice';
import { formatCurrency } from '../../../utils/format';
import type { DriverStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<DriverStackParamList, 'DriverCompleted'>;

const TIP = 1.5;

export function DriverCompletedScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const ride = useAppSelector((s) => s.driver.activeRide);

  const handleNext = () => {
    dispatch(finishRide());
    navigation.popToTop();
  };

  if (!ride) {
    return null;
  }

  const baseFare = ride.fare;
  const total = baseFare + TIP;

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
          {ride.riderName} · {ride.distanceKm} km
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
        <View className="flex-row justify-between py-1.5">
          <Text className="text-muted dark:text-ink-400">{t('driver.completed.tip')}</Text>
          <Text className="text-primary-600 font-semibold">
            {formatCurrency(TIP)}
          </Text>
        </View>
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
