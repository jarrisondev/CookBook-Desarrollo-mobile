import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar, ChevronLeft, CreditCard, Lock, ScanLine, User } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  Card,
  IconButton,
  ScreenContainer,
  TextField,
} from '../../../components';
import type { MainStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'AddCard'>;

export function AddCardScreen({ navigation }: Props) {
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<{ holder?: string; number?: string; expiry?: string; cvv?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!holder.trim()) next.holder = 'Cardholder name required';
    if (!/^[0-9]{16}$/.test(number.replace(/\s/g, ''))) next.number = 'Card must be 16 digits';
    if (!/^[0-9]{2}\s?\/\s?[0-9]{2}$/.test(expiry)) next.expiry = 'Use MM/YY format';
    if (!/^[0-9]{3,4}$/.test(cvv)) next.cvv = 'CVV is invalid';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center mt-2">
        <IconButton
          icon={<ChevronLeft size={22} color="#0F1115" />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
        <Text className="text-ink-900 text-xl font-bold ml-2">Add payment card</Text>
      </View>

      <View className="mt-6">
        <Card>
          <View className="h-44 bg-ink-900 rounded-2xl p-5 justify-between">
            <View className="flex-row justify-between items-start">
              <CreditCard size={28} color="#fff" />
              <Text className="text-white/70 text-xs">VISA</Text>
            </View>
            <View>
              <Text className="text-white text-lg tracking-widest">
                {number || '•••• •••• •••• ••••'}
              </Text>
              <View className="flex-row justify-between mt-3">
                <View>
                  <Text className="text-white/60 text-[10px]">CARDHOLDER</Text>
                  <Text className="text-white text-sm font-semibold">
                    {holder || 'Your name'}
                  </Text>
                </View>
                <View>
                  <Text className="text-white/60 text-[10px]">EXPIRES</Text>
                  <Text className="text-white text-sm font-semibold">{expiry || 'MM/YY'}</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </View>

      <View className="mt-6 gap-4">
        <TextField
          label="Cardholder name"
          placeholder="John Doe"
          value={holder}
          onChangeText={setHolder}
          error={errors.holder}
          leftIcon={<User size={20} color="#6B7280" />}
        />
        <TextField
          label="Card number"
          placeholder="1234 5678 9012 3456"
          keyboardType="number-pad"
          value={number}
          onChangeText={setNumber}
          error={errors.number}
          leftIcon={<CreditCard size={20} color="#6B7280" />}
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <TextField
              label="Expiry"
              placeholder="06/27"
              value={expiry}
              onChangeText={setExpiry}
              error={errors.expiry}
              leftIcon={<Calendar size={20} color="#6B7280" />}
            />
          </View>
          <View className="flex-1">
            <TextField
              label="CVV"
              placeholder="123"
              keyboardType="number-pad"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
              error={errors.cvv}
              leftIcon={<Lock size={20} color="#6B7280" />}
            />
          </View>
        </View>
        <Pressable className="flex-row items-center self-start">
          <ScanLine size={18} color="#16A34A" />
          <Text className="text-primary-600 font-semibold ml-2">Scan card</Text>
        </Pressable>
      </View>

      <View className="mt-8">
        <Button label="Confirm" onPress={handleSubmit} />
      </View>
    </ScreenContainer>
  );
}
