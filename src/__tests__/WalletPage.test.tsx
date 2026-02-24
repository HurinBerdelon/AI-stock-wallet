import { render, screen, fireEvent } from "@testing-library/react";
import WalletPage from "../app/wallet/page";
import { StockPosition } from "../types/StockPosition";
import * as useTransactionsModule from "../hooks/useTransactions";

const mockLoad = jest.fn();
const mockGetPortfolio = jest.fn();
const mockCalculateProfitability = jest.fn();

const mockPortfolio: StockPosition[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    quantity: 15,
    averagePrice: 150,
    lastTimeBought: new Date("2024-06-01"),
  },
  {
    ticker: "GOOGL",
    name: "Google LLC",
    quantity: 5,
    averagePrice: 200,
    lastTimeBought: new Date("2024-02-20"),
  },
];

jest.mock("../hooks/useTransactions");

describe("WalletPage", () => {
  beforeEach(() => {
    mockLoad.mockClear();
    mockGetPortfolio.mockClear();
    mockCalculateProfitability.mockClear();
    mockGetPortfolio.mockReturnValue(mockPortfolio);
    mockCalculateProfitability.mockImplementation(
      (_ticker: string, currentPrice: number) => {
        const avgPrice = 150;
        return ((currentPrice - avgPrice) / avgPrice) * 100;
      }
    );
    jest.spyOn(useTransactionsModule, "useTransactions").mockReturnValue({
      transactions: [],
      load: mockLoad,
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      calculateAveragePrice: jest.fn(),
      calculateProfitability: mockCalculateProfitability,
      getPortfolio: mockGetPortfolio,
    });
  });

  it("renders the page heading", () => {
    render(<WalletPage />);
    expect(screen.getByRole("heading", { name: "My Wallet" })).toBeInTheDocument();
  });

  it("calls load on mount", () => {
    render(<WalletPage />);
    expect(mockLoad).toHaveBeenCalledTimes(1);
  });

  it("renders a row for each stock position", () => {
    render(<WalletPage />);
    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.getByText("GOOGL")).toBeInTheDocument();
  });

  it("renders quantity for each position", () => {
    render(<WalletPage />);
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders average price for each position", () => {
    render(<WalletPage />);
    expect(screen.getByText("$150.00")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
  });

  it("renders current price inputs for each position", () => {
    render(<WalletPage />);
    expect(screen.getByLabelText("Current price for AAPL")).toBeInTheDocument();
    expect(screen.getByLabelText("Current price for GOOGL")).toBeInTheDocument();
  });

  it("renders dash for profitability when current price is invalid", () => {
    render(<WalletPage />);
    const aaplInput = screen.getByLabelText("Current price for AAPL");
    fireEvent.change(aaplInput, { target: { value: "" } });
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("renders profitability when current price is changed to a valid value", () => {
    mockCalculateProfitability.mockReturnValue(10);
    render(<WalletPage />);
    const aaplInput = screen.getByLabelText("Current price for AAPL");
    fireEvent.change(aaplInput, { target: { value: "165" } });
    expect(mockCalculateProfitability).toHaveBeenCalledWith("AAPL", 165);
  });

  it("renders empty state message when there are no positions", () => {
    mockGetPortfolio.mockReturnValue([]);
    jest.spyOn(useTransactionsModule, "useTransactions").mockReturnValue({
      transactions: [],
      load: mockLoad,
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      calculateAveragePrice: jest.fn(),
      calculateProfitability: mockCalculateProfitability,
      getPortfolio: mockGetPortfolio,
    });
    render(<WalletPage />);
    expect(screen.getByText("No stocks in wallet.")).toBeInTheDocument();
  });
});
