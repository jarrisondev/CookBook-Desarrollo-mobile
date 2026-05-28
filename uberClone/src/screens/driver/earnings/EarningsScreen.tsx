import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Card,
  Divider,
  ScreenContainer,
} from '../../../components';
import {
  driverStats,
  weeklyEarnings,
} from '../../../constants/driverMockData';
import { formatCurrency } from '../../../utils/format';
import type { DriverTabScreenProps } from '../../../navigation/types';

type Props = DriverTabScreenProps<'Earnings'>;

type Tab = 'balance' | 'revenue' | 'net';

export function EarningsScreen(_: Props) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('revenue');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'balance', label: t('driver.earnings.balance') },
    { id: 'revenue', label: t('driver.earnings.revenue') },
    { id: 'net', label: t('driver.earnings.net') },
  ];

  const totalAmount = weeklyEarnings.reduce((sum, d) => sum + d.amount, 0);
  const totalBonuses = 12 * weeklyEarnings.length;
  const highlightIndex = weeklyEarnings.reduce(
    (best, day, i) => (day.amount > weeklyEarnings[best].amount ? i : best),
    0,
  );

  return (
    <ScreenContainer scroll>
      <View className="mt-4">
        <Text className="text-ink-900 dark:text-white text-2xl font-bold">
          {t('driver.earnings.title')}
        </Text>
        <Text className="text-muted dark:text-ink-400 text-sm mt-1">
          {t('driver.earnings.subtitle')}
        </Text>
      </View>

      <View className="mt-6">
        <Card>
          <BarChart
            data={weeklyEarnings.map((d) => ({ label: d.day, value: d.amount }))}
            highlightedIndex={highlightIndex}
            height={170}
          />
          <View className="self-center bg-ink-900 px-4 py-1.5 rounded-full mt-4 flex-row items-center">
            <Text className="text-white text-xs">USD</Text>
            <Text className="text-white font-bold ml-1">
              {weeklyEarnings[highlightIndex].amount.toFixed(0)}
            </Text>
            <View className="w-px h-3 bg-white/40 mx-3" />
            <Text className="text-primary-300 text-xs">{t('driver.earnings.bonuses')}</Text>
            <Text className="text-primary-300 font-bold ml-1">12</Text>
          </View>
          <Text className="text-muted dark:text-ink-400 text-xs text-center mt-3">
            {t('driver.earnings.finishedRides')}
          </Text>

          <View className="flex-row justify-around mt-4 border-t border-ink-100 dark:border-dark-border pt-4">
            {tabs.map((it) => (
              <Pressable key={it.id} onPress={() => setTab(it.id)} className="px-2">
                <Text
                  className={`text-sm font-semibold ${
                    tab === it.id
                      ? 'text-primary-600'
                      : 'text-muted dark:text-ink-400'
                  }`}
                >
                  {it.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>
      </View>

      <View className="mt-6">
        <Card>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('driver.earnings.totalThisWeek')}
              </Text>
              <Text className="text-ink-900 dark:text-white text-3xl font-bold mt-1">
                {formatCurrency(totalAmount)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('driver.earnings.bonuses')}
              </Text>
              <Text className="text-primary-600 text-2xl font-bold mt-1">
                +{formatCurrency(totalBonuses)}
              </Text>
            </View>
          </View>
          <Divider className="my-4" />
          <View className="flex-row justify-between">
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('driver.stats.accepted')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
                {driverStats.acceptedPercent}%
              </Text>
            </View>
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('driver.stats.rating')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
                {driverStats.rating.toFixed(1)} ★
              </Text>
            </View>
            <View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('driver.stats.cancelled')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
                {driverStats.cancelledPercent}%
              </Text>
            </View>
          </View>
        </Card>
      </View>

      <View className="mt-6">
        <Card>
          <Text className="text-ink-900 dark:text-white font-bold">
            {t('driver.activeRides.title')}
          </Text>
          <View className="flex-row items-end justify-center mt-3">
            <Text className="text-primary-600 text-5xl font-bold">
              {driverStats.activeRidesThisWeek}
            </Text>
            <Text className="text-muted dark:text-ink-400 text-xl ml-1 mb-2">
              /{driverStats.activeRidesTarget}
            </Text>
          </View>
          <View className="bg-ink-100 dark:bg-ink-700 h-2 rounded-full mt-3 overflow-hidden">
            <View
              className="bg-primary-500 h-full"
              style={{
                width: `${(driverStats.activeRidesThisWeek / driverStats.activeRidesTarget) * 100}%`,
              }}
            />
          </View>
          <Text className="text-muted dark:text-ink-400 text-xs text-center mt-2">
            {t('driver.activeRides.target')}
          </Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}
