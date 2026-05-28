import { Pressable, Text } from 'react-native';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 h-9 items-center justify-center rounded-full border ${
        selected ? 'bg-primary-500 border-primary-500' : 'bg-surface border-border'
      }`}
    >
      <Text className={`text-sm font-semibold ${selected ? 'text-white' : 'text-ink-700'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
