"use client";

import { useEffect } from "react";
import { StockTransaction } from "@/types/StockTransaction";

type Props = {
  transaction: StockTransaction;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export function DeleteTransactionModal({ transaction, onClose, onDelete }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleConfirm = () => {
    onDelete(transaction.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 id="delete-modal-title" className="text-xl font-bold mb-4">
          Delete Transaction
        </h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete the transaction for{" "}
          <span className="font-semibold">{transaction.name}</span> (
          <span className="font-mono">{transaction.ticker}</span>)?
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
