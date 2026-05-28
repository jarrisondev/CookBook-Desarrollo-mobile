import { useEffect } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronUp, Menu } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  BottomSheet,
  Card,
  Divider,
  IconButton,
} from '../../../components';
import { shadows } from '../../../theme';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setIncomingRequest,
  setOnline,
} from '../../../store/slices/driverSlice';
import { useIconColor } from '../../../hooks/useIconColor';
import {
  driverStats,
  mockDriverProfile,
  mockIncomingRequest,
  weeklyEarnings,
} from '../../../constants/driverMockData';
import { formatCurrency } from '../../../utils/format';
import { MapPlaceholder } from '../../../components/MapPlaceholder';
import type { DriverTabScreenProps } from '../../../navigation/types';

type Props = DriverTabScreenProps<'DriverHome'>;

const COLLAPSED_HEIGHT = 220;
const EXPANDED_HEIGHT = 460;

const todaysEarnings = weeklyEarnings[weeklyEarnings.length - 1];

export function DriverHomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconColor = useIconColor();
  const online = useAppSelector((s) => s.driver.online);
  const currentRequest = useAppSelector((s) => s.driver.currentRequest);

  useEffect(() => {
    if (currentRequest) {
      navigation.navigate('IncomingRide');
    }
  }, [currentRequest, navigation]);

  const handleSimulateRequest = () => {
    dispatch(setIncomingRequest(mockIncomingRequest));
  };

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showPulse={online} />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="flex-row items-center justify-between mt-2">
          <IconButton icon={<Menu size={22} color={iconColor.primary} />} />
          <View
            className="bg-surface dark:bg-dark-surface px-4 py-1.5 rounded-full flex-row items-center"
            style={shadows.card}
          >
            <View
              className={`w-2 h-2 rounded-full mr-2 ${online ? 'bg-success' : 'bg-ink-400'}`}
            />
            <Text className="text-ink-900 dark:text-white font-semibold text-sm mr-3">
              {online ? t('driver.home.online') : t('driver.home.offline')}
            </Text>
            <Switch
              value={online}
              onValueChange={(v) => {
                dispatch(setOnline(v));
              }}
              trackColor={{ true: '#22C55E', false: '#E5E7EB' }}
              style={{ transform: [{ scale: 0.8 }] }}
            />
          </View>
          <Pressable>
            <Avatar name={mockDriverProfile.fullName} size={44} />
          </Pressable>
        </View>

        {online ? (
          <View className="items-center mt-8">
            <View className="bg-primary-50 px-4 py-2 rounded-full" style={shadows.card}>
              <Text className="text-primary-700 font-semibold text-sm">
                {t('driver.home.lookingForRides')}
              </Text>
            </View>
          </View>
        ) : null}
      </SafeAreaView>

      <BottomSheet
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={EXPANDED_HEIGHT}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-muted dark:text-ink-400 text-xs">
              {t('driver.home.balance')}
            </Text>
            <Text className="text-ink-900 dark:text-white text-2xl font-bold mt-0.5">
              {formatCurrency(mockDriverProfile.balance)}
            </Text>
          </View>
          <View className="items-end">
            <Avatar name={mockDriverProfile.fullName} size={44} />
            <Text className="text-ink-900 dark:text-white font-semibold text-sm mt-1">
              {mockDriverProfile.fullName.split(' ')[0]}
            </Text>
            <Text className="text-muted dark:text-ink-400 text-[10px]">
              {mockDriverProfile.level}
            </Text>
          </View>
        </View>

        <Divider />

        <View className="flex-row justify-between mt-4">
          <View>
            <Text className="text-muted dark:text-ink-400 text-xs">
              {t('driver.home.todayEarnings')}
            </Text>
            <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
              {formatCurrency(todaysEarnings.amount)}
            </Text>
          </View>
          <View>
            <Text className="text-muted dark:text-ink-400 text-xs">
              {t('driver.home.todayRides')}
            </Text>
            <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
              {todaysEarnings.rides}
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
        </View>

        <View className="mt-6">
          <Card elevated={false} className="bg-ink-900">
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-white text-lg font-bold">
                  {driverStats.acceptedPercent}%
                </Text>
                <Text className="text-white/70 text-xs">
                  {t('driver.stats.accepted')}
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-white text-lg font-bold">
                  {driverStats.rating.toFixed(1)}
                </Text>
                <Text className="text-white/70 text-xs">
                  {t('driver.stats.rating')}
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-white text-lg font-bold">
                  {driverStats.cancelledPercent}%
                </Text>
                <Text className="text-white/70 text-xs">
                  {t('driver.stats.cancelled')}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {online ? (
          <Pressable
            onPress={handleSimulateRequest}
            className="mt-4 bg-primary-50 rounded-2xl px-4 py-3 flex-row items-center justify-center"
          >
            <ChevronUp size={18} color="#16A34A" />
            <Text className="text-primary-700 font-semibold ml-2">
              {t('driver.home.simulate')}
            </Text>
          </Pressable>
        ) : null}
      </BottomSheet>
    </View>
  );
}
