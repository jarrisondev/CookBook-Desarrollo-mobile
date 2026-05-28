import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { MapPin, Star, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Button, Card, MapPlaceholder } from '../../../components';
import { shadows } from '../../../theme';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  acceptRequest,
  rejectRequest,
} from '../../../store/slices/driverSlice';
import { formatCurrency } from '../../../utils/format';
import type { DriverStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<DriverStackParamList, 'IncomingRide'>;

const COUNTDOWN_SECONDS = 15;

export function IncomingRideScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const request = useAppSelector((s) => s.driver.currentRequest);
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (!request) {
      navigation.goBack();
      return;
    }
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          dispatch(rejectRequest());
          navigation.goBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [request, dispatch, navigation]);

  const handleAccept = () => {
    dispatch(acceptRequest());
    navigation.replace('DriverPickup');
  };

  const handleReject = () => {
    dispatch(rejectRequest());
    navigation.goBack();
  };

  if (!request) return null;

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showRoute showPulse={false} />

      <View className="absolute inset-0 bg-black/30" />

      <View className="absolute top-0 left-0 right-0 bottom-0 justify-end p-5">
        <Card>
          <View className="items-center mb-3">
            <View className="bg-ink-900 px-3 py-1 rounded-full">
              <Text className="text-white font-semibold text-xs">
                {t('driver.incoming.secondsToAccept', { count: seconds })}
              </Text>
            </View>
            <Text className="text-ink-900 dark:text-white font-bold text-lg mt-3">
              {t('driver.incoming.newRequest')}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Avatar name={request.riderName} size={52} />
            <View className="flex-1 ml-3">
              <Text className="text-ink-900 dark:text-white font-bold text-base">
                {request.riderName}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text className="text-ink-700 dark:text-ink-200 text-sm ml-1">
                  {request.riderRating.toFixed(1)}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-primary-600 text-2xl font-bold">
                {formatCurrency(request.fare)}
              </Text>
              {request.bonusPercent ? (
                <Text className="text-primary-600 text-xs font-semibold">
                  +{request.bonusPercent}% {t('driver.incoming.bonus')}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-4 gap-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-primary-100 items-center justify-center mr-3">
                <MapPin size={16} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text className="text-muted dark:text-ink-400 text-xs">
                  {t('driver.incoming.pickup')}
                </Text>
                <Text className="text-ink-900 dark:text-white font-semibold text-sm">
                  {request.pickup.label}
                </Text>
              </View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('driver.incoming.minutes', { count: request.etaMin })}
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-ink-900 items-center justify-center mr-3">
                <MapPin size={16} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-muted dark:text-ink-400 text-xs">
                  {t('driver.incoming.dropoff')}
                </Text>
                <Text className="text-ink-900 dark:text-white font-semibold text-sm">
                  {request.dropoff.label}
                </Text>
              </View>
              <Text className="text-muted dark:text-ink-400 text-xs">
                {t('driver.incoming.km', { count: request.distanceKm })}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3 mt-6">
            <Pressable
              onPress={handleReject}
              className="w-14 h-14 rounded-full bg-ink-100 dark:bg-ink-700 items-center justify-center"
              style={shadows.card}
            >
              <X size={22} color="#EF4444" />
            </Pressable>
            <View className="flex-1">
              <Button label={t('driver.incoming.accept')} onPress={handleAccept} />
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}
