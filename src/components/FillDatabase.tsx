"use client";

import { useTransactions } from "@/hooks/useTransactions";
import { StockTransaction } from "@/types/StockTransaction";

const STORAGE_KEY = "stock_transactions";

const SAMPLE_TRANSACTIONS: Omit<StockTransaction, "id">[] = [
  { name: "Apple Inc.", ticker: "AAPL", quantity: 10, pricePaid: 185.5, date: new Date("2025-01-15") },
  { name: "Microsoft Corporation", ticker: "MSFT", quantity: 5, pricePaid: 420.0, date: new Date("2025-02-10") },
  { name: "Alphabet Inc.", ticker: "GOOGL", quantity: 8, pricePaid: 190.25, date: new Date("2025-03-20") },
  { name: "Amazon.com Inc.", ticker: "AMZN", quantity: 12, pricePaid: 220.0, date: new Date("2025-04-05") },
  { name: "NVIDIA Corporation", ticker: "NVDA", quantity: 6, pricePaid: 875.0, date: new Date("2025-05-18") },
  { name: "Tesla Inc.", ticker: "TSLA", quantity: 15, pricePaid: 195.0, date: new Date("2025-06-30") },
  { name: "Meta Platforms Inc.", ticker: "META", quantity: 7, pricePaid: 590.0, date: new Date("2025-08-14") },
  { name: "Netflix Inc.", ticker: "NFLX", quantity: 4, pricePaid: 680.0, date: new Date("2025-09-22") },
  { name: "Apple Inc.", ticker: "AAPL", quantity: 5, pricePaid: 225.0, date: new Date("2025-11-10") },
  { name: "Microsoft Corporation", ticker: "MSFT", quantity: 3, pricePaid: 450.0, date: new Date("2026-01-15") },
];

export function FillDatabase() {
  const { load } = useTransactions();

  const handleFill = () => {
    const transactions: StockTransaction[] = SAMPLE_TRANSACTIONS.map((t) => ({
      ...t,
      id: crypto.randomUUID(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    load();
  };

  return <button onClick={handleFill}>Fill Database</button>;
}
