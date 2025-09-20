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
      <Card className="mobile-card financial-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 mobile-text-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white mobile-text-base">📊</span>
            </div>
            <div>
              <div className="mobile-text-lg font-bold text-foreground">Despesas por Categoria</div>
              <div className="mobile-text-xs text-muted-foreground">Análise dos seus gastos</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <p className="mobile-text-base font-medium text-center mb-2">Nenhuma despesa registrada</p>
            <p className="mobile-text-sm text-center text-muted-foreground">
              Adicione transações para visualizar a análise por categoria
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar dados para o gráfico
  const chartData = data.slice(0, 6).map((item, index) => ({
    ...item,
    fill: getColorByIndex(index)
  }));

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-xl animate-scale-in">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: data.fill }}
            />
            <span className="mobile-text-base font-semibold text-foreground">{data.category}</span>
          </div>
          <div className="space-y-1">
            <p className="mobile-text-sm text-muted-foreground">
              Valor: <span className="font-semibold text-foreground">{formatCurrency(data.amount)}</span>
            </p>
            <p className="mobile-text-sm text-muted-foreground">
              Percentual: <span className="font-semibold text-foreground">{data.percentage.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mobile-card financial-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white mobile-text-base">📊</span>
          </div>
          <div className="flex-1">
            <div className="mobile-text-lg font-bold text-foreground">Despesas por Categoria</div>
            <div className="mobile-text-xs text-muted-foreground">
              Total: {formatCurrency(totalAmount)} • {data.length} categorias
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gráfico */}
          <div className="relative">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centro do gráfico - valor total */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="mobile-text-xs text-muted-foreground">Total</div>
                <div className="mobile-text-sm font-bold text-foreground">
                  {formatCurrency(totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de categorias */}
          <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
            {chartData.map((item) => (
              <div key={item.category} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="mobile-text-sm font-medium text-foreground truncate">
                      {item.category}
                    </div>
                    <div className="mobile-text-xs text-muted-foreground">
                      {item.percentage.toFixed(1)}% do total
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="mobile-text-sm font-bold text-foreground">
                    {formatCurrencyCompact(item.amount)}
                  </div>
                </div>
              </div>
            ))}

            {data.length > 6 && (
              <div className="text-center py-2">
                <span className="mobile-text-xs text-muted-foreground">
                  +{data.length - 6} outras categorias
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Resumo inferior */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="mobile-text-xs text-muted-foreground">Categorias</div>
              <div className="mobile-text-base font-bold text-foreground">{data.length}</div>
            </div>
            <div>
              <div className="mobile-text-xs text-muted-foreground">Maior Gasto</div>
              <div className="mobile-text-base font-bold text-foreground">
                {data[0] ? formatCurrencyCompact(data[0].amount) : '---'}
              </div>
            </div>
            <div>
              <div className="mobile-text-xs text-muted-foreground">Ticket Médio</div>
              <div className="mobile-text-base font-bold text-foreground">
                {data.length > 0 ? formatCurrencyCompact(totalAmount / data.length) : '---'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Função para gerar cores consistentes
function getColorByIndex(index: number): string {
  const colors = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
  ];
  return colors[index % colors.length];
}

// Função para formatar valores de forma compacta
function formatCurrencyCompact(value: number): string {
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return `${value < 0 ? '-' : ''}R$ ${(absValue / 1000000).toFixed(1)}M`;
  } else if (absValue >= 1000) {
    return `${value < 0 ? '-' : ''}R$ ${(absValue / 1000).toFixed(0)}k`;
  }
  return `R$ ${absValue.toFixed(0)}`;
}