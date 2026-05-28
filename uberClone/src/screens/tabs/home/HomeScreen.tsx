import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Home as HomeIcon,
  Menu,
  Search,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  BottomSheet,
  IconButton,
  MapPlaceholder,
} from '../../../components';
import { shadows } from '../../../theme';
import { savedPlaces } from '../../../constants/mockData';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setDestination } from '../../../store/slices/rideSlice';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'Home'>;

const COLLAPSED_HEIGHT = 200;
const EXPANDED_HEIGHT = 440;

const quickPlaces = savedPlaces.slice(0, 3);

const iconForType = (type: string) => {
  if (type === 'home') return <HomeIcon size={18} color="#fff" />;
  if (type === 'work') return <Briefcase size={18} color="#fff" />;
  return <Crosshair size={18} color="#fff" />;
};

export function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const handlePickPlace = (label: string, address: string) => {
    dispatch(setDestination({ label, address }));
    navigation.navigate('VehicleSelect', { destination: address });
  };

  return (
    <View className="flex-1 bg-bg">
      <MapPlaceholder showPulse />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="flex-row items-center justify-between mt-2">
          <IconButton icon={<Menu size={22} color="#0F1115" />} />
          <View
            className="bg-surface px-4 py-1.5 rounded-full flex-row items-center"
            style={shadows.card}
          >
            <View className="w-2 h-2 rounded-full bg-success mr-2" />
            <Text className="text-ink-900 font-semibold text-sm">{t('common.online')}</Text>
          </View>
          <Pressable>
            <Avatar name={user?.fullName ?? 'Guest'} size={44} />
          </Pressable>
        </View>
      </SafeAreaView>

      <BottomSheet
        collapsedHeight={COLLAPSED_HEIGHT}
        expandedHeight={EXPANDED_HEIGHT}
        initiallyExpanded={false}
        onChangeExpanded={setExpanded}
      >
        <Pressable
          className="flex-row items-center bg-ink-50 rounded-2xl px-4 h-14"
          onPress={() => navigation.navigate('SearchDestination')}
        >
          <Search size={20} color="#6B7280" />
          <Text className="ml-3 text-ink-400 text-base flex-1">{t('home.whereTo')}</Text>
          {expanded ? (
            <ChevronUp size={18} color="#9CA3AF" />
          ) : (
            <ChevronDown size={18} color="#9CA3AF" />
          )}
        </Pressable>

        <View className="mt-6">
          <Text className="text-ink-900 font-bold text-base mb-3">{t('home.savedPlaces')}</Text>
          <View className="flex-row justify-between">
            {quickPlaces.map((place) => (
              <Pressable
                key={place.id}
                onPress={() => handlePickPlace(place.label, place.address)}
                className="items-center flex-1"
              >
                <View className="w-14 h-14 rounded-full bg-ink-900 items-center justify-center mb-2">
                  {iconForType(place.type)}
                </View>
                <Text className="text-ink-900 font-semibold text-sm">{place.label}</Text>
                <Text className="text-muted text-xs">{place.address.split(',')[0]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}
