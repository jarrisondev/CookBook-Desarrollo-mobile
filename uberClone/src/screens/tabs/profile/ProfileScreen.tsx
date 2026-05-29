import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../components';
import { useIconColor } from '../../../hooks/useIconColor';
import { PersonalDataTab } from './PersonalDataTab';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const iconColor = useIconColor();

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dark-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">
          {t('profile.title')}
        </Text>
        <IconButton
          icon={<Settings size={20} color={iconColor.primary} />}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <PersonalDataTab />
    </SafeAreaView>
  );
}
