import type { Transaction, Goal, CreditCard, Recurrence } from '@/types/finance';
import { generateId } from './utils';
import { subDays, addDays, format } from 'date-fns';

// Generate mock transactions for the last 30 days
export function generateMockTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Income transactions
  const incomeData = [
    { description: 'Salário Empresa XYZ', category: 'Salário', amount: 5500, daysAgo: 25 },
    { description: 'Freelance Website', category: 'Freelance', amount: 1200, daysAgo: 20 },
    { description: 'Venda Produto Online', category: 'Vendas', amount: 350, daysAgo: 15 },
    { description: 'Dividendos Ações', category: 'Investimentos', amount: 180, daysAgo: 10 },
    { description: 'Freelance Logo', category: 'Freelance', amount: 800, daysAgo: 5 },
  ];
  
  incomeData.forEach(item => {
    transactions.push({
      id: generateId(),
      type: 'income',
      amount: item.amount,
      description: item.description,
      category: item.category,
      date: subDays(now, item.daysAgo).toISOString(),
      createdAt: new Date().toISOString(),
    });
  });
  
  // Expense transactions
  const expenseData = [
    { description: 'Supermercado Extra', category: 'Alimentação', amount: 245.80, daysAgo: 29 },
    { description: 'Aluguel Apartamento', category: 'Moradia', amount: 1500, daysAgo: 28 },
    { description: 'Combustível', category: 'Transporte', amount: 120, daysAgo: 27 },
    { description: 'Conta de Luz', category: 'Contas', amount: 185.50, daysAgo: 26 },
    { description: 'Netflix', category: 'Lazer', amount: 32.90, daysAgo: 25 },
    { description: 'Uber', category: 'Transporte', amount: 28.50, daysAgo: 24 },
    { description: 'Farmácia', category: 'Saúde', amount: 67.20, daysAgo: 23 },
    { description: 'Restaurante', category: 'Alimentação', amount: 89.90, daysAgo: 22 },
    { description: 'Academia', category: 'Saúde', amount: 79.90, daysAgo: 21 },
    { description: 'Livros Técnicos', category: 'Educação', amount: 156.80, daysAgo: 20 },
    { description: 'Supermercado', category: 'Alimentação', amount: 198.45, daysAgo: 19 },
    { description: 'Conta de Internet', category: 'Contas', amount: 99.90, daysAgo: 18 },
    { description: 'Shopping', category: 'Roupas', amount: 299.90, daysAgo: 17 },
    { description: 'Cinema', category: 'Lazer', amount: 45, daysAgo: 16 },
    { description: 'Farmácia', category: 'Saúde', amount: 34.60, daysAgo: 15 },
    { description: 'Combustível', category: 'Transporte', amount: 115, daysAgo: 14 },
    { description: 'Delivery', category: 'Alimentação', amount: 42.50, daysAgo: 13 },
    { description: 'Spotify', category: 'Lazer', amount: 16.90, daysAgo: 12 },
    { description: 'Supermercado', category: 'Alimentação', amount: 167.30, daysAgo: 11 },
    { description: 'Manutenção Carro', category: 'Transporte', amount: 280, daysAgo: 10 },
    { description: 'Conta de Água', category: 'Contas', amount: 78.40, daysAgo: 9 },
    { description: 'Restaurante', category: 'Alimentação', amount: 95.80, daysAgo: 8 },
    { description: 'Steam Games', category: 'Lazer', amount: 59.90, daysAgo: 7 },
    { description: 'Uber', category: 'Transporte', amount: 22.30, daysAgo: 6 },
    { description: 'Farmácia', category: 'Saúde', amount: 45.80, daysAgo: 5 },
    { description: 'Supermercado', category: 'Alimentação', amount: 201.60, daysAgo: 4 },
    { description: 'Café', category: 'Alimentação', amount: 12.50, daysAgo: 3 },
    { description: 'Curso Online', category: 'Educação', amount: 197, daysAgo: 2 },
    { description: 'Delivery Pizza', category: 'Alimentação', amount: 38.90, daysAgo: 1 },
  ];
  
  expenseData.forEach(item => {
    transactions.push({
      id: generateId(),
      type: 'expense',
      amount: item.amount,
      description: item.description,
      category: item.category,
      date: subDays(now, item.daysAgo).toISOString(),
      createdAt: new Date().toISOString(),
    });
  });
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate mock goals
export function generateMockGoals(): Goal[] {
  return [
    {
      id: generateId(),
      name: 'Viagem para Europa',
      targetAmount: 15000,
      currentAmount: 4800,
      deadline: addDays(new Date(), 180).toISOString(),
      icon: '✈️',
      color: '#6366f1',
      deposits: [
        {
          id: generateId(),
          amount: 2000,
          date: subDays(new Date(), 30).toISOString(),
          description: 'Depósito inicial',
        },
        {
          id: generateId(),
          amount: 1500,
          date: subDays(new Date(), 15).toISOString(),
          description: 'Economia do mês',
        },
        {
          id: generateId(),
          amount: 1300,
          date: subDays(new Date(), 5).toISOString(),
          description: 'Freelance extra',
        },
      ],
      createdAt: subDays(new Date(), 60).toISOString(),
    },
    {
      id: generateId(),
      name: 'Reserva de Emergência',
      targetAmount: 20000,
      currentAmount: 12400,
      icon: '🛡️',
      color: '#10b981',
      deposits: [
        {
          id: generateId(),
          amount: 5000,
          date: subDays(new Date(), 45).toISOString(),
          description: '25% do valor total',
        },
        {
          id: generateId(),
          amount: 4000,
          date: subDays(new Date(), 30).toISOString(),
          description: 'Economia mensal',
        },
        {
          id: generateId(),
          amount: 3400,
          date: subDays(new Date(), 10).toISOString(),
          description: 'Bonus trabalho',
        },
      ],
      createdAt: subDays(new Date(), 90).toISOString(),
    },
    {
      id: generateId(),
      name: 'MacBook Pro',
      targetAmount: 8500,
      currentAmount: 2100,
      deadline: addDays(new Date(), 120).toISOString(),
      icon: '💻',
      color: '#8b5cf6',
      deposits: [
        {
          id: generateId(),
          amount: 1000,
          date: subDays(new Date(), 20).toISOString(),
          description: 'Economia para equipamento',
        },
        {
          id: generateId(),
          amount: 1100,
          date: subDays(new Date(), 8).toISOString(),
          description: 'Projeto freelance',
        },
      ],
      createdAt: subDays(new Date(), 30).toISOString(),
    },
  ];
}

