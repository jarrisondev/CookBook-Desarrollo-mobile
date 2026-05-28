import type { ReactNode } from 'react';
import { Pressable } from 'react-native';
import { shadows } from '../theme';

type Variant = 'surface' | 'primary' | 'ghost';

type Props = {
  icon: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: number;
  elevated?: boolean;
};

const variantClasses: Record<Variant, string> = {
  surface: 'bg-surface dark:bg-dark-surface',
  primary: 'bg-primary-500',
  ghost: 'bg-transparent',
};

export function IconButton({
  icon,
  onPress,
  variant = 'surface',
  size = 44,
  elevated = true,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        elevated ? shadows.card : undefined,
      ]}
      className={`items-center justify-center ${variantClasses[variant]} active:opacity-80`}
    >
      {icon}
    </Pressable>
  );
}
