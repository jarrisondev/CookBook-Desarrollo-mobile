import { Text, View } from 'react-native';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  MapPlaceholder,
  ScreenContainer,
} from '../../../components';
import { useIconColor } from '../../../hooks/useIconColor';
import { tripHistory } from '../../../constants/mockData';
import { formatCurrency, formatTripDate } from '../../../utils/format';
import type { MainStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'TripDetail'>;

export function TripDetailScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const iconColor = useIconColor();
  const trip = tripHistory.find((tt) => tt.id === route.params.tripId) ?? tripHistory[0];

  return (
    <ScreenContainer scroll padded={false}>
      <View className="h-56 relative">
        <MapPlaceholder showRoute showPulse={false} />
        <View className="absolute top-4 left-5">
          <IconButton
            icon={<ChevronLeft size={22} color={iconColor.primary} />}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>

      <View className="px-5 -mt-6">
        <Card>
          <View className="flex-row items-center">
            <Avatar name={trip.driverName} size={48} />
            <View className="ml-3 flex-1">
              <Text className="text-ink-900 dark:text-white font-bold">{trip.driverName}</Text>
              <Text className="text-muted dark:text-ink-400 text-xs">{formatTripDate(trip.date)}</Text>
            </View>
            <Text className="text-ink-900 dark:text-white font-bold text-lg">{formatCurrency(trip.price)}</Text>
          </View>

          <Divider className="my-4" />

          <View className="gap-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center mr-3">
                <MapPin size={16} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text className="text-muted dark:text-ink-400 text-xs">{t('tripDetail.pickup')}</Text>
                <Text className="text-ink-900 dark:text-white font-semibold">{trip.from}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-ink-900 items-center justify-center mr-3">
                <MapPin size={16} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-muted dark:text-ink-400 text-xs">{t('tripDetail.dropoff')}</Text>
                <Text className="text-ink-900 dark:text-white font-semibold">{trip.to}</Text>
              </View>
            </View>
          </View>
        </Card>

        <View className="mt-4">
          <Card>
            <Text className="text-ink-900 dark:text-white font-bold mb-3">{t('tripDetail.fareDetails')}</Text>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-muted dark:text-ink-400">{t('tripDetail.baseFare')}</Text>
              <Text className="text-ink-900 dark:text-white font-semibold">{formatCurrency(4.5)}</Text>
            </View>
            <View className="flex-row justify-between py-1.5">
              <Text className="text-muted dark:text-ink-400">{t('tripDetail.distance')}</Text>
              <Text className="text-ink-900 dark:text-white font-semibold">
                {formatCurrency(trip.price - 4.5)}
              </Text>
            </View>
            <Divider className="my-3" />
            <View className="flex-row justify-between">
              <Text className="text-ink-900 dark:text-white font-bold">{t('tripDetail.total')}</Text>
              <Text className="text-ink-900 dark:text-white font-bold">{formatCurrency(trip.price)}</Text>
            </View>
          </Card>
        </View>
      </View>
    </ScreenContainer>
  );
}
