import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, ChevronDown, Crosshair, Home as HomeIcon, Menu, Search } from 'lucide-react-native';
import { Avatar, IconButton, MapPlaceholder } from '../../../components';
import { shadows } from '../../../theme';
import { mockUser, savedPlaces } from '../../../constants/mockData';
import type { TabScreenProps } from '../../../navigation/types';

type Props = TabScreenProps<'Home'>;

const quickPlaces = savedPlaces.slice(0, 3);

const iconForType = (type: string) => {
  if (type === 'home') return <HomeIcon size={18} color="#fff" />;
  if (type === 'work') return <Briefcase size={18} color="#fff" />;
  return <Crosshair size={18} color="#fff" />;
};

export function HomeScreen({ navigation }: Props) {
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
            <Text className="text-ink-900 font-semibold text-sm">Online</Text>
          </View>
          <Pressable>
            <Avatar name={mockUser.name} size={44} />
          </Pressable>
        </View>
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="bg-surface rounded-t-3xl px-5 pt-5 pb-8"
          style={shadows.cardLg}
        >
          <View className="self-center w-12 h-1.5 bg-ink-200 rounded-full mb-5" />

          <Pressable
            className="flex-row items-center bg-ink-50 rounded-2xl px-4 h-14"
            onPress={() => navigation.navigate('SearchDestination')}
          >
            <Search size={20} color="#6B7280" />
            <Text className="ml-3 text-ink-400 text-base flex-1">Where are you going?</Text>
            <ChevronDown size={18} color="#9CA3AF" />
          </Pressable>

          <Text className="text-ink-900 font-bold text-base mt-6 mb-3">Saved places</Text>
          <View className="flex-row justify-between">
            {quickPlaces.map((place) => (
              <Pressable
                key={place.id}
                onPress={() => navigation.navigate('VehicleSelect', { destination: place.address })}
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
      </View>
    </View>
  );
}
