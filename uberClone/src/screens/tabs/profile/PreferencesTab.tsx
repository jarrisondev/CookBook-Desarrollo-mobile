import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { Bell, Globe, Moon, Shield } from 'lucide-react-native';
import { Card, Divider, ListItem, Select } from '../../../components';
import { mockUser } from '../../../constants/mockData';

export function PreferencesTab() {
  const [language, setLanguage] = useState<'en' | 'es'>(mockUser.language);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkEnabled, setDarkEnabled] = useState(false);
  const [promoEnabled, setPromoEnabled] = useState(true);

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Card>
        <Text className="text-ink-900 font-bold mb-4">Language</Text>
        <Select
          value={language}
          onChange={setLanguage}
          options={[
            { label: 'English', value: 'en' },
            { label: 'Español', value: 'es' },
          ]}
        />
      </Card>

      <View className="mt-4">
        <Card>
          <Text className="text-ink-900 font-bold mb-2">Notifications</Text>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1">
              <Bell size={18} color="#6B7280" />
              <Text className="text-ink-900 font-semibold ml-3">Push notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ true: '#22C55E', false: '#E5E7EB' }}
            />
          </View>
          <Divider />
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1">
              <Globe size={18} color="#6B7280" />
              <Text className="text-ink-900 font-semibold ml-3">Promo offers</Text>
            </View>
            <Switch
              value={promoEnabled}
              onValueChange={setPromoEnabled}
              trackColor={{ true: '#22C55E', false: '#E5E7EB' }}
            />
          </View>
        </Card>
      </View>

      <View className="mt-4">
        <Card>
          <Text className="text-ink-900 font-bold mb-2">Appearance</Text>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1">
              <Moon size={18} color="#6B7280" />
              <Text className="text-ink-900 font-semibold ml-3">Dark mode</Text>
            </View>
            <Switch
              value={darkEnabled}
              onValueChange={setDarkEnabled}
              trackColor={{ true: '#22C55E', false: '#E5E7EB' }}
            />
          </View>
        </Card>
      </View>

      <View className="mt-4 gap-2">
        <ListItem
          title="Privacy & security"
          subtitle="Manage account security"
          leftIcon={<Shield size={18} color="#0F1115" />}
          onPress={() => undefined}
        />
      </View>
    </ScrollView>
  );
}
