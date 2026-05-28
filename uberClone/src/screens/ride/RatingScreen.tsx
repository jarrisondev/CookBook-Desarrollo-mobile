import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Star } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, Button, ScreenContainer } from '../../components';
import { mockDriver } from '../../constants/mockData';
import type { MainStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainStackParamList, 'Rating'>;

const tips = [0, 1, 2, 5];

export function RatingScreen({ navigation }: Props) {
  const [rating, setRating] = useState(5);
  const [tipIndex, setTipIndex] = useState(1);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    navigation.popToTop();
  };

  return (
    <ScreenContainer scroll>
      <View className="items-center mt-8">
        <Avatar name={mockDriver.name} size={88} />
        <Text className="text-ink-900 text-2xl font-bold mt-4">You arrived!</Text>
        <Text className="text-muted text-base mt-2 text-center">
          How was your trip with {mockDriver.name}?
        </Text>
      </View>

      <View className="flex-row justify-center mt-8 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Pressable key={n} onPress={() => setRating(n)} hitSlop={10}>
            <Star
              size={40}
              color={n <= rating ? '#F59E0B' : '#E5E7EB'}
              fill={n <= rating ? '#F59E0B' : '#E5E7EB'}
            />
          </Pressable>
        ))}
      </View>

      <Text className="text-ink-900 font-bold text-base mt-10 mb-3">Tip the driver</Text>
      <View className="flex-row gap-2">
        {tips.map((amount, i) => {
          const isSelected = tipIndex === i;
          return (
            <Pressable
              key={amount}
              onPress={() => setTipIndex(i)}
              className={`flex-1 items-center py-3 rounded-2xl border ${
                isSelected ? 'bg-primary-500 border-primary-500' : 'bg-surface border-border'
              }`}
            >
              <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-ink-900'}`}>
                {amount === 0 ? 'No tip' : `$${amount.toFixed(2)}`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="text-ink-900 font-bold text-base mt-8 mb-3">Leave a comment</Text>
      <View className="bg-surface border border-border rounded-2xl px-4 py-3">
        <TextInput
          placeholder="Write your comment…"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          className="text-ink-900 min-h-24 text-base"
          textAlignVertical="top"
        />
      </View>

      <View className="mt-8">
        <Button label="Submit" onPress={handleSubmit} />
      </View>
    </ScreenContainer>
  );
}
