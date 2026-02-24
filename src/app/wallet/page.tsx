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
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 border">Ticker</th>
              <th className="text-right p-3 border">Quantity</th>
              <th className="text-right p-3 border">Avg. Price</th>
              <th className="text-left p-3 border">Last Bought</th>
              <th className="text-right p-3 border">Current Price</th>
              <th className="text-right p-3 border">Profitability</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((pos) => {
              const profitability = getProfitability(pos.ticker);
              return (
                <tr key={pos.ticker} className="hover:bg-gray-50">
                  <td className="p-3 border font-mono">{pos.ticker}</td>
                  <td className="p-3 border text-right">{pos.quantity}</td>
                  <td className="p-3 border text-right">${pos.averagePrice.toFixed(2)}</td>
                  <td className="p-3 border">{pos.lastTimeBought.toLocaleDateString()}</td>
                  <td className="p-3 border text-right">
                    <input
                      type="number"
                      step="any"
                      aria-label={`Current price for ${pos.ticker}`}
                      className="w-24 border rounded px-2 py-1 text-right"
                      value={currentPrices[pos.ticker] ?? ""}
                      onChange={(e) => handlePriceChange(pos.ticker, e.target.value)}
                    />
                  </td>
                  <td className="p-3 border text-right">
                    {profitability === null ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      <span className={profitability >= 0 ? "text-green-600" : "text-red-600"}>
                        {profitability >= 0 ? "+" : ""}
                        {profitability.toFixed(2)}%
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
