import { View } from 'react-native';

type Props = {
  className?: string;
};

export function Divider({ className = '' }: Props) {
  return <View className={`h-px bg-ink-200 dark:bg-dark-border w-full ${className}`} />;
}
