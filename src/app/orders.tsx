import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BottomNav } from '@/components/BottomNav';
import { BookCover } from '@/components/book/BookCover';
import { Screen } from '@/components/Screen';
import { typography } from '@/constants/typography';
import { books } from '@/services/books';
import { formatCurrency } from '@/utils/currency';

const orders = [
  {
    id: 'BN1234567890',
    status: 'Processing',
    date: 'May 24, 2026',
    total: 42.96,
    books: books.slice(0, 3),
  },
  {
    id: 'BN9876543210',
    status: 'Shipped',
    date: 'May 10, 2026',
    total: 29.98,
    books: books.slice(2, 5),
  },
];

export default function OrdersScreen() {
  return (
    <Screen>
      <View className="flex-1">
        <View className="mb-6 pt-2">
          <Text className="text-3xl text-slate-950" style={typography.titleBlack}>
            My Orders
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 132 }}>
          <View className="gap-4">
            {orders.map((order) => (
              <Pressable
                key={order.id}
                accessibilityRole="button"
                onPress={() => router.push('/')}
                className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <View className="mb-4 flex-row items-start justify-between">
                  <View>
                    <Text className="text-base text-slate-950" style={typography.title}>
                      Order #{order.id}
                    </Text>
                    <Text className="mt-1 text-[11px] text-slate-500" style={typography.label}>
                      {order.date}
                    </Text>
                  </View>
                  <View className="rounded-full bg-orange-50 px-3 py-1">
                    <Text className="text-[10px] text-orange-500" style={typography.labelBold}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <View className="mb-4 flex-row gap-3">
                  {order.books.map((book) => (
                    <BookCover key={book.id} uri={book.cover} width={54} height={78} rounded={8} />
                  ))}
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-slate-950" style={typography.labelBold}>
                    Total: {formatCurrency(order.total)}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Text className="text-orange-500" style={typography.labelBold}>
                      View Details
                    </Text>
                    <ChevronRight color="#F97316" size={16} />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <BottomNav />
      </View>
    </Screen>
  );
}