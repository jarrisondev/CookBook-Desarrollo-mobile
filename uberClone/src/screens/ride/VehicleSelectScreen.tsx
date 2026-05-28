import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CreditCard, Tag, Users } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, IconButton, MapPlaceholder } from '../../components';
import { shadows } from '../../theme';
import { rideCategories } from '../../constants/mockData';
import { formatCurrency } from '../../utils/format';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'VehicleSelect'>;

export function VehicleSelectScreen({ navigation, route }: Props) {
  const [selectedId, setSelectedId] = useState<typeof rideCategories[number]['id']>('economic');
  const selected = rideCategories.find((c) => c.id === selectedId)!;
  const destination = route.params?.destination ?? 'Selected destination';

  return (
    <View className="flex-1 bg-bg">
      <MapPlaceholder showRoute showPulse={false} />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="flex-row items-center mt-2">
          <IconButton
            icon={<ChevronLeft size={22} color="#0F1115" />}
            onPress={() => navigation.goBack()}
          />
          <View className="ml-3 bg-surface rounded-2xl flex-1 px-4 py-2" style={shadows.card}>
            <Text className="text-muted text-xs">Going to</Text>
            <Text className="text-ink-900 font-semibold text-sm" numberOfLines={1}>
              {destination}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View className="bg-surface rounded-t-3xl px-5 pt-5 pb-8" style={shadows.cardLg}>
          <View className="self-center w-12 h-1.5 bg-ink-200 rounded-full mb-5" />
          <Text className="text-ink-900 font-bold text-lg mb-4">Choose your ride</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 8 }}
          >
            {rideCategories.map((cat) => {
              const isSelected = cat.id === selectedId;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedId(cat.id)}
                  className={`w-40 rounded-2xl p-4 border ${
                    isSelected ? 'border-primary-500 bg-primary-50' : 'border-border bg-surface'
                  }`}
                >
                  <Text className="text-4xl">{cat.emoji}</Text>
                  <Text className="text-ink-900 font-bold mt-2">{cat.label}</Text>
                  <View className="flex-row items-center mt-1">
                    <Users size={12} color="#6B7280" />
                    <Text className="text-muted text-xs ml-1">{cat.capacity} seats</Text>
                  </View>
                  <Text className="text-primary-600 font-bold text-base mt-2">
                    {formatCurrency(cat.price)}
                  </Text>
                  <Text className="text-muted text-xs">{cat.etaMin} min</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mt-5 flex-row items-center justify-between bg-ink-50 rounded-2xl px-4 py-3">
            <View className="flex-row items-center">
              <CreditCard size={18} color="#0F1115" />
              <Text className="text-ink-900 font-semibold ml-2">Cash</Text>
            </View>
            <View className="flex-row items-center">
              <Tag size={14} color="#16A34A" />
              <Text className="text-primary-600 font-semibold text-sm ml-1">Promo 15%</Text>
            </View>
          </View>

          <View className="mt-5">
            <Button
              label={`Book ${selected.label} · ${formatCurrency(selected.price)}`}
              onPress={() => navigation.navigate('RideTracking')}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
