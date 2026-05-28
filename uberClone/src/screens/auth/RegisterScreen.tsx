import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, Lock, Mail, Phone, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  IconButton,
  ScreenContainer,
  Select,
  TextField,
} from '../../components';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other' | '';
  password: string;
};

export function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>({
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

  const handleSubmit = () => {
    if (!validate()) return;
    navigation.replace('EnableLocation');
  };

  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center mt-4">
        <IconButton
          icon={<ChevronLeft size={22} color="#0F1115" />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
      </View>
      <View className="mt-6">
        <Text className="text-ink-900 text-3xl font-bold">{t('auth.createAccount')}</Text>
        <Text className="text-muted text-base mt-2">{t('auth.registerSubtitle')}</Text>
      </View>

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
        <Button label={t('auth.createAccount')} onPress={handleSubmit} />
      </View>

      <View className="flex-row items-center justify-center mt-6 mb-4">
        <Text className="text-muted text-sm">{t('auth.hasAccount')}</Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text className="text-primary-600 font-semibold text-sm">{t('auth.signIn')}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
