import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  type?: 'default' | 'income' | 'expense' | 'savings';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon, type = 'default', trend }: StatsCardProps) {
  const getCardStyles = () => {
    switch (type) {
      case 'income':
        return 'border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-400/5';
      case 'expense':
        return 'border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-400/5';
      case 'savings':
        return value >= 0 
          ? 'border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-400/5'
          : 'border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-400/5';
      default:
        return 'border-border';
    }
  };

  const getValueColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-400';
      case 'expense':
        return 'text-red-400';
      case 'savings':
        return value >= 0 ? 'text-indigo-400' : 'text-red-400';
      default:
        return 'text-foreground';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-400 bg-green-500/20';
      case 'expense':
        return 'text-red-400 bg-red-500/20';
      case 'savings':
        return value >= 0 
          ? 'text-indigo-400 bg-indigo-500/20'
          : 'text-red-400 bg-red-500/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <Card className={cn(
      'stats-card hover-scale hover-glow cursor-pointer',
      getCardStyles()
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className={cn(
              'text-2xl font-bold tracking-tight',
              getValueColor()
            )}>
              {formatCurrency(value)}
            </p>
            {trend && (
              <div className="flex items-center space-x-1">
                <span className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs mês anterior
                </span>
              </div>
            )}
          </div>
          
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            getIconColor()
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}