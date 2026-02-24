import { render, screen, fireEvent } from "@testing-library/react";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { StockTransaction } from "@/types/StockTransaction";

const mockOnClose = jest.fn();
const mockOnUpdate = jest.fn();

const mockTransaction: StockTransaction = {
  id: "1",
  name: "Apple Inc.",
  ticker: "AAPL",
  quantity: 10,
  pricePaid: 150,
  date: new Date("2024-01-15"),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("EditTransactionModal", () => {
  it("renders the modal with all form fields pre-populated", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Apple Inc.");
    expect(screen.getByLabelText("Ticker")).toHaveValue("AAPL");
    expect(screen.getByLabelText("Quantity")).toHaveValue(10);
    expect(screen.getByLabelText("Price Paid")).toHaveValue(150);
    expect(screen.getByLabelText("Date")).toHaveValue("2024-01-15");
  });

  it("renders Save and Cancel buttons", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("renders the Edit Transaction heading", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    expect(
      screen.getByRole("heading", { name: "Edit Transaction" })
    ).toBeInTheDocument();
  });

  it("calls onClose when the backdrop is clicked", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the modal content", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    fireEvent.click(screen.getByRole("heading", { name: "Edit Transaction" }));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("calls onClose when the Escape key is pressed", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it("shows validation errors when submitted with empty fields", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Ticker"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Price Paid"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Ticker is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Quantity must be a positive number.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Price paid must be a positive number.")
    ).toBeInTheDocument();
    expect(screen.getByText("Date is required.")).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it("calls onUpdate with correct data and closes on valid submit", () => {
    render(
      <EditTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Microsoft Corp." },
    });
    fireEvent.change(screen.getByLabelText("Ticker"), {
      target: { value: "msft" },
    });
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText("Price Paid"), {
      target: { value: "300.50" },
    });
    fireEvent.change(screen.getByLabelText("Date"), {
      target: { value: "2025-06-01" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith("1", {
      name: "Microsoft Corp.",
      ticker: "MSFT",
      quantity: 20,
      pricePaid: 300.5,
      date: new Date("2025-06-01"),
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
