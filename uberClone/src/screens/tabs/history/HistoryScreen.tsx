import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Car } from 'lucide-react-native';
import { Chip, ScreenContainer } from '../../../components';
import { shadows } from '../../../theme';
import { tripHistory } from '../../../constants/mockData';
import { formatCurrency, formatTripDate } from '../../../utils/format';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'History'>;

type Filter = 'all' | 'completed' | 'cancelled';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export function HistoryScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const data = tripHistory.filter((t) => (filter === 'all' ? true : t.status === filter));

  return (
    <ScreenContainer>
      <View className="mt-4">
        <Text className="text-ink-900 text-2xl font-bold">Your trips</Text>
        <Text className="text-muted text-sm mt-1">Review your recent rides</Text>
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

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 12, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
            className="bg-surface rounded-2xl p-4"
            style={shadows.card}
          >
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-full bg-primary-100 items-center justify-center mr-3">
                <Car size={20} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text className="text-ink-900 font-bold">{item.from} → {item.to}</Text>
                <Text className="text-muted text-xs mt-0.5">{formatTripDate(item.date)}</Text>
              </View>
              <View className="items-end">
                <Text className="text-ink-900 font-bold">{formatCurrency(item.price)}</Text>
                <Text
                  className={`text-xs font-semibold mt-0.5 ${
                    item.status === 'completed' ? 'text-primary-600' : 'text-danger'
                  }`}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Text className="text-muted">No trips yet</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
