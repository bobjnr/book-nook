import { books } from '@/services/books';
import { useCartStore } from '@/store/cart-store';

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('adds books and increases existing quantities', () => {
    const book = books[0];

    useCartStore.getState().addBook(book);
    useCartStore.getState().addBook(book);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
    expect(useCartStore.getState().getItemCount()).toBe(2);
  });

  it('decreases quantity and removes an item at zero', () => {
    const book = books[0];

    useCartStore.getState().addBook(book);
    useCartStore.getState().increaseQuantity(book.id);
    useCartStore.getState().decreaseQuantity(book.id);
    useCartStore.getState().decreaseQuantity(book.id);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calculates the cart total', () => {
    useCartStore.getState().addBook(books[0]);
    useCartStore.getState().addBook(books[1]);

    expect(useCartStore.getState().getTotal()).toBeCloseTo(25.98);
  });
});
