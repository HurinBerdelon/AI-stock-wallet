"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { AddTransactionModal } from "@/components/AddTransactionModal";

export default function TransactionsPage() {
  const { transactions, load, create } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>
      {isModalOpen && (
        <AddTransactionModal
          onClose={() => setIsModalOpen(false)}
          onCreate={create}
        />
      )}
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 border">Name</th>
              <th className="text-left p-3 border">Ticker</th>
              <th className="text-right p-3 border">Quantity</th>
              <th className="text-right p-3 border">Price Paid</th>
              <th className="text-right p-3 border">Total</th>
              <th className="text-left p-3 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="p-3 border">{transaction.name}</td>
                <td className="p-3 border font-mono">{transaction.ticker}</td>
                <td className="p-3 border text-right">{transaction.quantity}</td>
                <td className="p-3 border text-right">${transaction.pricePaid.toFixed(2)}</td>
                <td className="p-3 border text-right">${(transaction.quantity * transaction.pricePaid).toFixed(2)}</td>
                <td className="p-3 border">{transaction.date.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
