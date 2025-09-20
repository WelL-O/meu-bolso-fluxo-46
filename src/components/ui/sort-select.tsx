import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
}

const defaultOptions: SortOption[] = [
  { value: 'date-desc', label: 'Data (recente)' },
  { value: 'date-asc', label: 'Data (antiga)' },
  { value: 'value-desc', label: 'Valor (maior)' },
  { value: 'value-asc', label: 'Valor (menor)' },
  { value: 'category', label: 'Categoria' },
  { value: 'type', label: 'Tipo' }
];

export function SortSelect({ value, onChange, options = defaultOptions }: SortSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-muted text-foreground px-4 py-2 pr-10 rounded-lg cursor-pointer hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary text-sm border border-border"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center space-x-1">
        {value.includes('desc') && (
          <ArrowDown size={14} className="text-muted-foreground" />
        )}
        {value.includes('asc') && (
          <ArrowUp size={14} className="text-muted-foreground" />
        )}
        <ChevronDown size={16} className="text-muted-foreground" />
      </div>
    </div>
  );
}