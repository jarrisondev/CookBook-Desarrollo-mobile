import { Image, Text, View } from 'react-native';

type Props = {
  uri?: string;
  name?: string;
  size?: number;
};

function initialsOf(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

export function Avatar({ uri, name, size = 44 }: Props) {
  const radius = size / 2;
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius }}
      />
    );
  }
  return (
    <View
      className="items-center justify-center bg-primary-100"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <Text className="text-primary-700 font-bold" style={{ fontSize: size * 0.4 }}>
        {initialsOf(name).toUpperCase()}
      </Text>
    </View>
  );
}
