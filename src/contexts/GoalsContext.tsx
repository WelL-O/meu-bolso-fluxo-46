import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface GoalTransaction {
  id: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdraw';
  description?: string;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
  createdAt: string;
  history: GoalTransaction[];
}

interface GoalsContextType {
  goals: Goal[];
  selectedGoal: Goal | null;
  setSelectedGoal: (goal: Goal | null) => void;
  createGoal: (goalData: Omit<Goal, 'id' | 'currentAmount' | 'history' | 'createdAt'>) => void;
  depositToGoal: (goalId: string, amount: number, description?: string) => void;
  deleteGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (open: boolean) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

const GoalsContext = createContext<GoalsContextType | null>(null);

interface GoalsProviderProps {
  children: ReactNode;
}

export const GoalsProvider = ({ children }: GoalsProviderProps) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('goals');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Save to localStorage whenever goals change
  useEffect(() => {
    try {
      localStorage.setItem('goals', JSON.stringify(goals));
    } catch (error) {
      console.error('Failed to save goals to localStorage:', error);
    }
  }, [goals]);
  
  const createGoal = (goalData: Omit<Goal, 'id' | 'currentAmount' | 'history' | 'createdAt'>) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      ...goalData,
      currentAmount: 0,
      history: [],
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };
  
  const depositToGoal = (goalId: string, amount: number, description = '') => {
    const transaction: GoalTransaction = {
      id: Date.now().toString(),
      amount,
      date: new Date().toISOString(),
      type: 'deposit',
      description
    };
    
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? {
            ...goal,
            currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount),
            history: [...goal.history, transaction]
          }
        : goal
    ));
  };
  
  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };
  
  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };
  
  return (
    <GoalsContext.Provider value={{
      goals,
      selectedGoal,
      setSelectedGoal,
      createGoal,
      depositToGoal,
      deleteGoal,
      updateGoal,
      isDepositModalOpen,
      setIsDepositModalOpen,
      isDetailsModalOpen,
      setIsDetailsModalOpen,
      isCreateModalOpen,
      setIsCreateModalOpen
    }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};