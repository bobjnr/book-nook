import { Text, View } from 'react-native';

import { typography } from '@/constants/typography';
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
      <Text className="text-xl text-slate-950" style={typography.title}>
        Order Summary
      </Text>
      <View className="gap-3">
        {items.map((item) => (
          <View key={item.book.id} className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-slate-950" numberOfLines={1} style={typography.title}>
                {item.book.title}
              </Text>
              <Text className="text-xs text-slate-500" style={typography.label}>
                {item.book.author}  x{item.quantity}
              </Text>
            </View>
            <Text className="text-slate-950" style={typography.labelBold}>
              {formatCurrency(item.book.price * item.quantity)}
            </Text>
          </View>
        ))}
      </View>
      <View className="h-px bg-slate-100" />
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
          <Text testID="checkout-total" className="text-lg text-slate-950" style={typography.labelBold}>
            {formatCurrency(total)}
          </Text>
        </View>
      </View>
    </View>
  );
}
