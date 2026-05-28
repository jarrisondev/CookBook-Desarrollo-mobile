import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CreditCard, Tag, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, IconButton, MapPlaceholder } from '../../components';
import { shadows } from '../../theme';
import { useIconColor } from '../../hooks/useIconColor';
import { rideCategories } from '../../constants/mockData';
import { formatCurrency } from '../../utils/format';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCategory, setFareEstimate } from '../../store/slices/rideSlice';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'VehicleSelect'>;

export function VehicleSelectScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconColor = useIconColor();
  const selectedId = useAppSelector((s) => s.ride.selectedCategory);
  const selected = rideCategories.find((c) => c.id === selectedId) ?? rideCategories[0];
  const destination = route.params?.destination ?? '—';

  const handleSelect = (id: typeof rideCategories[number]['id']) => {
    const cat = rideCategories.find((c) => c.id === id)!;
    dispatch(setCategory(id));
    dispatch(setFareEstimate(cat.price));
  };

  const handleBook = () => {
    dispatch(setFareEstimate(selected.price));
    navigation.navigate('SearchingDriver');
  };

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showRoute showPulse={false} />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="flex-row items-center mt-2">
          <IconButton
            icon={<ChevronLeft size={22} color={iconColor.primary} />}
            onPress={() => navigation.goBack()}
          />
          <View className="ml-3 bg-surface dark:bg-dark-surface rounded-2xl flex-1 px-4 py-2" style={shadows.card}>
            <Text className="text-muted dark:text-ink-400 text-xs">{t('vehicleSelect.goingTo')}</Text>
            <Text className="text-ink-900 dark:text-white font-semibold text-sm" numberOfLines={1}>
              {destination}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8" style={shadows.cardLg}>
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />
          <Text className="text-ink-900 dark:text-white font-bold text-lg mb-4">{t('vehicleSelect.title')}</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingRight: 8 }}
          >
            {rideCategories.map((cat) => {
              const isSelected = cat.id === selectedId;
              const label = t(`ride.categories.${cat.id}`);
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => handleSelect(cat.id)}
                  className={`w-40 rounded-2xl p-4 border ${
                    isSelected ? 'border-primary-500 bg-primary-50' : 'border-border dark:border-dark-border bg-surface dark:bg-dark-surface'
                  }`}
                >
                  <Text className="text-4xl">{cat.emoji}</Text>
                  <Text className="text-ink-900 dark:text-white font-bold mt-2">{label}</Text>
                  <View className="flex-row items-center mt-1">
                    <Users size={12} color="#6B7280" />
                    <Text className="text-muted dark:text-ink-400 text-xs ml-1">
                      {t('vehicleSelect.seats', { count: cat.capacity })}
                    </Text>
                  </View>
                  <Text className="text-primary-600 font-bold text-base mt-2">
                    {formatCurrency(cat.price)}
                  </Text>
                  <Text className="text-muted dark:text-ink-400 text-xs">
                    {t('vehicleSelect.minutes', { count: cat.etaMin })}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mt-5 flex-row items-center justify-between bg-ink-50 dark:bg-ink-700 rounded-2xl px-4 py-3">
            <View className="flex-row items-center">
              <CreditCard size={18} color={iconColor.primary} />
              <Text className="text-ink-900 dark:text-white font-semibold ml-2">{t('payment.cash')}</Text>
            </View>
            <View className="flex-row items-center">
              <Tag size={14} color="#16A34A" />
              <Text className="text-primary-600 font-semibold text-sm ml-1">
                {t('vehicleSelect.promo')}
              </Text>
            </View>
          </View>

          <View className="mt-5">
            <Button
              label={t('vehicleSelect.book', {
                label: t(`ride.categories.${selected.id}`),
                price: formatCurrency(selected.price),
              })}
              onPress={handleBook}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
