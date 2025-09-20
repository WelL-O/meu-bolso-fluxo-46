import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { BalanceHistory } from '@/types/finance';

interface BalanceChartProps {
  data: BalanceHistory[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground mb-1">{`Data: ${label}`}</p>
          <p className="text-sm font-semibold text-foreground">
            {`Saldo: ${formatCurrency(value)}`}
          </p>
          {value !== 0 && (
            <p className={`text-xs mt-1 ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {value >= 0 ? '▲ Positivo' : '▼ Negativo'}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate Y domain with proper margins
  const getYDomain = () => {
    if (!data || data.length === 0) return [-1000, 1000];
    
    const values = data.map(d => d.balance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.abs(max - min);
    const padding = range * 0.1 || 1000;
    
    return [
      Math.floor((min - padding) / 100) * 100,
      Math.ceil((max + padding) / 100) * 100
    ];
  };

  // Improved Y-axis formatter
  const formatYAxis = (value: number) => {
    if (value === 0) return 'R$ 0';
    
    const absValue = Math.abs(value);
    const isNegative = value < 0;
    const prefix = isNegative ? '-' : '';
    
    if (absValue >= 1000000) {
      return `${prefix}R$ ${(absValue / 1000000).toFixed(1)}M`;
    } else if (absValue >= 1000) {
      return `${prefix}R$ ${(absValue / 1000).toFixed(0)}k`;
    }
    
    return `${prefix}R$ ${absValue.toFixed(0)}`;
  };

  const yDomain = getYDomain();

  return (
    <Card className="financial-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📈</span>
          <span>Evolução do Saldo (30 dias)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data}
              margin={{ 
                top: 15, 
                right: 15, 
                left: 70, 
                bottom: 35 
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 11 
                }}
                interval="preserveStartEnd"
                tickCount={6}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 11 
                }}
                width={65}
                domain={yDomain}
                tickFormatter={formatYAxis}
                tickCount={8}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={false}
                activeDot={{ 
                  r: 5, 
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Quick stats below chart */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-xs md:text-sm">
            <div className="text-center">
              <span className="text-muted-foreground block">Início</span>
              <span className={`font-bold ${data[0]?.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(data[0]?.balance || 0)}
              </span>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground block">Atual</span>
              <span className={`font-bold ${data[data.length-1]?.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(data[data.length-1]?.balance || 0)}
              </span>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground block">Variação</span>
              <span className={`font-bold ${
                (data[data.length-1]?.balance - data[0]?.balance) >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {(data[data.length-1]?.balance - data[0]?.balance) >= 0 ? '↑' : '↓'}
                {formatCurrency(Math.abs((data[data.length-1]?.balance || 0) - (data[0]?.balance || 0)))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}