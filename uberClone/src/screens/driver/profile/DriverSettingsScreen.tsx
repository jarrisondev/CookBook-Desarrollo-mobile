import { Text, View } from 'react-native';
import {
  Bell,
  ChevronLeft,
  CircleHelp,
  FileText,
  LogOut,
  Shield,
  Trash2,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Button,
  Divider,
  IconButton,
  ListItem,
  ScreenContainer,
} from '../../../components';
import { useIconColor } from '../../../hooks/useIconColor';
import { useAppDispatch } from '../../../store';
import { signOut } from '../../../store/slices/authSlice';
import { resetDriver } from '../../../store/slices/driverSlice';
import type { DriverStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<DriverStackParamList, 'DriverSettings'>;

export function DriverSettingsScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconColor = useIconColor();

  const handleLogout = () => {
    dispatch(resetDriver());
    dispatch(signOut());
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Login' as never }] });
  };

  return (
    <ScreenContainer scroll>
      <View className="flex-row items-center mt-2">
        <IconButton
          icon={<ChevronLeft size={22} color={iconColor.primary} />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
        <Text className="text-ink-900 dark:text-white text-xl font-bold ml-2">
          {t('settings.title')}
        </Text>
      </View>

      <View className="mt-6 gap-2">
        <ListItem
          title={t('settings.notifications')}
          subtitle={t('settings.notificationsSubtitle')}
          leftIcon={<Bell size={18} color={iconColor.primary} />}
          onPress={() => undefined}
        />
        <ListItem
          title={t('settings.privacy')}
          subtitle={t('settings.privacySubtitle')}
          leftIcon={<Shield size={18} color={iconColor.primary} />}
          onPress={() => undefined}
        />
        <ListItem
          title={t('settings.help')}
          subtitle={t('settings.helpSubtitle')}
          leftIcon={<CircleHelp size={18} color={iconColor.primary} />}
          onPress={() => undefined}
        />
        <ListItem
          title={t('settings.terms')}
          subtitle={t('settings.termsSubtitle')}
          leftIcon={<FileText size={18} color={iconColor.primary} />}
          onPress={() => undefined}
        />
      </View>

      <Divider className="my-6" />

      <View className="gap-2">
        <ListItem
          title={t('settings.deleteAccount')}
          subtitle={t('settings.deleteSubtitle')}
          leftIcon={<Trash2 size={18} color="#EF4444" />}
          onPress={() => undefined}
        />
      </View>

      <View className="mt-8">
        <Button
          label={t('settings.logout')}
          variant="secondary"
          leftIcon={<LogOut size={18} color={iconColor.primary} />}
          onPress={handleLogout}
        />
      </View>
    </ScreenContainer>
  );
}
