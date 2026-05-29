import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Clock, Home as HomeIcon, User, Wallet } from 'lucide-react-native';
import type { LucideProps } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useIsDark } from '../hooks/useIsDark';
import { useRiderActiveRideBootstrap } from '../hooks/useRiderActiveRideBootstrap';
import { HomeScreen } from '../screens/tabs/home/HomeScreen';
import { WalletScreen } from '../screens/tabs/wallet/WalletScreen';
import { HistoryScreen } from '../screens/tabs/history/HistoryScreen';
import { ProfileScreen } from '../screens/tabs/profile/ProfileScreen';
import type { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

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

export function BottomTabs() {
  const { t } = useTranslation();
  const isDark = useIsDark();
  useRiderActiveRideBootstrap();

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
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(HomeIcon, focused, isDark),
          tabBarLabel: ({ focused }) => renderTabLabel(focused, t('tabs.home'), isDark),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(Wallet, focused, isDark),
          tabBarLabel: ({ focused }) => renderTabLabel(focused, t('tabs.wallet'), isDark),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(Clock, focused, isDark),
          tabBarLabel: ({ focused }) => renderTabLabel(focused, t('tabs.history'), isDark),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(User, focused, isDark),
          tabBarLabel: ({ focused }) => renderTabLabel(focused, t('tabs.profile'), isDark),
        }}
      />
    </Tab.Navigator>
  );
}
