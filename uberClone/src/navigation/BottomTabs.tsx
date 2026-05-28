import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Clock, Home as HomeIcon, User, Wallet } from 'lucide-react-native';
import type { LucideProps } from 'lucide-react-native';
import { HomeScreen } from '../screens/tabs/home/HomeScreen';
import { WalletScreen } from '../screens/tabs/wallet/WalletScreen';
import { HistoryScreen } from '../screens/tabs/history/HistoryScreen';
import { ProfileScreen } from '../screens/tabs/profile/ProfileScreen';
import type { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const renderTabLabel = (focused: boolean, label: string) => (
  <Text
    className={`text-xs mt-1 ${focused ? 'text-primary-600 font-bold' : 'text-muted font-medium'}`}
  >
    {label}
  </Text>
);

const renderTabIcon = (Icon: React.ComponentType<LucideProps>, focused: boolean) => (
  <View className="items-center justify-center">
    <Icon size={22} color={focused ? '#16A34A' : '#6B7280'} strokeWidth={focused ? 2.4 : 2} />
  </View>
);

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 72,
          paddingTop: 10,
          paddingBottom: 16,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(HomeIcon, focused),
          tabBarLabel: ({ focused }) => renderTabLabel(focused, 'Home'),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(Wallet, focused),
          tabBarLabel: ({ focused }) => renderTabLabel(focused, 'Wallet'),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(Clock, focused),
          tabBarLabel: ({ focused }) => renderTabLabel(focused, 'History'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(User, focused),
          tabBarLabel: ({ focused }) => renderTabLabel(focused, 'Profile'),
        }}
      />
    </Tab.Navigator>
  );
}
