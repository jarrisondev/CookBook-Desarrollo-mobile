import { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import { ArrowRight, MapPin, Navigation, Wallet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

export function OnboardingScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const slides = [
    { icon: MapPin, title: t('onboarding.slide1Title'), description: t('onboarding.slide1Desc') },
    { icon: Navigation, title: t('onboarding.slide2Title'), description: t('onboarding.slide2Desc') },
    { icon: Wallet, title: t('onboarding.slide3Title'), description: t('onboarding.slide3Desc') },
  ];

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
    <View className="flex-1 bg-bg dark:bg-dark-bg">
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
              <Text className="text-ink-900 dark:text-white text-3xl font-bold text-center">{item.title}</Text>
              <Text className="text-muted dark:text-ink-400 text-base text-center mt-4 leading-6">
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
              className={`h-2 rounded-full mx-1 ${i === index ? 'bg-primary-500 w-6' : 'bg-ink-200 dark:bg-ink-500 w-2'}`}
            />
          ))}
        </View>
        <Button
          label={index === slides.length - 1 ? t('onboarding.getStarted') : t('common.next')}
          onPress={handleNext}
          rightIcon={<ArrowRight size={18} color="#fff" />}
        />
      </View>
    </View>
  );
}
