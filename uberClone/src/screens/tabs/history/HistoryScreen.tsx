import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Car } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { Chip, ScreenContainer } from '../../../components';
import { shadows } from '../../../theme';
import { formatCurrency, formatTripDate } from '../../../utils/format';
import { useAppSelector } from '../../../store';
import { getRiderHistory } from '../../../services/firebase/rides';
import type { Ride } from '../../../models';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'History'>;

type Filter = 'all' | 'completed' | 'cancelled';

export function HistoryScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const user = useAppSelector((s) => s.auth.user);
  const [trips, setTrips] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getRiderHistory(user.uid);
      setTrips(data);
    } catch (err) {
      console.warn('[history] getRiderHistory failed:', err);
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

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('history.all') },
    { id: 'completed', label: t('history.completed') },
    { id: 'cancelled', label: t('history.cancelled') },
  ];

  const data = trips.filter((trip) =>
    filter === 'all' ? true : trip.status === filter,
  );

  return (
    <ScreenContainer>
      <View className="mt-4">
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">
          {t('history.title')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-sm mt-1">
          {t('history.subtitle')}
        </Text>
      </View>

      <View className="flex-row gap-2 mt-5 mb-2">
        {filters.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={filter === f.id}
            onPress={() => setFilter(f.id)}
          />
        ))}
      </View>

      {loading ? (
        <View className="items-center justify-center mt-20">
          <ActivityIndicator color="#16A34A" />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => {
            const price = item.finalFare ?? item.fareEstimate;
            return (
              <Pressable
                onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
                className="bg-surface dark:bg-dark-surface rounded-2xl p-4"
                style={shadows.card}
              >
                <View className="flex-row items-center">
                  <View className="w-11 h-11 rounded-full bg-primary-100 items-center justify-center mr-3">
                    <Car size={20} color="#16A34A" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-ink-900 dark:text-white font-bold">
                      {item.pickup.label} → {item.dropoff.label}
                    </Text>
                    {item.createdAt ? (
                      <Text className="text-muted dark:text-ink-400 text-xs mt-0.5">
                        {formatTripDate(timestampToIso(item.createdAt))}
                      </Text>
                    ) : null}
                  </View>
                  <View className="items-end">
                    <Text className="text-ink-900 dark:text-white font-bold">
                      {formatCurrency(price)}
                    </Text>
                    <Text
                      className={`text-xs font-semibold mt-0.5 ${
                        item.status === 'completed' ? 'text-primary-600' : 'text-danger'
                      }`}
                    >
                      {item.status === 'completed'
                        ? t('common.completed')
                        : t('common.cancelled')}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View className="items-center justify-center mt-20">
              <Text className="text-muted dark:text-ink-400">{t('history.empty')}</Text>
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
