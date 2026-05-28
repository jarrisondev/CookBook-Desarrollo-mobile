import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, MapPlaceholder } from '../../components';
import { shadows } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { resetRide } from '../../store/slices/rideSlice';
import { formatCurrency } from '../../utils/format';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'SearchingDriver'>;

const SEARCH_DURATION_MS = 5000;

export function SearchingDriverScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const destination = useAppSelector((s) => s.ride.destination);
  const fare = useAppSelector((s) => s.ride.fareEstimate);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('RideTracking');
    }, SEARCH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  const handleCancel = () => {
    dispatch(resetRide());
    navigation.popToTop();
  };

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showPulse />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        {destination ? (
          <View
            className="bg-surface dark:bg-dark-surface rounded-2xl px-4 py-3 mt-2"
            style={shadows.card}
          >
            <Text className="text-muted dark:text-ink-400 text-xs">
              {t('vehicleSelect.goingTo')}
            </Text>
            <Text
              className="text-ink-900 dark:text-white font-semibold text-sm"
              numberOfLines={1}
            >
              {destination.address}
            </Text>
          </View>
        ) : null}
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-6 pb-8"
          style={shadows.cardLg}
        >
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />

          <View className="items-center">
            <Text className="text-ink-900 dark:text-white text-2xl font-bold text-center">
              {t('searching.title')}
            </Text>
            <Text className="text-muted dark:text-ink-400 text-base mt-2 text-center">
              {t('searching.subtitle')}
            </Text>
            {fare > 0 ? (
              <Text className="text-primary-600 text-3xl font-bold mt-4">
                {formatCurrency(fare)}
              </Text>
            ) : null}
          </View>

          <View className="mt-8">
            <Button
              label={t('searching.cancelSearch')}
              variant="secondary"
              onPress={handleCancel}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
