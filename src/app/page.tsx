'use client';

import AddTransaction from "@/components/add-transaction";
import { useEffect, useState, useMemo } from "react";

export interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await res.json();
      setTransactions(JSON.parse(data));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const calculateBalance = useMemo(() => {
    return transactions.reduce((balance, t) => {
      return t.type === 'Credit' ? balance + t.amount : balance - t.amount;
    }, 0);
  }, [transactions]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Cash Flow Transactions</h1>
      <AddTransaction fetchTransactions={fetchTransactions} />

      <h2 className="text-xl font-semibold mt-4">
        Running Balance: <span className="text-green-600">${calculateBalance}</span>
      </h2>

      {loading ? (
        <div className="mt-6 text-gray-600">Loading transactions...</div>
      ) : (
        <>
          {transactions.length > 0 ? (
            <table className="max-w-xl w-[90vw] mt-6 border-collapse border border-gray-300 bg-white shadow-md">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Description</th>
                  <th className="border border-gray-300 p-2">Credit</th>
                  <th className="border border-gray-300 p-2">Debit</th>
                  <th className="border border-gray-300 p-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, index) => {
                  const balance = transactions
                    .slice(index)
                    .reduce(
                      (b, t) => (t.type === 'Credit' ? b + t.amount : b - t.amount),
                      0
                    );

                  return (
                    <tr key={t._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 p-2">{t.description}</td>
                      <td className="border border-gray-300 p-2 text-green-600">
                        {t.type === 'Credit' ? `$${t.amount}` : ''}
                      </td>
                      <td className="border border-gray-300 p-2 text-red-600">
                        {t.type === 'Debit' ? `$${t.amount}` : ''}
                      </td>
                      <td className="border border-gray-300 p-2">${balance}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="mt-6 text-gray-600">No transactions found.</div>
          )}
        </>
      )}
    </div>
  );
}
