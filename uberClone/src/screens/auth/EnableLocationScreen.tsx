import { Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, MapPlaceholder } from '../../components';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EnableLocation'>;

export function EnableLocationScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const handleEnable = () => navigation.replace('Main');

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showPulse={false} />
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-36 h-36 rounded-full bg-primary-100 items-center justify-center mb-8">
          <MapPin size={72} color="#16A34A" strokeWidth={1.5} />
        </View>
        <Text className="text-ink-900 dark:text-white text-2xl font-bold text-center">{t('location.title')}</Text>
        <Text className="text-muted dark:text-ink-400 text-base text-center mt-3 leading-6">
          {t('location.description')}
        </Text>
      </View>
      <View className="px-6 pb-10 gap-3">
        <Button label={t('location.enable')} onPress={handleEnable} />
        <Button label={t('location.later')} variant="ghost" onPress={handleEnable} />
      </View>
    </View>
  );
}
