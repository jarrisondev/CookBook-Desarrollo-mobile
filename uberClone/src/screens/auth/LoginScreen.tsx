import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, ScreenContainer, TextField } from '../../components';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Invalid email format';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    navigation.replace('EnableLocation');
  };

  return (
    <ScreenContainer scroll>
      <View className="mt-12">
        <Text className="text-ink-900 text-3xl font-bold">Welcome back</Text>
        <Text className="text-muted text-base mt-2">Sign in to continue your journey</Text>
      </View>

      <View className="mt-10 gap-4">
        <TextField
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          leftIcon={<Mail size={20} color="#6B7280" />}
        />
        <TextField
          label="Password"
          placeholder="••••••••"
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
          <Text className="text-primary-600 font-semibold text-sm">Forgot password?</Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <Button label="Sign In" onPress={handleSubmit} />
      </View>

      <View className="flex-row items-center justify-center mt-8">
        <Text className="text-muted text-sm">Don’t have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text className="text-primary-600 font-semibold text-sm">Sign up</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
