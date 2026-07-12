import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Book, CartItem } from "@/types/book";

export type OrderStatus = "Processing" | "Shipped";

export type OrderItem = {
  book: Book;
  quantity: number;
};

export type Order = {
  id: string;
  status: OrderStatus;
  placedAt: string;
  statusDate: string;
  statusLabel: string;
  note: string;
  trackingCode?: string;
  items: OrderItem[];
};

type OrderState = {
  orders: Order[];
  addOrderFromCart: (items: CartItem[]) => Order;
  markOrderShipped: (orderId: string) => void;
  clearOrders: () => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
};

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatOrderDate(date: Date) {
  return `${monthLabels[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function createOrderId(date: Date) {
  const timestamp = date.getTime().toString().slice(-10);
  const suffix = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");

  return `BN${timestamp}${suffix}`;
}

function createTrackingCode(date: Date) {
  const timestamp = date.getTime().toString().slice(-5);
  const suffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `BN-LAG-${timestamp}${suffix}`;
}

function createProcessingOrder(items: CartItem[]): Order {
  const placedDate = new Date();
  const shipDate = addDays(placedDate, 5);

  return {
    id: createOrderId(placedDate),
    status: "Processing",
    placedAt: formatOrderDate(placedDate),
    statusDate: `Ships by ${formatOrderDate(shipDate)}`,
    statusLabel: "Preparing order",
    note: "We are packing these books and confirming dispatch with the store.",
    items: items.map((item) => ({ book: item.book, quantity: item.quantity })),
  };
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrderFromCart: (items) => {
        const order = createProcessingOrder(items);

        set((state) => ({ orders: [order, ...state.orders] }));

        return order;
      },
      markOrderShipped: (orderId) => {
        const shippedDate = new Date();

        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "Shipped",
                  statusDate: `Shipped ${formatOrderDate(shippedDate)}`,
                  statusLabel: "In transit",
                  note: "Your package has left the fulfilment center and is on the way.",
                  trackingCode:
                    order.trackingCode ?? createTrackingCode(shippedDate),
                }
              : order,
          ),
        }));
      },
      clearOrders: () => set({ orders: [] }),
      getOrdersByStatus: (status) =>
        get().orders.filter((order) => order.status === status),
    }),
    {
      name: "book-nook-orders",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
