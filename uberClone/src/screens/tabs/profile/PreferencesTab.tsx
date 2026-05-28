import { ScrollView, Switch, Text, View } from 'react-native';
import { Bell, Globe, Moon, Shield } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Card, Divider, ListItem, Select } from '../../../components';
import { useIconColor } from '../../../hooks/useIconColor';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setLanguage,
  toggleDarkMode,
  togglePromoOffers,
  togglePushNotifications,
} from '../../../store/slices/preferencesSlice';
import type { Language } from '../../../store/slices/preferencesSlice';

export function PreferencesTab() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconColor = useIconColor();
  const { language, pushNotifications, promoOffers, darkMode } = useAppSelector(
    (s) => s.preferences,
  );

  return (
    <ScrollView
      className="flex-1 bg-bg dark:bg-dark-bg"
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Card>
        <Text className="text-ink-900 dark:text-white font-bold mb-4">{t('preferences.language')}</Text>
        <Select<Language>
          value={language}
          onChange={(value) => dispatch(setLanguage(value))}
          options={[
            { label: t('preferences.spanish'), value: 'es' },
            { label: t('preferences.english'), value: 'en' },
          ]}
        />
      </Card>

      <View className="mt-4">
        <Card>
          <Text className="text-ink-900 dark:text-white font-bold mb-2">{t('preferences.notifications')}</Text>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1">
              <Bell size={18} color="#6B7280" />
              <Text className="text-ink-900 dark:text-white font-semibold ml-3">
                {t('preferences.pushNotifications')}
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={(v) => {
                dispatch(togglePushNotifications(v));
              }}
              trackColor={{ true: '#22C55E', false: '#E5E7EB' }}
            />
          </View>
          <Divider />
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1">
              <Globe size={18} color="#6B7280" />
              <Text className="text-ink-900 dark:text-white font-semibold ml-3">
                {t('preferences.promoOffers')}
              </Text>
            </View>
            <Switch
              value={promoOffers}
              onValueChange={(v) => {
                dispatch(togglePromoOffers(v));
              }}
              trackColor={{ true: '#22C55E', false: '#E5E7EB' }}
            />
          </View>
        </Card>
      </View>

      <View className="mt-4">
        <Card>
          <Text className="text-ink-900 dark:text-white font-bold mb-2">{t('preferences.appearance')}</Text>
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center flex-1">
              <Moon size={18} color="#6B7280" />
              <Text className="text-ink-900 dark:text-white font-semibold ml-3">
                {t('preferences.darkMode')}
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(v) => {
                dispatch(toggleDarkMode(v));
              }}
              trackColor={{ true: '#22C55E', false: '#E5E7EB' }}
            />
          </View>
        </Card>
      </View>

      <View className="mt-4 gap-2">
        <ListItem
          title={t('preferences.privacy')}
          subtitle={t('preferences.privacySubtitle')}
          leftIcon={<Shield size={18} color={iconColor.primary} />}
          onPress={() => undefined}
        />
      </View>
    </ScrollView>
  );
}
