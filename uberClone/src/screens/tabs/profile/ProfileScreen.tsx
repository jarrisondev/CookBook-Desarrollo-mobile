import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { IconButton } from '../../../components';
import { PersonalDataTab } from './PersonalDataTab';
import { PreferencesTab } from './PreferencesTab';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'Profile'>;

const Tab = createMaterialTopTabNavigator();

export function ProfileScreen({ navigation }: Props) {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-ink-900 text-2xl font-bold">{t('profile.title')}</Text>
        <IconButton
          icon={<Settings size={20} color="#0F1115" />}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: '600', textTransform: 'none' },
          tabBarStyle: {
            backgroundColor: '#F5F6F8',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
          },
          tabBarActiveTintColor: '#16A34A',
          tabBarInactiveTintColor: '#6B7280',
          tabBarIndicatorStyle: { backgroundColor: '#16A34A', height: 3, borderRadius: 3 },
        }}
      >
        <Tab.Screen
          name="PersonalData"
          component={PersonalDataTab}
          options={{ title: t('profile.personalData') }}
        />
        <Tab.Screen
          name="Preferences"
          component={PreferencesTab}
          options={{ title: t('profile.preferences') }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
