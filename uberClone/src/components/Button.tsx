import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
};

const containerByVariant: Record<Variant, string> = {
  primary: 'bg-primary-500 active:bg-primary-600',
  secondary: 'bg-ink-100 dark:bg-ink-700 active:bg-ink-200 dark:active:bg-ink-500',
  ghost: 'bg-transparent active:bg-ink-100 dark:active:bg-ink-700',
  danger: 'bg-danger active:opacity-90',
};

const textByVariant: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-ink-900 dark:text-white',
  ghost: 'text-ink-900 dark:text-white',
  danger: 'text-white',
};

const sizeContainer: Record<Size, string> = {
  sm: 'h-10 px-4 rounded-xl',
  md: 'h-12 px-5 rounded-2xl',
  lg: 'h-14 px-6 rounded-2xl',
};

const sizeText: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${sizeContainer[size]} ${containerByVariant[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${isDisabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : '#0F1115'} />
      ) : (
        <>
          {leftIcon ? <>{leftIcon}</> : null}
          <Text className={`font-semibold ${sizeText[size]} ${textByVariant[variant]} ${leftIcon ? 'ml-2' : ''} ${rightIcon ? 'mr-2' : ''}`}>
            {label}
          </Text>
          {rightIcon ? <>{rightIcon}</> : null}
        </>
      )}
    </Pressable>
  );
}
