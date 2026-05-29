import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Check,
  ChevronLeft,
  CreditCard,
  DollarSign,
  Plus,
  Wallet as WalletIcon,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  Card,
  Divider,
  IconButton,
  ScreenContainer,
} from '../../components';
import { useIconColor } from '../../hooks/useIconColor';
import { useUserCards } from '../../hooks/useUserCards';
import { formatCurrency } from '../../utils/format';
import { useAppSelector } from '../../store';
import { completeRide } from '../../services/firebase/rides';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Payment'>;

type Method = 'cash' | 'card' | 'wallet';

export function PaymentScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const iconColor = useIconColor();
  const rideId = useAppSelector((s) => s.ride.currentRideId);
  const fareEstimate = useAppSelector((s) => s.ride.fareEstimate);
  const [method, setMethod] = useState<Method>('card');
  const [loading, setLoading] = useState(false);

  const baseFare = fareEstimate > 0 ? fareEstimate : 5.5;
  const distance = 3.2;
  const discount = -(baseFare + distance) * 0.15;
  const total = Math.max(baseFare + distance + discount, 0);
  const { defaultCard } = useUserCards();

  const methods: { id: Method; label: string; icon: typeof CreditCard }[] = [
    { id: 'cash', label: t('payment.cash'), icon: DollarSign },
    { id: 'card', label: t('payment.card'), icon: CreditCard },
    { id: 'wallet', label: t('payment.wallet'), icon: WalletIcon },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (rideId) {
        await completeRide(rideId, { finalFare: total });
      }
    } catch {}
    setLoading(false);
    navigation.replace('Rating');
  };

  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center mt-2">
        <IconButton
          icon={<ChevronLeft size={22} color={iconColor.primary} />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
        <Text className="text-ink-900 dark:text-white text-xl font-bold ml-2">
          {t('payment.title')}
        </Text>
      </View>

      <View className="items-center mt-8 mb-8">
        <Text className="text-muted dark:text-ink-400 text-sm">{t('payment.totalToPay')}</Text>
        <Text className="text-ink-900 dark:text-white text-5xl font-bold mt-1">
          {formatCurrency(total)}
        </Text>
      </View>

      <Card>
        <Text className="text-ink-900 dark:text-white font-bold text-base mb-3">
          {t('payment.fareDetails')}
        </Text>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-muted dark:text-ink-400">{t('payment.baseFare')}</Text>
          <Text className="text-ink-900 dark:text-white font-semibold">
            {formatCurrency(baseFare)}
          </Text>
        </View>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-muted dark:text-ink-400">{t('payment.distance')}</Text>
          <Text className="text-ink-900 dark:text-white font-semibold">
            {formatCurrency(distance)}
          </Text>
        </View>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-muted dark:text-ink-400">{t('payment.promo')}</Text>
          <Text className="text-primary-600 font-semibold">{formatCurrency(discount)}</Text>
        </View>
        <Divider className="my-3" />
        <View className="flex-row justify-between">
          <Text className="text-ink-900 dark:text-white font-bold">{t('payment.total')}</Text>
          <Text className="text-ink-900 dark:text-white font-bold">{formatCurrency(total)}</Text>
        </View>
      </Card>

      <Text className="text-ink-900 dark:text-white font-bold text-base mt-6 mb-3">
        {t('payment.method')}
      </Text>
      <View className="flex-row gap-3">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = method === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMethod(m.id)}
              className={`flex-1 items-center py-4 rounded-2xl border ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-border dark:border-dark-border bg-surface dark:bg-dark-surface'
              }`}
            >
              <Icon size={22} color={isSelected ? '#16A34A' : '#6B7280'} />
              <Text
                className={`text-sm font-semibold mt-2 ${
                  isSelected ? 'text-primary-700' : 'text-ink-700 dark:text-ink-200'
                }`}
              >
                {m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {method === 'card' && defaultCard ? (
        <View className="mt-4">
          <Pressable className="flex-row items-center bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-2xl px-4 py-3.5">
            <View className="w-10 h-10 bg-ink-900 rounded-xl items-center justify-center mr-3">
              <CreditCard size={18} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-ink-900 dark:text-white font-semibold">
                •••• {defaultCard.last4}
              </Text>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('payment.expires', { date: defaultCard.expires })}
              </Text>
            </View>
            <Check size={20} color="#16A34A" />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('AddCard')}
            className="flex-row items-center mt-3"
          >
            <Plus size={18} color="#16A34A" />
            <Text className="text-primary-600 font-semibold ml-2">{t('payment.addCard')}</Text>
          </Pressable>
        </View>
      ) : null}

      <View className="mt-8">
        <Button label={t('payment.confirm')} onPress={handleConfirm} loading={loading} />
      </View>
    </ScreenContainer>
  );
}
