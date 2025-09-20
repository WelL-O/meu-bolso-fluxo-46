import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { BalanceHistory } from '@/types/finance';

interface MobileBalanceChartProps {
  data: BalanceHistory[];
}

export function MobileBalanceChart({ data }: MobileBalanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="financial-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <span className="text-lg">📈</span>
            Evolução do Saldo (30 dias)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[120px] md:h-[180px] text-muted-foreground">
            <span className="text-3xl mb-2">📊</span>
            <p className="text-xs md:text-sm text-center">Dados insuficientes</p>
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-popover border border-border rounded-lg p-2 shadow-lg">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xs font-semibold text-foreground">
            {formatCurrency(value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const minValue = Math.min(...data.map(d => d.balance));
  const maxValue = Math.max(...data.map(d => d.balance));
  const range = Math.abs(maxValue - minValue);
  const padding = range * 0.1 || 1000;

  const yDomain = [
    Math.floor((minValue - padding) / 100) * 100,
    Math.ceil((maxValue + padding) / 100) * 100
  ];

  const currentValue = data[data.length - 1]?.balance || 0;
  const initialValue = data[0]?.balance || 0;
  const variation = currentValue - initialValue;

  return (
    <Card className="financial-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <span className="text-lg">📈</span>
          Evolução do Saldo (30 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[120px] md:h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 30, bottom: 5 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={9}
                interval="preserveStartEnd"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={8}
                tickFormatter={formatCompactValue}
                domain={yDomain}
                width={25}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Compact stats */}
        <div className="flex justify-between mt-3 text-[9px] md:text-xs">
          <div>
            <span className="text-muted-foreground">Início: </span>
            <span className={initialValue >= 0 ? 'text-foreground' : 'text-red-400'}>
              {formatCompactValue(initialValue)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Atual: </span>
            <span className={currentValue >= 0 ? 'text-foreground' : 'text-red-400'}>
              {formatCompactValue(currentValue)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Var: </span>
            <span className={variation >= 0 ? 'text-green-400' : 'text-red-400'}>
              {variation >= 0 ? '↑' : '↓'} {formatCompactValue(Math.abs(variation))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}