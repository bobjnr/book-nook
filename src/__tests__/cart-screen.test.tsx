import { fireEvent, render, screen } from '@testing-library/react-native';

import CartScreen from '@/app/cart';
import { books } from '@/services/books';
import { useCartStore } from '@/store/cart-store';

describe('CartScreen', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('updates quantities, totals, and removes items from the rendered cart', () => {
    useCartStore.getState().addBook(books[0]);

    render(<CartScreen />);

    expect(screen.getByText('My Cart (1)')).toBeTruthy();
    expect(screen.getByText('The Alchemist')).toBeTruthy();
    expect(screen.getAllByText('$10.99').length).toBeGreaterThan(0);

    fireEvent.press(screen.getByLabelText('Increase quantity'));

    expect(screen.getAllByText('$21.98').length).toBeGreaterThan(0);
    expect(screen.getByText('$25.97')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Decrease quantity'));

    expect(screen.getAllByText('$10.99').length).toBeGreaterThan(0);
    expect(screen.getByText('$14.98')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Remove The Alchemist'));

    expect(screen.getByText('Your cart is empty')).toBeTruthy();
  });
});

