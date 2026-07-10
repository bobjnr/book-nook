import { render, screen } from '@testing-library/react-native';

import { CheckoutSummary, getCheckoutTotal } from '@/features/checkout/CheckoutSummary';
import { books } from '@/services/books';

const items = [
  { book: books[0], quantity: 2 },
  { book: books[1], quantity: 1 },
];

describe('CheckoutSummary', () => {
  it('calculates totals with shipping', () => {
    expect(getCheckoutTotal(items, 3.99)).toBeCloseTo(40.96);
  });

  it('renders the total amount', () => {
    render(<CheckoutSummary items={items} shipping={3.99} />);

    expect(screen.getByTestId('checkout-total')).toHaveTextContent('$40.96');
  });
});
