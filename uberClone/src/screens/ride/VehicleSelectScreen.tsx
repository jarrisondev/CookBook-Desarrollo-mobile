import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Award,
  Bus,
  Car,
  ChevronLeft,
  CreditCard,
  DollarSign,
  Tag,
  Users,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, IconButton, MapView } from '../../components';
import type { MapMarker } from '../../components';
import { shadows } from '../../theme';
import { useIconColor } from '../../hooks/useIconColor';
import { useLocation } from '../../hooks/useLocation';
import { useUserCards } from '../../hooks/useUserCards';
import { rideCategories } from '../../constants/mockData';
import { formatCurrency } from '../../utils/format';
import { calculateFare } from '../../utils/fare';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  setCategory,
  setCurrentRideId,
  setDestination,
  setFareEstimate,
  setPaymentMethod,
} from '../../store/slices/rideSlice';
import { createRide } from '../../services/firebase/rides';
import { addRecentPlace } from '../../services/firebase/places';
import {
  geocodeAddress,
  getRoute,
  metersToKm,
  secondsToMinutes,
} from '../../services/google';
import type { Route } from '../../services/google';
import type { PaymentMethod } from '../../models';
import type { Coordinates } from '../../hooks/useLocation';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'VehicleSelect'>;

const categoryIcons: Record<'economic' | 'xl' | 'premium', LucideIcon> = {
  economic: Car,
  xl: Bus,
  premium: Award,
};

