export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  account?: string;
  cardId?: string;
  recurrenceId?: string;
  installments?: {
    current: number;
    total: number;
  };
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
  deposits: Deposit[];
  createdAt: string;
}

export interface Deposit {
  id: string;
  amount: number;
  date: string;
  description?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  color: string;
  currentBill: number;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  month: string;
}

export interface Recurrence {
  id: string;
  transaction: Omit<Transaction, 'id' | 'date' | 'createdAt'>;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDate: string;
  endDate?: string;
  active: boolean;
  createdAt: string;
}

export interface Settings {
  currency: 'BRL' | 'USD' | 'EUR';
  firstDayOfMonth: number;
  notifications: boolean;
  theme: 'dark' | 'light';
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
}

export interface DashboardStats {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

export interface BalanceHistory {
  date: string;
  balance: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}