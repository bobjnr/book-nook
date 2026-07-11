import { router } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BottomNav } from '@/components/BottomNav';
import { BookCover } from '@/components/book/BookCover';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuantityStepper } from '@/components/QuantityStepper';
import { Screen } from '@/components/Screen';
import { typography } from '@/constants/typography';
import { useCartStore } from '@/store/cart-store';
import { formatCurrency } from '@/utils/currency';

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const removeBook = useCartStore((state) => state.removeBook);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const subtotal = useCartStore((state) => state.getTotal());
  const shipping = items.length ? 3.99 : 0;
  const total = subtotal + shipping;

  return (
    <Screen>
      <View className="flex-1">
        <View className="mb-6 pt-2">
          <Text className="text-3xl text-slate-950" style={typography.titleBlack}>
            My Cart ({items.length})
          </Text>
        </View>

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4 pb-24">
            <Text className="text-2xl text-slate-950" style={typography.title}>
              Your cart is empty
            </Text>
            <Text className="text-center text-slate-500" style={typography.label}>
              Add a few books and they will appear here.
            </Text>
            <PrimaryButton onPress={() => router.push('/')}>Continue Shopping</PrimaryButton>
          </View>
        ) : (
          <View className="flex-1">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 340 }}>
              <View className="gap-5">
                {items.map((item) => (
                  <View key={item.book.id} className="flex-row gap-4 border-b border-slate-100 pb-5">
                    <BookCover uri={item.book.cover} width={82} height={124} rounded={12} />
                    <View className="flex-1 justify-between">
                      <View className="gap-1">
                        <View className="flex-row items-start justify-between gap-2">
                          <Text className="flex-1 text-xl leading-6 text-slate-950" numberOfLines={2} style={typography.title}>
                            {item.book.title}
                          </Text>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Remove ${item.book.title}`}
                            onPress={() => removeBook(item.book.id)}
                          >
                            <Trash2 color="#EF4444" size={17} />
                          </Pressable>
                        </View>
                        <Text className="text-sm text-slate-500" style={typography.label}>
                          {item.book.author}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <QuantityStepper
                          quantity={item.quantity}
                          onIncrease={() => increaseQuantity(item.book.id)}
                          onDecrease={() => decreaseQuantity(item.book.id)}
                        />
                        <Text className="text-slate-950" style={typography.labelBold}>
                          {formatCurrency(item.book.price * item.quantity)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View className="absolute bottom-0 left-0 right-0 gap-4 border-t border-slate-100 bg-white pb-28 pt-4">
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-slate-500" style={typography.label}>
                    Subtotal
                  </Text>
                  <Text className="text-slate-950" style={typography.labelBold}>
                    {formatCurrency(subtotal)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-500" style={typography.label}>
                    Shipping
                  </Text>
                  <Text className="text-slate-950" style={typography.labelBold}>
                    {formatCurrency(shipping)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-lg text-slate-950" style={typography.title}>
                    Total
                  </Text>
                  <Text className="text-lg text-slate-950" style={typography.labelBold}>
                    {formatCurrency(total)}
                  </Text>
                </View>
              </View>
              <PrimaryButton onPress={() => router.push('/checkout')}>PROCEED TO CHECKOUT</PrimaryButton>
            </View>
          </View>
        )}

        <BottomNav />
      </View>
    </Screen>
  );
}
