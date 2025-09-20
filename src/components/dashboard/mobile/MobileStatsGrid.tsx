import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
}

interface MobileStatsGridProps {
  stats: Stats;
}

export function MobileStatsGrid({ stats }: MobileStatsGridProps) {
  const formatCompactCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}R$ ${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}R$ ${(absValue / 1000).toFixed(0)}k`;
    }
    return formatCurrency(value);
  };

  const cards = [
    {
      title: "Saldo Atual",
      value: stats.currentBalance,
      icon: DollarSign,
      color: stats.currentBalance >= 0 ? "text-foreground" : "text-red-400",
      bgColor: stats.currentBalance >= 0 ? "bg-card" : "bg-red-500/5",
      borderColor: stats.currentBalance >= 0 ? "border-border" : "border-red-500/20"
    },
    {
      title: "Entradas do Mês",
      value: stats.monthlyIncome,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/20"
    },
    {
      title: "Saídas do Mês",
      value: stats.monthlyExpenses,
      icon: TrendingDown,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/20"
    },
    {
      title: "Economia do Mês",
      value: stats.monthlySavings,
      icon: Target,
      color: stats.monthlySavings >= 0 ? "text-green-400" : "text-red-400",
      bgColor: stats.monthlySavings >= 0 ? "bg-green-500/5" : "bg-red-500/5",
      borderColor: stats.monthlySavings >= 0 ? "border-green-500/20" : "border-red-500/20"
    }
  ];

  return (
    <div className="mobile-grid-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`mobile-stats-compact ${card.bgColor} ${card.borderColor} border rounded-xl hover:scale-105 transition-all duration-200 active:scale-95`}
          >
            {/* Header with title and icon */}
            <div className="flex items-center justify-between mb-2">
              <p className="mobile-stats-label text-muted-foreground truncate pr-1">
                {card.title}
              </p>
              <div className={`${card.color} flex-shrink-0`}>
                <IconComponent className="mobile-icon-sm" />
              </div>
            </div>

            {/* Value */}
            <div className="flex items-end">
              <p className={`mobile-stats-value ${card.color} truncate`}>
                {formatCompactCurrency(card.value)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}