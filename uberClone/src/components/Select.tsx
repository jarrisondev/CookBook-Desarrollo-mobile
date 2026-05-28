import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  label?: string;
  placeholder?: string;
  value?: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  error?: string;
};

export function Select<T extends string>({
  label,
  placeholder = 'Select…',
  value,
  options,
  onChange,
  error,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View className="w-full">
      {label ? (
        <Text className="text-ink-700 text-sm font-semibold mb-2">{label}</Text>
      ) : null}
      <Pressable
        onPress={() => setOpen(true)}
        className={`flex-row items-center bg-surface border ${
          error ? 'border-danger' : 'border-border'
        } rounded-2xl px-4 h-14`}
      >
        <Text className={`flex-1 text-base ${selected ? 'text-ink-900' : 'text-ink-400'}`}>
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#6B7280" />
      </Pressable>
      {error ? <Text className="text-danger text-xs mt-1.5">{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-surface rounded-t-3xl pt-2 pb-8">
            <View className="self-center w-10 h-1.5 bg-ink-200 rounded-full mb-3" />
            {label ? (
              <Text className="text-ink-900 font-semibold text-lg px-5 mb-2">{label}</Text>
            ) : null}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    className="flex-row items-center justify-between px-5 py-4 active:bg-ink-50"
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text className={`text-base ${isSelected ? 'text-primary-600 font-semibold' : 'text-ink-900'}`}>
                      {item.label}
                    </Text>
                    {isSelected ? <Check size={20} color="#16A34A" /> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
