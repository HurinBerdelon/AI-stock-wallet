"use client";

import { useEffect, useRef, useState } from "react";
import { StockTransaction } from "@/types/StockTransaction";

type Props = {
  onClose: () => void;
  onCreate: (transaction: Omit<StockTransaction, "id">) => void;
};

export function AddTransactionModal({ onClose, onCreate }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const firstFocusableRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFocusableRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePaid, setPricePaid] = useState("");
  const [date, setDate] = useState(today);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!ticker.trim()) newErrors.ticker = "Ticker is required.";
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0)
      newErrors.quantity = "Quantity must be a positive number.";
    if (!pricePaid || isNaN(Number(pricePaid)) || Number(pricePaid) <= 0)
      newErrors.pricePaid = "Price paid must be a positive number.";
    if (!date) newErrors.date = "Date is required.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onCreate({
      name: name.trim(),
      ticker: ticker.trim().toUpperCase(),
      quantity: Number(quantity),
      pricePaid: Number(pricePaid),
      date: new Date(date),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          Add Transaction
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              ref={firstFocusableRef}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="ticker" className="block text-sm font-medium mb-1">
              Ticker
            </label>
            <input
              id="ticker"
              type="text"
              className="w-full border rounded px-3 py-2 font-mono uppercase"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            {errors.ticker && (
              <p className="text-red-500 text-sm mt-1">{errors.ticker}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium mb-1"
            >
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              step="any"
              className="w-full border rounded px-3 py-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="pricePaid"
              className="block text-sm font-medium mb-1"
            >
              Price Paid
            </label>
            <input
              id="pricePaid"
              type="number"
              step="any"
              className="w-full border rounded px-3 py-2"
              value={pricePaid}
              onChange={(e) => setPricePaid(e.target.value)}
            />
            {errors.pricePaid && (
              <p className="text-red-500 text-sm mt-1">{errors.pricePaid}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full border rounded px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
