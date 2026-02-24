import { useState, useCallback } from "react";
import { StockTransaction } from "@/types/StockTransaction";

const STORAGE_KEY = "stock_transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  const load = useCallback((): StockTransaction[] => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const loaded: StockTransaction[] = raw
      ? JSON.parse(raw).map((t: Omit<StockTransaction, "date"> & { date: string }) => {
          const date = new Date(t.date);
          return { ...t, date: isNaN(date.getTime()) ? new Date() : date };
        })
      : [];
    setTransactions(loaded);
    return loaded;
  }, []);

  const save = (data: StockTransaction[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setTransactions(data);
  };

  const create = useCallback(
    (transaction: Omit<StockTransaction, "id">): StockTransaction => {
      const newTransaction: StockTransaction = {
        ...transaction,
        id: crypto.randomUUID(),
      };
      const updated = [...transactions, newTransaction];
      save(updated);
      return newTransaction;
    },
    [transactions]
  );

  const update = useCallback(
    (id: string, changes: Partial<Omit<StockTransaction, "id">>): StockTransaction | null => {
      const index = transactions.findIndex((t) => t.id === id);
      if (index === -1) return null;
      const updated = transactions.map((t) =>
        t.id === id ? { ...t, ...changes } : t
      );
      save(updated);
      return updated[index];
    },
    [transactions]
  );

  const remove = useCallback(
    (id: string): boolean => {
      const filtered = transactions.filter((t) => t.id !== id);
      if (filtered.length === transactions.length) return false;
      save(filtered);
      return true;
    },
    [transactions]
  );

  const calculateAveragePrice = useCallback(
    (ticker: string): number => {
      const tickerTransactions = transactions.filter((t) => t.ticker === ticker);
      if (tickerTransactions.length === 0) return 0;
      const totalCost = tickerTransactions.reduce(
        (sum, t) => sum + t.pricePaid * t.quantity,
        0
      );
      const totalQuantity = tickerTransactions.reduce(
        (sum, t) => sum + t.quantity,
        0
      );
      return totalQuantity === 0 ? 0 : totalCost / totalQuantity;
    },
    [transactions]
  );

  const calculateProfitability = useCallback(
    (ticker: string, currentPrice: number): number => {
      const averagePrice = calculateAveragePrice(ticker);
      if (averagePrice === 0) return 0;
      return ((currentPrice - averagePrice) / averagePrice) * 100;
    },
    [calculateAveragePrice]
  );

  return {
    transactions,
    load,
    create,
    update,
    remove,
    calculateAveragePrice,
    calculateProfitability,
  };
}
