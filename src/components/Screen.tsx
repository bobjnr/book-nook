import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenProps = {
  children: ReactNode;
  padded?: boolean;
};

export function Screen({ children, padded = true }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={`flex-1 ${padded ? 'px-5' : ''}`}>{children}</View>
    </SafeAreaView>
  );
}
