import { Text, View } from 'react-native';

import { Price } from '@/components/Price';
import type { CartItem } from '@/types/book';
import { formatCurrency } from '@/utils/currency';

type CheckoutSummaryProps = {
  items: CartItem[];
  shipping?: number;
};

export function getCheckoutTotal(items: CartItem[], shipping = 3.99) {
  return items.reduce((total, item) => total + item.book.price * item.quantity, 0) + shipping;
}

export function CheckoutSummary({ items, shipping = 3.99 }: CheckoutSummaryProps) {
  const subtotal = items.reduce((total, item) => total + item.book.price * item.quantity, 0);
  const total = subtotal + shipping;

  return (
    <View className="gap-4">
      <Text className="text-xl font-extrabold text-slate-950">Order Summary</Text>
      <View className="gap-3">
        {items.map((item) => (
          <View key={item.book.id} className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="font-extrabold text-slate-950" numberOfLines={1}>
                {item.book.title}
              </Text>
              <Text className="text-xs font-semibold text-slate-500">
                {item.book.author}  x{item.quantity}
              </Text>
            </View>
            <Price value={item.book.price * item.quantity} size="sm" />
          </View>
        ))}
      </View>
      <View className="h-px bg-slate-100" />
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
          <Text className="text-lg font-extrabold text-slate-950">Total</Text>
          <Text testID="checkout-total" className="text-lg font-extrabold text-slate-950">
            {formatCurrency(total)}
          </Text>
        </View>
      </View>
    </View>
  );
}
