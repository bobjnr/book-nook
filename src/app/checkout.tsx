import { router } from "expo-router";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  MapPin,
  Wallet,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { typography } from "@/constants/typography";
import { CheckoutSummary } from "@/features/checkout/CheckoutSummary";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";

const paymentMethods = [
  {
    id: "card",
    title: "Credit / Debit Card",
    description: "Visa, Mastercard, and Verve cards.",
    icon: CreditCard,
  },
  {
    id: "bank-transfer",
    title: "Bank Transfer",
    description: "Pay from your bank app or internet banking.",
    icon: Building2,
  },
  {
    id: "wallet",
    title: "Mobile Wallet",
    description: "Use Apple Pay, Google Pay, or supported wallets.",
    icon: Wallet,
  },
  {
    id: "delivery",
    title: "Pay on Delivery",
    description: "Pay with cash or transfer when your books arrive.",
    icon: Banknote,
  },
] as const;

type PaymentMethodId = (typeof paymentMethods)[number]["id"];

export default function CheckoutScreen() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const addOrderFromCart = useOrderStore((state) => state.addOrderFromCart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodId>("card");

  function placeOrder() {
    addOrderFromCart(items);
    clearCart();
    router.replace("/success");
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
          <Text
            className="text-center text-2xl text-slate-950"
            style={typography.titleBlack}
          >
            No books to checkout
          </Text>
          <PrimaryButton onPress={() => router.replace("/")}>
            CONTINUE SHOPPING
          </PrimaryButton>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 104 }}
          >
            <View className="mb-6 px-1">
              <View className="relative flex-row items-start justify-between">
                <View className="absolute left-10 right-10 top-4 h-0.5 bg-orange-200" />
                {["Shipping", "Payment", "Review"].map((step, index) => (
                  <View key={step} className="z-10 items-center gap-2">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                      <Text
                        className="text-xs text-white"
                        style={typography.labelBold}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    <Text
                      className="text-xs text-slate-600"
                      style={typography.labelBold}
                    >
                      {step}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="gap-5">
              <View className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <View className="mb-3 flex-row items-center gap-2">
                  <MapPin color="#F97316" size={18} />
                  <Text
                    className="text-lg text-slate-950"
                    style={typography.title}
                  >
                    Shipping Address
                  </Text>
                </View>
                <Text className="text-slate-950" style={typography.labelBold}>
                  Ekene Bob
                </Text>
                <Text
                  className="mt-1 leading-6 text-slate-500"
                  style={typography.label}
                >
                  27, Ojurongbe Street, Egbeda, Lagos State, Nigeria
                </Text>
              </View>

              <View className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <View className="mb-3 flex-row items-center gap-2">
                  <CreditCard color="#F97316" size={18} />
                  <Text
                    className="text-lg text-slate-950"
                    style={typography.title}
                  >
                    Payment Method
                  </Text>
                </View>
                <View className="gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = method.id === selectedPaymentMethod;

                    return (
                      <Pressable
                        key={method.id}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                        accessibilityLabel={method.title}
                        onPress={() => setSelectedPaymentMethod(method.id)}
                        className={`flex-row items-center gap-3 rounded-2xl border p-4 ${
                          isSelected
                            ? "border-orange-300 bg-orange-50"
                            : "border-slate-100 bg-white"
                        }`}
                      >
                        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                          <Icon
                            color={isSelected ? "#F97316" : "#64748B"}
                            size={18}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-slate-950"
                            style={typography.labelBold}
                          >
                            {method.title}
                          </Text>
                          <Text
                            className="mt-1 text-xs leading-5 text-slate-500"
                            style={typography.label}
                          >
                            {method.description}
                          </Text>
                        </View>
                        {isSelected ? (
                          <CheckCircle2 color="#16A34A" size={20} />
                        ) : null}
                      </Pressable>
                    );
                  })}
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
