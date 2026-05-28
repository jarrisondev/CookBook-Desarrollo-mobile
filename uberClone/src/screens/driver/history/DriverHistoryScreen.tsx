import { FlatList, Text, View } from 'react-native';
import { Car, Star } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '../../../components';
import { shadows } from '../../../theme';
import { driverTripHistory } from '../../../constants/driverMockData';
import { formatCurrency, formatTripDate } from '../../../utils/format';
import type { DriverTabScreenProps } from '../../../navigation/types';

type Props = DriverTabScreenProps<'DriverHistory'>;

export function DriverHistoryScreen(_: Props) {
  const { t } = useTranslation();
  return (
    <ScreenContainer>
      <View className="mt-4">
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">
          {t('driver.history.title')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-sm mt-1">
          {t('driver.history.subtitle')}
        </Text>
      </View>

      <FlatList
        data={driverTripHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <View
            className="bg-surface dark:bg-dark-surface rounded-2xl p-4"
            style={shadows.card}
          >
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-full bg-primary-100 items-center justify-center mr-3">
                <Car size={20} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text className="text-ink-900 dark:text-white font-bold">
                  {item.riderName}
                </Text>
                <Text className="text-muted dark:text-ink-400 text-xs mt-0.5">
                  {formatTripDate(item.date)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-ink-900 dark:text-white font-bold">
                  {formatCurrency(item.earnings + item.tip)}
                </Text>
                <View className="flex-row items-center mt-0.5">
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text className="text-muted dark:text-ink-400 text-xs ml-1">
                    {item.rating}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-ink-100 dark:border-dark-border">
              <Text className="text-muted dark:text-ink-400 text-xs flex-1" numberOfLines={1}>
                {item.from} → {item.to}
              </Text>
              {item.tip > 0 ? (
                <Text className="text-primary-600 text-xs font-semibold ml-3">
                  {t('driver.history.tip')} +{formatCurrency(item.tip)}
                </Text>
              ) : null}
              <Text
                className={`text-xs font-semibold ml-3 ${
                  item.status === 'completed' ? 'text-primary-600' : 'text-danger'
                }`}
              >
                {item.status === 'completed'
                  ? t('common.completed')
                  : t('common.cancelled')}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center mt-20">
            <Text className="text-muted dark:text-ink-400">
              {t('driver.history.empty')}
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
