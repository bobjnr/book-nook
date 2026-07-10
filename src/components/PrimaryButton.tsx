import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

type PrimaryButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

export function PrimaryButton({ children, onPress, disabled, testID }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      testID={testID}
      onPress={onPress}
      className={`h-14 items-center justify-center rounded-2xl px-5 shadow-sm ${
        disabled ? 'bg-slate-300' : 'bg-orange-500'
      }`}
    >
      <Text className="text-base font-extrabold text-white">{children}</Text>
    </Pressable>
  );
}
