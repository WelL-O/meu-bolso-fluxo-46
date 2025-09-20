import { Plus, Target, TrendingUp } from 'lucide-react';
import { useGoals } from '@/contexts/GoalsContext';
import { GoalCard } from '@/components/goals/GoalCard';
import { GoalModals } from '@/components/goals/GoalModals';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Goals() {
  const { goals, setIsCreateModalOpen } = useGoals();

  // Calculate statistics
  const totalGoalsValue = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalGoalsValue > 0 ? (totalSaved / totalGoalsValue) * 100 : 0;

  return (
    <div className="min-h-screen bg-background mobile-safe-bottom">
      {/* Mobile-first header */}
      <div className="mobile-container mobile-section-spacing">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="mobile-title text-foreground">Metas de Economia</h1>
            <p className="mobile-text-sm text-muted-foreground">
              Defina e acompanhe seus objetivos financeiros
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mobile-button bg-primary hover:bg-primary/90 text-primary-foreground hidden md:flex"
          >
            <Plus className="mobile-icon-sm mr-2" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="mobile-container mobile-section-spacing">
        <div className="mobile-grid-4 lg:grid-cols-3">
          <div className="mobile-stats-compact bg-primary/5 border-primary/20 border rounded-xl hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <p className="mobile-stats-label text-muted-foreground">Total de Metas</p>
              <div className="text-primary">
                <Target className="mobile-icon-sm" />
              </div>
            </div>
            <p className="mobile-stats-value text-primary truncate">
              {goals.length} meta{goals.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="mobile-stats-compact bg-green-500/5 border-green-500/20 border rounded-xl hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <p className="mobile-stats-label text-muted-foreground">Valor Total</p>
              <div className="text-green-400">
                <TrendingUp className="mobile-icon-sm" />
              </div>
            </div>
            <p className="mobile-stats-value text-green-400 truncate">
              {formatCurrency(totalGoalsValue)}
            </p>
          </div>

          <div className="mobile-stats-compact bg-primary/5 border-primary/20 border rounded-xl hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <p className="mobile-stats-label text-muted-foreground">Progresso Geral</p>
              <div className="text-primary">
                <span className="mobile-text-lg">🎯</span>
              </div>
            </div>
            <p className="mobile-stats-value text-primary truncate">
              {overallProgress.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="mobile-container">
        {goals.length === 0 ? (
          <Card className="mobile-card financial-card">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <span className="text-8xl mb-6">🎯</span>
              <h3 className="mobile-subtitle text-foreground mb-3 text-center">
                Nenhuma meta criada
              </h3>
              <p className="mobile-text-base text-muted-foreground text-center mb-6 max-w-sm">
                Comece definindo seus objetivos financeiros para acompanhar seu progresso
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="mobile-button bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="mobile-icon-sm mr-2" />
                Criar Primeira Meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mobile Add Button - Only visible on mobile */}
            <div className="mb-6 md:hidden">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="mobile-button bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                <Plus className="mobile-icon-sm mr-2" />
                Nova Meta
              </Button>
            </div>

            {/* Goals Grid - Single column on mobile, responsive grid on larger screens */}
            <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:space-y-0">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <GoalModals />

      {/* Extra spacing at bottom for mobile navigation */}
      <div className="h-24 md:h-8" />
    </div>
  );
}