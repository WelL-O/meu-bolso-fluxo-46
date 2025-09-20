import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Transaction, DashboardStats, BalanceHistory, CategoryExpense } from '@/types/finance';
import { format, parseISO, startOfMonth, endOfMonth, subDays, addDays, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in Brazilian Real
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

// Format currency for input (without symbol)
export function formatCurrencyInput(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Parse currency string to number
export function parseCurrency(value: string): number {
  return Number(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
}

// Apply currency mask while typing
export function applyCurrencyMask(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Convert to number and divide by 100 to get decimal places
  const number = Number(digits) / 100;
  
  // Format as currency
  return formatCurrencyInput(number);
}

// Format date for display
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
}

// Format date for datetime-local input
export function formatDateForInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd'T'HH:mm");
}

// Get current month start and end
export function getCurrentMonthRange() {
  const now = new Date();
  return {
    start: startOfMonth(now).toISOString(),
    end: endOfMonth(now).toISOString(),
  };
}

// Filter transactions by date range
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: string,
  endDate: string
): Transaction[] {
  return transactions.filter(transaction => {
    const transactionDate = parseISO(transaction.date);
    return isAfter(transactionDate, parseISO(startDate)) && 
           isBefore(transactionDate, parseISO(endDate));
  });
}

// Calculate dashboard stats
export function calculateDashboardStats(transactions: Transaction[]): DashboardStats {
  const { start, end } = getCurrentMonthRange();
  const monthlyTransactions = filterTransactionsByDateRange(transactions, start, end);
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const currentBalance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);
  
  return {
    currentBalance,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings: monthlyIncome - monthlyExpenses,
  };
}

// Calculate balance history for the last 30 days
export function calculateBalanceHistory(transactions: Transaction[]): BalanceHistory[] {
  const endDate = new Date();
  const startDate = subDays(endDate, 29); // 30 days total
  
  const history: BalanceHistory[] = [];
  
  // Get all transactions up to start date to calculate initial balance
  const initialTransactions = transactions.filter(t => 
    isBefore(parseISO(t.date), startDate)
  );
  
  let runningBalance = initialTransactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);
  
  // Calculate balance for each day
  for (let i = 0; i < 30; i++) {
    const currentDate = addDays(startDate, i);
    const dayStr = format(currentDate, 'yyyy-MM-dd');
    
    // Add transactions from this day
    const dayTransactions = transactions.filter(t => 
      format(parseISO(t.date), 'yyyy-MM-dd') === dayStr
    );
    
    dayTransactions.forEach(t => {
      runningBalance += t.type === 'income' ? t.amount : -t.amount;
    });
    
    history.push({
      date: format(currentDate, 'dd/MM'),
      balance: runningBalance,
    });
  }
  
  return history;
}

// Calculate expenses by category for current month
export function calculateCategoryExpenses(transactions: Transaction[]): CategoryExpense[] {
  const { start, end } = getCurrentMonthRange();
  const monthlyExpenses = filterTransactionsByDateRange(transactions, start, end)
    .filter(t => t.type === 'expense');
    
  const totalExpenses = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
  
  if (totalExpenses === 0) return [];
  
  const categoryMap = new Map<string, number>();
  
  monthlyExpenses.forEach(t => {
    const current = categoryMap.get(t.category) || 0;
    categoryMap.set(t.category, current + t.amount);
  });
  
  const categoryColors = [
    '#ef4444', '#f59e0b', '#84cc16', '#06b6d4', 
    '#6366f1', '#8b5cf6', '#ec4899', '#f97316'
  ];
  
  return Array.from(categoryMap.entries())
    .map(([category, amount], index) => ({
      category,
      amount,
      percentage: (amount / totalExpenses) * 100,
      color: categoryColors[index % categoryColors.length],
    }))
    .sort((a, b) => b.amount - a.amount);
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get category icon
export function getCategoryIcon(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'Salário': '💰',
    'Freelance': '💻',
    'Investimentos': '📈',
    'Vendas': '🛍️',
    'Alimentação': '🍽️',
    'Transporte': '🚗',
    'Moradia': '🏠',
    'Saúde': '🏥',
    'Educação': '📚',
    'Lazer': '🎮',
    'Roupas': '👕',
    'Contas': '📋',
    'Outros': '🔧',
  };
  
  return iconMap[categoryName] || '🔧';
}

// Validate transaction
export function validateTransaction(transaction: Partial<Transaction>): string[] {
  const errors: string[] = [];
  
  if (!transaction.amount || transaction.amount <= 0) {
    errors.push('Valor deve ser maior que zero');
  }
  
  if (!transaction.description?.trim()) {
    errors.push('Descrição é obrigatória');
  }
  
  if (!transaction.category?.trim()) {
    errors.push('Categoria é obrigatória');
  }
  
  if (!transaction.date) {
    errors.push('Data é obrigatória');
  }
  
  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.push('Tipo deve ser entrada ou saída');
  }
  
  return errors;
}