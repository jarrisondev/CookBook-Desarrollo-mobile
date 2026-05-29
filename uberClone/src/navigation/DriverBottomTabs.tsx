import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  ChartBar,
  Clock,
  Home as HomeIcon,
  User,
} from 'lucide-react-native';
import type { LucideProps } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useIsDark } from '../hooks/useIsDark';
import { useDriverActiveRideBootstrap } from '../hooks/useDriverActiveRideBootstrap';
import { DriverHomeScreen } from '../screens/driver/home/DriverHomeScreen';
import { EarningsScreen } from '../screens/driver/earnings/EarningsScreen';
import { DriverHistoryScreen } from '../screens/driver/history/DriverHistoryScreen';
import { DriverProfileScreen } from '../screens/driver/profile/DriverProfileScreen';
import type { DriverTabParamList } from './types';

const Tab = createBottomTabNavigator<DriverTabParamList>();

const renderTabLabel = (focused: boolean, label: string, isDark: boolean) => (
  <Text
    className={`text-xs mt-1 ${
      focused
        ? 'text-primary-600 font-bold'
        : isDark
          ? 'text-ink-400 font-medium'
          : 'text-muted font-medium'
    }`}
  >
    {label}
  </Text>
);

const renderTabIcon = (
  Icon: React.ComponentType<LucideProps>,
  focused: boolean,
  isDark: boolean,
) => (
  <View className="items-center justify-center">
    <Icon
      size={22}
      color={focused ? '#16A34A' : isDark ? '#9CA3AF' : '#6B7280'}
      strokeWidth={focused ? 2.4 : 2}
    />
  </View>
);

export function DriverBottomTabs() {
  const { t } = useTranslation();
  const isDark = useIsDark();
  useDriverActiveRideBootstrap();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
          height: 72,
          paddingTop: 10,
          paddingBottom: 16,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen
        name="DriverHome"
        component={DriverHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(HomeIcon, focused, isDark),
          tabBarLabel: ({ focused }) =>
            renderTabLabel(focused, t('driver.tabs.home'), isDark),
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(ChartBar, focused, isDark),
          tabBarLabel: ({ focused }) =>
            renderTabLabel(focused, t('driver.tabs.earnings'), isDark),
        }}
      />
      <Tab.Screen
        name="DriverHistory"
        component={DriverHistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(Clock, focused, isDark),
          tabBarLabel: ({ focused }) =>
            renderTabLabel(focused, t('driver.tabs.history'), isDark),
        }}
      />
      <Tab.Screen
        name="DriverProfile"
        component={DriverProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(User, focused, isDark),
          tabBarLabel: ({ focused }) =>
            renderTabLabel(focused, t('driver.tabs.profile'), isDark),
        }}
      />
    </Tab.Navigator>
  );
}
