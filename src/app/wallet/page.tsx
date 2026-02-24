"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { StockPosition } from "@/types/StockPosition";

export default function WalletPage() {
  const { load, getPortfolio, calculateProfitability } = useTransactions();
  const [portfolio, setPortfolio] = useState<StockPosition[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, string>>({});

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const positions = getPortfolio();
    setPortfolio(positions);
    const initialPrices: Record<string, string> = {};
    for (const pos of positions) {
      initialPrices[pos.ticker] = pos.averagePrice.toFixed(2);
    }
    setCurrentPrices(initialPrices);
  }, [getPortfolio]);

  const handlePriceChange = (ticker: string, value: string) => {
    setCurrentPrices((prev) => ({ ...prev, [ticker]: value }));
  };

  const getProfitability = (ticker: string): number | null => {
    const price = parseFloat(currentPrices[ticker] ?? "");
    if (isNaN(price) || price <= 0) return null;
    return calculateProfitability(ticker, price);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Wallet</h1>
      {portfolio.length === 0 ? (
        <p className="text-gray-500">No stocks in wallet.</p>
      ) : (
        <div className="grid gap-4">
          {portfolio.map((pos) => {
            const profitability = getProfitability(pos.ticker);
            return (
              <div key={pos.ticker} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono font-bold text-lg">{pos.ticker}</span>
                  {profitability === null ? (
                    <span className="text-gray-400">—</span>
                  ) : (
                    <span className={profitability >= 0 ? "text-green-600" : "text-red-600"}>
                      {profitability >= 0 ? "+" : ""}
                      {profitability.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p>{pos.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Avg. Price</p>
                    <p>${pos.averagePrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Bought</p>
                    <p>{pos.lastTimeBought.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Price</p>
                    <input
                      type="number"
                      step="any"
                      aria-label={`Current price for ${pos.ticker}`}
                      className="w-24 border rounded px-2 py-1 text-right"
                      value={currentPrices[pos.ticker] ?? ""}
                      onChange={(e) => handlePriceChange(pos.ticker, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
