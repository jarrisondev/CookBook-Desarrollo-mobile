import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft, Lock, Mail, Phone, User } from 'lucide-react-native';
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
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    else if (form.fullName.length > 50) next.fullName = 'Max 50 characters';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Invalid email format';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    else if (!/^[0-9 +()-]+$/.test(form.phone)) next.phone = 'Only numbers allowed';
    if (!form.gender) next.gender = 'Select a gender';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Min 6 characters';
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
        <Text className="text-ink-900 text-3xl font-bold">Create account</Text>
        <Text className="text-muted text-base mt-2">Tell us a bit about you</Text>
      </View>

      <View className="mt-8 gap-4">
        <TextField
          label="Full name"
          placeholder="John Doe"
          value={form.fullName}
          onChangeText={(v) => update('fullName', v)}
          error={errors.fullName}
          maxLength={50}
          leftIcon={<User size={20} color="#6B7280" />}
        />
        <TextField
          label="Email"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(v) => update('email', v)}
          error={errors.email}
          leftIcon={<Mail size={20} color="#6B7280" />}
        />
        <TextField
          label="Phone number"
          placeholder="+1 555 123 4567"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => update('phone', v)}
          error={errors.phone}
          leftIcon={<Phone size={20} color="#6B7280" />}
        />
        <Select
          label="Gender"
          placeholder="Select your gender"
          value={form.gender || undefined}
          onChange={(v) => update('gender', v)}
          error={errors.gender}
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
        />
        <TextField
          label="Password"
          placeholder="At least 6 characters"
          secureTextEntry
          value={form.password}
          onChangeText={(v) => update('password', v)}
          error={errors.password}
          leftIcon={<Lock size={20} color="#6B7280" />}
        />
      </View>

      <View className="mt-8">
        <Button label="Create Account" onPress={handleSubmit} />
      </View>

      <View className="flex-row items-center justify-center mt-6 mb-4">
        <Text className="text-muted text-sm">Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text className="text-primary-600 font-semibold text-sm">Sign in</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
