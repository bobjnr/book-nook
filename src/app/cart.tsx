import { Link, router } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BookCover } from '@/components/book/BookCover';
import { Price } from '@/components/Price';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuantityStepper } from '@/components/QuantityStepper';
import { Screen } from '@/components/Screen';
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
      <View className="mb-5 flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50"
        >
          <ArrowLeft color="#0F172A" size={21} />
        </Pressable>
        <Text className="text-xl font-black text-slate-950">My Cart ({items.length})</Text>
        <View className="w-11" />
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-2xl font-black text-slate-950">Your cart is empty</Text>
          <Text className="text-center font-semibold text-slate-500">
            Add a few books and they will appear here.
          </Text>
          <Link href="/" asChild>
            <PrimaryButton>Continue Shopping</PrimaryButton>
          </Link>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 220 }}>
            <View className="gap-5">
              {items.map((item) => (
                <View key={item.book.id} className="flex-row gap-4 border-b border-slate-100 pb-5">
                  <BookCover uri={item.book.cover} width={82} height={124} rounded={12} />
                  <View className="flex-1 justify-between">
                    <View className="gap-1">
                      <View className="flex-row items-start justify-between gap-2">
                        <Text className="flex-1 text-base font-extrabold text-slate-950" numberOfLines={2}>
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
                      <Text className="text-xs font-semibold text-slate-500">{item.book.author}</Text>
                      <Price value={item.book.price} size="sm" />
                    </View>
                    <View className="flex-row items-center justify-between">
                      <QuantityStepper
                        quantity={item.quantity}
                        onIncrease={() => increaseQuantity(item.book.id)}
                        onDecrease={() => decreaseQuantity(item.book.id)}
                      />
                      <Text className="font-extrabold text-slate-950">
                        {formatCurrency(item.book.price * item.quantity)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 gap-4 border-t border-slate-100 bg-white pb-5 pt-4">
            <View className="gap-3">
              <View className="flex-row justify-between">
                <Text className="font-semibold text-slate-500">Subtotal</Text>
                <Text className="font-bold text-slate-950">{formatCurrency(subtotal)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-semibold text-slate-500">Shipping</Text>
                <Text className="font-bold text-slate-950">{formatCurrency(shipping)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-lg font-black text-slate-950">Total</Text>
                <Text className="text-lg font-black text-slate-950">{formatCurrency(total)}</Text>
              </View>
            </View>
            <PrimaryButton onPress={() => router.push('/checkout')}>Proceed to Checkout</PrimaryButton>
          </View>
        </View>
      )}
    </Screen>
  );
}