export function VehicleSelectScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconColor = useIconColor();
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<Route | null>(null);
  const [sheetHeight, setSheetHeight] = useState(360);
  const user = useAppSelector((s) => s.auth.user);
  const destinationState = useAppSelector((s) => s.ride.destination);
  const selectedId = useAppSelector((s) => s.ride.selectedCategory);
  const paymentMethod = useAppSelector((s) => s.ride.paymentMethod);
  const selected = rideCategories.find((c) => c.id === selectedId) ?? rideCategories[0];
  const destinationAddress = route.params?.destination ?? destinationState?.address ?? '—';
  const { defaultCard } = useUserCards();
  const { coords: userCoords } = useLocation();

  const pickupCoord: Coordinates = userCoords;
  const destinationCoord: Coordinates | null =
    destinationState?.lat !== undefined && destinationState?.lng !== undefined
      ? { latitude: destinationState.lat, longitude: destinationState.lng }
      : null;

  // If we don't have coords for the destination yet (Place Details didn't
  // return location), fall back to Geocoding the address so we can still
  // draw the route + compute a real fare.
  useEffect(() => {
    if (!destinationState) return;
    if (destinationState.lat !== undefined && destinationState.lng !== undefined) return;
    let cancelled = false;
    geocodeAddress(destinationState.address)
      .then((coords) => {
        if (cancelled || !coords) return;
        dispatch(
          setDestination({
            ...destinationState,
            lat: coords.latitude,
            lng: coords.longitude,
          }),
        );
      })
      .catch((err) => {
        if (!cancelled) console.warn('[geocode] fallback failed:', err);
      });
    return () => {
      cancelled = true;
    };
  }, [destinationState, dispatch]);

  // Load real route + distance + ETA between pickup and destination
  useEffect(() => {
    if (!destinationCoord) {
      setRouteInfo(null);
      return;
    }
    let cancelled = false;
    getRoute(pickupCoord, destinationCoord)
      .then((r) => {
        if (!cancelled) setRouteInfo(r);
      })
      .catch((err) => {
        if (!cancelled) console.warn('[directions] failed:', err);
      });
    return () => {
      cancelled = true;
    };
  }, [
    pickupCoord.latitude,
    pickupCoord.longitude,
    destinationCoord?.latitude,
    destinationCoord?.longitude,
  ]);

  const distanceKm = routeInfo ? metersToKm(routeInfo.distanceMeters) : undefined;
  const etaMin = routeInfo ? secondsToMinutes(routeInfo.durationSeconds) : undefined;

  // Per-category dynamic fare based on the real Directions result.
  const fareFor = (catId: typeof rideCategories[number]['id']) => {
    const cat = rideCategories.find((c) => c.id === catId)!;
    return calculateFare(cat, distanceKm, etaMin);
  };
  const selectedFare = fareFor(selected.id);

  // Keep the global fareEstimate in sync so the SearchingDriver screen + ride
  // doc use the same number we are showing the user here.
  useEffect(() => {
    dispatch(setFareEstimate(selectedFare));
  }, [selectedFare, dispatch]);

  const markers: MapMarker[] = [];
  markers.push({
    id: 'pickup',
    coordinate: pickupCoord,
    title: t('vehicleSelect.goingTo'),
    pinColor: '#22C55E',
  });
  if (destinationCoord) {
    markers.push({
      id: 'dropoff',
      coordinate: destinationCoord,
      title: destinationAddress,
      pinColor: '#0F1115',
    });
  }

  // Coords the camera should fit so pickup + dropoff + the route are visible.
  const fitTo: Coordinates[] = [pickupCoord];
  if (destinationCoord) fitTo.push(destinationCoord);
  if (routeInfo?.polyline && routeInfo.polyline.length > 1) {
    fitTo.push(...routeInfo.polyline);
  }

  const methods: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
    { id: 'cash', label: t('payment.cash'), icon: DollarSign },
    { id: 'card', label: t('payment.card'), icon: CreditCard },
    { id: 'wallet', label: t('payment.wallet'), icon: WalletIcon },
  ];

  const handleSelect = (id: typeof rideCategories[number]['id']) => {
    dispatch(setCategory(id));
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
    if (paymentMethod === 'card' && !defaultCard) {
      Alert.alert(t('vehicleSelect.paymentMethod'), t('wallet.noCards'));
      return;
    }
    setLoading(true);
    try {
      dispatch(setFareEstimate(selectedFare));
      const rideId = await createRide({
        rider: user,
        pickup: {
          label: 'Mi ubicación',
          address: 'Ubicación actual',
          lat: pickupCoord.latitude,
          lng: pickupCoord.longitude,
        },
        dropoff: destinationState,
        category: selected.id,
        fareEstimate: selectedFare,
        distanceKm: distanceKm ?? 0,
        etaMin: etaMin ?? selected.defaultEtaMin,
        paymentMethod,
        cardLast4: paymentMethod === 'card' ? defaultCard?.last4 : undefined,
      });
      dispatch(setCurrentRideId(rideId));
      void addRecentPlace(user.uid, {
        label: destinationState.label,
        address: destinationState.address,
        lat: destinationState.lat,
        lng: destinationState.lng,
      }).catch(() => undefined);
      navigation.navigate('SearchingDriver');
    } catch (err) {
      Alert.alert('Viaje', err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapView
        initialCoordinates={pickupCoord}
        markers={markers}
        routePolyline={routeInfo?.polyline}
        fitTo={fitTo.length >= 2 ? fitTo : undefined}
        edgePadding={{
          top: 140,
          right: 40,
          bottom: sheetHeight + 24,
          left: 40,
        }}
        showMyLocationButton={false}
      />

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
            {distanceKm !== undefined && etaMin !== undefined ? (
              <Text className="text-primary-600 text-[11px] font-semibold mt-0.5">
                {distanceKm} km · {etaMin} min
              </Text>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

      <View
        className="absolute bottom-0 left-0 right-0"
        onLayout={(e: LayoutChangeEvent) => {
          const h = e.nativeEvent.layout.height;
          if (Math.abs(h - sheetHeight) > 4) setSheetHeight(h);
        }}
      >
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
              const CategoryIcon = categoryIcons[cat.id];
              const catFare = fareFor(cat.id);
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
                  <View
                    className={`w-12 h-12 rounded-2xl items-center justify-center ${
                      isSelected ? 'bg-primary-500' : 'bg-ink-100 dark:bg-ink-700'
                    }`}
                  >
                    <CategoryIcon
                      size={26}
                      color={isSelected ? '#fff' : iconColor.primary}
                      strokeWidth={2.2}
                    />
                  </View>
                  <Text className="text-ink-900 dark:text-white font-bold mt-2">{label}</Text>
                  <View className="flex-row items-center mt-1">
                    <Users size={12} color="#6B7280" />
                    <Text className="text-muted dark:text-ink-400 text-xs ml-1">
                      {t('vehicleSelect.seats', { count: cat.capacity })}
                    </Text>
                  </View>
                  <Text className="text-primary-600 font-bold text-base mt-2">
                    {formatCurrency(catFare)}
                  </Text>
                  <Text className="text-muted dark:text-ink-400 text-xs">
                    {t('vehicleSelect.minutes', { count: etaMin ?? cat.defaultEtaMin })}
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

          {paymentMethod === 'card' ? (
            defaultCard ? (
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
            ) : (
              <Pressable
                onPress={() => navigation.navigate('AddCard')}
                className="mt-3 flex-row items-center justify-center bg-primary-50 rounded-2xl px-4 py-3"
              >
                <CreditCard size={18} color="#16A34A" />
                <Text className="text-primary-700 font-semibold ml-2">
                  {t('wallet.addNewCard')}
                </Text>
              </Pressable>
            )
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
                price: formatCurrency(selectedFare),
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
