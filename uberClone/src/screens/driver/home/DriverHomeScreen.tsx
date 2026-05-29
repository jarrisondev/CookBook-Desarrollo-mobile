import { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Divider,
  MapView,
} from '../../../components';
import { useLocation } from '../../../hooks/useLocation';
import { shadows } from '../../../theme';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  setActiveRideId,
  setOnline,
} from '../../../store/slices/driverSlice';
import { subscribeToOpenRequests } from '../../../services/firebase/rides';
import { driverStats, weeklyEarnings } from '../../../constants/driverMockData';
import { formatCurrency } from '../../../utils/format';
import type { Ride } from '../../../models';
import type { DriverTabScreenProps } from '../../../navigation/types';

type Props = DriverTabScreenProps<'DriverHome'>;

const todaysEarnings = weeklyEarnings[weeklyEarnings.length - 1];

export function DriverHomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const online = useAppSelector((s) => s.driver.online);
  const activeRideId = useAppSelector((s) => s.driver.activeRideId);
  const [openRequests, setOpenRequests] = useState<Ride[]>([]);
  const { coords } = useLocation();

  useEffect(() => {
    console.log(`[driver-home] online changed to ${online}`);
    if (!online) return;
    const unsub = subscribeToOpenRequests(setOpenRequests);
    return () => {
      console.log('[driver-home] closing open-requests listener');
      unsub();
    };
  }, [online]);

  useEffect(() => {
    if (!online) {
      console.log('[driver-home] skip navigate: not online');
      return;
    }
    if (activeRideId) {
      console.log(
        `[driver-home] skip navigate: activeRideId already set (${activeRideId})`,
      );
      return;
    }
    const next = openRequests[0];
    if (next) {
      console.log(`[driver-home] new request -> navigate to IncomingRide (${next.id})`);
      dispatch(setActiveRideId(next.id));
      navigation.navigate('IncomingRide');
    } else {
      console.log('[driver-home] no open requests yet');
    }
  }, [online, openRequests, activeRideId, dispatch, navigation]);

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapView initialCoordinates={coords} myLocation={coords} />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="items-center mt-2">
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

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8"
          style={shadows.cardLg}
        >
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-muted dark:text-ink-400 text-[11px]">
                {t('driver.home.balance')}
              </Text>
              <Text className="text-ink-900 dark:text-white text-2xl font-bold mt-0.5">
                {formatCurrency(user?.balance ?? 0)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="items-end mr-2.5">
                <Text className="text-ink-900 dark:text-white font-semibold text-sm">
                  {user?.fullName.split(' ')[0]}
                </Text>
                <Text className="text-muted dark:text-ink-400 text-[10px]">
                  {user?.level}
                </Text>
              </View>
              <Avatar name={user?.fullName ?? '?'} size={40} />
            </View>
          </View>

          <Divider />

          <View className="flex-row justify-between mt-3">
            <View>
              <Text className="text-muted dark:text-ink-400 text-[11px]">
                {t('driver.home.todayEarnings')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
                {formatCurrency(todaysEarnings.amount)}
              </Text>
            </View>
            <View>
              <Text className="text-muted dark:text-ink-400 text-[11px]">
                {t('driver.home.todayRides')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
                {todaysEarnings.rides}
              </Text>
            </View>
            <View>
              <Text className="text-muted dark:text-ink-400 text-[11px]">
                {t('driver.stats.rating')}
              </Text>
              <Text className="text-ink-900 dark:text-white font-bold mt-0.5">
                {(user?.rating ?? driverStats.rating).toFixed(1)} ★
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
