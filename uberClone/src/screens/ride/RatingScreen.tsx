import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { CreditCard, DollarSign, Star, Wallet as WalletIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Button, ScreenContainer } from '../../components';
import { resetRide } from '../../store/slices/rideSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { rateRide, subscribeToRide } from '../../services/firebase/rides';
import { useUserCards } from '../../hooks/useUserCards';
import { formatCurrency } from '../../utils/format';
import type { Ride } from '../../models';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Rating'>;

const tips = [0, 1, 2, 5];

export function RatingScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const rideId = useAppSelector((s) => s.ride.currentRideId);
  const [ride, setRide] = useState<Ride | null>(null);
  const [rating, setRating] = useState(5);
  const [tipIndex, setTipIndex] = useState(1);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rideId) return;
    const unsub = subscribeToRide(rideId, (r) => {
      if (r) setRide(r);
    });
    return unsub;
  }, [rideId]);

  const { defaultCard } = useUserCards();
  const total = ride?.finalFare ?? ride?.fareEstimate ?? 0;
  const method = ride?.paymentMethod ?? 'cash';
  const last4 = ride?.cardLast4 ?? defaultCard?.last4 ?? '••••';

  const paymentMessage = (() => {
    if (method === 'card') {
      return t('rating.cardCharged', {
        amount: formatCurrency(total),
        last4,
      });
    }
    if (method === 'wallet') {
      return t('rating.paidWallet', { amount: formatCurrency(total) });
    }
    return t('rating.paidCash', { amount: formatCurrency(total) });
  })();

  const PaymentIcon =
    method === 'card' ? CreditCard : method === 'wallet' ? WalletIcon : DollarSign;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (rideId) {
        await rateRide(rideId, { rating, comment: comment.trim() || undefined });
      }
    } catch {}
    dispatch(resetRide());
    setLoading(false);
    if (navigation.canGoBack()) navigation.popToTop();
  };

  return (
    <ScreenContainer scroll>
      <View className="items-center mt-8">
        <Avatar name={ride?.driverName ?? 'Driver'} size={88} />
        <Text className="text-ink-900 dark:text-white text-2xl font-bold mt-4">
          {t('rating.title')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-base mt-2 text-center">
          {t('rating.description', { driver: ride?.driverName ?? 'tu conductor' })}
        </Text>
      </View>

      <View className="mt-6 flex-row items-center bg-primary-50 rounded-2xl px-4 py-3">
        <View className="w-9 h-9 rounded-full bg-primary-500 items-center justify-center mr-3">
          <PaymentIcon size={18} color="#fff" />
        </View>
        <Text className="text-primary-700 font-semibold text-sm flex-1">
          {paymentMessage}
        </Text>
      </View>

      <View className="flex-row justify-center mt-8 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setRating(n)} hitSlop={10}>
            <Star
              size={40}
              color={n <= rating ? '#F59E0B' : '#E5E7EB'}
              fill={n <= rating ? '#F59E0B' : '#E5E7EB'}
            />
          </Pressable>
        ))}
      </View>

      <Text className="text-ink-900 dark:text-white font-bold text-base mt-10 mb-3">
        {t('rating.tipDriver')}
      </Text>
      <View className="flex-row gap-2">
        {tips.map((amount, i) => {
          const isSelected = tipIndex === i;
          return (
            <Pressable
              key={amount}
              onPress={() => setTipIndex(i)}
              className={`flex-1 items-center py-3 rounded-2xl border ${
                isSelected ? 'bg-primary-500 border-primary-500' : 'bg-surface dark:bg-dark-surface border-border dark:border-dark-border'
              }`}
            >
              <Text
                className={`font-semibold ${
                  isSelected ? 'text-white' : 'text-ink-900 dark:text-white'
                }`}
              >
                {amount === 0 ? t('rating.noTip') : `$${amount.toFixed(2)}`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="text-ink-900 dark:text-white font-bold text-base mt-8 mb-3">
        {t('rating.leaveComment')}
      </Text>
      <View className="bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-2xl px-4 py-3">
        <TextInput
          placeholder={t('rating.commentPlaceholder')}
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          className="text-ink-900 dark:text-white min-h-24 text-base"
          textAlignVertical="top"
        />
      </View>

      <View className="mt-8">
        <Button label={t('common.submit')} onPress={handleSubmit} loading={loading} />
      </View>
    </ScreenContainer>
  );
}
