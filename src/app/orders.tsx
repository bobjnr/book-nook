import {
  CalendarDays,
  ChevronRight,
  PackageCheck,
  PackageSearch,
  Truck,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { BottomNav } from "@/components/BottomNav";
import { BookCover } from "@/components/book/BookCover";
import { Screen } from "@/components/Screen";
import { typography } from "@/constants/typography";
import { books } from "@/services/books";
import type { Book } from "@/types/book";
import { formatCurrency } from "@/utils/currency";

type OrderStatus = "Processing" | "Shipped";

type OrderItem = {
  book: Book;
  quantity: number;
};

type Order = {
  id: string;
  status: OrderStatus;
  placedAt: string;
  statusDate: string;
  statusLabel: string;
  note: string;
  trackingCode?: string;
  items: OrderItem[];
};

const orders: Order[] = [
  {
    id: "BN1234567890",
    status: "Processing",
    placedAt: "Jul 10, 2026",
    statusDate: "Ships by Jul 15, 2026",
    statusLabel: "Preparing order",
    note: "We are packing these books and confirming dispatch with the store.",
    items: [
      { book: books[0], quantity: 1 },
      { book: books[1], quantity: 2 },
      { book: books[5], quantity: 1 },
    ],
  },
  {
    id: "BN1234567844",
    status: "Processing",
    placedAt: "Jul 11, 2026",
    statusDate: "Ships by Jul 16, 2026",
    statusLabel: "Payment confirmed",
    note: "Your order is queued for fulfilment and will move to shipped after pickup.",
    items: [
      { book: books[13], quantity: 1 },
      { book: books[21], quantity: 1 },
    ],
  },
  {
    id: "BN9876543210",
    status: "Shipped",
    placedAt: "Jun 28, 2026",
    statusDate: "Shipped Jul 01, 2026",
    statusLabel: "In transit",
    note: "Your package has left the fulfilment center and is on the way.",
    trackingCode: "BN-LAG-39821",
    items: [
      { book: books[2], quantity: 1 },
      { book: books[3], quantity: 1 },
      { book: books[4], quantity: 1 },
    ],
  },
  {
    id: "BN9876543188",
    status: "Shipped",
    placedAt: "Jun 20, 2026",
    statusDate: "Shipped Jun 23, 2026",
    statusLabel: "Out for delivery",
    note: "The courier is scheduled to deliver these books soon.",
    trackingCode: "BN-LAG-38674",
    items: [
      { book: books[7], quantity: 1 },
      { book: books[9], quantity: 1 },
    ],
  },
];

function getOrderTotal(items: OrderItem[]) {
  return items.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0,
  );
}

