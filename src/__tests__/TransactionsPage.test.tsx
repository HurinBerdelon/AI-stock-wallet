import { render, screen } from "@testing-library/react";
import TransactionsPage from "../app/transactions/page";
import { StockTransaction } from "../types/StockTransaction";
import * as useTransactionsModule from "../hooks/useTransactions";

const mockLoad = jest.fn();

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
    jest.spyOn(useTransactionsModule, "useTransactions").mockReturnValue({
      transactions: mockTransactions,
      load: mockLoad,
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      calculateAveragePrice: jest.fn(),
      calculateProfitability: jest.fn(),
    });
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
});
