import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MessageCircle, Phone, Star, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Button, IconButton, MapPlaceholder } from '../../components';
import { shadows } from '../../theme';
import { useIconColor } from '../../hooks/useIconColor';
import { mockDriver } from '../../constants/mockData';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'RideTracking'>;

export function RideTrackingScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const iconColor = useIconColor();

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showRoute showPulse={false} />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="flex-row items-center justify-between mt-2">
          <IconButton
            icon={<ChevronLeft size={22} color={iconColor.primary} />}
            onPress={() => navigation.goBack()}
          />
          <View className="bg-ink-900 px-4 py-1.5 rounded-full" style={shadows.card}>
            <Text className="text-white font-semibold text-sm">
              {t('tracking.minAway', { count: mockDriver.etaMin })}
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8" style={shadows.cardLg}>
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />

          <View className="flex-row items-center">
            <Avatar name={mockDriver.name} size={56} />
            <View className="flex-1 ml-4">
              <Text className="text-ink-900 dark:text-white font-bold text-lg">{mockDriver.name}</Text>
              <View className="flex-row items-center mt-0.5">
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-ink-700 dark:text-ink-200 text-sm ml-1">{mockDriver.rating.toFixed(1)}</Text>
                <Text className="text-muted dark:text-ink-400 text-sm"> · {mockDriver.car}</Text>
              </View>
              <Text className="text-muted dark:text-ink-400 text-xs mt-0.5">Plate {mockDriver.plate}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-6">
            <View className="items-center flex-1">
              <IconButton
                icon={<Phone size={20} color="#16A34A" />}
                onPress={() => undefined}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">{t('tracking.call')}</Text>
            </View>
            <View className="items-center flex-1">
              <IconButton
                icon={<MessageCircle size={20} color="#16A34A" />}
                onPress={() => undefined}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">
                {t('tracking.message')}
              </Text>
            </View>
            <View className="items-center flex-1">
              <IconButton
                icon={<X size={20} color="#EF4444" />}
                onPress={() => navigation.goBack()}
                size={52}
              />
              <Text className="text-ink-900 dark:text-white text-xs font-semibold mt-2">
                {t('common.cancel')}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Button
              label={t('tracking.driverArrived')}
              onPress={() => navigation.replace('TripInProgress')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