// Generate mock credit cards
export function generateMockCreditCards(): CreditCard[] {
  return [
    {
      id: generateId(),
      name: 'Nubank Roxinho',
      limit: 5000,
      closingDay: 15,
      dueDay: 10,
      color: '#8a2be2',
      currentBill: 1234.56,
    },
    {
      id: generateId(),
      name: 'Inter Black',
      limit: 8000,
      closingDay: 20,
      dueDay: 15,
      color: '#ff8c00',
      currentBill: 567.89,
    },
  ];
}

// Generate mock recurrences
export function generateMockRecurrences(): Recurrence[] {
  return [
    {
      id: generateId(),
      transaction: {
        type: 'income',
        amount: 5500,
        description: 'Salário Empresa XYZ',
        category: 'Salário',
      },
      frequency: 'monthly',
      nextDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      active: true,
      createdAt: subDays(new Date(), 180).toISOString(),
    },
    {
      id: generateId(),
      transaction: {
        type: 'expense',
        amount: 1500,
        description: 'Aluguel Apartamento',
        category: 'Moradia',
      },
      frequency: 'monthly',
      nextDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      active: true,
      createdAt: subDays(new Date(), 365).toISOString(),
    },
    {
      id: generateId(),
      transaction: {
        type: 'expense',
        amount: 32.90,
        description: 'Netflix',
        category: 'Lazer',
      },
      frequency: 'monthly',
      nextDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
      active: true,
      createdAt: subDays(new Date(), 90).toISOString(),
    },
    {
      id: generateId(),
      transaction: {
        type: 'expense',
        amount: 79.90,
        description: 'Academia Forma Física',
        category: 'Saúde',
      },
      frequency: 'monthly',
      nextDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
      active: true,
      createdAt: subDays(new Date(), 60).toISOString(),
    },
    {
      id: generateId(),
      transaction: {
        type: 'expense',
        amount: 99.90,
        description: 'Internet Fibra',
        category: 'Contas',
      },
      frequency: 'monthly',
      nextDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      active: true,
      createdAt: subDays(new Date(), 300).toISOString(),
    },
  ];
}