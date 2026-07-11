import type { ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, Text } from 'react-native';

import { typography } from '@/constants/typography';

type PrimaryButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

function triggerCtaHaptic() {
  const feedback =
    Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)
      : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  void feedback.catch(() => undefined);
}

export function PrimaryButton({ children, onPress, disabled, testID }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      testID={testID}
      onPress={onPress}
      onPressIn={triggerCtaHaptic}
      className={`h-14 items-center justify-center rounded-2xl px-5 shadow-sm ${
        disabled ? 'bg-slate-300' : 'bg-orange-500'
      }`}
    >
      <Text className="text-base text-white" style={typography.labelBold}>
        {children}
      </Text>
    </Pressable>
  );
}
