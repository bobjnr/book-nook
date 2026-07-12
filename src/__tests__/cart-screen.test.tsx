import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";

import CartScreen from "@/app/cart";
import { books } from "@/services/books";
import { useCartStore } from "@/store/cart-store";

describe("CartScreen", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    useCartStore.setState({ items: [] });
  });

  it("updates quantities, totals, and confirms before removing items from the rendered cart", () => {
    useCartStore.getState().addBook(books[0]);
    const alertSpy = jest.spyOn(Alert, "alert");

    render(<CartScreen />);

    expect(screen.getByText("My Cart (1)")).toBeTruthy();
    expect(screen.getByText("The Alchemist")).toBeTruthy();
    expect(screen.getAllByText("$10.99").length).toBeGreaterThan(0);

    fireEvent.press(screen.getByLabelText("Increase quantity"));

    expect(screen.getAllByText("$21.98").length).toBeGreaterThan(0);
    expect(screen.getByText("$25.97")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Decrease quantity"));

    expect(screen.getAllByText("$10.99").length).toBeGreaterThan(0);
    expect(screen.getByText("$14.98")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Delete The Alchemist"));

    expect(alertSpy).toHaveBeenCalledWith(
      "Remove book?",
      "Remove The Alchemist from your cart?",
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel", style: "cancel" }),
        expect.objectContaining({ text: "Delete", style: "destructive" }),
      ]),
    );
    expect(screen.getByText("The Alchemist")).toBeTruthy();

    const alertButtons = alertSpy.mock.calls[0][2];
    const deleteButton = alertButtons?.find(
      (button) => button.text === "Delete",
    );
    act(() => {
      deleteButton?.onPress?.();
    });

    expect(screen.getByText("Your cart is empty")).toBeTruthy();
  });
});
