import { fireEvent, render, screen } from "@testing-library/react-native";

import OrdersScreen from "@/app/orders";
import { books } from "@/services/books";
import { useOrderStore } from "@/store/order-store";

describe("orders screen", () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [] });
  });

  it("shows an empty processing state on a fresh install", () => {
    render(<OrdersScreen />);

    expect(screen.getByText("Processing (0)")).toBeTruthy();
    expect(screen.getByText("Shipped (0)")).toBeTruthy();
    expect(screen.getByText("No processing orders")).toBeTruthy();
    expect(
      screen.getByText("Orders you place from checkout will appear here."),
    ).toBeTruthy();
  });

  it("shows locally placed orders in processing first", () => {
    const order = useOrderStore
      .getState()
      .addOrderFromCart([{ book: books[0], quantity: 1 }]);

    render(<OrdersScreen />);

    expect(screen.getByText(`Order #${order.id}`)).toBeTruthy();
    expect(screen.getByText("Processing (1)")).toBeTruthy();
    expect(screen.getByText("Shipped (0)")).toBeTruthy();

    fireEvent(screen.getByLabelText("Shipped orders"), "touchEnd");

    expect(screen.queryByText(`Order #${order.id}`)).toBeNull();
    expect(screen.getByText("No shipped orders")).toBeTruthy();
    expect(
      screen.getByText(
        "Your shipped books will appear here once they are on the way.",
      ),
    ).toBeTruthy();
  });

  it("shows orders in shipped after their local status changes", () => {
    const order = useOrderStore
      .getState()
      .addOrderFromCart([{ book: books[1], quantity: 2 }]);

    useOrderStore.getState().markOrderShipped(order.id);

    render(<OrdersScreen />);

    expect(screen.getByText("Processing (0)")).toBeTruthy();
    expect(screen.getByText("Shipped (1)")).toBeTruthy();

    fireEvent(screen.getByLabelText("Shipped orders"), "touchEnd");

    expect(screen.getByText(`Order #${order.id}`)).toBeTruthy();
    expect(screen.getByText(/Tracking: BN-LAG-/)).toBeTruthy();
  });
});
