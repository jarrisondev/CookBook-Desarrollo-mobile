import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, ScreenContainer, TextField } from '../../components';
import { signInWithEmail } from '../../services/firebase/auth';
import { useAppDispatch } from '../../store';
import { signedIn } from '../../store/slices/authSlice';
import { demoAccounts } from '../../constants/demoCredentials';
import { serializeUser } from '../../models';
import type { UserRole } from '../../models';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [demoRole, setDemoRole] = useState<UserRole>('rider');
  const [email, setEmail] = useState(demoAccounts.rider.email);
  const [password, setPassword] = useState(demoAccounts.rider.password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const switchRole = (role: UserRole) => {
    setDemoRole(role);
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    setErrors({});
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = t('auth.errors.required');
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = t('auth.errors.invalidEmail');
    if (!password) next.password = t('auth.errors.passwordRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const profile = await signInWithEmail(email.trim(), password);
      dispatch(signedIn(serializeUser(profile)));
      navigation.replace('EnableLocation');
    } catch (err) {
      Alert.alert('Login', err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer scroll>
      <View className="mt-12">
        <Text className="text-ink-900 dark:text-white text-3xl font-bold">
          {t('auth.welcomeBack')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-base mt-2">
          {t('auth.signInSubtitle')}
        </Text>
      </View>

      <View className="mt-8">
        <Text className="text-muted dark:text-ink-400 text-xs font-semibold mb-2">
          {t('auth.loginAs')}
        </Text>
        <View className="flex-row bg-ink-100 dark:bg-ink-700 rounded-2xl p-1">
          {(['rider', 'driver'] as UserRole[]).map((role) => {
            const isSelected = demoRole === role;
            return (
              <Pressable
                key={role}
                onPress={() => switchRole(role)}
                className={`flex-1 items-center py-3 rounded-xl ${
                  isSelected ? 'bg-white dark:bg-dark-surface' : ''
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    isSelected ? 'text-primary-700' : 'text-muted dark:text-ink-400'
                  }`}
                >
                  {t(`auth.${role}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text className="text-muted dark:text-ink-400 text-[11px] mt-1.5 italic">
          {t('auth.demoModeHint')}
        </Text>
      </View>

      <View className="mt-6 gap-4">
        <TextField
          label={t('auth.email')}
          placeholder={t('auth.emailPlaceholder')}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          leftIcon={<Mail size={20} color="#6B7280" />}
        />
        <TextField
          label={t('auth.password')}
          placeholder={t('auth.passwordPlaceholder')}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          leftIcon={<Lock size={20} color="#6B7280" />}
          rightIcon={
            <Pressable onPress={() => setShowPassword((v) => !v)}>
              {showPassword ? (
                <EyeOff size={20} color="#6B7280" />
              ) : (
                <Eye size={20} color="#6B7280" />
              )}
            </Pressable>
          }
        />
        <Pressable className="self-end">
          <Text className="text-primary-600 font-semibold text-sm">
            {t('auth.forgotPassword')}
          </Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <Button label={t('auth.signIn')} onPress={handleSubmit} loading={loading} />
      </View>

      <View className="flex-row items-center justify-center mt-8">
        <Text className="text-muted dark:text-ink-400 text-sm">{t('auth.noAccount')}</Text>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text className="text-primary-600 font-semibold text-sm">{t('auth.signUp')}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
