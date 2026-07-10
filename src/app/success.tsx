import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';

export default function SuccessScreen() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-8">
        <View className="h-28 w-28 items-center justify-center rounded-full bg-green-500 shadow-lg">
          <Check color="#FFFFFF" size={64} strokeWidth={3} />
        </View>

        <View className="items-center gap-3">
          <Text className="text-center text-3xl font-black text-slate-950">Thank You!</Text>
          <Text className="max-w-[280px] text-center text-base font-semibold leading-7 text-slate-500">
            Your order has been placed successfully.
          </Text>
        </View>

        <View className="w-full rounded-3xl bg-slate-50 p-6">
          <Text className="text-center text-xs font-semibold text-slate-500">Order Number</Text>
          <Text className="mt-2 text-center text-xl font-black text-slate-950">#BN1234567890</Text>
        </View>
      </View>

      <View className="pb-5">
        <PrimaryButton onPress={() => router.replace('/')}>Continue Shopping</PrimaryButton>
      </View>
    </Screen>
  );
}
