"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { StockTransaction } from "@/types/StockTransaction";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { EditTransactionModal } from "@/components/EditTransactionModal";

export default function TransactionsPage() {
  const { transactions, load, create, update } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<StockTransaction | null>(null);

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
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdate={update}
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
              <th className="p-3 border"><span className="sr-only">Actions</span></th>
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
                <td className="p-3 border text-center">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    aria-label={`Edit ${transaction.name}`}
                    className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
