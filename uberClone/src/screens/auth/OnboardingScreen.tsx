import { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import { ArrowRight, MapPin, Navigation, Wallet } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: MapPin,
    title: 'Pick your destination',
    description: 'Search or drop a pin on the map. We will find the fastest route for you.',
  },
  {
    icon: Navigation,
    title: 'Track your ride live',
    description: 'See your driver approach in real time and share trip status with friends.',
  },
  {
    icon: Wallet,
    title: 'Pay your way',
    description: 'Cash, card or wallet — choose any payment method that works best for you.',
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (index < slides.length - 1) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View className="flex-1 bg-bg">
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View style={{ width }} className="items-center justify-center px-8">
              <View className="w-56 h-56 rounded-full bg-primary-100 items-center justify-center mb-12">
                <Icon size={88} color="#16A34A" strokeWidth={1.5} />
              </View>
              <Text className="text-ink-900 text-3xl font-bold text-center">{item.title}</Text>
              <Text className="text-muted text-base text-center mt-4 leading-6">
                {item.description}
              </Text>
            </View>
          );
        }}
      />
      <View className="px-6 pb-10">
        <View className="flex-row justify-center mb-8">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full mx-1 ${i === index ? 'bg-primary-500 w-6' : 'bg-ink-200 w-2'}`}
            />
          ))}
        </View>
        <Button
          label={index === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          rightIcon={<ArrowRight size={18} color="#fff" />}
        />
      </View>
    </View>
  );
}
