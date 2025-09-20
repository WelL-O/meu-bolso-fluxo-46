import { TrendingUp, Target, Activity, BarChart3 } from 'lucide-react';
import { MobileStatsGrid } from '@/components/dashboard/mobile/MobileStatsGrid';
import { MobileBalanceChart } from '@/components/dashboard/mobile/MobileBalanceChart';
import { MobileCategoryChart } from '@/components/dashboard/mobile/MobileCategoryChart';
import { MobileRecentTransactions } from '@/components/dashboard/mobile/MobileRecentTransactions';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
import { useFinanceData } from '@/hooks/useFinanceData';
import {
  calculateDashboardStats,
  calculateBalanceHistory,
  calculateCategoryExpenses
} from '@/lib/utils';

const Dashboard = () => {
  const { transactions, isLoading } = useFinanceData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background mobile-container">
        {/* Enhanced loading skeleton */}
        <div className="space-y-8 animate-pulse">
          {/* Header skeleton */}
          <div className="space-y-3">
            <div className="h-8 bg-muted rounded-xl w-3/4" />
            <div className="h-5 bg-muted rounded-lg w-1/2" />
          </div>

          {/* Quick stats skeleton */}
          <div className="mobile-grid-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-shimmer" />
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            <div className="h-80 bg-muted rounded-xl animate-shimmer" />
            <div className="h-80 bg-muted rounded-xl animate-shimmer" />
          </div>

          {/* Bottom sections skeleton */}
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            <div className="h-64 bg-muted rounded-xl animate-shimmer" />
            <div className="h-64 bg-muted rounded-xl animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateDashboardStats(transactions);
  const balanceHistory = calculateBalanceHistory(transactions);
  const categoryExpenses = calculateCategoryExpenses(transactions);

  return (
    <div className="min-h-screen bg-background mobile-safe-bottom">
      {/* Hero Header Section */}
      <div className="mobile-container mobile-section-spacing">
        <div className="text-center md:text-left space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="mobile-title text-foreground font-bold">
                Dashboard Financeiro
              </h1>
              <p className="mobile-text-sm text-muted-foreground">
                Controle suas finanças de forma inteligente • Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Quick summary badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <BarChart3 className="mobile-icon-xs text-primary" />
            <span className="mobile-text-xs font-medium text-primary">
              {transactions.length} transações • {categoryExpenses.length} categorias ativas
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid - Enhanced */}
      <div className="mobile-container mobile-section-spacing">
        <div className="mb-4">
          <h2 className="mobile-text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="mobile-icon-base text-green-500" />
            Resumo Financeiro
          </h2>
          <p className="mobile-text-sm text-muted-foreground">
            Acompanhe seus principais indicadores financeiros
          </p>
        </div>
        <MobileStatsGrid stats={stats} />
      </div>

      {/* Analytics Section */}
      <div className="mobile-container mobile-section-spacing">
        <div className="mb-6">
          <h2 className="mobile-text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <BarChart3 className="mobile-icon-base text-blue-500" />
            Análise e Tendências
          </h2>
          <p className="mobile-text-sm text-muted-foreground">
            Visualize a evolução do seu saldo e distribuição de gastos
          </p>
        </div>

        {/* Responsive charts grid */}
        <div className="space-y-6 xl:grid xl:grid-cols-3 xl:gap-8 xl:space-y-0">
          {/* Balance chart - takes 2 columns on XL */}
          <div className="xl:col-span-2">
            <MobileBalanceChart data={balanceHistory} />
          </div>

          {/* Category chart - takes 1 column on XL */}
          <div className="xl:col-span-1">
            <MobileCategoryChart data={categoryExpenses} />
          </div>
        </div>
      </div>

      {/* Activity & Insights Section */}
      <div className="mobile-container mobile-section-spacing">
        <div className="mb-6">
          <h2 className="mobile-text-lg font-bold text-foreground mb-2 flex items-center gap-2">
            <Activity className="mobile-icon-base text-purple-500" />
            Atividade Recente
          </h2>
          <p className="mobile-text-sm text-muted-foreground">
            Suas últimas transações e insights personalizados
          </p>
        </div>

        {/* Bottom content grid */}
        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {/* Recent transactions - takes 2 columns */}
          <div className="lg:col-span-2">
            <MobileRecentTransactions transactions={transactions} />
          </div>

          {/* Insights - takes 1 column */}
          <div className="lg:col-span-1">
            <InsightsCard transactions={transactions} />
          </div>
        </div>
      </div>

      {/* Financial Health Summary */}
      {stats && (
        <div className="mobile-container mobile-section-spacing">
          <div className="mobile-card financial-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Target className="mobile-icon-base text-white" />
              </div>
              <div>
                <h3 className="mobile-text-lg font-bold text-foreground">Saúde Financeira</h3>
                <p className="mobile-text-xs text-muted-foreground">Resumo do seu desempenho financeiro</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-muted/30">
                <div className={`mobile-text-xl font-bold mb-1 ${stats.currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.currentBalance >= 0 ? '✓' : '⚠'}
                </div>
                <div className="mobile-text-xs text-muted-foreground">Saldo</div>
                <div className="mobile-text-sm font-medium text-foreground">
                  {stats.currentBalance >= 0 ? 'Positivo' : 'Negativo'}
                </div>
              </div>

              <div className="text-center p-3 rounded-xl bg-muted/30">
                <div className={`mobile-text-xl font-bold mb-1 ${stats.monthlySavings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {stats.monthlySavings >= 0 ? '📈' : '📉'}
                </div>
                <div className="mobile-text-xs text-muted-foreground">Economia</div>
                <div className="mobile-text-sm font-medium text-foreground">
                  {stats.monthlySavings >= 0 ? 'Poupando' : 'Gastando'}
                </div>
              </div>

              <div className="text-center p-3 rounded-xl bg-muted/30">
                <div className="mobile-text-xl font-bold mb-1 text-blue-400">
                  {categoryExpenses.length}
                </div>
                <div className="mobile-text-xs text-muted-foreground">Categorias</div>
                <div className="mobile-text-sm font-medium text-foreground">Ativas</div>
              </div>

              <div className="text-center p-3 rounded-xl bg-muted/30">
                <div className="mobile-text-xl font-bold mb-1 text-purple-400">
                  {transactions.length}
                </div>
                <div className="mobile-text-xs text-muted-foreground">Transações</div>
                <div className="mobile-text-sm font-medium text-foreground">Total</div>
              </div>
            </div>

            {/* Health score */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="mobile-text-sm font-medium text-foreground">Status Geral</span>
                </div>
                <div className="mobile-text-sm font-bold text-green-400">
                  {stats.currentBalance >= 0 && stats.monthlySavings >= 0 ? 'Excelente' :
                   stats.currentBalance >= 0 ? 'Bom' : 'Atenção'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom spacing for mobile navigation */}
      <div className="h-32 md:h-16" />
    </div>
  );
};

export default Dashboard;