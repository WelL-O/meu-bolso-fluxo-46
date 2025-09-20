import { useGoals } from '@/contexts/GoalsContext';
import { Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { differenceInDays, parseISO } from 'date-fns';

interface GoalCardProps {
  goal: import('@/contexts/GoalsContext').Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const { setSelectedGoal, setIsDepositModalOpen, setIsDetailsModalOpen } = useGoals();
  
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const remaining = goal.targetAmount - goal.currentAmount;
  const isCompleted = progress >= 100;
  
  let daysUntilDeadline = null;
  if (goal.deadline) {
    daysUntilDeadline = differenceInDays(parseISO(goal.deadline), new Date());
  }
  
  // Calculate monthly suggestion
  const monthlySuggestion = goal.deadline && daysUntilDeadline && daysUntilDeadline > 0
    ? remaining / (daysUntilDeadline / 30)
    : remaining * 0.1;
  
  const handleDeposit = () => {
    setSelectedGoal(goal);
    setIsDepositModalOpen(true);
  };
  
  const handleDetails = () => {
    setSelectedGoal(goal);
    setIsDetailsModalOpen(true);
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">{goal.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground">{goal.name}</h3>
          {goal.deadline && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>
                {daysUntilDeadline !== null && daysUntilDeadline > 0 
                  ? `${daysUntilDeadline} dias restantes`
                  : daysUntilDeadline === 0
                  ? 'Vence hoje'
                  : 'Prazo vencido'
                }
              </span>
            </div>
          )}
        </div>
        {isCompleted && (
          <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-full text-xs">
            Concluída
          </div>
        )}
      </div>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-bold text-foreground">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Values */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Atual</span>
          <span className="text-green-500 font-bold">
            {formatCurrency(goal.currentAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">Meta</span>
          <span className="text-foreground font-bold">
            {formatCurrency(goal.targetAmount)}
          </span>
        </div>
        {!isCompleted && (
          <div className="flex justify-between">
            <span className="text-muted-foreground text-sm">Restante</span>
            <span className="text-destructive font-bold">
              {formatCurrency(remaining)}
            </span>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDeposit}
          disabled={isCompleted}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground text-white py-2 px-4 rounded-lg transition-all font-medium"
        >
          {isCompleted ? 'Concluída' : 'Depositar'}
        </button>
        <button
          onClick={handleDetails}
          className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground py-2 px-4 rounded-lg transition-all font-medium"
        >
          Detalhes
        </button>
      </div>
      
      {/* Suggestion */}
      {!isCompleted && monthlySuggestion > 0 && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">
            Sugestão para atingir a meta:
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">
              {formatCurrency(monthlySuggestion)}
              <span className="text-muted-foreground text-xs ml-1">por mês</span>
            </span>
            <TrendingUp size={16} className="text-primary" />
          </div>
        </div>
      )}
    </div>
  );
}