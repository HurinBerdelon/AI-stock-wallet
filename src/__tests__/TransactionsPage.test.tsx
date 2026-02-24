import { render, screen, fireEvent } from "@testing-library/react";
import TransactionsPage from "../app/transactions/page";
import { StockTransaction } from "../types/StockTransaction";
import * as useTransactionsModule from "../hooks/useTransactions";

const mockLoad = jest.fn();
const mockUpdate = jest.fn();

const mockTransactions: StockTransaction[] = [
  {
    id: "1",
    name: "Apple Inc.",
    ticker: "AAPL",
    quantity: 10,
    pricePaid: 150,
    date: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Google LLC",
    ticker: "GOOGL",
    quantity: 5,
    pricePaid: 200,
    date: new Date("2024-02-20"),
  },
];

jest.mock("../hooks/useTransactions");

describe("TransactionsPage", () => {
  beforeEach(() => {
    mockLoad.mockClear();
    mockUpdate.mockClear();
    jest.spyOn(useTransactionsModule, "useTransactions").mockReturnValue({
      transactions: mockTransactions,
      load: mockLoad,
      create: jest.fn(),
      update: mockUpdate,
      remove: jest.fn(),
      calculateAveragePrice: jest.fn(),
      calculateProfitability: jest.fn(),
    });
  });

  it("renders the Add Transaction button", () => {
    render(<TransactionsPage />);
    expect(screen.getByRole("button", { name: "Add Transaction" })).toBeInTheDocument();
  });

  it("opens the modal when Add Transaction button is clicked", () => {
    render(<TransactionsPage />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add Transaction" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the modal when Cancel is clicked", () => {
    render(<TransactionsPage />);
    fireEvent.click(screen.getByRole("button", { name: "Add Transaction" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the page heading", () => {
    render(<TransactionsPage />);
    expect(screen.getByRole("heading", { name: "Transactions" })).toBeInTheDocument();
  });

  it("renders a row for each transaction", () => {
    render(<TransactionsPage />);
    expect(screen.getByText("Apple Inc.")).toBeInTheDocument();
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("Google LLC")).toBeInTheDocument();
    expect(screen.getByText("GOOGL")).toBeInTheDocument();
  });

  it("renders quantity and price paid for each transaction", () => {
    render(<TransactionsPage />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("$150.00")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
  });

  it("renders the total value for each transaction", () => {
    render(<TransactionsPage />);
    expect(screen.getByText("$1500.00")).toBeInTheDocument();
    expect(screen.getByText("$1000.00")).toBeInTheDocument();
  });

  it("calls load on mount", () => {
    render(<TransactionsPage />);
    expect(mockLoad).toHaveBeenCalledTimes(1);
  });

  it("renders empty state message when there are no transactions", () => {
    jest.spyOn(useTransactionsModule, "useTransactions").mockReturnValue({
      transactions: [],
      load: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      calculateAveragePrice: jest.fn(),
      calculateProfitability: jest.fn(),
    });
    render(<TransactionsPage />);
    expect(screen.getByText("No transactions found.")).toBeInTheDocument();
  });

  it("renders an edit button for each transaction row", () => {
    render(<TransactionsPage />);
    expect(
      screen.getByRole("button", { name: "Edit Apple Inc." })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Edit Google LLC" })
    ).toBeInTheDocument();
  });

  it("opens the edit modal when an edit button is clicked", () => {
    render(<TransactionsPage />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Edit Apple Inc." }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Edit Transaction" })
    ).toBeInTheDocument();
  });

  it("pre-populates the edit modal with the selected transaction data", () => {
    render(<TransactionsPage />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Apple Inc." }));
    expect(screen.getByLabelText("Name")).toHaveValue("Apple Inc.");
    expect(screen.getByLabelText("Ticker")).toHaveValue("AAPL");
    expect(screen.getByLabelText("Quantity")).toHaveValue(10);
    expect(screen.getByLabelText("Price Paid")).toHaveValue(150);
  });

  it("closes the edit modal when Cancel is clicked", () => {
    render(<TransactionsPage />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Apple Inc." }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls update and closes the modal on valid edit submit", () => {
    render(<TransactionsPage />);
    fireEvent.click(screen.getByRole("button", { name: "Edit Apple Inc." }));
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "15" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ quantity: 15 })
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
