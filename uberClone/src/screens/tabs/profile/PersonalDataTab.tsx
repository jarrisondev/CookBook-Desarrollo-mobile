import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Camera } from 'lucide-react-native';
import {
  Avatar,
  Button,
  Select,
  TextField,
} from '../../../components';
import { mockUser } from '../../../constants/mockData';

export function PersonalDataTab() {
  const [fullName, setFullName] = useState(mockUser.name);
  const [phone, setPhone] = useState(mockUser.phone);
  const [email, setEmail] = useState(mockUser.email);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(mockUser.gender);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; email?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = 'Required';
    else if (fullName.length > 50) next.fullName = 'Max 50 characters';
    if (!phone.trim()) next.phone = 'Required';
    else if (!/^[0-9 +()-]+$/.test(phone)) next.phone = 'Only numbers';
    if (!email.trim()) next.email = 'Required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Invalid email';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center mb-8">
        <View className="relative">
          <Avatar name={fullName} size={96} />
          <Pressable className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 items-center justify-center border-2 border-white">
            <Camera size={14} color="#fff" />
          </Pressable>
        </View>
        <Text className="text-ink-900 font-bold text-lg mt-3">{fullName}</Text>
        <Text className="text-muted text-sm">{mockUser.level}</Text>
      </View>

      <View className="gap-4">
        <TextField
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
          maxLength={50}
        />
        <TextField
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
        />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Select
          label="Gender"
          value={gender}
          onChange={setGender}
          options={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
        />
      </View>

      <View className="mt-8">
        <Button label="Save changes" onPress={validate} />
      </View>
    </ScrollView>
  );
}
