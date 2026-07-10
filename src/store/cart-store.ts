import { create } from 'zustand';

import type { Book, CartItem } from '@/types/book';

type CartState = {
  items: CartItem[];
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  increaseQuantity: (bookId: string) => void;
  decreaseQuantity: (bookId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addBook: (book) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.book.id === book.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }

      return { items: [...state.items, { book, quantity: 1 }] };
    }),
  removeBook: (bookId) =>
    set((state) => ({
      items: state.items.filter((item) => item.book.id !== bookId),
    })),
  increaseQuantity: (bookId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.book.id === bookId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),
  decreaseQuantity: (bookId) =>
    set((state) => ({
      items: state.items
        .map((item) => (item.book.id === bookId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    })),
  clearCart: () => set({ items: [] }),
  getItemCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotal: () =>
    get().items.reduce((total, item) => total + item.book.price * item.quantity, 0),
}));
