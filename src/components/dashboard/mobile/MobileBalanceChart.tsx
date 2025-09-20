import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import type { BalanceHistory } from '@/types/finance';

interface MobileBalanceChartProps {
  data: BalanceHistory[];
}

export function MobileBalanceChart({ data }: MobileBalanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="mobile-card financial-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white mobile-text-base">📈</span>
            </div>
            <div>
              <div className="mobile-text-lg font-bold text-foreground">Evolução do Saldo</div>
              <div className="mobile-text-xs text-muted-foreground">Últimos 30 dias</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <p className="mobile-text-base font-medium text-center mb-2">Dados insuficientes</p>
            <p className="mobile-text-sm text-center text-muted-foreground">
              Adicione mais transações para visualizar a evolução do saldo
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCompactValue = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `${value < 0 ? '-' : ''}R$ ${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${value < 0 ? '-' : ''}R$ ${(absValue / 1000).toFixed(0)}k`;
    }
    return `R$ ${value.toFixed(0)}`;
  };

  const formatDateLabel = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const date = new Date(label || '');
      const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-xl animate-scale-in">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="mobile-icon-xs text-muted-foreground" />
            <span className="mobile-text-sm text-muted-foreground">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="mobile-icon-xs text-primary" />
            <span className="mobile-text-base font-bold text-foreground">
              {formatCurrency(value)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const currentValue = data[data.length - 1]?.balance || 0;
  const initialValue = data[0]?.balance || 0;
  const variation = currentValue - initialValue;
  const variationPercent = initialValue !== 0 ? (variation / Math.abs(initialValue)) * 100 : 0;

  const minValue = Math.min(...data.map(d => d.balance));
  const maxValue = Math.max(...data.map(d => d.balance));
  const range = Math.abs(maxValue - minValue);
  const padding = range * 0.1 || 1000;

  const yDomain = [
    Math.floor((minValue - padding) / 100) * 100,
    Math.ceil((maxValue + padding) / 100) * 100
  ];

  const isPositiveTrend = variation >= 0;
  const gradientId = isPositiveTrend ? "colorBalancePositive" : "colorBalanceNegative";

  return (
    <Card className="mobile-card financial-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <span className="text-white mobile-text-base">📈</span>
          </div>
          <div className="flex-1">
            <div className="mobile-text-lg font-bold text-foreground">Evolução do Saldo</div>
            <div className="mobile-text-xs text-muted-foreground">
              Período: {data.length} dias • Tendência: {isPositiveTrend ? 'Alta' : 'Baixa'}
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Indicadores principais */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${currentValue >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="mobile-text-xs text-muted-foreground">Saldo Atual</span>
            </div>
            <div className={`mobile-text-lg font-bold ${currentValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(currentValue)}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              {isPositiveTrend ? (
                <TrendingUp className="mobile-icon-xs text-green-500" />
              ) : (
                <TrendingDown className="mobile-icon-xs text-red-500" />
              )}
              <span className="mobile-text-xs text-muted-foreground">Variação</span>
            </div>
            <div className={`mobile-text-lg font-bold ${isPositiveTrend ? 'text-green-400' : 'text-red-400'}`}>
              {isPositiveTrend ? '+' : ''}{formatCompactValue(variation)}
            </div>
            <div className={`mobile-text-xs ${isPositiveTrend ? 'text-green-400' : 'text-red-400'}`}>
              {isPositiveTrend ? '+' : ''}{variationPercent.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="relative mb-6">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 10 }}>
              <defs>
                <linearGradient id="colorBalancePositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBalanceNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted-foreground))"
                strokeOpacity={0.1}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickFormatter={formatDateLabel}
                interval="preserveStartEnd"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />

              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickFormatter={formatCompactValue}
                domain={yDomain}
                width={60}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="balance"
                stroke={isPositiveTrend ? "#22c55e" : "#ef4444"}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                dot={{ fill: isPositiveTrend ? "#22c55e" : "#ef4444", strokeWidth: 0, r: 0 }}
                activeDot={{
                  r: 6,
                  fill: isPositiveTrend ? "#22c55e" : "#ef4444",
                  stroke: "white",
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Estatísticas detalhadas */}
        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="mobile-text-xs text-muted-foreground mb-1">Início</div>
            <div className={`mobile-text-sm font-bold ${initialValue >= 0 ? 'text-foreground' : 'text-red-400'}`}>
              {formatCompactValue(initialValue)}
            </div>
          </div>

          <div className="text-center">
            <div className="mobile-text-xs text-muted-foreground mb-1">Pico</div>
            <div className="mobile-text-sm font-bold text-green-400">
              {formatCompactValue(maxValue)}
            </div>
          </div>

          <div className="text-center">
            <div className="mobile-text-xs text-muted-foreground mb-1">Menor</div>
            <div className="mobile-text-sm font-bold text-red-400">
              {formatCompactValue(minValue)}
            </div>
          </div>

          <div className="text-center">
            <div className="mobile-text-xs text-muted-foreground mb-1">Amplitude</div>
            <div className="mobile-text-sm font-bold text-foreground">
              {formatCompactValue(range)}
            </div>
          </div>
        </div>

        {/* Insights */}
        {variation !== 0 && (
          <div className={`mt-4 p-3 rounded-xl ${isPositiveTrend ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <div className="flex items-center gap-2">
              {isPositiveTrend ? (
                <TrendingUp className="mobile-icon-sm text-green-400 flex-shrink-0" />
              ) : (
                <TrendingDown className="mobile-icon-sm text-red-400 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className={`mobile-text-sm font-medium ${isPositiveTrend ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositiveTrend ? 'Crescimento positivo!' : 'Tendência de queda'}
                </div>
                <div className="mobile-text-xs text-muted-foreground">
                  {isPositiveTrend
                    ? `Seu saldo cresceu ${formatCurrency(Math.abs(variation))} no período`
                    : `Seu saldo diminuiu ${formatCurrency(Math.abs(variation))} no período`
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}