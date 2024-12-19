'use client';

import React, { useState } from 'react';
import Modal from './modal';

interface AddTransactionProps {
  fetchTransactions: () => void;
}

function AddTransaction({ fetchTransactions }: AddTransactionProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Credit', description: '', amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setForm({ type: 'Credit', description: '', amount: '' });
    setError(null);
  };

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.description || !form.amount || Number(form.amount) <= 0) {
      setError('Please fill out all fields with valid values.');
      return;
    }

    setIsSubmitting(true);
    const date = new Date().toISOString();

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date }),
      });

      if (res.status !== 201) {
        throw new Error('Failed to add transaction.');
      }

      setForm({ type: 'Credit', description: '', amount: '' });
      fetchTransactions();
      closeModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err:any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={openModal}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        + Add Transaction
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <form className="flex flex-col gap-6" onSubmit={handleAddTransaction}>
          <h2 className="text-2xl font-semibold">New Transaction</h2>

          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-2 gap-4 items-center">
            <label htmlFor="type" className="font-medium">
              Transaction Type
            </label>
            <select
              id="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as 'Credit' | 'Debit' })}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <label htmlFor="amount" className="font-medium">
              Amount
            </label>
            <input
              id="amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              type="number"
              min="0"
              placeholder="Amount"
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <label htmlFor="description" className="font-medium">
              Description
            </label>
            <input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              type="text"
              placeholder="Description"
              className="border border-gray-300 rounded px-2 py-1"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded text-white ${
                isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AddTransaction;
