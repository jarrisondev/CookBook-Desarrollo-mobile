import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { Car, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../../../components';
import { shadows } from '../../../theme';
import { formatCurrency, formatTripDate } from '../../../utils/format';
import { useAppSelector } from '../../../store';
import { getDriverHistory } from '../../../services/firebase/rides';
import type { Ride } from '../../../models';
import type { DriverTabScreenProps } from '../../../navigation/types';

type Props = DriverTabScreenProps<'DriverHistory'>;

export function DriverHistoryScreen(_: Props) {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const [trips, setTrips] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getDriverHistory(user.uid);
      setTrips(data);
    } catch (err) {
      console.warn('[history] getDriverHistory failed:', err);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void fetchTrips();
    }, [fetchTrips]),
  );

  return (
    <ScreenContainer>
      <View className="mt-4">
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">
          {t('driver.history.title')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-sm mt-1">
          {t('driver.history.subtitle')}
        </Text>
      </View>

      {loading ? (
        <View className="items-center justify-center mt-20">
          <ActivityIndicator color="#16A34A" />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            const earnings = (item.finalFare ?? item.fareEstimate) + (item.tip ?? 0);
            return (
              <View
                className="bg-surface dark:bg-dark-surface rounded-2xl p-4"
                style={shadows.card}
              >
                <View className="flex-row items-center">
                  <View className="w-11 h-11 rounded-full bg-primary-100 items-center justify-center mr-3">
                    <Car size={20} color="#16A34A" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-ink-900 dark:text-white font-bold">
                      {item.riderName}
                    </Text>
                    {item.createdAt ? (
                      <Text className="text-muted dark:text-ink-400 text-xs mt-0.5">
                        {formatTripDate(timestampToIso(item.createdAt))}
                      </Text>
                    ) : null}
                  </View>
                  <View className="items-end">
                    <Text className="text-ink-900 dark:text-white font-bold">
                      {formatCurrency(earnings)}
                    </Text>
                    {item.rating ? (
                      <View className="flex-row items-center mt-0.5">
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text className="text-muted dark:text-ink-400 text-xs ml-1">
                          {item.rating}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-ink-100 dark:border-dark-border">
                  <Text className="text-muted dark:text-ink-400 text-xs flex-1" numberOfLines={1}>
                    {item.pickup.label} → {item.dropoff.label}
                  </Text>
                  {item.tip && item.tip > 0 ? (
                    <Text className="text-primary-600 text-xs font-semibold ml-3">
                      {t('driver.history.tip')} +{formatCurrency(item.tip)}
                    </Text>
                  ) : null}
                  <Text
                    className={`text-xs font-semibold ml-3 ${
                      item.status === 'completed' ? 'text-primary-600' : 'text-danger'
                    }`}
                  >
                    {item.status === 'completed'
                      ? t('common.completed')
                      : t('common.cancelled')}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20">
              <Text className="text-muted dark:text-ink-400">
                {t('driver.history.empty')}
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

function timestampToIso(ts: unknown): string {
  if (
    ts &&
    typeof ts === 'object' &&
    'seconds' in ts &&
    typeof (ts as { seconds: number }).seconds === 'number'
  ) {
    return new Date((ts as { seconds: number }).seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}
