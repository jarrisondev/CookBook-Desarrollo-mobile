import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { ChevronLeft, Clock, MapPin, Search } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IconButton, ScreenContainer, TextField } from '../../components';
import { savedPlaces } from '../../constants/mockData';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'SearchDestination'>;

export function SearchDestinationScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return savedPlaces;
    return savedPlaces.filter((p) =>
      `${p.label} ${p.address}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <ScreenContainer>
      <View className="flex-row items-center mt-2 mb-4">
        <IconButton
          icon={<ChevronLeft size={22} color="#0F1115" />}
          onPress={() => navigation.goBack()}
          elevated={false}
          size={40}
        />
        <Text className="text-ink-900 text-xl font-bold ml-2">Where to?</Text>
      </View>

      <TextField
        placeholder="Search destination"
        value={query}
        onChangeText={setQuery}
        leftIcon={<Search size={20} color="#6B7280" />}
        autoFocus
      />

      <Text className="text-ink-900 font-bold text-base mt-6 mb-3">
        {query.trim() ? 'Suggestions' : 'Recent and saved'}
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-1" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('VehicleSelect', { destination: item.address })}
            className="flex-row items-center py-3 active:opacity-60"
          >
            <View className="w-10 h-10 rounded-full bg-ink-100 items-center justify-center mr-3">
              {item.type === 'recent' ? (
                <Clock size={18} color="#6B7280" />
              ) : (
                <MapPin size={18} color="#16A34A" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-ink-900 font-semibold text-base">{item.label}</Text>
              <Text className="text-muted text-xs">{item.address}</Text>
            </View>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}