function getOrderItemCount(items: OrderItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function getOrdersByStatus(status: OrderStatus) {
  return orders.filter((order) => order.status === status);
}

function OrderTabs({
  onSelect,
  processingCount,
  selectedTab,
  shippedCount,
}: {
  onSelect: (status: OrderStatus) => void;
  processingCount: number;
  selectedTab: OrderStatus;
  shippedCount: number;
}) {
  const tabs: { count: number; label: OrderStatus }[] = [
    { label: "Processing", count: processingCount },
    { label: "Shipped", count: shippedCount },
  ];

  return (
    <View className="mb-5 flex-row rounded-2xl bg-slate-50 p-1">
      {tabs.map((tab) => {
        const isActive = tab.label === selectedTab;
        const Icon = tab.label === "Processing" ? PackageSearch : PackageCheck;

        return (
          <View
            key={tab.label}
            accessible
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${tab.label} orders`}
            onTouchEnd={() => onSelect(tab.label)}
            className={`h-11 flex-1 flex-row items-center justify-center gap-2 rounded-xl ${
              isActive ? "bg-white shadow-sm" : ""
            }`}
          >
            <Icon color={isActive ? "#F97316" : "#64748B"} size={16} />
            <Text
              className={`text-xs ${
                isActive ? "text-slate-950" : "text-slate-500"
              }`}
              style={typography.labelBold}
            >
              {tab.label} ({tab.count})
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function OrderCard({ order }: { order: Order }) {
  const isShipped = order.status === "Shipped";
  const StatusIcon = isShipped ? Truck : PackageSearch;
  const total = getOrderTotal(order.items);
  const itemCount = getOrderItemCount(order.items);

  return (
    <View className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <View className="mb-4 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base text-slate-950" style={typography.title}>
            Order #{order.id}
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <CalendarDays color="#94A3B8" size={14} />
            <Text
              className="text-[11px] text-slate-500"
              style={typography.label}
            >
              Placed {order.placedAt}
            </Text>
          </View>
        </View>
        <View
          className={`rounded-full px-3 py-1 ${
            isShipped ? "bg-emerald-50" : "bg-orange-50"
          }`}
        >
          <Text
            className={`text-[10px] ${
              isShipped ? "text-emerald-600" : "text-orange-500"
            }`}
            style={typography.labelBold}
          >
            {order.status}
          </Text>
        </View>
      </View>

      <View className="mb-4 rounded-2xl bg-slate-50 p-4">
        <View className="flex-row items-center gap-2">
          <StatusIcon color={isShipped ? "#059669" : "#F97316"} size={18} />
          <Text className="text-slate-950" style={typography.labelBold}>
            {order.statusLabel}
          </Text>
        </View>
        <Text
          className="mt-2 leading-5 text-slate-500"
          style={typography.label}
        >
          {order.note}
        </Text>
        <Text
          className="mt-3 text-xs text-slate-600"
          style={typography.labelBold}
        >
          {order.statusDate}
        </Text>
        {order.trackingCode ? (
          <Text
            className="mt-1 text-xs text-emerald-600"
            style={typography.labelBold}
          >
            Tracking: {order.trackingCode}
          </Text>
        ) : null}
      </View>

      <View className="gap-3">
        {order.items.map((item) => (
          <View key={item.book.id} className="flex-row items-center gap-3">
            <BookCover
              uri={item.book.cover}
              width={54}
              height={78}
              rounded={8}
            />
            <View className="flex-1">
              <Text
                className="text-slate-950"
                numberOfLines={1}
                style={typography.title}
              >
                {item.book.title}
              </Text>
              <Text
                className="mt-1 text-xs text-slate-500"
                numberOfLines={1}
                style={typography.label}
              >
                {item.book.author}
              </Text>
              <Text
                className="mt-2 text-xs text-slate-600"
                style={typography.labelBold}
              >
                Qty {item.quantity} at {formatCurrency(item.book.price)} each
              </Text>
            </View>
            <ChevronRight color="#CBD5E1" size={18} />
          </View>
        ))}
      </View>

      <View className="mt-4 border-t border-slate-100 pt-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-slate-500" style={typography.label}>
            {itemCount} {itemCount === 1 ? "book" : "books"}
          </Text>
          <Text className="text-slate-950" style={typography.labelBold}>
            Total: {formatCurrency(total)}
          </Text>
        </View>
      </View>
    </View>
  );
}

function OrderList({
  orders: visibleOrders,
  status,
}: {
  orders: Order[];
  status: OrderStatus;
}) {
  const Icon = status === "Processing" ? PackageSearch : PackageCheck;
  const description =
    status === "Processing"
      ? "Orders currently being packed for dispatch."
      : "Orders that have left the fulfilment center.";

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-2">
          <View
            className={`h-9 w-9 items-center justify-center rounded-xl ${
              status === "Processing" ? "bg-orange-50" : "bg-emerald-50"
            }`}
          >
            <Icon
              color={status === "Processing" ? "#F97316" : "#059669"}
              size={18}
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg text-slate-950" style={typography.title}>
              {status}
            </Text>
            <Text
              className="mt-0.5 text-xs text-slate-500"
              style={typography.label}
            >
              {description}
            </Text>
          </View>
        </View>
        <View className="rounded-full bg-slate-100 px-3 py-1">
          <Text className="text-xs text-slate-600" style={typography.labelBold}>
            {visibleOrders.length}
          </Text>
        </View>
      </View>

      {visibleOrders.length > 0 ? (
        <View className="gap-4">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </View>
      ) : (
        <View className="items-center justify-center rounded-3xl bg-slate-50 p-8">
          <Text
            className="text-center text-xl text-slate-950"
            style={typography.title}
          >
            No {status.toLowerCase()} orders
          </Text>
          <Text
            className="mt-2 text-center leading-6 text-slate-500"
            style={typography.label}
          >
            Orders will appear here when they enter this stage.
          </Text>
        </View>
      )}
    </View>
  );
}

export default function OrdersScreen() {
  const [selectedTab, setSelectedTab] = useState<OrderStatus>("Processing");
  const processingOrders = getOrdersByStatus("Processing");
  const shippedOrders = getOrdersByStatus("Shipped");
  const visibleOrders =
    selectedTab === "Processing" ? processingOrders : shippedOrders;

  return (
    <Screen>
      <View className="flex-1">
        <View className="mb-5 pt-2">
          <Text
            className="text-3xl text-slate-950"
            style={typography.titleBlack}
          >
            My Orders
          </Text>
          <Text className="mt-2 text-sm text-slate-500" style={typography.label}>
            Track every bookstore order by stage.
          </Text>
        </View>

        <OrderTabs
          onSelect={setSelectedTab}
          processingCount={processingOrders.length}
          selectedTab={selectedTab}
          shippedCount={shippedOrders.length}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 132 }}
        >
          <OrderList orders={visibleOrders} status={selectedTab} />
        </ScrollView>

        <BottomNav activeTab="orders" />
      </View>
    </Screen>
  );
}
