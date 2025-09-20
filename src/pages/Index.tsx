import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BalanceChart } from '@/components/dashboard/BalanceChart';
import { ExpensesChart } from '@/components/dashboard/ExpensesChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
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
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-muted rounded-lg" />
          <div className="h-96 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  const stats = calculateDashboardStats(transactions);
  const balanceHistory = calculateBalanceHistory(transactions);
  const categoryExpenses = calculateCategoryExpenses(transactions);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="mobile-title md:text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
        <p className="text-muted-foreground mobile-text-sm md:text-base">
          Acompanhe suas finanças e tome decisões inteligentes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mobile-grid-2x2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatsCard
          title="Saldo Atual"
          value={stats.currentBalance}
          icon={<Wallet className="h-6 w-6" />}
          type="default"
        />
        
        <StatsCard
          title="Entradas do Mês"
          value={stats.monthlyIncome}
          icon={<TrendingUp className="h-6 w-6" />}
          type="income"
        />
        
        <StatsCard
          title="Saídas do Mês"
          value={stats.monthlyExpenses}
          icon={<TrendingDown className="h-6 w-6" />}
          type="expense"
        />
        
        <StatsCard
          title="Economia do Mês"
          value={stats.monthlySavings}
          icon={<Target className="h-6 w-6" />}
          type="savings"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceChart data={balanceHistory} />
        <ExpensesChart data={categoryExpenses} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions} />
        <InsightsCard transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
