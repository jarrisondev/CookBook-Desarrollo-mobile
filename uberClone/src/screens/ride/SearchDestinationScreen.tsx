import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { ChevronLeft, Clock, MapPin, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IconButton, ScreenContainer, TextField } from '../../components';
import { useIconColor } from '../../hooks/useIconColor';
import { useLocation } from '../../hooks/useLocation';
import { usePlacesAutocomplete } from '../../hooks/usePlacesAutocomplete';
import { useSavedPlaces } from '../../hooks/useSavedPlaces';
import { useAppDispatch } from '../../store';
import { setDestination } from '../../store/slices/rideSlice';
import { getPlaceDetails } from '../../services/google';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'SearchDestination'>;

export function SearchDestinationScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const iconColor = useIconColor();
  const { places } = useSavedPlaces();
  const { coords } = useLocation();
  const [input, setInput] = useState('');
  const [resolving, setResolving] = useState(false);

  const { predictions, loading, error, sessionToken } = usePlacesAutocomplete(input, {
    location: coords,
  });

  const hasQuery = input.trim().length >= 2;

  const handlePickSaved = (
    label: string,
    address: string,
    lat?: number,
    lng?: number,
  ) => {
    dispatch(setDestination({ label, address, lat, lng }));
    navigation.navigate('VehicleSelect', { destination: address });
  };

  const handlePickPrediction = async (placeId: string, fallbackLabel: string) => {
    setResolving(true);
    try {
      const details = await getPlaceDetails(placeId, sessionToken);
      const label = details?.name || fallbackLabel;
      const address = details?.address || fallbackLabel;
      dispatch(
        setDestination({
          label,
          address,
          lat: details?.coordinates.latitude,
          lng: details?.coordinates.longitude,
        }),
      );
      navigation.navigate('VehicleSelect', { destination: address });
    } catch (err) {
      console.warn('[search] place details failed:', err);
    } finally {
      setResolving(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-row items-center mt-2 mb-4">
        <IconButton
          icon={<ChevronLeft size={22} color={iconColor.primary} />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
        <Text className="text-ink-900 dark:text-white text-xl font-bold ml-2">
          {t('search.title')}
        </Text>
      </View>

      <TextField
        placeholder={t('search.placeholder')}
        value={input}
        onChangeText={setInput}
        leftIcon={<Search size={20} color="#6B7280" />}
        autoFocus
      />

      {hasQuery ? (
        <>
          <View className="flex-row items-center mt-6 mb-3">
            <Text className="text-ink-900 dark:text-white font-bold text-base flex-1">
              {t('search.suggestions')}
            </Text>
            {loading || resolving ? (
              <ActivityIndicator color="#16A34A" size="small" />
            ) : null}
          </View>
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.placeId}
            ItemSeparatorComponent={() => <View className="h-1" />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handlePickPrediction(item.placeId, item.description)}
                className="flex-row items-center py-3 active:opacity-60"
              >
                <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
                  <MapPin size={18} color="#16A34A" />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-ink-900 dark:text-white font-semibold text-base"
                    numberOfLines={1}
                  >
                    {item.mainText}
                  </Text>
                  {item.secondaryText ? (
                    <Text
                      className="text-muted dark:text-ink-400 text-xs"
                      numberOfLines={1}
                    >
                      {item.secondaryText}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              loading ? null : (
                <View className="items-center justify-center mt-10">
                  <Text className="text-muted dark:text-ink-400 text-sm text-center">
                    {error
                      ? `Google Places: ${error.message}`
                      : t('search.noResults')}
                  </Text>
                </View>
              )
            }
          />
        </>
      ) : (
        <>
          <Text className="text-ink-900 dark:text-white font-bold text-base mt-6 mb-3">
            {t('search.recentAndSaved')}
          </Text>
          <FlatList
            data={places}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View className="h-1" />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  handlePickSaved(item.label, item.address, item.lat, item.lng)
                }
                className="flex-row items-center py-3 active:opacity-60"
              >
                <View className="w-10 h-10 rounded-full bg-ink-100 dark:bg-ink-700 items-center justify-center mr-3">
                  {item.type === 'recent' ? (
                    <Clock size={18} color="#6B7280" />
                  ) : (
                    <MapPin size={18} color="#16A34A" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-ink-900 dark:text-white font-semibold text-base">
                    {item.label}
                  </Text>
                  <Text className="text-muted dark:text-ink-400 text-xs">
                    {item.address}
                  </Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="items-center justify-center mt-10">
                <Text className="text-muted dark:text-ink-400 text-sm text-center">
                  {t('search.emptyHint')}
                </Text>
              </View>
            }
          />
        </>
      )}
    </ScreenContainer>
  );
}
