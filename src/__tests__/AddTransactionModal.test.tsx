import { render, screen, fireEvent } from "@testing-library/react";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { StockTransaction } from "@/types/StockTransaction";

const mockOnClose = jest.fn();
const mockOnCreate = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AddTransactionModal", () => {
  it("renders the modal with all form fields", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Ticker")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity")).toBeInTheDocument();
    expect(screen.getByLabelText("Price Paid")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
  });

  it("renders Add and Cancel buttons", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("calls onClose when the backdrop is clicked", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the modal content", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    fireEvent.click(screen.getByRole("heading", { name: "Add Transaction" }));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("calls onClose when the Escape key is pressed", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it("shows validation errors when submitted with empty fields", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("Ticker is required.")).toBeInTheDocument();
    expect(screen.getByText("Quantity must be a positive number.")).toBeInTheDocument();
    expect(screen.getByText("Price paid must be a positive number.")).toBeInTheDocument();
    expect(screen.getByText("Date is required.")).toBeInTheDocument();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it("calls onCreate with correct data and closes on valid submit", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Apple Inc." } });
    fireEvent.change(screen.getByLabelText("Ticker"), { target: { value: "aapl" } });
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("Price Paid"), { target: { value: "150.50" } });
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2025-01-15" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
    const arg: Omit<StockTransaction, "id"> = mockOnCreate.mock.calls[0][0];
    expect(arg.name).toBe("Apple Inc.");
    expect(arg.ticker).toBe("AAPL");
    expect(arg.quantity).toBe(10);
    expect(arg.pricePaid).toBe(150.5);
    expect(arg.date).toEqual(new Date("2025-01-15"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onCreate or onClose when quantity is zero", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Apple Inc." } });
    fireEvent.change(screen.getByLabelText("Ticker"), { target: { value: "AAPL" } });
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("Price Paid"), { target: { value: "150" } });
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2025-01-15" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOnCreate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("does not call onCreate or onClose when price paid is zero", () => {
    render(<AddTransactionModal onClose={mockOnClose} onCreate={mockOnCreate} />);
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Apple Inc." } });
    fireEvent.change(screen.getByLabelText("Ticker"), { target: { value: "AAPL" } });
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText("Price Paid"), { target: { value: "0" } });
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: "2025-01-15" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(mockOnCreate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
