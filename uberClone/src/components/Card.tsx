import type { ReactNode } from 'react';
import { View } from 'react-native';
import { shadows } from '../theme';

type Props = {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
};

export function Card({ children, className = '', elevated = true }: Props) {
  return (
    <View
      className={`bg-surface dark:bg-dark-surface rounded-3xl p-5 ${className}`}
      style={elevated ? shadows.card : undefined}
    >
      {children}
    </View>
  );
}
