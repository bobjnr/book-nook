import { fireEvent, render, screen } from "@testing-library/react-native";

import OrdersScreen from "@/app/orders";

describe("orders screen", () => {
  it("switches between processing and shipped orders with custom tabs", () => {
    render(<OrdersScreen />);

    expect(screen.getByText("Order #BN1234567890")).toBeTruthy();
    expect(screen.queryByText("Order #BN9876543210")).toBeNull();

    fireEvent(screen.getByLabelText("Shipped orders"), "touchEnd");

    expect(screen.queryByText("Order #BN1234567890")).toBeNull();
    expect(screen.getByText("Order #BN9876543210")).toBeTruthy();
    expect(screen.getByText("Tracking: BN-LAG-39821")).toBeTruthy();
  });
});
