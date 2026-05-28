import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check, ChevronLeft, CreditCard, DollarSign, Plus, Wallet as WalletIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  Card,
  Divider,
  IconButton,
  ScreenContainer,
} from '../../components';
import { paymentCards } from '../../constants/mockData';
import { formatCurrency } from '../../utils/format';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Payment'>;

type Method = 'cash' | 'card' | 'wallet';

const fareBreakdown = {
  base: 4.5,
  distance: 3.2,
  discount: -1.0,
};

export function PaymentScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [method, setMethod] = useState<Method>('card');
  const total = fareBreakdown.base + fareBreakdown.distance + fareBreakdown.discount;
  const defaultCard = paymentCards.find((c) => c.default);

  const methods: { id: Method; label: string; icon: typeof CreditCard }[] = [
    { id: 'cash', label: t('payment.cash'), icon: DollarSign },
    { id: 'card', label: t('payment.card'), icon: CreditCard },
    { id: 'wallet', label: t('payment.wallet'), icon: WalletIcon },
  ];

  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center mt-2">
        <IconButton
          icon={<ChevronLeft size={22} color="#0F1115" />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
        <Text className="text-ink-900 text-xl font-bold ml-2">{t('payment.title')}</Text>
      </View>

      <View className="items-center mt-8 mb-8">
        <Text className="text-muted text-sm">{t('payment.totalToPay')}</Text>
        <Text className="text-ink-900 text-5xl font-bold mt-1">{formatCurrency(total)}</Text>
      </View>

      <Card>
        <Text className="text-ink-900 font-bold text-base mb-3">{t('payment.fareDetails')}</Text>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-muted">{t('payment.baseFare')}</Text>
          <Text className="text-ink-900 font-semibold">{formatCurrency(fareBreakdown.base)}</Text>
        </View>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-muted">{t('payment.distance')}</Text>
          <Text className="text-ink-900 font-semibold">{formatCurrency(fareBreakdown.distance)}</Text>
        </View>
        <View className="flex-row justify-between py-1.5">
          <Text className="text-muted">{t('payment.promo')}</Text>
          <Text className="text-primary-600 font-semibold">
            {formatCurrency(fareBreakdown.discount)}
          </Text>
        </View>
        <Divider className="my-3" />
        <View className="flex-row justify-between">
          <Text className="text-ink-900 font-bold">{t('payment.total')}</Text>
          <Text className="text-ink-900 font-bold">{formatCurrency(total)}</Text>
        </View>
      </Card>

      <Text className="text-ink-900 font-bold text-base mt-6 mb-3">{t('payment.method')}</Text>
      <View className="flex-row gap-3">
        {methods.map((m) => {
          const Icon = m.icon;
          const isSelected = method === m.id;
          return (
            <Pressable
              key={m.id}
              onPress={() => setMethod(m.id)}
              className={`flex-1 items-center py-4 rounded-2xl border ${
                isSelected ? 'border-primary-500 bg-primary-50' : 'border-border bg-surface'
              }`}
            >
              <Icon size={22} color={isSelected ? '#16A34A' : '#6B7280'} />
              <Text
                className={`text-sm font-semibold mt-2 ${isSelected ? 'text-primary-700' : 'text-ink-700'}`}
              >
                {m.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {method === 'card' && defaultCard ? (
        <View className="mt-4">
          <Pressable className="flex-row items-center bg-surface border border-border rounded-2xl px-4 py-3.5">
            <View className="w-10 h-10 bg-ink-900 rounded-xl items-center justify-center mr-3">
              <CreditCard size={18} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-ink-900 font-semibold">•••• {defaultCard.last4}</Text>
              <Text className="text-muted text-xs">
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
        <Button label={t('payment.confirm')} onPress={() => navigation.replace('Rating')} />
      </View>
    </ScreenContainer>
  );
}
