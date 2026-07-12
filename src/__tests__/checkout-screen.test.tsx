import { fireEvent, render, screen } from "@testing-library/react-native";

import CheckoutScreen from "@/app/checkout";
import { books } from "@/services/books";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";

describe("checkout screen", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useOrderStore.setState({ orders: [] });
  });

  it("saves the cart as a processing order before clearing it", () => {
    useCartStore.getState().addBook(books[0]);
    useCartStore.getState().addBook(books[0]);

    render(<CheckoutScreen />);

    fireEvent.press(screen.getByTestId("place-order-button"));

    const [order] = useOrderStore.getState().orders;

    expect(order.status).toBe("Processing");
    expect(order.items).toHaveLength(1);
    expect(order.items[0]).toEqual({ book: books[0], quantity: 2 });
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
