import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Card,
  TextField,
} from '../../../components';
import { useAppDispatch, useAppSelector } from '../../../store';
import { profileUpdated } from '../../../store/slices/authSlice';
import { updateUserProfile } from '../../../services/firebase/users';
import { formatCurrency } from '../../../utils/format';

export function DriverPersonalTab() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({});

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName);
    setPhone(user.phone);
    setEmail(user.email);
  }, [user]);

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = t('auth.errors.required');
    else if (fullName.length > 50) next.fullName = t('auth.errors.nameMax');
    if (!phone.trim()) next.phone = t('auth.errors.required');
    else if (!/^[0-9 +()-]+$/.test(phone)) next.phone = t('auth.errors.phoneInvalid');
    if (!email.trim()) next.email = t('auth.errors.required');
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = t('auth.errors.invalidEmail');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;
    setSaving(true);
    try {
      const patch = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      };
      await updateUserProfile(user.uid, patch);
      dispatch(profileUpdated(patch));
    } catch (err) {
      Alert.alert(
        t('driver.profile.personalData'),
        err instanceof Error ? err.message : 'Error',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-bg dark:bg-dark-bg"
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-6">
        <View className="relative">
          <Avatar name={fullName} size={96} />
          <Pressable className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 items-center justify-center border-2 border-white">
            <Camera size={14} color="#fff" />
          </Pressable>
        </View>
        <Text className="text-ink-900 dark:text-white font-bold text-lg mt-3">
          {fullName}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-sm">
          {user?.level ?? 'Pro Driver'}
        </Text>
      </View>

      <Card>
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-muted dark:text-ink-400 text-xs">
              {t('driver.stats.rating')}
            </Text>
            <Text className="text-ink-900 dark:text-white font-bold mt-1">
              {(user?.rating ?? 5).toFixed(1)} ★
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-muted dark:text-ink-400 text-xs">
              {t('driver.home.balance')}
            </Text>
            <Text className="text-ink-900 dark:text-white font-bold mt-1">
              {formatCurrency(user?.balance ?? 0)}
            </Text>
          </View>
        </View>
      </Card>

      <View className="gap-4 mt-6">
        <TextField
          label={t('auth.fullName')}
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
          maxLength={50}
        />
        <TextField
          label={t('auth.phone')}
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
        />
        <TextField
          label={t('auth.email')}
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View className="mt-8">
        <Button label={t('common.saveChanges')} onPress={handleSave} loading={saving} />
      </View>
    </ScrollView>
  );
}
