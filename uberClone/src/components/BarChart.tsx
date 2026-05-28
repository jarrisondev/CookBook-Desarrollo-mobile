import { Text, View } from 'react-native';

type Bar = {
  label: string;
  value: number;
};

type Props = {
  data: Bar[];
  highlightedIndex?: number;
  height?: number;
};

export function BarChart({ data, highlightedIndex, height = 160 }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View>
      <View style={{ height }} className="flex-row items-end justify-between">
        {data.map((bar, index) => {
          const ratio = bar.value / max;
          const isHighlighted = index === highlightedIndex;
          return (
            <View key={bar.label} className="flex-1 items-center">
              <View
                className={`w-7 rounded-full ${
                  isHighlighted ? 'bg-primary-500' : 'bg-ink-200 dark:bg-ink-500'
                }`}
                style={{ height: Math.max(ratio * height, 8) }}
              />
            </View>
          );
        })}
      </View>
      <View className="flex-row justify-between mt-2">
        {data.map((bar, index) => (
          <View key={bar.label} className="flex-1 items-center">
            <Text
              className={`text-[11px] ${
                index === highlightedIndex
                  ? 'text-primary-600 font-bold'
                  : 'text-muted dark:text-ink-400'
              }`}
            >
              {bar.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
