import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, MapPlaceholder } from '../../components';
import { shadows } from '../../theme';
import { useAppSelector } from '../../store';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'TripInProgress'>;

export function TripInProgressScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const destination = useAppSelector((s) => s.ride.destination);

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showRoute showPulse={false} />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="bg-ink-900 rounded-2xl px-4 py-3 mt-2" style={shadows.card}>
          <Text className="text-white/70 text-xs">{t('inProgress.dropoff')}</Text>
          <View className="flex-row items-center mt-0.5">
            <MapPin size={16} color="#22C55E" />
            <Text className="text-white font-semibold ml-2 flex-1" numberOfLines={1}>
              {destination?.address ?? 'Tower Bridge, London'}
            </Text>
          </View>
        </View>
        <View
          className="self-center bg-primary-100 px-3 py-1 rounded-full mt-3"
          style={shadows.card}
        >
          <Text className="text-primary-700 font-semibold text-sm">
            {t('vehicleSelect.minutes', { count: 4 })}
          </Text>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8" style={shadows.cardLg}>
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />

          <View className="flex-row justify-between">
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">{t('inProgress.paymentType')}</Text>
              <Text className="text-ink-900 dark:text-white font-bold text-lg mt-0.5">
                {t('inProgress.promo')}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-muted dark:text-ink-400 text-xs">{t('inProgress.cash')}</Text>
              <Text className="text-ink-900 dark:text-white font-bold text-lg mt-0.5">
                {t('inProgress.applied')}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Button
              label={t('inProgress.endTrip')}
              onPress={() => navigation.replace('Payment')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
