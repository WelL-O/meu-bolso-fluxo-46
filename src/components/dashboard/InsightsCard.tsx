import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getCurrentMonthRange, filterTransactionsByDateRange } from '@/lib/utils';
import { subMonths } from 'date-fns';
import type { Transaction } from '@/types/finance';

interface InsightsCardProps {
  transactions: Transaction[];
}

export function InsightsCard({ transactions }: InsightsCardProps) {
  const generateInsights = () => {
    const { start: currentStart, end: currentEnd } = getCurrentMonthRange();
    const previousMonth = subMonths(new Date(currentStart), 1);
    const previousStart = subMonths(new Date(currentStart), 1).toISOString();
    const previousEnd = new Date(currentStart).toISOString();

    // Current month data
    const currentMonthTransactions = filterTransactionsByDateRange(transactions, currentStart, currentEnd);
    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Previous month data
    const previousMonthTransactions = filterTransactionsByDateRange(transactions, previousStart, previousEnd);
    const previousExpenses = previousMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category analysis
    const categoryExpenses = new Map<string, number>();
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryExpenses.get(t.category) || 0;
        categoryExpenses.set(t.category, current + t.amount);
      });

    const topCategory = Array.from(categoryExpenses.entries())
      .sort(([,a], [,b]) => b - a)[0];

    const insights = [];

    // Spending comparison
    if (previousExpenses > 0) {
      const difference = ((currentExpenses - previousExpenses) / previousExpenses) * 100;
      if (Math.abs(difference) > 5) {
        insights.push({
          icon: difference > 0 ? '📈' : '📉',
          text: `Você gastou ${Math.abs(difference).toFixed(1)}% ${
            difference > 0 ? 'mais' : 'menos'
          } que o mês passado`,
          type: difference > 0 ? 'warning' : 'success'
        });
      }
    }

    // Top category spending
    if (topCategory) {
      insights.push({
        icon: '🏆',
        text: `Maior gasto: ${topCategory[0]} - ${formatCurrency(topCategory[1])}`,
        type: 'info'
      });
    }

    // Daily average
    const daysInMonth = new Date().getDate();
    const dailyAverage = currentExpenses / daysInMonth;
    if (dailyAverage > 0) {
      insights.push({
        icon: '📊',
        text: `Média diária de gastos: ${formatCurrency(dailyAverage)}`,
        type: 'info'
      });
    }

    // If no specific insights, add motivational messages
    if (insights.length === 0) {
      insights.push({
        icon: '🎯',
        text: 'Continue registrando suas transações para obter insights valiosos!',
        type: 'info'
      });
    }

    return insights.slice(0, 3); // Max 3 insights
  };

  const insights = generateInsights();

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>💡</span>
          <span>Insights Financeiros</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
              <span className="text-lg flex-shrink-0">{insight.icon}</span>
              <p className="text-sm text-foreground leading-relaxed">
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}