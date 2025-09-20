import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
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
      <div className="space-y-4 md:space-y-6 animate-pulse px-4 md:px-0">
        {/* Mobile loading skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 md:h-32 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="h-48 md:h-96 bg-muted rounded-xl" />
          <div className="h-48 md:h-96 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const stats = calculateDashboardStats(transactions);
  const balanceHistory = calculateBalanceHistory(transactions);
  const categoryExpenses = calculateCategoryExpenses(transactions);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Mobile-first header */}
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
        <p className="text-xs md:text-base text-muted-foreground mt-1">
          Acompanhe suas finanças e tome decisões inteligentes
        </p>
      </div>

      {/* Mobile Stats Grid */}
      <div className="mb-6">
        <MobileStatsGrid stats={stats} />
      </div>

      {/* Charts Section */}
      <div className="px-4 md:px-6 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <MobileBalanceChart data={balanceHistory} />
          <MobileCategoryChart data={categoryExpenses} />
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <MobileRecentTransactions transactions={transactions} />
          <InsightsCard transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
