import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteTransactionModal } from "@/components/DeleteTransactionModal";
import { StockTransaction } from "@/types/StockTransaction";

const mockOnClose = jest.fn();
const mockOnDelete = jest.fn();

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

describe("DeleteTransactionModal", () => {
  it("renders the modal with the transaction name and ticker", () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("AAPL")).toBeInTheDocument();
  });

  it("renders Delete Transaction heading", () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    expect(
      screen.getByRole("heading", { name: "Delete Transaction" })
    ).toBeInTheDocument();
  });

  it("renders Cancel and Delete buttons", () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it("calls onDelete with the transaction id and onClose when Delete is clicked", () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith("1");
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked", () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the modal content", () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.click(screen.getByRole("heading", { name: "Delete Transaction" }));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("calls onClose when the Escape key is pressed", () => {
    render(
      <DeleteTransactionModal
        transaction={mockTransaction}
        onClose={mockOnClose}
        onDelete={mockOnDelete}
      />
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
