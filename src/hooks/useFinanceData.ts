import { useState, useEffect } from 'react';
import { 
  loadTransactions, 
  loadGoals, 
  loadCreditCards, 
  loadRecurrences,
  saveTransactions,
  saveGoals,
  saveCreditCards,
  saveRecurrences
} from '@/lib/storage';
import { 
  generateMockTransactions, 
  generateMockGoals, 
  generateMockCreditCards,
  generateMockRecurrences 
} from '@/lib/mockData';
import type { Transaction, Goal, CreditCard, Recurrence } from '@/types/finance';

export function useFinanceData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [recurrences, setRecurrences] = useState<Recurrence[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      let storedTransactions = loadTransactions();
      let storedGoals = loadGoals();
      let storedCards = loadCreditCards();
      let storedRecurrences = loadRecurrences();

      // If no data exists, create mock data
      if (storedTransactions.length === 0) {
        storedTransactions = generateMockTransactions();
        saveTransactions(storedTransactions);
      }

      if (storedGoals.length === 0) {
        storedGoals = generateMockGoals();
        saveGoals(storedGoals);
      }

      if (storedCards.length === 0) {
        storedCards = generateMockCreditCards();
        saveCreditCards(storedCards);
      }

      if (storedRecurrences.length === 0) {
        storedRecurrences = generateMockRecurrences();
        saveRecurrences(storedRecurrences);
      }

      setTransactions(storedTransactions);
      setGoals(storedGoals);
      setCreditCards(storedCards);
      setRecurrences(storedRecurrences);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Listen for transaction updates
  useEffect(() => {
    const handleTransactionAdded = () => {
      setTransactions(loadTransactions());
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);
    return () => window.removeEventListener('transactionAdded', handleTransactionAdded);
  }, []);

  // Refresh functions
  const refreshTransactions = () => setTransactions(loadTransactions());
  const refreshGoals = () => setGoals(loadGoals());
  const refreshCreditCards = () => setCreditCards(loadCreditCards());
  const refreshRecurrences = () => setRecurrences(loadRecurrences());

  const refreshAll = () => {
    refreshTransactions();
    refreshGoals();
    refreshCreditCards();
    refreshRecurrences();
  };

  return {
    transactions,
    goals,
    creditCards,
    recurrences,
    isLoading,
    refreshTransactions,
    refreshGoals,
    refreshCreditCards,
    refreshRecurrences,
    refreshAll,
  };
}