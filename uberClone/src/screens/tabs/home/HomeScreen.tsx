import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Briefcase,
  ChevronRight,
  Crosshair,
  Home as HomeIcon,
  MapPin,
  Search,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { MapPlaceholder } from '../../../components';
import { shadows } from '../../../theme';
import { useSavedPlaces } from '../../../hooks/useSavedPlaces';
import { useAppDispatch } from '../../../store';
import { setDestination } from '../../../store/slices/rideSlice';
import type { PlaceType } from '../../../models';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'Home'>;

const iconForType = (type: PlaceType) => {
  if (type === 'home') return <HomeIcon size={18} color="#fff" />;
  if (type === 'work') return <Briefcase size={18} color="#fff" />;
  if (type === 'favorite') return <Crosshair size={18} color="#fff" />;
  return <MapPin size={18} color="#fff" />;
};

export function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { places } = useSavedPlaces();

  const handlePickPlace = (label: string, address: string) => {
    dispatch(setDestination({ label, address }));
    navigation.navigate('VehicleSelect', { destination: address });
  };

  return (
    <View className="flex-1 bg-bg dark:bg-dark-bg">
      <MapPlaceholder showPulse />

      <SafeAreaView edges={['top']} className="absolute top-0 left-0 right-0 px-5">
        <View className="items-center mt-2">
          <View
            className="bg-surface dark:bg-dark-surface px-4 py-1.5 rounded-full flex-row items-center"
            style={shadows.card}
          >
            <View className="w-2 h-2 rounded-full bg-success mr-2" />
            <Text className="text-ink-900 dark:text-white font-semibold text-sm">
              {t('common.online')}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="bg-surface dark:bg-dark-surface rounded-t-3xl px-5 pt-5 pb-8"
          style={shadows.cardLg}
        >
          <Pressable
            className="flex-row items-center bg-ink-50 dark:bg-ink-700 rounded-2xl px-4 h-14"
            onPress={() => navigation.navigate('SearchDestination')}
          >
            <Search size={20} color="#6B7280" />
            <Text className="ml-3 text-ink-400 text-base flex-1">
              {t('home.whereTo')}
            </Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </Pressable>

          {places.length > 0 ? (
            <>
              <Text className="text-ink-900 dark:text-white font-bold text-sm mt-5 mb-3">
                {t('home.savedPlaces')}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 14, paddingRight: 8 }}
              >
                {places.map((place) => (
                  <Pressable
                    key={place.id}
                    onPress={() => handlePickPlace(place.label, place.address)}
                    className="items-center"
                    style={{ width: 76 }}
                  >
                    <View className="w-12 h-12 rounded-full bg-ink-900 items-center justify-center mb-1.5">
                      {iconForType(place.type)}
                    </View>
                    <Text
                      className="text-ink-900 dark:text-white font-semibold text-xs text-center"
                      numberOfLines={1}
                    >
                      {place.label}
                    </Text>
                    <Text
                      className="text-muted dark:text-ink-400 text-[10px] text-center"
                      numberOfLines={1}
                    >
                      {place.address.split(',')[0]}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}
