import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type SkeletonProps = {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({ width = '100%', height, radius = 16, className, style }: SkeletonProps) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      accessibilityRole="progressbar"
      className={`bg-slate-100 ${className ?? ''}`}
      style={[{ width, height, borderRadius: radius }, animatedStyle, style]}
    />
  );
}

export function BookDetailsSkeleton() {
  return (
    <View className="flex-1">
      <View className="items-center pt-3">
        <Skeleton width={204} height={318} radius={20} />
      </View>
      <View className="mt-7 gap-4">
        <Skeleton width="78%" height={36} radius={12} />
        <Skeleton width="42%" height={18} radius={9} />
        <View className="flex-row items-center gap-3">
          <Skeleton width={72} height={72} radius={36} />
          <Skeleton width={92} height={28} radius={10} />
        </View>
        <View className="gap-2">
          <Skeleton height={16} radius={8} />
          <Skeleton height={16} radius={8} />
          <Skeleton width="68%" height={16} radius={8} />
        </View>
        <View className="gap-3 pt-2">
          <Skeleton width={72} height={14} radius={7} />
          <Skeleton height={84} radius={18} />
          <Skeleton height={84} radius={18} />
        </View>
        <Skeleton height={76} radius={24} />
      </View>
    </View>
  );
}

type BookGridSkeletonProps = {
  cardWidth: number;
  count?: number;
};

export function BookGridSkeleton({ cardWidth, count = 6 }: BookGridSkeletonProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-8 pb-8">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={{ width: cardWidth }}>
          <Skeleton height={Math.round(cardWidth * 1.35)} radius={18} />
          <View className="mt-3 gap-2">
            <Skeleton width="86%" height={18} radius={9} />
            <Skeleton width="58%" height={14} radius={7} />
            <View className="flex-row items-center justify-between pt-2">
              <View className="gap-2">
                <Skeleton width={58} height={14} radius={7} />
                <Skeleton width={48} height={14} radius={7} />
              </View>
              <Skeleton width={48} height={48} radius={24} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
