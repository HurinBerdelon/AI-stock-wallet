"use client";

import { useEffect, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { StockTransaction } from "@/types/StockTransaction";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { EditTransactionModal } from "@/components/EditTransactionModal";
import { DeleteTransactionModal } from "@/components/DeleteTransactionModal";

export default function TransactionsPage() {
  const { transactions, load, create, update, remove } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<StockTransaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<StockTransaction | null>(null);

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
      {deletingTransaction && (
        <DeleteTransactionModal
          transaction={deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onDelete={remove}
        />
      )}
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="grid gap-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{transaction.name}</p>
                  <p className="font-mono text-sm text-gray-600">{transaction.ticker}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    aria-label={`Edit ${transaction.name}`}
                    className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeletingTransaction(transaction)}
                    aria-label={`Delete ${transaction.name}`}
                    className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <p className="text-gray-500">Quantity</p>
                  <p>{transaction.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Price Paid</p>
                  <p>${transaction.pricePaid.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p>${(transaction.quantity * transaction.pricePaid).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p>{transaction.date.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
