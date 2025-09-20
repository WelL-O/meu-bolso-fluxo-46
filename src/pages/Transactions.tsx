import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortSelect } from '@/components/ui/sort-select';
import { Search, Filter, Plus, Calendar, Download, X } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useSortTransactions } from '@/hooks/useSortTransactions';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/utils';
import { loadSettings } from '@/lib/storage';
import type { Transaction } from '@/types/finance';

export default function Transactions() {
  const { transactions, isLoading } = useFinanceData();
  const settings = loadSettings();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Use the sorting hook
  const { sortedTransactions, sortBy, setSortBy } = useSortTransactions(transactions);

  // Filter transactions based on user inputs
  const filteredTransactions = useMemo(() => {
    let filtered = [...sortedTransactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    return filtered;
  }, [sortedTransactions, searchTerm, selectedType, selectedCategory]);

  // Calculate running balance
  const transactionsWithBalance = useMemo(() => {
    let balance = 0;
    const allTransactionsSorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return filteredTransactions.map(transaction => {
      // Calculate balance up to this transaction
      const transactionIndex = allTransactionsSorted.findIndex(t => t.id === transaction.id);
      balance = allTransactionsSorted.slice(0, transactionIndex + 1).reduce((sum, t) => {
        return t.type === 'income' ? sum + t.amount : sum - t.amount;
      }, 0);

      return {
        ...transaction,
        runningBalance: balance,
      };
    }).reverse(); // Show newest first
  }, [transactions, filteredTransactions]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const categories = [...new Set(transactions.map(t => t.category))];
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground">
            Gerencie todas suas receitas e despesas
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="financial-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Receitas</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Despesas</p>
                <p className="text-2xl font-bold text-red-400">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400">📉</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="financial-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${
                  totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <span className="text-indigo-400">💰</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="financial-card">
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Type filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                </SelectContent>
              </Select>

              {/* Category filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <SortSelect 
                value={sortBy} 
                onChange={setSortBy}
                options={[
                  { value: 'date-desc', label: 'Data (recente)' },
                  { value: 'date-asc', label: 'Data (antiga)' },
                  { value: 'value-desc', label: 'Valor (maior)' },
                  { value: 'value-asc', label: 'Valor (menor)' },
                  { value: 'category', label: 'Categoria' },
                  { value: 'type', label: 'Tipo' }
                ]}
              />

              {/* Export */}
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Active filters chips */}
            {(selectedType !== 'all' || selectedCategory !== 'all' || searchTerm) && (
              <div className="flex gap-2 flex-wrap">
                {selectedType !== 'all' && (
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    {selectedType === 'income' ? 'Entradas' : 'Saídas'}
                    <button onClick={() => setSelectedType('all')} className="hover:text-red-300">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="hover:text-red-300">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="hover:text-red-300">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button 
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedCategory('all');
                    setSearchTerm('');
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="financial-card">
        <CardHeader>
          <CardTitle>
            {filteredTransactions.length} transação(ões) encontrada(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block">📝</span>
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactionsWithBalance.map((transaction) => (
                <div key={transaction.id}>
                  {/* Desktop View */}
                  <div className="hidden md:flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center">
                        <span className="text-lg">
                          {getCategoryIcon(transaction.category)}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-foreground">
                            {transaction.description}
                          </h3>
                          <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span>{transaction.category}</span>
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className={`text-lg font-semibold ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Saldo: {formatCurrency(transaction.runningBalance)}
                      </div>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden flex items-center justify-between py-3 border-b border-border/50 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-sm">
                          {getCategoryIcon(transaction.category)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.category} • {formatDate(transaction.date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}