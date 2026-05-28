import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Phone, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, IconButton, MapPlaceholder } from '../../components';
import { shadows } from '../../theme';
import { mockDriver } from '../../constants/mockData';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'DriverArrived'>;

const PICKUP_MS = 5000;

export function DriverArrivedScreen({ navigation }: Props) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('TripInProgress');
    }, PICKUP_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showPulse />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="bg-primary-500 px-4 py-2 rounded-full self-center mt-2" style={shadows.card}>
          <Text className="text-white font-semibold text-sm">
            {t('arrived.waiting')}
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
              {t('arrived.title')}
            </Text>
            <Text className="text-muted dark:text-ink-400 text-sm mt-2 text-center">
              {t('arrived.subtitle')}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Avatar name={mockDriver.name} size={56} />
            <View className="flex-1 ml-4">
              <Text className="text-ink-900 dark:text-white font-bold text-lg">
                {mockDriver.name}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-ink-700 dark:text-ink-200 text-sm ml-1">
                  {mockDriver.rating.toFixed(1)}
                </Text>
                <Text className="text-muted dark:text-ink-400 text-sm"> · {mockDriver.car}</Text>
              </View>
              <Text className="text-muted dark:text-ink-400 text-xs mt-0.5">
                {mockDriver.plate}
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
                {t('tracking.call')}
              </Text>
            </View>
            <View className="items-center">
              <IconButton
                icon={<MessageCircle size={20} color="#16A34A" />}
                onPress={() => undefined}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">
                {t('tracking.message')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
