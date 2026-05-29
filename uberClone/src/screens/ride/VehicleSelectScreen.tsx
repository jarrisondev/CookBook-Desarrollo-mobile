import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  CreditCard,
  DollarSign,
  Tag,
  Users,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, IconButton, MapPlaceholder } from '../../components';
import { shadows } from '../../theme';
import { useIconColor } from '../../hooks/useIconColor';
import { rideCategories, paymentCards } from '../../constants/mockData';
import { formatCurrency } from '../../utils/format';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setCategory,
  setCurrentRideId,
  setFareEstimate,
  setPaymentMethod,
} from '../../store/slices/rideSlice';
import { createRide } from '../../services/firebase/rides';
import type { PaymentMethod } from '../../models';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'VehicleSelect'>;

export function VehicleSelectScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconColor = useIconColor();
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((s) => s.auth.user);
  const destinationState = useAppSelector((s) => s.ride.destination);
  const selectedId = useAppSelector((s) => s.ride.selectedCategory);
  const paymentMethod = useAppSelector((s) => s.ride.paymentMethod);
  const selected = rideCategories.find((c) => c.id === selectedId) ?? rideCategories[0];
  const destinationAddress = route.params?.destination ?? destinationState?.address ?? '—';
  const defaultCard = paymentCards.find((c) => c.default);

  const methods: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
    { id: 'cash', label: t('payment.cash'), icon: DollarSign },
    { id: 'card', label: t('payment.card'), icon: CreditCard },
    { id: 'wallet', label: t('payment.wallet'), icon: WalletIcon },
  ];

  const handleSelect = (id: typeof rideCategories[number]['id']) => {
    const cat = rideCategories.find((c) => c.id === id)!;
    dispatch(setCategory(id));
    dispatch(setFareEstimate(cat.price));
  };

  const handleBook = async () => {
    if (!user) {
      Alert.alert('Login', 'Inicia sesión para pedir un viaje');
      return;
    }
    if (!destinationState) {
      Alert.alert('Viaje', 'Elige un destino primero');
      return;
    }
    setLoading(true);
    try {
      dispatch(setFareEstimate(selected.price));
      const rideId = await createRide({
        rider: user,
        pickup: { label: 'Mi ubicación', address: 'Ubicación actual' },
        dropoff: destinationState,
        category: selected.id,
        fareEstimate: selected.price,
        distanceKm: 3.2,
        etaMin: selected.etaMin,
        paymentMethod,
      });
      dispatch(setCurrentRideId(rideId));
      navigation.navigate('SearchingDriver');
    } catch (err) {
      Alert.alert('Viaje', err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
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
          <View
            className="ml-3 bg-surface dark:bg-dark-surface rounded-2xl flex-1 px-4 py-2"
            style={shadows.card}
          >
            <Text className="text-muted dark:text-ink-400 text-xs">
              {t('vehicleSelect.goingTo')}
            </Text>
            <Text
              className="text-ink-900 dark:text-white font-semibold text-sm"
              numberOfLines={1}
            >
              {destinationAddress}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <ScrollView
          className="bg-surface dark:bg-dark-surface rounded-t-3xl"
          style={shadows.cardLg}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="self-center w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mb-5" />
          <Text className="text-ink-900 dark:text-white font-bold text-lg mb-4">
            {t('vehicleSelect.title')}
          </Text>

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
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-border dark:border-dark-border bg-surface dark:bg-dark-surface'
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

          <Text className="text-ink-900 dark:text-white font-bold text-base mt-6 mb-3">
            {t('vehicleSelect.paymentMethod')}
          </Text>
          <View className="flex-row gap-2">
            {methods.map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => dispatch(setPaymentMethod(m.id))}
                  className={`flex-1 items-center py-3 rounded-2xl border ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-border dark:border-dark-border bg-surface dark:bg-dark-surface'
                  }`}
                >
                  <Icon size={20} color={isSelected ? '#16A34A' : '#6B7280'} />
                  <Text
                    className={`text-xs font-semibold mt-1.5 ${
                      isSelected ? 'text-primary-700' : 'text-ink-700 dark:text-ink-200'
                    }`}
                  >
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {paymentMethod === 'card' && defaultCard ? (
            <View className="mt-3 flex-row items-center bg-ink-50 dark:bg-ink-700 rounded-2xl px-4 py-3">
              <View className="w-8 h-8 bg-ink-900 rounded-lg items-center justify-center mr-3">
                <CreditCard size={16} color="#fff" />
              </View>
              <Text className="text-ink-900 dark:text-white font-semibold flex-1">
                •••• {defaultCard.last4}
              </Text>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {defaultCard.expires}
              </Text>
            </View>
          ) : null}

          <View className="mt-4 flex-row items-center justify-end">
            <Tag size={14} color="#16A34A" />
            <Text className="text-primary-600 font-semibold text-sm ml-1">
              {t('vehicleSelect.promo')}
            </Text>
          </View>

          <View className="mt-5">
            <Button
              label={t('vehicleSelect.book', {
                label: t(`ride.categories.${selected.id}`),
                price: formatCurrency(selected.price),
              })}
              onPress={handleBook}
              loading={loading}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
