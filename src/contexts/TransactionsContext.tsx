'use client';

import type { Transaction } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'> & { date: string | Date }) => void;
  deleteTransaction: (id: string) => void;
  loading: boolean;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'financeguard_transactions';

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions) as Transaction[];
        // Ensure dates are Date objects
        setTransactions(parsedTransactions.map(t => ({ ...t, date: new Date(t.date) })));
      }
    } catch (error) {
      console.error("Failed to load transactions from localStorage:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) { // Only save if not in initial loading phase
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error("Failed to save transactions to localStorage:", error);
      }
    }
  }, [transactions, loading]);

  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id' | 'date'> & { date: string | Date }) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: new Date().toISOString() + Math.random().toString(36).substring(2, 9), // More robust ID
      date: new Date(transactionData.date), 
    };
    setTransactions(prev => [...prev, newTransaction].sort((a,b) => b.date.getTime() - a.date.getTime()));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, addTransaction, deleteTransaction, loading }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = (): TransactionsContextType => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
