import { ReactNode } from 'react';
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
      icon: <DollarSign size={14} />,
      color: stats.currentBalance >= 0 ? "text-foreground" : "text-red-400",
      bg: "border-border"
    },
    {
      title: "Entradas do Mês",
      value: stats.monthlyIncome,
      icon: <TrendingUp size={14} />,
      color: "text-green-400",
      bg: "border-green-900/30"
    },
    {
      title: "Saídas do Mês", 
      value: stats.monthlyExpenses,
      icon: <TrendingDown size={14} />,
      color: "text-red-400",
      bg: "border-red-900/30"
    },
    {
      title: "Economia do Mês",
      value: stats.monthlySavings,
      icon: <Target size={14} />,
      color: stats.monthlySavings >= 0 ? "text-green-400" : "text-red-400",
      bg: "border-border"
    }
  ];

  return (
    <div className="px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-card rounded-xl p-3 md:p-4 border ${card.bg} hover:bg-card/80 transition-colors`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">
                {card.title}
              </p>
              <div className={`${card.color.includes('green') ? 'text-green-400' : card.color.includes('red') ? 'text-red-400' : 'text-muted-foreground'}`}>
                {card.icon}
              </div>
            </div>
            <p className={`text-sm md:text-xl font-bold ${card.color} leading-tight`}>
              {formatCompactCurrency(card.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}