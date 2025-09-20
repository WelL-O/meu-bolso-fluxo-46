import type { 
  Transaction, 
  Goal, 
  CreditCard, 
  Budget, 
  Recurrence, 
  Settings, 
  Category 
} from '@/types/finance';

// Storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  GOALS: 'finance_goals',
  CARDS: 'finance_cards',
  BUDGETS: 'finance_budgets',
  RECURRENCES: 'finance_recurrences',
  SETTINGS: 'finance_settings',
} as const;

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  // Income categories
  { id: '1', name: 'Salário', icon: '💰', color: '#10b981', type: 'income' },
  { id: '2', name: 'Freelance', icon: '💻', color: '#6366f1', type: 'income' },
  { id: '3', name: 'Investimentos', icon: '📈', color: '#8b5cf6', type: 'income' },
  { id: '4', name: 'Vendas', icon: '🛍️', color: '#06b6d4', type: 'income' },
  
  // Expense categories
  { id: '5', name: 'Alimentação', icon: '🍽️', color: '#f59e0b', type: 'expense' },
  { id: '6', name: 'Transporte', icon: '🚗', color: '#ef4444', type: 'expense' },
  { id: '7', name: 'Moradia', icon: '🏠', color: '#84cc16', type: 'expense' },
  { id: '8', name: 'Saúde', icon: '🏥', color: '#ec4899', type: 'expense' },
  { id: '9', name: 'Educação', icon: '📚', color: '#3b82f6', type: 'expense' },
  { id: '10', name: 'Lazer', icon: '🎮', color: '#f97316', type: 'expense' },
  { id: '11', name: 'Roupas', icon: '👕', color: '#a855f7', type: 'expense' },
  { id: '12', name: 'Contas', icon: '📋', color: '#6b7280', type: 'expense' },
  { id: '13', name: 'Outros', icon: '🔧', color: '#64748b', type: 'both' },
];

// Default settings
const DEFAULT_SETTINGS: Settings = {
  currency: 'BRL',
  firstDayOfMonth: 1,
  notifications: true,
  theme: 'dark',
  categories: DEFAULT_CATEGORIES,
};

// Generic storage functions
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage:`, error);
  }
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading from storage:`, error);
    return defaultValue;
  }
}

// Transactions
export function saveTransactions(transactions: Transaction[]): void {
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
}

export function loadTransactions(): Transaction[] {
  return loadFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

// Goals
export function saveGoals(goals: Goal[]): void {
  saveToStorage(STORAGE_KEYS.GOALS, goals);
}

export function loadGoals(): Goal[] {
  return loadFromStorage<Goal[]>(STORAGE_KEYS.GOALS, []);
}

// Credit Cards
export function saveCreditCards(cards: CreditCard[]): void {
  saveToStorage(STORAGE_KEYS.CARDS, cards);
}

export function loadCreditCards(): CreditCard[] {
  return loadFromStorage<CreditCard[]>(STORAGE_KEYS.CARDS, []);
}

// Budgets
export function saveBudgets(budgets: Budget[]): void {
  saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
}

export function loadBudgets(): Budget[] {
  return loadFromStorage<Budget[]>(STORAGE_KEYS.BUDGETS, []);
}

// Recurrences
export function saveRecurrences(recurrences: Recurrence[]): void {
  saveToStorage(STORAGE_KEYS.RECURRENCES, recurrences);
}

export function loadRecurrences(): Recurrence[] {
  return loadFromStorage<Recurrence[]>(STORAGE_KEYS.RECURRENCES, []);
}

// Settings
export function saveSettings(settings: Settings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

export function loadSettings(): Settings {
  return loadFromStorage<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// Export/Import functionality
export function exportData(): string {
  const data = {
    transactions: loadTransactions(),
    goals: loadGoals(),
    cards: loadCreditCards(),
    budgets: loadBudgets(),
    recurrences: loadRecurrences(),
    settings: loadSettings(),
    exportDate: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.transactions) saveTransactions(data.transactions);
    if (data.goals) saveGoals(data.goals);
    if (data.cards) saveCreditCards(data.cards);
    if (data.budgets) saveBudgets(data.budgets);
    if (data.recurrences) saveRecurrences(data.recurrences);
    if (data.settings) saveSettings(data.settings);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}