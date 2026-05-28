import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Car } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 1400);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 bg-primary-500 items-center justify-center">
      <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center mb-6">
        <Car size={48} color="#22C55E" />
      </View>
      <Text className="text-white text-4xl font-bold">RideX</Text>
      <Text className="text-primary-50 text-base mt-2">Your ride, on demand</Text>
    </View>
  );
}
