import type { ReactNode } from 'react';
import { useCallback, useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { shadows } from '../theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SPRING_CONFIG = { damping: 18, stiffness: 160, mass: 1 };

type Props = {
  collapsedHeight: number;
  expandedHeight: number;
  initiallyExpanded?: boolean;
  onChangeExpanded?: (expanded: boolean) => void;
  children: ReactNode;
};

export function BottomSheet({
  collapsedHeight,
  expandedHeight,
  initiallyExpanded = false,
  onChangeExpanded,
  children,
}: Props) {
  const collapsedY = SCREEN_HEIGHT - collapsedHeight;
  const expandedY = SCREEN_HEIGHT - expandedHeight;
  const translateY = useSharedValue(initiallyExpanded ? expandedY : collapsedY);
  const startY = useSharedValue(translateY.value);

  useEffect(() => {
    translateY.value = withSpring(
      initiallyExpanded ? expandedY : collapsedY,
      SPRING_CONFIG,
    );
  }, [collapsedY, expandedY, initiallyExpanded, translateY]);

  const reportExpanded = useCallback(
    (expanded: boolean) => onChangeExpanded?.(expanded),
    [onChangeExpanded],
  );

  const snapTo = (target: 'collapsed' | 'expanded') => {
    'worklet';
    translateY.value = withSpring(target === 'expanded' ? expandedY : collapsedY, SPRING_CONFIG);
    runOnJS(reportExpanded)(target === 'expanded');
  };

  const drag = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      const next = startY.value + e.translationY;
      translateY.value = Math.min(Math.max(next, expandedY), collapsedY);
    })
    .onEnd((e) => {
      const projected = translateY.value + e.velocityY * 0.15;
      const midpoint = (collapsedY + expandedY) / 2;
      const shouldExpand = projected < midpoint;
      snapTo(shouldExpand ? 'expanded' : 'collapsed');
    });

  const tap = Gesture.Tap().onEnd(() => {
    const midpoint = (collapsedY + expandedY) / 2;
    const isExpanded = translateY.value <= midpoint;
    snapTo(isExpanded ? 'collapsed' : 'expanded');
  });

  const composed = Gesture.Simultaneous(drag, tap);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      className="absolute left-0 right-0 bg-surface dark:bg-dark-surface rounded-t-3xl overflow-hidden"
      style={[{ top: 0, height: SCREEN_HEIGHT }, sheetStyle, shadows.cardLg]}
    >
      <GestureDetector gesture={composed}>
        <View className="pt-2 pb-2 items-center">
          <View className="w-12 h-1.5 bg-ink-200 dark:bg-ink-500 rounded-full mt-2 mb-3" />
        </View>
      </GestureDetector>
      <View className="flex-1 px-5">{children}</View>
    </Animated.View>
  );
}
