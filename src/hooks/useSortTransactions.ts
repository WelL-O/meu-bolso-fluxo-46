import { useState, useMemo } from 'react';
import type { Transaction } from '@/types/finance';

export const useSortTransactions = (transactions: Transaction[]) => {
  const [sortBy, setSortBy] = useState('date-desc');
  
  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions];
    
    switch (sortBy) {
      case 'date-desc': // Data (recente)
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      case 'date-asc': // Data (antiga)
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      case 'value-desc': // Valor (maior primeiro)
        return sorted.sort((a, b) => {
          const valueA = Math.abs(a.amount);
          const valueB = Math.abs(b.amount);
          return valueB - valueA; // B - A = maior primeiro
        });
      
      case 'value-asc': // Valor (menor primeiro)
        return sorted.sort((a, b) => {
          const valueA = Math.abs(a.amount);
          const valueB = Math.abs(b.amount);
          return valueA - valueB; // A - B = menor primeiro
        });
      
      case 'category': // Por categoria
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      
      case 'type': // Por tipo (entrada/saída)
        return sorted.sort((a, b) => {
          if (a.type === b.type) return 0;
          return a.type === 'income' ? -1 : 1;
        });
      
      default:
        return sorted;
    }
  }, [transactions, sortBy]);
  
  return { sortedTransactions, sortBy, setSortBy };
};