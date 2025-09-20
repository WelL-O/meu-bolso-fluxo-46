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
      
      case 'value-desc': // Valor (maior)
        return sorted.sort((a, b) => b.amount - a.amount);
      
      case 'value-asc': // Valor (menor)
        return sorted.sort((a, b) => a.amount - b.amount);
      
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