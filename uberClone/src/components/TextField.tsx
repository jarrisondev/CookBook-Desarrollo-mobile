import type { ReactNode } from 'react';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export function TextField({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onFocus,
  onBlur,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? 'border-danger'
    : focused
      ? 'border-primary-500'
      : 'border-border';

  return (
    <View className="w-full">
      {label ? (
        <Text className="text-ink-700 text-sm font-semibold mb-2">{label}</Text>
      ) : null}
      <View
        className={`flex-row items-center bg-surface border ${borderColor} rounded-2xl px-4 h-14`}
      >
        {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}
        <TextInput
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-ink-900 text-base"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...inputProps}
        />
        {rightIcon ? <View className="ml-3">{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text className="text-danger text-xs mt-1.5">{error}</Text>
      ) : hint ? (
        <Text className="text-muted text-xs mt-1.5">{hint}</Text>
      ) : null}
    </View>
  );
}
