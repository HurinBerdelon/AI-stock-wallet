import { renderHook, act } from "@testing-library/react";
import { useTransactions } from "@/hooks/useTransactions";

const STORAGE_KEY = "stock_transactions";

const mockDate = new Date("2024-01-15");

const mockTransaction = {
  name: "Apple Inc.",
  ticker: "AAPL",
  quantity: 10,
  pricePaid: 150,
  date: mockDate,
};

beforeEach(() => {
  localStorage.clear();
});

describe("useTransactions", () => {
  describe("load", () => {
    it("returns empty array when localStorage is empty", () => {
      const { result } = renderHook(() => useTransactions());
      let loaded: ReturnType<typeof result.current.load>;
      act(() => {
        loaded = result.current.load();
      });
      expect(loaded!).toEqual([]);
      expect(result.current.transactions).toEqual([]);
    });

    it("loads transactions from localStorage", () => {
      const stored = [{ ...mockTransaction, id: "1" }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

      const { result } = renderHook(() => useTransactions());
      act(() => {
        result.current.load();
      });
      expect(result.current.transactions).toHaveLength(1);
      expect(result.current.transactions[0].id).toBe("1");
      expect(result.current.transactions[0].ticker).toBe("AAPL");
      expect(result.current.transactions[0].date).toEqual(mockDate);
    });
  });

  describe("create", () => {
    it("creates a transaction with a generated id", () => {
      const { result } = renderHook(() => useTransactions());
      let created: ReturnType<typeof result.current.create>;
      act(() => {
        created = result.current.create(mockTransaction);
      });
      expect(created!.id).toBeDefined();
      expect(created!.ticker).toBe("AAPL");
      expect(result.current.transactions).toHaveLength(1);
    });

    it("saves created transaction to localStorage", () => {
      const { result } = renderHook(() => useTransactions());
      act(() => {
        result.current.create(mockTransaction);
      });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].ticker).toBe("AAPL");
    });
  });

  describe("update", () => {
    it("updates an existing transaction", () => {
      const { result } = renderHook(() => useTransactions());
      let created: ReturnType<typeof result.current.create>;
      act(() => {
        created = result.current.create(mockTransaction);
      });
      act(() => {
        result.current.update(created!.id, { quantity: 20 });
      });
      expect(result.current.transactions[0].quantity).toBe(20);
    });

    it("returns null when transaction id does not exist", () => {
      const { result } = renderHook(() => useTransactions());
      let updated: ReturnType<typeof result.current.update>;
      act(() => {
        updated = result.current.update("nonexistent-id", { quantity: 5 });
      });
      expect(updated!).toBeNull();
    });

    it("saves updated transaction to localStorage", () => {
      const { result } = renderHook(() => useTransactions());
      let created: ReturnType<typeof result.current.create>;
      act(() => {
        created = result.current.create(mockTransaction);
      });
      act(() => {
        result.current.update(created!.id, { pricePaid: 200 });
      });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored[0].pricePaid).toBe(200);
    });
  });

  describe("remove", () => {
    it("removes an existing transaction", () => {
      const { result } = renderHook(() => useTransactions());
      let created: ReturnType<typeof result.current.create>;
      act(() => {
        created = result.current.create(mockTransaction);
      });
      act(() => {
        result.current.remove(created!.id);
      });
      expect(result.current.transactions).toHaveLength(0);
    });

    it("returns false when transaction id does not exist", () => {
      const { result } = renderHook(() => useTransactions());
      let removed: boolean;
      act(() => {
        removed = result.current.remove("nonexistent-id");
      });
      expect(removed!).toBe(false);
    });

    it("saves to localStorage after removal", () => {
      const { result } = renderHook(() => useTransactions());
      let created: ReturnType<typeof result.current.create>;
      act(() => {
        created = result.current.create(mockTransaction);
      });
      act(() => {
        result.current.remove(created!.id);
      });
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(0);
    });
  });

  describe("calculateAveragePrice", () => {
    it("returns 0 when there are no transactions for the ticker", () => {
      const { result } = renderHook(() => useTransactions());
      expect(result.current.calculateAveragePrice("AAPL")).toBe(0);
    });

    it("calculates average price for a single transaction", () => {
      const { result } = renderHook(() => useTransactions());
      act(() => {
        result.current.create(mockTransaction);
      });
      expect(result.current.calculateAveragePrice("AAPL")).toBe(150);
    });

    it("calculates weighted average price for multiple transactions", () => {
      const { result } = renderHook(() => useTransactions());
      act(() => {
        result.current.create({ ...mockTransaction, quantity: 10, pricePaid: 100 });
      });
      act(() => {
        result.current.create({ ...mockTransaction, quantity: 10, pricePaid: 200 });
      });
      // (10*100 + 10*200) / (10+10) = 3000/20 = 150
      expect(result.current.calculateAveragePrice("AAPL")).toBe(150);
    });

    it("only considers transactions for the specified ticker", () => {
      const { result } = renderHook(() => useTransactions());
      act(() => {
        result.current.create({ ...mockTransaction, ticker: "AAPL", quantity: 10, pricePaid: 100 });
      });
      act(() => {
        result.current.create({ ...mockTransaction, ticker: "GOOGL", quantity: 10, pricePaid: 300 });
      });
      expect(result.current.calculateAveragePrice("AAPL")).toBe(100);
      expect(result.current.calculateAveragePrice("GOOGL")).toBe(300);
    });
  });

  describe("calculateProfitability", () => {
    it("returns 0 when there are no transactions for the ticker", () => {
      const { result } = renderHook(() => useTransactions());
      expect(result.current.calculateProfitability("AAPL", 200)).toBe(0);
    });

    it("calculates positive profitability when current price is higher", () => {
      const { result } = renderHook(() => useTransactions());
      act(() => {
        result.current.create({ ...mockTransaction, pricePaid: 100 });
      });
      // (200 - 100) / 100 * 100 = 100%
      expect(result.current.calculateProfitability("AAPL", 200)).toBe(100);
    });

    it("calculates negative profitability when current price is lower", () => {
      const { result } = renderHook(() => useTransactions());
      act(() => {
        result.current.create({ ...mockTransaction, pricePaid: 100 });
      });
      // (50 - 100) / 100 * 100 = -50%
      expect(result.current.calculateProfitability("AAPL", 50)).toBe(-50);
    });

    it("returns 0 when current price equals average price", () => {
      const { result } = renderHook(() => useTransactions());
      act(() => {
        result.current.create({ ...mockTransaction, pricePaid: 100 });
      });
      expect(result.current.calculateProfitability("AAPL", 100)).toBe(0);
    });
  });
});
