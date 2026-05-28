import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { IconButton } from '../../../components';
import { useIsDark } from '../../../hooks/useIsDark';
import { useIconColor } from '../../../hooks/useIconColor';
import { DriverPersonalTab } from './DriverPersonalTab';
import { DriverVehicleTab } from './DriverVehicleTab';
import type { DriverTabScreenProps } from '../../../navigation/types';

type Props = DriverTabScreenProps<'DriverProfile'>;

const Tab = createMaterialTopTabNavigator();

export function DriverProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const isDark = useIsDark();
  const iconColor = useIconColor();

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dark-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">
          {t('driver.profile.title')}
        </Text>
        <IconButton
          icon={<Settings size={20} color={iconColor.primary} />}
          onPress={() => navigation.navigate('DriverSettings')}
        />
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600', textTransform: 'none' },
          tabBarStyle: {
            backgroundColor: isDark ? '#0F1115' : '#F5F6F8',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#374151' : '#E5E7EB',
          },
          tabBarActiveTintColor: '#16A34A',
          tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
          tabBarIndicatorStyle: { backgroundColor: '#16A34A', height: 3, borderRadius: 3 },
        }}
      >
        <Tab.Screen
          name="DriverPersonal"
          component={DriverPersonalTab}
          options={{ title: t('driver.profile.personalData') }}
        />
        <Tab.Screen
          name="DriverVehicle"
          component={DriverVehicleTab}
          options={{ title: t('driver.profile.vehicle') }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
