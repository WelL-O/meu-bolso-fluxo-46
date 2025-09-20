import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/utils';
import type { Transaction } from '@/types/finance';

interface MobileRecentTransactionsProps {
  transactions: Transaction[];
}

export function MobileRecentTransactions({ transactions }: MobileRecentTransactionsProps) {
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <Card className="financial-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <span className="text-lg">📝</span>
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <span className="text-3xl mb-2">💳</span>
            <p className="text-xs md:text-sm text-center">Nenhuma transação encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="financial-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <span className="text-lg">📝</span>
            Transações Recentes
          </CardTitle>
          <Link 
            to="/transactions" 
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
          >
            Ver todas
            <ArrowRight size={12} />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm shrink-0">
                  {getCategoryIcon(transaction.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-foreground truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] md:text-xs text-muted-foreground">
                    <span className="truncate">{transaction.category}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-xs md:text-sm font-bold ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {transaction.amount >= 1000 
                    ? `R$ ${(transaction.amount / 1000).toFixed(1)}k`
                    : formatCurrency(transaction.amount)
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}