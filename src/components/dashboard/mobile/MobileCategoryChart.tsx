import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { CategoryExpense } from '@/types/finance';

interface MobileCategoryChartProps {
  data: CategoryExpense[];
}

export function MobileCategoryChart({ data }: MobileCategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="financial-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <span className="text-lg">📊</span>
            Despesas por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[120px] md:h-[180px] text-muted-foreground">
            <span className="text-3xl mb-2">🥧</span>
            <p className="text-xs md:text-sm text-center">Nenhuma despesa este mês</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show only top 5 categories for mobile
  const displayData = data.slice(0, 5);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
          <p className="text-xs font-semibold text-foreground">{data.category}</p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(data.amount)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="financial-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <span className="text-lg">📊</span>
          Despesas por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[120px] md:h-[180px]">
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={20}
                outerRadius={45}
                paddingAngle={2}
                dataKey="amount"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Compact legend */}
          <div className="space-y-1">
            {displayData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between text-[9px] md:text-xs">
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-foreground truncate max-w-[60px] md:max-w-none">
                    {item.category}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  {item.amount >= 1000 
                    ? `R$ ${(item.amount / 1000).toFixed(0)}k`
                    : `R$ ${item.amount.toFixed(0)}`
                  } ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}