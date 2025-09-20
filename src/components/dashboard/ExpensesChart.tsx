import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { CategoryExpense } from '@/types/finance';

interface ExpensesChartProps {
  data: CategoryExpense[];
}

export function ExpensesChart({ data }: ExpensesChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{data.category}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.amount)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="space-y-2 mt-4">
      {payload?.map((entry: any, index: number) => {
        const data = entry.payload;
        return (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-foreground">{data.category}</span>
            </div>
            <div className="text-muted-foreground">
              {formatCurrency(data.amount)} ({data.percentage.toFixed(1)}%)
            </div>
          </div>
        );
      })}
    </div>
  );

  if (data.length === 0) {
    return (
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🥧</span>
            <span>Despesas por Categoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-80 text-muted-foreground">
            <span className="text-4xl mb-4">📊</span>
            <p className="text-center">Nenhuma despesa registrada este mês</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🥧</span>
          <span>Despesas por Categoria</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage, name }) => percentage > 5 ? `${percentage.toFixed(1)}%` : ''}
                outerRadius={60}
                fill="#8884d8"
                dataKey="amount"
                nameKey="category"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <CustomLegend payload={data.map((item, index) => ({
            value: item.category,
            color: item.color,
            payload: item
          }))} />
        </div>
      </CardContent>
    </Card>
  );
}