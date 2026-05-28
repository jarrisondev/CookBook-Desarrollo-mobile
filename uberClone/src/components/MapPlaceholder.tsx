import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type Props = {
  showPulse?: boolean;
  showRoute?: boolean;
};

export function MapPlaceholder({ showPulse = true, showRoute = false }: Props) {
  return (
    <View className="absolute inset-0 bg-ink-50 overflow-hidden">
      <Svg width="100%" height="100%" viewBox="0 0 360 720" preserveAspectRatio="xMidYMid slice">
        <Path d="M0 120 L360 80" stroke="#FFFFFF" strokeWidth="22" />
        <Path d="M0 260 L360 220" stroke="#FFFFFF" strokeWidth="18" />
        <Path d="M0 420 L360 380" stroke="#FFFFFF" strokeWidth="14" />
        <Path d="M0 560 L360 520" stroke="#FFFFFF" strokeWidth="20" />
        <Path d="M40 0 L80 720" stroke="#FFFFFF" strokeWidth="18" />
        <Path d="M180 0 L220 720" stroke="#FFFFFF" strokeWidth="22" />
        <Path d="M300 0 L340 720" stroke="#FFFFFF" strokeWidth="14" />

        {showRoute ? (
          <Path
            d="M60 600 C 140 540, 120 420, 200 380 S 280 240, 260 140"
            stroke="#22C55E"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        ) : null}

        {showPulse ? (
          <>
            <Circle cx="180" cy="360" r="80" fill="#22C55E" opacity="0.08" />
            <Circle cx="180" cy="360" r="56" fill="#22C55E" opacity="0.12" />
            <Circle cx="180" cy="360" r="34" fill="#22C55E" opacity="0.18" />
            <Circle cx="180" cy="360" r="14" fill="#22C55E" />
          </>
        ) : null}
      </Svg>
    </View>
  );
}
