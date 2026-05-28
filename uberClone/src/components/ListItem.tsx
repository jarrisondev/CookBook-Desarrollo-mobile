import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

type Props = {
  title: string;
  subtitle?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
};

export function ListItem({
  title,
  subtitle,
  leftIcon,
  rightSlot,
  onPress,
  showChevron = true,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-surface rounded-2xl px-4 py-3.5 active:opacity-70"
    >
      {leftIcon ? (
        <View className="w-10 h-10 rounded-full bg-ink-100 items-center justify-center mr-3">
          {leftIcon}
        </View>
      ) : null}
      <View className="flex-1">
        <Text className="text-ink-900 font-semibold text-base">{title}</Text>
        {subtitle ? (
          <Text className="text-muted text-xs mt-0.5">{subtitle}</Text>
        ) : null}
      </View>
      {rightSlot ?? (showChevron && onPress ? <ChevronRight size={18} color="#9CA3AF" /> : null)}
    </Pressable>
  );
}
