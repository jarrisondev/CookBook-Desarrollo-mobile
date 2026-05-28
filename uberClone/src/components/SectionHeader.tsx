import { Pressable, Text, View } from 'react-native';

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({ title, actionLabel, onActionPress }: Props) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="text-ink-900 font-bold text-lg">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onActionPress}>
          <Text className="text-primary-600 font-semibold text-sm">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
