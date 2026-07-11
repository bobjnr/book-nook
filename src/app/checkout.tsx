import { router } from 'expo-router';
import { ArrowLeft, CheckCircle2, CreditCard, MapPin } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { typography } from '@/constants/typography';
import { CheckoutSummary } from '@/features/checkout/CheckoutSummary';
import { useCartStore } from '@/store/cart-store';

export default function CheckoutScreen() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  function placeOrder() {
    clearCart();
    router.replace('/success');
  }

  return (
    <Screen>
      <View className="mb-5 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50"
        >
          <ArrowLeft color="#0F172A" size={21} />
        </Pressable>
        <Text className="text-xl text-slate-950" style={typography.titleBlack}>
          Checkout
        </Text>
        <View className="w-11" />
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-center text-2xl text-slate-950" style={typography.titleBlack}>
            No books to checkout
          </Text>
          <PrimaryButton onPress={() => router.replace('/')}>CONTINUE SHOPPING</PrimaryButton>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 104 }}>
            <View className="mb-6 flex-row items-center justify-between">
              {['Shipping', 'Payment', 'Review'].map((step, index) => (
                <View key={step} className="items-center gap-2">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                    <Text className="text-xs text-white" style={typography.labelBold}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="text-xs text-slate-600" style={typography.labelBold}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            <View className="gap-5">
              <View className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <View className="mb-3 flex-row items-center gap-2">
                  <MapPin color="#F97316" size={18} />
                  <Text className="text-lg text-slate-950" style={typography.title}>
                    Shipping Address
                  </Text>
                </View>
                <Text className="text-slate-950" style={typography.labelBold}>
                  Ekene Bob
                </Text>
                <Text className="mt-1 leading-6 text-slate-500" style={typography.label}>
                  27, Ojurongbe Street, Egbeda, Lagos State, Nigeria
                </Text>
              </View>

              <View className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <View className="mb-3 flex-row items-center gap-2">
                  <CreditCard color="#F97316" size={18} />
                  <Text className="text-lg text-slate-950" style={typography.title}>
                    Payment Method
                  </Text>
                </View>
                <View className="flex-row items-center justify-between rounded-2xl bg-orange-50 p-4">
                  <Text className="text-slate-950" style={typography.labelBold}>
                    Credit / Debit Card
                  </Text>
                  <CheckCircle2 color="#16A34A" size={20} />
                </View>
              </View>

              <View className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <CheckoutSummary items={items} />
              </View>
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white pb-5 pt-4">
            <PrimaryButton testID="place-order-button" onPress={placeOrder}>
              PLACE ORDER
            </PrimaryButton>
          </View>
        </View>
      )}
    </Screen>
  );
}