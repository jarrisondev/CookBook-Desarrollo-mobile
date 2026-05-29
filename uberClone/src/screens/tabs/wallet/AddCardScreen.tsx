import { useMemo, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Calendar, ChevronLeft, CreditCard, Lock, ScanLine, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  Card,
  IconButton,
  ScreenContainer,
  TextField,
} from '../../../components';
import { useIconColor } from '../../../hooks/useIconColor';
import { useAppSelector } from '../../../store';
import { addCardForUser, detectBrand } from '../../../services/firebase/cards';
import type { MainStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'AddCard'>;

function formatCardNumber(input: string) {
  const digits = input.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(input: string, previous: string) {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  if (previous.endsWith('/') && input.length < previous.length) {
    return digits.slice(0, 1);
  }
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCvv(input: string) {
  return input.replace(/\D/g, '').slice(0, 4);
}

export function AddCardScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const iconColor = useIconColor();
  const user = useAppSelector((s) => s.auth.user);
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ holder?: string; number?: string; expiry?: string; cvv?: string }>({});

  const cardDigits = useMemo(() => number.replace(/\s/g, ''), [number]);
  const brand = useMemo(() => detectBrand(cardDigits), [cardDigits]);

  const validate = () => {
    const next: typeof errors = {};
    if (!holder.trim()) next.holder = t('addCard.errors.holderRequired');
    if (cardDigits.length !== 16) next.number = t('addCard.errors.numberInvalid');
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      next.expiry = t('addCard.errors.expiryInvalid');
    } else {
      const month = Number(expiry.slice(0, 2));
      if (month < 1 || month > 12) next.expiry = t('addCard.errors.expiryMonth');
    }
    if (!/^\d{3,4}$/.test(cvv)) next.cvv = t('addCard.errors.cvvInvalid');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !user) return;
    setLoading(true);
    try {
      const last4 = cardDigits.slice(-4);
      await addCardForUser(user.uid, {
        brand,
        last4,
        holder: holder.trim(),
        expires: expiry,
      });
      Alert.alert(
        t('addCard.success'),
        t('addCard.successMessage', { last4 }),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert(
        t('addCard.title'),
        err instanceof Error ? err.message : t('addCard.errors.saveFailed'),
      );
    } finally {
      setLoading(false);
    }
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
          {t('addCard.title')}
        </Text>
      </View>

      <View className="mt-6">
        <Card>
          <View className="h-44 bg-ink-900 rounded-2xl p-5 justify-between">
            <View className="flex-row justify-between items-start">
              <CreditCard size={28} color="#fff" />
              <Text className="text-white/70 text-xs">{brand.toUpperCase()}</Text>
            </View>
            <View>
              <Text className="text-white text-lg tracking-widest">
                {number || '•••• •••• •••• ••••'}
              </Text>
              <View className="flex-row justify-between mt-3">
                <View>
                  <Text className="text-white/60 text-[10px]">{t('addCard.cardholder')}</Text>
                  <Text className="text-white text-sm font-semibold">
                    {holder || t('addCard.placeholderCardName')}
                  </Text>
                </View>
                <View>
                  <Text className="text-white/60 text-[10px]">{t('addCard.expires')}</Text>
                  <Text className="text-white text-sm font-semibold">{expiry || 'MM/YY'}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </View>

      <View className="mt-6 gap-4">
        <TextField
          label={t('addCard.cardholderName')}
          placeholder={t('addCard.cardholderPlaceholder')}
          value={holder}
          onChangeText={(v) => setHolder(v.slice(0, 50))}
          error={errors.holder}
          maxLength={50}
          autoCapitalize="words"
          leftIcon={<User size={20} color="#6B7280" />}
        />
        <TextField
          label={t('addCard.cardNumber')}
          placeholder={t('addCard.cardNumberPlaceholder')}
          keyboardType="number-pad"
          value={number}
          onChangeText={(v) => setNumber(formatCardNumber(v))}
          error={errors.number}
          maxLength={19}
          leftIcon={<CreditCard size={20} color="#6B7280" />}
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TextField
              label={t('addCard.expiry')}
              placeholder={t('addCard.expiryPlaceholder')}
              value={expiry}
              onChangeText={(v) => setExpiry(formatExpiry(v, expiry))}
              error={errors.expiry}
              keyboardType="number-pad"
              maxLength={5}
              leftIcon={<Calendar size={20} color="#6B7280" />}
            />
          </View>
          <View className="flex-1">
            <TextField
              label={t('addCard.cvv')}
              placeholder={t('addCard.cvvPlaceholder')}
              keyboardType="number-pad"
              secureTextEntry
              value={cvv}
              onChangeText={(v) => setCvv(formatCvv(v))}
              error={errors.cvv}
              maxLength={4}
              leftIcon={<Lock size={20} color="#6B7280" />}
            />
          </View>
        </View>
        <Pressable className="flex-row items-center self-start">
          <ScanLine size={18} color="#16A34A" />
          <Text className="text-primary-600 font-semibold ml-2">{t('addCard.scanCard')}</Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <Button label={t('common.confirm')} onPress={handleSubmit} loading={loading} />
      </View>
    </ScreenContainer>
  );
}
