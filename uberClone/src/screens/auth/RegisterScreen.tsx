import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Car, ChevronLeft, Lock, Mail, Phone, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  IconButton,
  ScreenContainer,
  Select,
  TextField,
} from '../../components';
import { useIconColor } from '../../hooks/useIconColor';
import { signUpWithEmail } from '../../services/firebase/auth';
import { useAppDispatch } from '../../store';
import { signedIn } from '../../store/slices/authSlice';
import { serializeUser } from '../../models';
import type { UserRole } from '../../models';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

type FormState = {
  role: UserRole | '';
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  password: string;
};

export function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const iconColor = useIconColor();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    role: '',
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.role) next.role = t('auth.errors_role');
    if (!form.fullName.trim()) next.fullName = t('auth.errors.required');
    else if (form.fullName.length > 50) next.fullName = t('auth.errors.nameMax');
    if (!form.email.trim()) next.email = t('auth.errors.required');
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t('auth.errors.invalidEmail');
    if (!form.phone.trim()) next.phone = t('auth.errors.required');
    else if (!/^[0-9 +()-]+$/.test(form.phone)) next.phone = t('auth.errors.phoneInvalid');
    if (!form.gender) next.gender = t('auth.errors.selectGender');
    if (!form.password) next.password = t('auth.errors.passwordRequired');
    else if (form.password.length < 6) next.password = t('auth.errors.passwordMin');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !form.role) return;
    setLoading(true);
    try {
      const profile = await signUpWithEmail({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        gender: form.gender as 'male' | 'female' | 'other',
        role: form.role,
      });
      dispatch(signedIn(serializeUser(profile)));
      navigation.replace('EnableLocation');
    } catch (err) {
      Alert.alert('Registro', err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center mt-4">
        <IconButton
          icon={<ChevronLeft size={22} color={iconColor.primary} />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
      </View>
      <View className="mt-6">
        <Text className="text-ink-900 dark:text-white text-3xl font-bold">
          {t('auth.createAccount')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-base mt-2">
          {t('auth.registerSubtitle')}
        </Text>
      </View>

      <Text className="text-ink-900 dark:text-white font-bold text-base mt-8 mb-3">
        {t('auth.iAmA')}
      </Text>
      <View className="flex-row gap-3">
        {(['rider', 'driver'] as UserRole[]).map((role) => {
          const isSelected = form.role === role;
          return (
            <Pressable
              key={role}
              onPress={() => update('role', role)}
              className={`flex-1 items-center p-5 rounded-2xl border-2 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-border dark:border-dark-border bg-surface dark:bg-dark-surface'
              }`}
            >
              <View
                className={`w-14 h-14 rounded-full items-center justify-center mb-3 ${
                  isSelected ? 'bg-primary-500' : 'bg-ink-100 dark:bg-ink-700'
                }`}
              >
                {role === 'rider' ? (
                  <User size={26} color={isSelected ? '#fff' : iconColor.primary} />
                ) : (
                  <Car size={26} color={isSelected ? '#fff' : iconColor.primary} />
                )}
              </View>
              <Text
                className={`font-bold text-base ${
                  isSelected ? 'text-primary-700' : 'text-ink-900 dark:text-white'
                }`}
              >
                {t(`auth.${role}`)}
              </Text>
              <Text className="text-muted dark:text-ink-400 text-xs text-center mt-1">
                {t(`auth.${role}Desc`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {errors.role ? (
        <Text className="text-danger text-xs mt-2">{errors.role}</Text>
      ) : null}

      <View className="mt-8 gap-4">
        <TextField
          label={t('auth.fullName')}
          placeholder={t('auth.fullNamePlaceholder')}
          value={form.fullName}
          onChangeText={(v) => update('fullName', v)}
          error={errors.fullName}
          maxLength={50}
          leftIcon={<User size={20} color="#6B7280" />}
        />
        <TextField
          label={t('auth.email')}
          placeholder={t('auth.emailPlaceholder')}
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => update('email', v)}
          error={errors.email}
          leftIcon={<Mail size={20} color="#6B7280" />}
        />
        <TextField
          label={t('auth.phone')}
          placeholder={t('auth.phonePlaceholder')}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => update('phone', v)}
          error={errors.phone}
          leftIcon={<Phone size={20} color="#6B7280" />}
        />
        <Select
          label={t('auth.gender')}
          placeholder={t('auth.genderPlaceholder')}
          value={form.gender || undefined}
          onChange={(v) => update('gender', v)}
          error={errors.gender}
          options={[
            { label: t('auth.male'), value: 'male' },
            { label: t('auth.female'), value: 'female' },
            { label: t('auth.other'), value: 'other' },
          ]}
        />
        <TextField
          label={t('auth.password')}
          placeholder={t('auth.passwordHint')}
          secureTextEntry
          value={form.password}
          onChangeText={(v) => update('password', v)}
          error={errors.password}
          leftIcon={<Lock size={20} color="#6B7280" />}
        />
      </View>

      <View className="mt-8">
        <Button label={t('auth.createAccount')} onPress={handleSubmit} loading={loading} />
      </View>

      <View className="flex-row items-center justify-center mt-6 mb-4">
        <Text className="text-muted dark:text-ink-400 text-sm">{t('auth.hasAccount')}</Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text className="text-primary-600 font-semibold text-sm">{t('auth.signIn')}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
