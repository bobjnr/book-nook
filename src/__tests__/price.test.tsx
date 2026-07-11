import { render, screen } from '@testing-library/react-native';

import { Price } from '@/components/Price';

describe('Price', () => {
  it('formats a price as USD', () => {
    render(<Price value={10.99} />);

    expect(screen.getByTestId('price-value').props.accessibilityLabel).toBe('$10.99');
  });

  it('shows an original price when supplied', () => {
    render(<Price value={10.99} originalValue={14.99} />);

    expect(screen.getByText('$14.99')).toBeTruthy();
  });
});